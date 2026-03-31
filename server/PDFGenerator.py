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
        "TemplateIDs_Baccalaureate_Certificate",
        "1X3rr9TPPR7egAZLvDalNBAnkOYizgAmezHwFgRw1rzE",
    ),
    "Baccalaureate-Certificate-V2": os.environ.get(
        "TemplateIDs_Baccalaureate_Certificate_V2",
        "1kJMRbEAy3c3x0sPuV5kSb9rebgs-ULjV08uj8ow3xlc",
    ),
    "Baccalaureate-School-Certificate": os.environ.get(
        "TemplateIDs_Baccalaureate_School_Certificate",
        "18HyzaYEH9JPbseo_SXebTBZ-O8gjAIP_x-m6XDRVbAU",
    ),
    "Baccalaureate-Transcript-of-Marks-V1": os.environ.get(
        "TemplateIDs_Baccalaureate_Transcript_of_Marks_V1",
        "1P8IUOG1ee2RS3y3TTGVLNeueHHaym4-S5fsnXoO4HqY",
    ),
    "Baccalaureate-Transcript-of-Marks-V2": os.environ.get(
        "TemplateIDs_Baccalaureate_Transcript_of_Marks_V2",
        "1yTkDcROEOUAyMPdfQn09770AQK3iLjaXpWAo7Ad7iMo",
    ),
    "Bachelor-Certificate": os.environ.get(
        "TemplateIDs_Bachelor_Certificate",
        "1gBQowrWKrdR98okjfY8s7rRL3vteY64f6sM3Wx8TzR8",
    ),
    "Master-Certificate": os.environ.get(
        "TemplateIDs_Master_Certificate",
        "1gBQowrWKrdR98okjfY8s7rRL3vteY64f6sM3Wx8TzR8",
    ),
    "Master-Transcript-of-Marks": os.environ.get(
        "TemplateIDs_Master_Transcript_of_Marks",
        "1yI3Gdxlw1YlEz-OuhxXNlNqelvzYphNxyo2nnS0n3cM",
    ),
    "Master-Certificate-of-Success-at-Diploma": os.environ.get(
        "TemplateIDs_Master_Certificate_of_Success_at_Diploma",
        "1TFocZylhyKTNXlvZ8Bz-sKJAPOdpIdx1w37-Kyw7rJk",
    ),
    "Master-Certificate-of-Schooling": os.environ.get(
        "TemplateIDs_Master_Certificate_of_Schooling",
        "1tWVsD9xKxVLYlM4FwnsHsIkEyVLPj0X_hcyqitvFhHM",
    ),
    "ExtraDocs-Police-Record-Checks": os.environ.get(
        "TemplateIDs_ExtraDocs_Police_Record_Checks",
        "18JiMZbk2qHXnhi0ecqHKq3L4Hu4GLNWnirx2PXKAoi0",
    ),
    "ExtraDocs-Statement-of-Penalties-Issued-by-Deprivation-of-Liberty": os.environ.get(
        "TemplateIDs_Extradocs_Statement_of_Penalties_Issued_by_Deprivation_of_Liberty",
        "1G42GpqZrapdmjbinaa6JGeKXK0v2V4wkX4Be2K7RvoI",
    ),
    "ExtraDocs-Registration-Certificate": os.environ.get(
        "TemplateIDs_ExtraDocs_Registration_Certificate",
        "1O_7KR2t0m4eSPbCsSCu5uhuUasn7e-Vxo3TIfJHmUKA",
    ),
    "ExtraDocs-Technical-University-Degree": os.environ.get(
        "TemplateIDs_ExtraDocs_Technical_University_Degree",
        "1O_7KR2t0m4eSPbCsSCu5uhuUasn7e-Vxo3TIfJHmUKA",
    ),
    "ExtraDocs-Certificate-of-Achievement": os.environ.get(
        "TemplateIDs_ExtraDocs_Certificate_of_Achievement",
        "168Q9wIx0aiGOp6Fco4EDac_867xDNq41JLFW57IJh58",
    ),
    "ExtraDocs-Bank-Statement": os.environ.get(
        "TemplateIDs_ExtraDocs_Bank_Statement",
        "1jNldSomjyT-Y2UFM7BpZIb4bqQGGNN-qysOGgr1PqtM",
    ),
    "ExtraDocs-Birth-Certificate": os.environ.get(
        "TemplateIDs_ExtraDocs_Birth_Certificate",
        "1aqtqLEQ54UQ2uCOqqSGD5fpC9npjlgVy0QpA_6sZZcQ",
    ),
    "ExtraDocs-Death-Certificate": os.environ.get(
        "TemplateIDs_ExtraDocs_Death_Certificate",
        "1IYNkZ7Cuw0fG44wWnKryjtO17jJEBocihClsv3Yrfrg",
    ),
}


class PDFGenerator:
    def Generate(self, Session):
        Document_Type = Session["Document Type"]

        # [1] Get the Template ID
        print(f"[...] Getting the Template ID for '{Document_Type}'...")
        Template_Id = TemplateIDs.get(Document_Type)

        # If no template ID is configured, fall back to local PDF generation for tabular docs
        if not Template_Id:
            print(f"[!] No Template ID configured for '{Document_Type}'. Available types: {list(TemplateIDs.keys())}")
            return self._fallback_local_pdf(Session)

        print(f"[OK] Template ID found: {Template_Id}")

        # [2] Get the Google Apps Script URL
        URL = os.environ.get("GOOGLE_SCRIPT_URL")
        if not URL:
            print("[!] GOOGLE_SCRIPT_URL not configured — cannot use Google Docs templates")
            return self._fallback_local_pdf(Session)

        # [3] Gather the information to fill in the template
        print("[...] Generating document using Google Apps Script template...")
        DATA = {
            "TemplateId": Template_Id,
            "Session": Session,
        }

        # [4] Send the POST Request to the Script
        try:
            Response = requests.post(URL, data=json.dumps(DATA))
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
