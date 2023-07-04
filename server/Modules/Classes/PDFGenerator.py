# This class can have templates for each document type
# (Baccalaureate Diploma, Language Diploma, Master Diploma)
# and methods to fill in the template with the translated information.
# You can use libraries like ReportLab or PyFPDF to generate the PDF files.
import datetime
import os
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
    def Generate(self, Doctype, SessionId, Fields):
        # Get the template ID
        TemplateId = None
        if Doctype in TemplateIDs:
            TemplateId = TemplateIDs[Doctype]
        else:
            return None

        # Fields are an array of object containing the field name and the value and description, etc.
        # Transform them into a dictionary
        # Keys are the field names and values are the field values
        Fields = {field["name"]: field["value"] for field in Fields}
        # Add Session Id and Translation Date to Fields
        Fields["Session Id"] = SessionId
        # Beautiful Date
        Fields["Translation Date"] = datetime.datetime.now().strftime("%d %B %Y")

        # Get the template
        URL = f"https://script.google.com/macros/s/AKfycbxt1JwpWDPzQ1dKF6L8Xfulm4kK_QCRtXrH_8OG0QbEOfWZT3TN6umsEI80G_3E4FxA/exec"
        DATA = {"templateId": TemplateId, "replacements": Fields}
        Response = requests.post(URL, data=json.dumps(DATA))

        if Response.status_code == 200:
            links = Response.json()

            print("Google Docs Link:", links["docLink"])
            print("PDF Link:", links["pdfLink"])
            print("Preview Link:", links["previewLink"])

            Links = {
                "PDF Link": links["pdfLink"],
                "Google Docs Link": links["docLink"],
                "Preview Link": links["previewLink"],
            }

            return Links
        else:
            print("Status:", Response.status_code)
            print("Content:", Response.reason)

            return None
