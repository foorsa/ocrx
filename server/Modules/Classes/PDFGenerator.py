# This class can have templates for each document type
# (Baccalaureate Diploma, Language Diploma, Master Diploma)
# and methods to fill in the template with the translated information.
# You can use libraries like ReportLab or PyFPDF to generate the PDF files.
import datetime
import requests
import json


TemplateIDs = {
    # Baccalaureate
    "Baccalaureate-Certificate": "1X3rr9TPPR7egAZLvDalNBAnkOYizgAmezHwFgRw1rzE",
    "Baccalaureate-School-Certificate": "18HyzaYEH9JPbseo_SXebTBZ-O8gjAIP_x-m6XDRVbAU",
    # Master
    "Master-Certificate": "1gBQowrWKrdR98okjfY8s7rRL3vteY64f6sM3Wx8TzR8",
    "Master-Transcript-of-Marks": "Master-Transcript-of-Marks",
    "Certificate-of-success-at-diploma": "1TFocZylhyKTNXlvZ8Bz-sKJAPOdpIdx1w37-Kyw7rJk",
    # Extra Docs
    "ExtraDocs-Police-Record-Checks": "18JiMZbk2qHXnhi0ecqHKq3L4Hu4GLNWnirx2PXKAoi0",
    "SOPIBDOL": "1G42GpqZrapdmjbinaa6JGeKXK0v2V4wkX4Be2K7RvoI",
}


class PDFGenerator:
    def Generate(self, Document_Type, SessionId, Values):
        # Get the template ID
        Template_Id = None
        if Document_Type in TemplateIDs:
            Template_Id = TemplateIDs[Document_Type]
        else:
            return {
                "Error": "Error Generating PDF.",
                "Status": 400,
                "Message": "Document Type not found",
            }

        # Fields is a dictionary with the fields to fill in the template

        # Add Session Id and Translation Date to Fields
        Values["Session Id"] = SessionId
        Values["Translation Date"] = datetime.datetime.now().strftime("%d %B %Y")

        # Meta Data is a dictionary with the information
        # about the session
        # We use it to fill the name of the file, and the Translation Date and Session Id
        Meta_Data = {
            "Document_Type": Document_Type,
            "Session_Id": SessionId,
            "Translation_Date": datetime.datetime.now().strftime("%d %B %Y"),
        }

        # Get the template
        URL = "https://script.google.com/macros/s/AKfycbwulQtedL9Y-M8wRbHkYOZV4j5J4DwamGSQ8xoa6d5eZCm5KeQ7-o3RyCdh1Z9hk-4/exec"
        DATA = {
            "templateId": Template_Id,
            "replacements": Values,
            "metaData": Meta_Data,
        }
        Response = requests.post(URL, data=json.dumps(DATA))

        if Response.status_code == 200:
            links = Response.json()

            Links = {
                "PDF Link": links["pdfLink"],
                "Google Docs Link": links["docLink"],
                "Preview Link": links["previewLink"],
            }

            return Links
        else:
            print("Status:", Response.status_code)
            print("Content:", Response.reason)

            return {
                "Error": "Error Generating PDF.",
                "Status": Response.status_code,
                "Message": Response.reason,
            }
