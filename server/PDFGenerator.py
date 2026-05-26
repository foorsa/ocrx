# This class can have templates for each document type
# (Baccalaureate Diploma, Language Diploma, Master Diploma)
# and methods to fill in the template with the translated information.
# You can use libraries like ReportLab or PyFPDF to generate the PDF files.
import os
import requests
from Modules.Classes.DocxTableGenerator import DocxTableGenerator


TemplateIDs = {
    "Baccalaureate-Certificate": os.environ.get(
        "TemplateIDs_Baccalaureate_Certificate",
        "1G4MkDqydk7FppspfLYjH50mg2v15PGe0lj6GDX5drNY",
    ),
    "Baccalaureate-Certificate-V2": os.environ.get(
        "TemplateIDs_Baccalaureate_Certificate_V2",
        "1kJMRbEAy3c3x0sPuV5kSb9rebgs-ULjV08uj8ow3xlc",
    ),
    "Baccalaureate-School-Certificate": os.environ.get(
        "TemplateIDs_Baccalaureate_School_Certificate",
        "1wd3NV2GlidXm_wBubH0l85DO0qiLMqCrtBksYlnqe9o",
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
        "1XVB2gaCxbCu021MPxtMd4HFUaO7Pgb-HdDn9hIofTTc",
    ),
    "Master-Certificate": os.environ.get(
        "TemplateIDs_Master_Certificate",
        "1_k7sTZl77Q8H0V6z9qHG7w_vrChSkfouXubOuwFdNuw",
    ),
    "Master-Transcript-of-Marks": os.environ.get(
        "TemplateIDs_Master_Transcript_of_Marks",
        "1yI3Gdxlw1YlEz-OuhxXNlNqelvzYphNxyo2nnS0n3cM",
    ),
    "Master-Certificate-of-Success-at-Diploma": os.environ.get(
        "TemplateIDs_Master_Certificate_of_Success_at_Diploma",
        "1tPwRsWLdbbQyRU0qqnifQY1INoKT0c6NJQCkXriJqOc",
    ),
    "Master-Certificate-of-Schooling": os.environ.get(
        "TemplateIDs_Master_Certificate_of_Schooling",
        "1GudSJq0yOy5u_iJH70DgOmDvqEvvZ6YPhygbxVyhZTk",
    ),
    "ExtraDocs-Police-Record-Checks": os.environ.get(
        "TemplateIDs_ExtraDocs_Police_Record_Checks",
        "1if3Sb6XvUL4E5BaJdQu--uMp4ew3lXVlKbuEQ2998XQ",
    ),
    "ExtraDocs-Statement-of-Penalties-Issued-by-Deprivation-of-Liberty": os.environ.get(
        "TemplateIDs_Extradocs_Statement_of_Penalties_Issued_by_Deprivation_of_Liberty",
        "1JLRy9ncr_wYduwEZsvbaspsgBJw_DbWc3NTTgGGMoq4",
    ),
    "ExtraDocs-Registration-Certificate": os.environ.get(
        "TemplateIDs_ExtraDocs_Registration_Certificate",
        "1QAGI7vLF0N7iZz4ZGX5hewqIHCg_LoK4QwKIWyI5QeE",
    ),
    "ExtraDocs-Technical-University-Degree": os.environ.get(
        "TemplateIDs_ExtraDocs_Technical_University_Degree",
        "1N_1iIdGK_R2AC227cfkmCATITL9-8lt_yRgOMtPD5xw",
    ),
    "ExtraDocs-Certificate-of-Achievement": os.environ.get(
        "TemplateIDs_ExtraDocs_Certificate_of_Achievement",
        "1TQs-wT3ussThmuGzD-PqGfGPGWoLmOV7QV3XgwDpKbc",
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

# Warn at startup if GOOGLE_SCRIPT_URL is missing
if not os.environ.get("GOOGLE_SCRIPT_URL"):
    print("[WARNING] GOOGLE_SCRIPT_URL is not set — all documents will fall back to local PDF generation instead of Google Docs templates.")
    print("[WARNING] Set GOOGLE_SCRIPT_URL in your .env file or hosting platform environment variables.")


class PDFGenerator:
    def _generate_local_pdf(self, Session):
        """Generate a local PDF and return (filename, file_base64)."""
        docx_gen = DocxTableGenerator()
        if docx_gen.is_tabular(Session):
            return docx_gen.generate(Session)
        else:
            return docx_gen.generate_text_pdf(Session)

    def Generate(self, Session):
        Document_Type = Session["Document Type"]

        # [1] Get the Template ID
        print(f"[...] Getting the Template ID for '{Document_Type}'...")
        Template_Id = TemplateIDs.get(Document_Type)

        # If no template ID is configured, fall back to local PDF generation for tabular docs
        if not Template_Id:
            print(f"[!] No Template ID configured for '{Document_Type}'. Available types: {list(TemplateIDs.keys())}")
            return self._fallback_local_pdf(Session, f"No template ID configured for {Document_Type}")

        print(f"[OK] Template ID found: {Template_Id}")

        # [2] Get the Google Apps Script URL
        URL = os.environ.get("GOOGLE_SCRIPT_URL")
        if not URL:
            print("[!] GOOGLE_SCRIPT_URL not configured — cannot use Google Docs templates")
            return self._fallback_local_pdf(Session, "GOOGLE_SCRIPT_URL is not configured")

        # [3] Gather the information to fill in the template
        print("[...] Generating document using Google Apps Script template...")
        DATA = {
            "TemplateId": Template_Id,
            "Session": Session,
        }

        # [4] Send the POST Request to the Script. Google Apps Script web apps
        # often respond with a redirect to script.googleusercontent.com. If
        # requests follows that redirect automatically, a 302 turns the POST
        # into a GET and the script never receives e.postData.
        try:
            Response = requests.post(
                URL,
                json=DATA,
                allow_redirects=False,
                timeout=120,
            )
            if Response.status_code in (301, 302, 303, 307, 308):
                redirect_url = Response.headers.get("Location")
                if not redirect_url:
                    print("[X] Google Apps Script redirected without a Location header")
                    return self._fallback_local_pdf(Session, "Google Apps Script redirected without a Location header")

                print("[...] Following Google Apps Script redirect...")
                Response = requests.get(redirect_url, timeout=120)
        except Exception as Error:
            print(f"[X] Error sending request to Google Apps Script: {Error}")
            return self._fallback_local_pdf(Session, str(Error))

        # [5] Check the Response
        if Response.status_code == 200 and Response.content is not None:
            try:
                ResponseData = Response.json()

                if ResponseData["status"] != "success":
                    template_error = ResponseData.get("message", "unknown")
                    print(f"[X] Google Apps Script error: {template_error}")
                    return self._fallback_local_pdf(Session, template_error)

                pdf_link = ResponseData.get("pdfLink", "")
                doc_link = ResponseData.get("docLink", "")
                preview_link = ResponseData.get("previewLink", "")

                if not pdf_link:
                    print("[X] Google Apps Script returned empty PDF link")
                    return self._fallback_local_pdf(Session, "Google Apps Script returned empty PDF link")

                Links = {
                    "PDF Link": pdf_link,
                    "Google Docs Link": doc_link,
                    "Preview Link": preview_link,
                    "Generation Source": "Template",
                }
                print(f"[OK] Document generated via template: {Links['PDF Link']}")

                return Links
            except Exception as Error:
                print(f"[X] Error parsing Google Apps Script response: {Error}")
                return self._fallback_local_pdf(Session, str(Error))
        else:
            print(f"[X] Google Apps Script returned status {Response.status_code}: {Response.reason}")
            return self._fallback_local_pdf(Session, f"Google Apps Script returned status {Response.status_code}: {Response.reason}")

    def _fallback_local_pdf(self, Session, template_error=None):
        """Fall back to local PDF generation."""
        docx_gen = DocxTableGenerator()
        try:
            if docx_gen.is_tabular(Session):
                print("[...] Falling back to local PDF generation for tabular document...")
                filename, file_base64 = docx_gen.generate(Session)
            else:
                print("[...] Falling back to local PDF generation for text document...")
                filename, file_base64 = docx_gen.generate_text_pdf(Session)

            print(f"[OK] Generated local PDF: {filename}")
            download_path = f"/api/v1/download/{filename}"
            return {
                "PDF Link": download_path,
                "Google Docs Link": download_path,
                "Preview Link": download_path,
                "Generation Source": "Local",
                "Template Error": template_error or "",
                "File Data": file_base64,
                "File Name": filename,
            }
        except Exception as e:
            print(f"[X] Local PDF generation failed: {e}")
            if template_error:
                raise Exception(f"Template generation failed: {template_error}; local PDF generation failed: {e}")
            raise Exception(f"PDF generation failed: {e}")
