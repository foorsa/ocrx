# Nameaspace: /Modules/SessionGenerator.py

import datetime
import json
from werkzeug.utils import secure_filename
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from urllib.parse import quote_plus
import gridfs
from PIL import Image
import io
import os
from unicodedata import normalize

# Classes Required for Operations
from Modules.Classes.OCRProcessor import OCRProcessor
from Modules.Classes.GPTCorrector import GPTCorrector
from Modules.Classes.PDFGenerator import PDFGenerator

# Credentials
username = quote_plus("yassinechettouch")
password = quote_plus("0tr7$F1m!@OCRX")
cluster = "ocrx-db.rpxyaec.mongodb.net"

# Auth Method
authentication_method = "SCRAM"

uri = (
    "mongodb+srv://"
    + username
    + ":"
    + password
    + "@"
    + cluster
    + "/?retryWrites=true&w=majority"
)

# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi("1"))

# Load BSON Data from the database
from bson import json_util


def parse_json(data):
    return json.loads(json_util.dumps(data))


class SessionGenerator:
    def __init__(self, Files, DocumentType):
        self.id = ""
        self.document_type = DocumentType
        self.files = Files  # Now a list of files
        self.session = {
            "Session Id": "",
            "Document Type": "",
            "Uploads": [],
            "Status": "Pending",
            "Error": None,
            "Message": "",
        }
        self.client = MongoClient(uri, server_api=ServerApi("1"))
        self.db = self.client["OCRX-db"]  # Connect to the 'ocrx-db' database
        self.fs = gridfs.GridFS(self.db)  # Use GridFS for file storage

    # Get the Session Information
    def Get(self):
        Session = self.session
        return parse_json(Session)

    def Initialize(self):
        # Session ID
        session_id = str(datetime.datetime.now())
        self.id = session_id.replace(" ", "").replace(":", "-").replace(".", "-")

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

        # Create session document
        Session = {
            "Session Id": self.id,
            "Document Type": self.document_type,
            "Uploads": Uploads,
            "Status": "Processing",
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
                    self.session["Document Type"], self.session["Session Id"], PDf_Bytes
                )
            elif FileExtension in {"png", "jpg", "jpeg"}:
                # convert bytes to a file-like object
                file_like = io.BytesIO(File.read())

                # create an Image object
                img = Image.open(file_like)
                # If the File is an Image, Read the Image
                Content = OCR.Read_Image(self.session["Document Type"], img)

            # Check if Content is None
            if Content is None:
                self.session["Error"] = "Error Reading the File, Please Try Again."
                self.session["Status"] = "Error"
                return self.session
            else:
                # Add the Content to the Session
                self.session["Extraction"] = {"RAW": Content}
        # Update the Session object
        self.db.sessions.update_one(
            {"Session Id": self.session["Session Id"]}, {"$set": self.session}
        )

        return self.session

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

    def Correct(self):
        # GPT to Correct the Output of the OCR
        GPT = GPTCorrector()

        (Content, Doctype) = (
            self.session["Extraction"]["RAW"],
            self.session["Document Type"],
        )

        Corrected = GPT.Correct(Content, Doctype)

        CorrectedObject = json.loads(Corrected)

        Description = GPT.Describe(Corrected, Doctype)

        self.session["Extraction"]["Corrected"] = CorrectedObject

        self.session["Extraction"]["Description"] = Description

        # Update the Session object
        self.db.sessions.update_one(
            {"Session Id": self.session["Session Id"]}, {"$set": self.session}
        )

        return self.session

    def Generate(self, Fields):
        # Method to generate PDF files from Correct Output
        PDF = PDFGenerator()

        # Fields are required to generate the PDF
        if Fields is None:
            self.session["Error"] = {
                "error": "Error Generating PDF.",
                "message": "Fields are None",
                "status": 400,
            }
            self.session["Status"] = "Error"
            return self.session

        # Generate the PDF
        Links = PDF.Generate(
            self.session["Document Type"], self.session["Session Id"], Fields
        )

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

    # Throw an error
    def Error(self, Error):
        self.session["Error"] = Error
        self.session["Status"] = "Error"
        return self.session
