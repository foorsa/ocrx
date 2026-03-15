# This class can have templates for each document type
# (Baccalaureate Diploma, Language Diploma, Master Diploma)
# and methods to fill in the template with the translated information.
# You can use libraries like ReportLab or PyFPDF to generate the PDF files.
import os
import requests
import json
from Modules.Classes.DocxTableGenerator import DocxTableGenerator


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
        Document_Type = Session["Document Type"]

        # [1] Get the Template ID
        print("[...] Getting the Template ID...")
        Template_Id = TemplateIDs.get(Document_Type)

        # If no template ID is configured, fall back to local PDF generation for tabular docs
        if not Template_Id:
            print(f"[!] No Template ID configured for {Document_Type}")
            return self._fallback_local_pdf(Session)

        # [2] Get the Google Apps Script URL
        URL = os.environ.get("GOOGLE_SCRIPT_URL")
        if not URL:
            print("[!] GOOGLE_SCRIPT_URL not configured")
            return self._fallback_local_pdf(Session)

        # [3] Gather the information to fill in the template
        print("[...] Generating document using Google Apps Script template...")
        DATA = {
            "TemplateId": Template_Id,
            "Session": Session,
        }

        # [4] Send the POST Request to the Script
        try:
            Response = requests.post(URL, json=DATA)
        except Exception as Error:
            print(f"[X] Error sending request to Google Apps Script: {Error}")
            return self._fallback_local_pdf(Session)

        # [5] Check the Response
        if Response.status_code == 200 and Response.content is not None:
            try:
                ResponseData = Response.json()

                if ResponseData["status"] != "success":
                    print(f"[X] Google Apps Script error: {ResponseData['message']}")
                    return self._fallback_local_pdf(Session)

                Links = {
                    "PDF Link": ResponseData["pdfLink"],
                    "Google Docs Link": ResponseData["docLink"],
                    "Preview Link": ResponseData["previewLink"],
                }
                print(f"[OK] Document generated via template: {Links['PDF Link']}")
                return Links
            except Exception as Error:
                print(f"[X] Error parsing Google Apps Script response: {Error}")
                return self._fallback_local_pdf(Session)
        else:
            print(f"[X] Google Apps Script returned status {Response.status_code}: {Response.reason}")
            return self._fallback_local_pdf(Session)

    def _fallback_local_pdf(self, Session):
        """Fall back to local PDF generation for tabular documents."""
        docx_gen = DocxTableGenerator()
        if docx_gen.is_tabular(Session):
            print("[...] Falling back to local PDF generation for tabular document...")
            try:
                filename, file_base64 = docx_gen.generate(Session)
                print(f"[OK] Generated local PDF: {filename}")
                download_path = f"/api/v1/download/{filename}"
                return {
                    "PDF Link": download_path,
                    "Google Docs Link": download_path,
                    "Preview Link": download_path,
                    "File Data": file_base64,
                    "File Name": filename,
                }
            except Exception as e:
                print(f"[X] Local PDF generation failed: {e}")

        return {
            "Error": "Error Generating PDF.",
            "Status": 400,
            "Message": "No template configured and local generation failed.",
        }
