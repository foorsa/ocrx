import json
import os
import datetime
from werkzeug.utils import secure_filename
import shutil


class SessionGenerator:
    def __init__(self, File, DocumentType):
        self.id = ""
        self.file = File
        self.document_type = DocumentType

    def Generate(self):
        # The session folder is created in the server's root directory
        # The session folder contains two subfolders: Uploads and Results
        # Plus a Data file that contains information about the session

        # Session ID
        session_id = str(datetime.datetime.now())
        self.id = session_id.replace(" ", "_").replace(":", "-").replace(".", "-")

        # Create session directory
        session_path = os.path.join(os.getcwd(), "Sessions", self.id)
        os.makedirs(session_path)

        # Uploads folder
        uploads_path = os.path.join(session_path, "Uploads")
        os.makedirs(uploads_path)

        # Results folder
        results_path = os.path.join(session_path, "Results")
        os.makedirs(results_path)

        # Save file
        filename = secure_filename(self.file.filename)
        file_path = os.path.join(uploads_path, filename)
        self.file.save(file_path)

        # Create data.json file
        data = {
            "Session ID": self.id,
            "Document Type": self.document_type,
            "File Name": filename,
            "File Path": file_path,
            "Public File Path": "/Sessions/{}/Uploads/{}".format(self.id, filename),
            "Status": "Processing",
            "Error": None,
        }

        data_path = os.path.join(session_path, "Data.json")
        with open(data_path, "w") as f:
            json.dump(data, f)

        return data

    def Destroy(self):
        session_path = os.path.join(os.getcwd(), "Sessions", self.id)
        shutil.rmtree(session_path)
