# This class can have templates for each document type
# (Baccalaureate Diploma, Language Diploma, Master Diploma)
# and methods to fill in the template with the translated information.
# You can use libraries like ReportLab or PyFPDF to generate the PDF files.
import os
import requests
from google.oauth2 import service_account
from googleapiclient.discovery import build

# URL = "https://script.google.com/macros/s/AKfycbxLTDAyEzqC1l49RVLI6BosQMfcv3Eb7y6_Nu3z6aSkAmqGg0N38YyRLV2MB-pX6aQ9/exec?SerialNumber={}&Candidate={}&DateOfBirth={}&Institute={}&City={}&Province={}&Session={}&Mention={}&Series={}"

# JSON Authentication File is in the Root Directory: /Cloud/credentials.json
credentials = service_account.Credentials.from_service_account_file(
    os.path.join(os.getcwd(), "server", "Cloud", "credentials.json")
)

# Use the credentials to authenticate
drive_service = build("drive", "v3", credentials=credentials)
docs_service = build("docs", "v1", credentials=credentials)


class PDFGenerator:
    def Generate(self, document_type, session_id, fields):
        if document_type == "Baccalaureate-Certificate":
            PDF_Path = self.BaccalaureateDiploma(session_id, fields)
            return PDF_Path
        else:
            raise ValueError("Unsupported document type")

    def BaccalaureateDiploma(self, session_id, fields):
        SerialNumber = None
        Candidate = None
        DateOfBirth = None
        Institute = None
        City = None
        Province = None
        Session = None
        Mention = None
        Series = None

        for field in fields:
            match field["name"]:
                case "Serial Number":
                    SerialNumber = field["value"]
                case "Candidate":
                    Candidate = field["value"]
                case "Date of birth":
                    DateOfBirth = field["value"]
                case "Institute":
                    Institute = field["value"]
                case "City":
                    City = field["value"]
                case "Province":
                    Province = field["value"]
                case "Session":
                    Session = field["value"]
                case "Series":
                    Series = field["value"]
                case "Mention":
                    Mention = field["value"]
                case _:
                    return False

        # Generate the PDF using the provided fields
        print("[Processing] ", "Baccalaureate Diploma - ", Candidate)
        response = requests.get(
            URL.format(
                SerialNumber,
                Candidate,
                DateOfBirth,
                Institute,
                City,
                Province,
                Session,
                Mention,
                Series,
            )
        )
        print("[File Generated] ", "Baccalaureate Diploma - ", Candidate)
        response = requests.get(response.content)
        print("[File Downloaded] ", "Baccalaureate Diploma - ", Candidate)

        return response
