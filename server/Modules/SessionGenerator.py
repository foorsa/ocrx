# Nameaspace: /Modules/SessionGenerator.py

import datetime
import json
from werkzeug.utils import secure_filename
import pymongo
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from urllib.parse import quote_plus
from time import sleep
import gridfs
from PIL import Image
import io
import os
from unicodedata import normalize

# Classes Required for Operations
from Modules.Classes.OCRProcessor import OCR as _shared_ocr
from Modules.Classes.GPTCorrector import GPTCorrector
from PDFGenerator import PDFGenerator


username = quote_plus("yassinechettouch")
password = quote_plus("0tr7$F1m!@OCRX")
cluster = "ocrx-db.rpxyaec.mongodb.net"

uri = (
    "mongodb+srv://"
    + username
    + ":"
    + password
    + "@"
    + cluster
    + "/?retryWrites=true&w=majority"
)

# Maximum number of retries
max_retries = 5
retry_count = 0

while retry_count < max_retries:
    try:
        client = MongoClient(
            uri,
            server_api=ServerApi("1"),
            maxPoolSize=100,
            minPoolSize=5,
            maxIdleTimeMS=45000,
            connectTimeoutMS=10000,
            socketTimeoutMS=300000,
            retryWrites=True,
        )
        db = client.get_database("OCRX-db")
        print("[MongoDB] Connected to the database successfully.")
        break  # Connection successful, break out of the loop
    except pymongo.errors.ServerSelectionTimeoutError:
        # Retry the connection after a short delay
        sleep(2)
        retry_count += 1
        print("[MongoDB] Retrying connection...")
else:
    # Maximum number of retries reached, raise an exception or handle the error.
    print("[MongoDB] Failed to connect to MongoDB after multiple attempts.")
    raise Exception("Failed to connect to MongoDB after multiple attempts.")

# Load BSON Data from the database
from bson import json_util
import base64
from cryptography.fernet import Fernet
import secrets


def parse_json(data):
    return json.loads(json_util.dumps(data))


def GenerateSessionId(Prefix="LLS-", Suffix="-TRS"):
    ID = Prefix + secrets.token_hex(4) + Suffix
    # All Upper Case
    ID = ID.upper()

    return ID


