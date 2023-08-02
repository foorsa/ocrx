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
    "Baccalaureate-Transcript-of-Notes": "19XxnsnQxSbWdWKkcUf7kuu7U5DMb056YKZqbI_KYImI",
    # Master
    "Master-Certificate": "1gBQowrWKrdR98okjfY8s7rRL3vteY64f6sM3Wx8TzR8",
    "Master-Transcript-of-Marks": "16s73p8NUPIcUFkv-VB4i8GSCDRXPtQOb5qJTKzF7xpo",
    "Certificate-of-success-at-diploma": "1TFocZylhyKTNXlvZ8Bz-sKJAPOdpIdx1w37-Kyw7rJk",
    # Extra Docs
    "ExtraDocs-Police-Record-Checks": "18JiMZbk2qHXnhi0ecqHKq3L4Hu4GLNWnirx2PXKAoi0",
    "SOPIBDOL": "1G42GpqZrapdmjbinaa6JGeKXK0v2V4wkX4Be2K7RvoI",
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
        URL = "https://script.google.com/macros/s/AKfycbyg1pMaO7_jNGg7oCizAe5n2aDq1YjhLrAXocbHyLJGf980U0lNAi5T7pFGWsJptq4E/exec"

        # [3] Gather the information to fill in the template.
        print("[...] Gathering the information to fill in the template...")
        DATA = {
            # [X] Giving the Template ID to the Script
            "TemplateId": Template_Id,
            "Session": Session,
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
