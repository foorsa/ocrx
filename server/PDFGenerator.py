# This class can have templates for each document type
# (Baccalaureate Diploma, Language Diploma, Master Diploma)
# and methods to fill in the template with the translated information.
# You can use libraries like ReportLab or PyFPDF to generate the PDF files.
import os
import requests
import json


TemplateIDs = {
    "Baccalaureate-Certificate": os.environ.get(
        "TemplateIDs_Baccalaureate_Certificate"
    ),
    "Baccalaureate-School-Certificate": os.environ.get(
        "TemplateIDs_Baccalaureate_School_Certificate"
    ),
    "Baccalaureate-Transcript-of-Marks-V1": os.environ.get(
        "TemplateIDs_Baccalaureate_Transcript_of_Marks_V1"
    ),
    "Baccalaureate-Transcript-of-Marks-V2": os.environ.get(
        "TemplateIDs_Baccalaureate_Transcript_of_Marks_V2"
    ),
    "Bachelor-Certificate": os.environ.get("TemplateIDs_Bachelor_Certificate"),
    "Master-Certificate": os.environ.get("TemplateIDs_Master_Certificate"),
    "Master-Transcript-of-Marks": os.environ.get(
        "TemplateIDs_Master_Transcript_of_Marks"
    ),
    "Master-Certificate-of-Success-at-Diploma": os.environ.get(
        "TemplateIDs_Master_Certificate_of_Success_at_Diploma"
    ),
    "Master-Certificate-of-Schooling": os.environ.get(
        "TemplateIDs_Master_Certificate_of_Schooling"
    ),
    "ExtraDocs-Police-Record-Checks": os.environ.get(
        "TemplateIDs_ExtraDocs_Police_Record_Checks"
    ),
    "ExtraDocs-Statement-of-Penalties-Issued-by-Deprivation-of-Liberty": os.environ.get(
        "TemplateIDs_Extradocs_Statement_of_Penalties_Issued_by_Deprivation_of_Liberty"
    ),
    "ExtraDocs-Registration-Certificate": os.environ.get(
        "TemplateIDs_ExtraDocs_Registration_Certificate"
    ),
    "ExtraDocs-Technical-University-Degree": os.environ.get(
        "TemplateIDs_ExtraDocs_Technical_University_Degree"
    ),
    "ExtraDocs-Certificate-of-Achievement": os.environ.get(
        "TemplateIDs_ExtraDocs_Certificate_of_Achievement"
    ),
}


class PDFGenerator:
    def Generate(self, Session):
        # [1] Get the Template ID: Used to Generate the Document with a Google Docs File.

        print("[...] Getting the Template ID...")
        Document_Type = Session["Document Type"]
        Template_Id = None
        if Document_Type in TemplateIDs:
            print("[OK] Template ID Found !")
            Template_Id = TemplateIDs[Document_Type]
        else:
            print("[X] Template ID Not Found !")
            return {
                "Error": "Error Generating PDF.",
                "Status": 400,
                "Message": "Document Type not found",
            }

        # [2] Store the Script ID: we execute the Apps Script to Generate the Document.
        print("[...] Getting the Script ID...")
        # Get URL from .env
        URL = os.environ.get("GOOGLE_SCRIPT_URL")

        # [3] Gather the information to fill in the template.
        print("[...] Gathering the information to fill in the template...")
        DATA = {
            # [X] Giving the Template ID to the Script
            "TemplateId": Template_Id,
            "Session": Session,
            # Table formatting options for compact table rendering
            "tableOptions": {
                "fontSize": 8,
                "headerFontSize": 8,
                "cellPadding": 2,
                "fitToPageWidth": True,
            },
        }
        print("[OK] Gathering the information to fill in the template Finished !")

        # [4] Send the POST Request to the Script.
        print("[...] Sending the POST Request to the Script...")
        try:
            Response = requests.post(URL, data=json.dumps(DATA))
        except Exception as Error:
            print("[X] Error Sending the POST Request to the Script !")
            print("Error:", Error)
            return {
                "Error": "Error Generating PDF.",
                "ErrorMessage": str(Error),
                "Status": 400,
                "Message": "Error Sending the POST Request to the Script",
            }
        print("[OK] Sending the POST Request to the Script Finished !")

        # [5] Check the Response Status Code.
        print("[...] Checking the Response Status Code...")
        if Response.status_code == 200 and Response.content is not None:
            try:
                print("[OK] Response Status Code is 200 !")
                # Show the Response in the Terminal
                print("[...] Showing the Response in the Terminal...")
                print(Response.content)

                ResponseData = Response.json()

                if ResponseData["status"] != "success":
                    print("[X] Error Generating PDF !")
                    print("Error:", ResponseData["message"])
                    return {
                        "Error": "Error Generating PDF.",
                        "ErrorMessage": ResponseData["message"],
                        "Status": 400,
                        "Message": "Error Generating PDF",
                    }

                # [6] Return the Links to the Generated Document.
                print("[...] Returning the Links to the Generated Document...")
                Links = {
                    "PDF Link": ResponseData["pdfLink"],
                    "Google Docs Link": ResponseData["docLink"],
                    "Preview Link": ResponseData["previewLink"],
                }
                print("[OK] Returning the Links to the Generated Document Finished !")

                print(
                    f"""
                    [OK] PDF Link: {Links['PDF Link']} \n
                    [OK] Google Docs Link: {Links['Google Docs Link']} \n
                    [OK] Preview Link: {Links['Preview Link']}
                    """
                )
                return Links
            except Exception as Error:
                print("[X] Error Returning the Links to the Generated Document !")
                print("Error:", Error)
                return {
                    "Error": "Error Generating PDF.",
                    "ErrorMessage": str(Error),
                    "Status": 400,
                    "Message": "Error Returning the Links to the Generated Document",
                }
        else:
            # [EXCEPTION] Return the Error Message: Status Code and Reason.
            print("[X] Response Status Code is not 200 !")
            print("Status:", Response.status_code)
            print("Content:", Response.reason)

            return {
                "Error": "Error Generating PDF.",
                "Status": Response.status_code,
                "Message": Response.reason,
            }
