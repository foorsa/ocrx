# This class can have templates for each document type
# (Baccalaureate Diploma, Language Diploma, Master Diploma)
# and methods to fill in the template with the translated information.
# You can use libraries like ReportLab or PyFPDF to generate the PDF files.
import datetime
import requests
import json


TemplateIDs = {
    # Baccalaureate
    "Baccalaureate-Certificate": "1M5M-Xe3fBOk0zXydJU4_js5N1jXSxtEh0WEcQxUv7b0",
    "Baccalaureate-School-Certificate": "1hmTI94rg7lNjyLDR6LOwCex7N7mJLzZeTrgQb7isgdY",
    "Baccalaureate-Transcript-of-Marks-V1": "1Z3iGEgvJ84Ab5oQMN8zkkEKkkdYvjNcrlMv-J7fE0nA",
    "Baccalaureate-Transcript-of-Marks-V2": "19azfA-YJqDNzl0gCKLjGtxchc8EqeeVhRv7e-sdmrBs",
    # Master
    "Master-Certificate": "1U2z7kfFQyeAI5ahMd1ClIKN7aI2SAxX81p_rnOa4Qp8",
    "Master-Transcript-of-Marks": "1p5Sy4TAThedWGTeqpxR9xJYUFj-6FlQEIxN7mDRi41c",
    "Certificate-of-success-at-diploma": "1In6UYY0FB4hUZiSFYQZ355R9iBrCCe3klY5FAW7m_lw",
    "Certificate-of-schooling": "15Eha3x9bwVW5fcLHaMwuOIo9fHfRhLzFBENU3bS_elk",
    # Extra Docs
    "ExtraDocs-Police-Record-Checks": "1sA8WiOhsj8MnEFXen9yg__wa93KgZJAGdoBZrsOvnvk",
    "SOPIBDOL": "18jxxLVJEGgcXNjP0HLt6OEhCJurCbbzw_qhOem7cy00",
    "Registration-Certificate": "1vfPYiiQfAyOyPgA4AfZpoMHb-NPTBw2aSN1FLMepDjE",
    "Technical-University-Degree": "1O_7KR2t0m4eSPbCsSCu5uhuUasn7e-Vxo3TIfJHmUKA",
    "Certificate-of-Achievement": "168Q9wIx0aiGOp6Fco4EDac_867xDNq41JLFW57IJh58",
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
        URL = "https://script.google.com/macros/s/AKfycbzx8PqBDbLX9aQMQty2plhGT4_BeeB_OFnycIunGk2ZqGqEikQPz2e0u82m3MeUvCES/exec"

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
