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
from Modules.Classes.OCRProcessor import OCRProcessor
from Modules.Classes.GPTCorrector import GPTCorrector
from Modules.Classes.PDFGenerator import PDFGenerator


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
        client = MongoClient(uri, server_api=ServerApi("1"))
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

# Continue with your MongoDB operations using the 'db' object.

client = MongoClient(uri, server_api=ServerApi("1"))

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
        }
        self.db = db  # Connect to the 'ocrx-db' database
        self.fs = gridfs.GridFS(self.db)  # Use GridFS for file storage

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

    def Initialize(self, DocumentType, Files):
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
            "Baccalaureate-Transcript-of-Notes",
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
        }

        self.session = Session

        # Insert the session document into the 'sessions' collection
        self.db.sessions.insert_one(Session)

        return Session

    def Read(self):
        # Process the session document
        print(f"[...] Processing Session: {self.session['Session Id']}")
        print(f"[...] Document Type: {self.session['Document Type']}")
        # Optical Character Recognition
        OCR = OCRProcessor()

        Content = None
        for File in self.session["Uploads"]:
            # Get the File ID
            FileId = File["Upload Id"]

            # Get the File
            File = self.fs.get(FileId)

            # Get the File Extension
            FileExtension = File.filename.rsplit(".", 1)[1].lower()

            if FileExtension == "pdf":
                # Create PDF Object
                PDf_Bytes = io.BytesIO(File.read())
                # If the File is a PDF, Read the PDF
                Content = OCR.Read_PDF(
                    self.session["Information Type"],
                    self.session["Session Id"],
                    PDf_Bytes,
                )
            elif FileExtension in {"png", "jpg", "jpeg"}:
                # convert bytes to a file-like object
                FILE_LIKE = io.BytesIO(File.read())

                # Create an Image object
                IMG = Image.open(FILE_LIKE)

                # If the File is an Image, Read the Image
                Content = OCR.Read_Image(
                    self.session["Information Type"],
                    self.session["Session Id"],
                    IMG,
                )

            # Check if Content is None
            if Content is None:
                self.session["Error"] = "Error Reading the File, Please Try Again."
                self.session["Status"] = "Error"
                return self.session
            else:
                # Add the Content to the Session
                self.session["Extraction"] = Content
                # Add new Status
                self.session["Status"] = "Extracted"
        # Update the Session object
        self.db.sessions.update_one(
            {"Session Id": self.session["Session Id"]}, {"$set": self.session}
        )

        return self.session

    def Correct(self):
        # GPT to Correct the Output of the OCR
        GPT = GPTCorrector()

        (Content, Doctype) = (
            self.session["Extraction"]["RAW"],
            self.session["Document Type"],
        )

        Corrected = GPT.Correct(Content, Doctype)

        if self.session["Information Type"] == "Tabular":
            RAW_TABLE = self.session["Extraction"]["RAW_TABLES"]

            CorrectedTable = GPT.CorrectTable(RAW_TABLE, Doctype)

            JSON_TABLE = json.loads(CorrectedTable)

            self.session["Extraction"]["CorrectedTable"] = JSON_TABLE

        CorrectedObject = json.loads(Corrected)

        Description = GPT.Describe(Corrected, Doctype)

        self.session["Extraction"]["Corrected"] = CorrectedObject

        self.session["Extraction"]["Description"] = Description

        # Update the Status of the Session
        self.session["Status"] = "Corrected"

        # Update the Session object
        self.db.sessions.update_one(
            {"Session Id": self.session["Session Id"]}, {"$set": self.session}
        )

        return self.session

    def Generate(self):
        # Method to generate PDF files from Correct Output
        PDF = PDFGenerator()

        Session = self.session

        # Generate the PDF
        Links = PDF.Generate(self.Get())

        # Add the Links to the Session
        self.session["Generation"] = Links

        return self.session

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
        OldValues = self.session["Extraction"]["Corrected"]

        for Field in NewValues:
            OldValues[Field] = NewValues[Field]

        self.session["Extraction"]["Corrected"] = OldValues

        return self.session

    # Throw an error
    def Error(self, Error):
        self.session["Error"] = Error
        self.session["Status"] = "Error"
        return self.session