class SessionGenerator:
    def __init__(self):
        self.id = ("",)
        self.document_type = ("",)
        self.files = []
        self.session = {
            "Session Id": "",
            "Operation Date": "",
            "Document Type": {},
            "Information Type": "",
            "Uploads": [],
            "Status": "Inactive",
            "Error": None,
            "Message": "",
            "Extraction": {
                "Text": "",
                "Tables": [],
            },
            "Correction": {
                "Text": "",
                "Tables": [],
            },
            "Translation": {
                "Text": "",
                "Tables": [],
            },
            "Generation": {
                "PDF Link": "",
                "Google Docs Link": "",
                "Preview Link": "",
            },
        }
        self.db = db  # Connect to the 'ocrx-db' database
        self.fs = gridfs.GridFS(self.db)  # Use GridFS for file storage
        self._file_cache = {}  # Cache file bytes to avoid redundant GridFS reads

    # Get the Session Information
    def Get(self):
        Session = self.session
        return parse_json(Session)

    def Set(self, Session_Id):
        # Find Session ID
        Session = self.db.sessions.find_one({"Session Id": Session_Id})
        if Session:
            self.session = Session
            return True
        else:
            return False

    def _get_file_bytes(self, file_id):
        """Get file bytes from GridFS with caching to avoid redundant reads."""
        str_id = str(file_id)
        if str_id not in self._file_cache:
            f = self.fs.get(file_id)
            self._file_cache[str_id] = {
                "bytes": f.read(),
                "filename": f.filename,
            }
        return self._file_cache[str_id]

    def Initialize(self, DocumentType, Files, skip_db_write=False):
        # Session ID
        self.id = GenerateSessionId()
        self.document_type = DocumentType
        self.files = Files

        Uploads = []
        for file_path in self.files:
            try:
                with open(file_path, "rb") as file:
                    FileData = file.read()
                    FileName = "Upload.{}".format(file_path.split(".")[-1])
                    FileId = self.fs.put(FileData, filename=FileName)
                    Uploads.append({"Upload Id": FileId, "File": FileName})
                    # Pre-populate file cache so extraction doesn't re-read from GridFS
                    self._file_cache[str(FileId)] = {
                        "bytes": FileData,
                        "filename": FileName,
                    }
            except FileNotFoundError:
                print(f"File not found: {file_path}")
            except IOError as e:
                print(f"Error opening file: {file_path} - {e}")
            else:
                print(
                    f"Successfully opened file: ",
                    "Upload.{}".format(file_path.split(".")[-1]),
                )

        TabularDocumentTypes = [
            "Master-Transcript-of-Marks",
            "Baccalaureate-Transcript-of-Marks-V1",
            "Baccalaureate-Transcript-of-Marks-V2",
        ]

        # Create session document
        Session = {
            "Session Id": self.id,
            "Operation Date": datetime.datetime.now().strftime(
                "%A, %d %B %Y, %I:%M%p" + " UTC"
            ),
            "Document Type": self.document_type,
            "Information Type": "Tabular"
            if self.document_type in TabularDocumentTypes
            else "Regular",
            "Uploads": Uploads,
            "Status": "Initialized",
            "Error": None,
            "Message": "",
            "Extraction": {
                "Text": "",
                "Tables": [],
            },
            "Correction": {
                "Text": {},
                "Tables": [],
            },
            "Translation": {
                "Text": {},
                "Tables": [],
            },
            "Generation": {
                "PDF Link": "",
                "Google Docs Link": "",
                "Preview Link": "",
            },
        }

        self.session = Session

        # Insert the session document into the 'sessions' collection
        # (skip during combined processing to defer until final save)
        if not skip_db_write:
            self.db.sessions.insert_one(Session)

        return Session

    def ExtractText(self, skip_db_write=False):
        # Process the session document
        print(f"[...] Processing Session: {self.session['Session Id']}")
        print(f"[...] Document Type: {self.session['Document Type']}")
        # Optical Character Recognition (reuse shared singleton)
        OCR = _shared_ocr

        ExtractedText = ""

        for File in self.session["Uploads"]:
            # Get the File ID
            FileId = File["Upload Id"]

            # Get cached file bytes (avoids redundant GridFS reads)
            cached = self._get_file_bytes(FileId)
            FileExtension = cached["filename"].rsplit(".", 1)[1].lower()

            if FileExtension == "pdf":
                # Create PDF Object
                PDf_Bytes = io.BytesIO(cached["bytes"])

                # If the File is a PDF, Read the PDF
                ExtractedText = OCR.ExtractTextFromPDF(
                    self.session["Information Type"],
                    self.session["Session Id"],
                    PDf_Bytes,
                )
            elif FileExtension in {"png", "jpg", "jpeg"}:
                # convert bytes to a file-like object
                FILE_LIKE = io.BytesIO(cached["bytes"])

                # Create an Image object
                IMG = Image.open(FILE_LIKE)

                # If the File is an Image, Read the Image
                ExtractedText += OCR.ExtractTextFromImage(
                    self.session["Information Type"],
                    self.session["Session Id"],
                    IMG,
                )

            # Check if Content is None
            if ExtractedText is None or ExtractedText.strip() == "":
                print("[ERROR] OCR file does not contain any content.")
                self.session["Error"] = "Error Reading the File, Please Try Again."
                self.session["Status"] = "Error"
                self.db.sessions.update_one(
                    {"Session Id": self.session["Session Id"]}, {"$set": self.session}
                )
                raise Exception("No text could be extracted from the uploaded file. Please try a clearer image or PDF.")
            else:
                print("[...] OCR file contains content.")
                print("[...] Extracted Text Length: ", len(ExtractedText))
                # Add the Content to the Session
                self.session["Extraction"]["Text"] = ExtractedText
                # Add new Status
                self.session["Status"] = "Extracted"

        # Update the Session object (skip during combined processing to reduce DB round trips)
        if not skip_db_write:
            self.db.sessions.update_one(
                {"Session Id": self.session["Session Id"]}, {"$set": self.session}
            )

        return ExtractedText

    def ExtractTables(self, skip_db_write=False):
        # Extract Table from the session document
        # Optical Character Recognition (reuse shared singleton)
        OCR = _shared_ocr

        if self.session["Information Type"] != "Tabular":
            print("[WARNING] The Document is not Tabular.")
            return self.session

        Tables = None
        for File in self.session["Uploads"]:
            # Get the File ID
            FileId = File["Upload Id"]

            # Get cached file bytes (avoids redundant GridFS reads)
            cached = self._get_file_bytes(FileId)
            FileExtension = cached["filename"].rsplit(".", 1)[1].lower()

            if FileExtension == "pdf":
                # Create PDF Object
                PDf_Bytes = io.BytesIO(cached["bytes"])
                # If the File is a PDF, Read the PDF
                Tables = OCR.ExtractTableFromPDF(
                    self.session["Information Type"],
                    self.session["Session Id"],
                    PDf_Bytes,
                )
            elif FileExtension in {"png", "jpg", "jpeg"}:
                # convert bytes to a file-like object
                FILE_LIKE = io.BytesIO(cached["bytes"])

                # Create an Image object
                IMG = Image.open(FILE_LIKE)

                # If the File is an Image, Read the Image
                Tables = OCR.ExtractTableFromImage(
                    self.session["Information Type"],
                    self.session["Session Id"],
                    IMG,
                )

            # Check if Content is None
            if Tables is None:
                self.session["Error"] = "Error Reading the File, Please Try Again."
                self.session["Status"] = "Error"
                return self.session
            else:
                # Add the Content to the Session
                self.session["Extraction"]["Tables"] = Tables

                # Add new Status
                self.session["Status"] = "Extracted"

        # Update the Session object
        if not skip_db_write:
            self.db.sessions.update_one(
                {"Session Id": self.session["Session Id"]}, {"$set": self.session}
            )

        return self.session

    def CorrectText(self, skip_db_write=False):
        # GPT to Correct the Output of the OCR
        GPT = GPTCorrector()

        (Text, Doctype) = (
            self.session["Extraction"]["Text"],
            self.session["Document Type"],
        )

        CorrectedText = GPT.CorrectText(Text, Doctype)

        CorrectedText = json.loads(CorrectedText)

        self.session["Correction"]["Text"] = CorrectedText

        # Update the Status of the Session
        self.session["Status"] = "Corrected"

        # Update the Session object
        if not skip_db_write:
            self.db.sessions.update_one(
                {"Session Id": self.session["Session Id"]}, {"$set": self.session}
            )

        return self.session

    def CorrectTables(self, skip_db_write=False):
        # GPT to Correct the Output of the OCR
        GPT = GPTCorrector()

        (Tables, Doctype) = (
            self.session["Extraction"]["Tables"],
            self.session["Document Type"],
        )

        if self.session["Information Type"] == "Tabular":
            Tables = self.session["Extraction"]["Tables"]

            CorrectedTable = GPT.CorrectTable(Tables, Doctype)

            JSON_TABLES = json.loads(CorrectedTable)

            self.session["Correction"]["Tables"] = JSON_TABLES

        # Update the Status of the Session
        self.session["Status"] = "Corrected"

        # Update the Session object
        if not skip_db_write:
            self.db.sessions.update_one(
                {"Session Id": self.session["Session Id"]}, {"$set": self.session}
            )

        return self.session

    def TranslateText(self, skip_db_write=False):
        # GPT to Correct the Output of the OCR
        GPT = GPTCorrector()

        (RAW_OCR, Text, Doctype) = (
            self.session["Extraction"]["Text"],
            self.session["Correction"]["Text"],
            self.session["Document Type"],
        )

        Translated = GPT.TranslateText(RAW_OCR, Text, Doctype)

        TranslatedObject = json.loads(Translated)

        self.session["Translation"]["Text"] = TranslatedObject

        # Update the Status of the Session
        self.session["Status"] = "Translated"

        # Update the Session object
        if not skip_db_write:
            self.db.sessions.update_one(
                {"Session Id": self.session["Session Id"]}, {"$set": self.session}
            )

        return self.session

    def TranslateTables(self, skip_db_write=False):
        # GPT to Correct the Output of the OCR
        GPT = GPTCorrector()

        (Tables, Doctype) = (
            self.session["Correction"]["Tables"],
            self.session["Document Type"],
        )

        if self.session["Information Type"] == "Tabular":
            TranslatedTables = GPT.TranslateTable(Tables, Doctype)

            JSON_TABLE = json.loads(TranslatedTables)

            self.session["Translation"]["Tables"] = JSON_TABLE

        # Update the Status of the Session
        self.session["Status"] = "Translated"

        # Update the Session object
        if not skip_db_write:
            self.db.sessions.update_one(
                {"Session Id": self.session["Session Id"]}, {"$set": self.session}
            )

        return self.session

    def CorrectAndTranslateText(self, skip_db_write=False):
        """Combined correct + translate text in one GPT call (saves ~5s)."""
        GPT = GPTCorrector()

        Text = self.session["Extraction"]["Text"]
        Doctype = self.session["Document Type"]

        corrected, translated = GPT.CorrectAndTranslateText(Text, Doctype)

        self.session["Correction"]["Text"] = corrected
        self.session["Translation"]["Text"] = translated
        self.session["Status"] = "Translated"

        if not skip_db_write:
            self.db.sessions.update_one(
                {"Session Id": self.session["Session Id"]}, {"$set": self.session}
            )

        return self.session

    def CorrectAndTranslateTables(self, skip_db_write=False):
        """Combined correct + translate tables in one GPT call (saves ~14s)."""
        GPT = GPTCorrector()

        Tables = self.session["Extraction"]["Tables"]
        Doctype = self.session["Document Type"]

        if self.session["Information Type"] == "Tabular":
            corrected, translated = GPT.CorrectAndTranslateTable(Tables, Doctype)

            self.session["Correction"]["Tables"] = corrected
            self.session["Translation"]["Tables"] = translated

        self.session["Status"] = "Translated"

        if not skip_db_write:
            self.db.sessions.update_one(
                {"Session Id": self.session["Session Id"]}, {"$set": self.session}
            )

        return self.session

    def GenerateDocument(self):
        # Method to generate PDF files from Correct Output
        PDF = PDFGenerator()

        # Generate the PDF
        Links = PDF.Generate(self.Get())

        # Check if generation returned an error
        if "Error" in Links:
            raise Exception(Links.get("Message", Links["Error"]))

        # Add the Links to the Session
        self.session["Generation"] = Links

        # Update the Status of the Session
        self.session["Status"] = "Generated"

        # Update the Session object
        self.db.sessions.update_one(
            {"Session Id": self.session["Session Id"]}, {"$set": self.session}
        )

        return self.session

    def SaveToDatabase(self):
        """Save current session state to MongoDB (used at the end of combined processing).
        Uses upsert so it works whether Initialize wrote to DB or was skipped."""
        self.db.sessions.update_one(
            {"Session Id": self.session["Session Id"]},
            {"$set": self.session},
            upsert=True,
        )
        # Free file cache memory after final save
        self._file_cache.clear()

    def Destroy(self):
        # Remove the session document from the 'sessions' collection
        self.db.sessions.delete_one({"Session Id": self.id})

        # Remove the files from GridFS
        for filename in self.filenames:
            file = self.db.fs.files.find_one({"filename": filename})
            if file:
                self.fs.delete(file["_id"])

    # Public methods
    def DestroyAll(self):
        # Get all the Sessions and remove them from the Database
        self.db.sessions.delete_many({})
        # Remove all the files from GridFS
        for file in self.db.fs.files.find():
            self.fs.delete(file["_id"])

        return self.session

    # Get Session by ID and Set it as the Current Session
    def GetSession(self, SessionID):
        # Get the Session
        Session = self.db.sessions.find_one({"Session Id": SessionID})

        # Set the Session
        self.session = Session

        return Session

    def GetFile(self, SessionID):
        # Get the Session
        Session = self.db.sessions.find_one({"Session Id": SessionID})

        # Get the File
        File = self.fs.get(Session["Uploads"][0]["Upload Id"])

        FileLike = io.BytesIO(File.read())

        # If File is Image
        if File.filename.rsplit(".", 1)[1].lower() in {"png", "jpg", "jpeg"}:
            # create an Image object
            img = Image.open(FileLike)
            return img

        return FileLike

    # Method to set Values for Corrected Fields
    def SetValues(self, NewValues):
        OldValues = self.session["Translation"]["Text"]

        for Field in NewValues:
            OldValues[Field] = NewValues[Field]

        self.session["Translation"]["Text"] = OldValues

        return self.session

    # Throw an error
    def Error(self, Error):
        self.session["Error"] = Error
        self.session["Status"] = "Error"
        return self.session
