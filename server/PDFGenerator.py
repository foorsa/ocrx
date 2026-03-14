# This class can have templates for each document type
# (Baccalaureate Diploma, Language Diploma, Master Diploma)
# and methods to fill in the template with the translated information.
# You can use libraries like ReportLab or PyFPDF to generate the PDF files.
import os
import requests
import json
import tempfile
import gridfs
import pymongo
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from urllib.parse import quote_plus


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

# Tabular document types that need compact table PDF generation
TABULAR_DOC_TYPES = [
    "Master-Transcript-of-Marks",
    "Baccalaureate-Transcript-of-Marks-V1",
    "Baccalaureate-Transcript-of-Marks-V2",
]


class PDFGenerator:
    def Generate(self, Session):
        Document_Type = Session["Document Type"]

        # For tabular documents, generate PDF locally with compact tables
        if Document_Type in TABULAR_DOC_TYPES and Session.get("Information Type") == "Tabular":
            print("[...] Generating compact table PDF locally...")
            try:
                return self._generate_table_pdf(Session)
            except Exception as e:
                print(f"[WARNING] Local PDF generation failed: {e}, falling back to Apps Script...")
                # Fall back to Google Apps Script
                return self._generate_via_apps_script(Session)
        else:
            return self._generate_via_apps_script(Session)

    def _generate_table_pdf(self, Session):
        """Generate PDF with compact tables using fpdf2."""
        from fpdf import FPDF

        print("[...] Building compact table PDF...")

        text_fields = Session.get("Translation", {}).get("Text", {})
        tables = Session.get("Translation", {}).get("Tables", None)
        doc_type = Session.get("Document Type", "")

        pdf = FPDF(orientation="P", unit="mm", format="A4")
        pdf.set_auto_page_break(auto=True, margin=15)
        pdf.add_page()

        # --- Header ---
        pdf.set_font("Helvetica", "B", 14)
        title = self._get_document_title(doc_type)
        pdf.cell(0, 10, title, ln=True, align="C")
        pdf.ln(4)

        # --- Text Fields ---
        if text_fields:
            pdf.set_font("Helvetica", "", 9)
            for key, value in text_fields.items():
                if key and value:
                    # Bold key, normal value
                    pdf.set_font("Helvetica", "B", 9)
                    key_width = pdf.get_string_width(str(key) + ": ") + 2
                    pdf.cell(key_width, 6, str(key) + ": ", ln=False)
                    pdf.set_font("Helvetica", "", 9)
                    pdf.cell(0, 6, str(value), ln=True)
            pdf.ln(4)

        # --- Tables ---
        if tables:
            if isinstance(tables, dict):
                # Baccalaureate format: {"Transcript": {...}, "Overall": {...}}
                if "Transcript" in tables:
                    self._render_compact_table(pdf, tables["Transcript"], "Transcript of Marks")
                    pdf.ln(4)
                if "Overall" in tables:
                    self._render_compact_table(pdf, tables["Overall"], "Overall Results")
            elif isinstance(tables, list):
                # Master format: array of {Subject, Mark, Result, Session}
                master_table = self._convert_master_array(tables)
                self._render_compact_table(pdf, master_table, "Transcript of Marks")

        # --- Footer ---
        pdf.ln(6)
        pdf.set_font("Helvetica", "I", 7)
        pdf.cell(0, 5, f"Generated by OCRX - Session: {Session.get('Session Id', 'N/A')}", ln=True, align="C")
        pdf.cell(0, 5, f"Date: {Session.get('Operation Date', 'N/A')}", ln=True, align="C")

        # Save PDF to temp file
        tmp_path = os.path.join(tempfile.gettempdir(), f"{Session.get('Session Id', 'doc')}.pdf")
        pdf.output(tmp_path)
        print(f"[OK] PDF saved to {tmp_path}")

        # Store PDF in GridFS and return link served by the backend
        pdf_file_id = self._store_pdf_in_gridfs(tmp_path, Session.get("Session Id", "doc"))

        # Clean up temp file
        try:
            os.remove(tmp_path)
        except:
            pass

        # Also send to Google Apps Script for Google Docs link (non-blocking)
        apps_script_links = {}
        try:
            apps_script_links = self._generate_via_apps_script(Session)
        except:
            pass

        # Build links - PDF served from our backend, Google Docs from Apps Script
        from flask import request as flask_request
        try:
            base_url = flask_request.host_url.rstrip("/")
        except:
            base_url = os.environ.get("SERVER_URL", "https://ocrx-api.foorsa.co")

        Links = {
            "PDF Link": f"{base_url}/api/v1/download-pdf?Session_Id={Session.get('Session Id', '')}",
            "Google Docs Link": apps_script_links.get("Google Docs Link", ""),
            "Preview Link": f"{base_url}/api/v1/preview-pdf?Session_Id={Session.get('Session Id', '')}",
        }

        print(f"[OK] PDF Link: {Links['PDF Link']}")
        return Links

    def _render_compact_table(self, pdf, table_data, title=""):
        """Render a table with compact formatting using fpdf2."""
        columns = table_data.get("Columns", [])
        rows = table_data.get("Rows", [])

        if not columns and not rows:
            return

        # Section title
        if title:
            pdf.set_font("Helvetica", "B", 10)
            pdf.cell(0, 7, title, ln=True)
            pdf.ln(1)

        # Calculate column widths
        num_cols = len(columns) if columns else (len(rows[0]) if rows else 0)
        if num_cols == 0:
            return

        # Page width minus margins (A4 = 210mm, margins = 10mm each side)
        usable_width = 190

        # Calculate optimal column widths based on content
        col_widths = self._calculate_column_widths(pdf, columns, rows, num_cols, usable_width)

        # Table styling
        cell_height = 5
        font_size = 7
        header_font_size = 7

        # Draw header row
        if columns:
            pdf.set_font("Helvetica", "B", header_font_size)
            pdf.set_fill_color(220, 220, 220)
            for i, col in enumerate(columns):
                w = col_widths[i] if i < len(col_widths) else col_widths[-1]
                text = str(col) if col else ""
                # Truncate if too long
                text = self._fit_text(pdf, text, w - 1)
                pdf.cell(w, cell_height, text, border=1, fill=True, align="C")
            pdf.ln()

        # Draw data rows
        pdf.set_font("Helvetica", "", font_size)
        for row_idx, row in enumerate(rows):
            # Alternate row colors for readability
            if row_idx % 2 == 1:
                pdf.set_fill_color(245, 245, 245)
                fill = True
            else:
                fill = False

            max_cell_height = cell_height

            for i in range(num_cols):
                w = col_widths[i] if i < len(col_widths) else col_widths[-1]
                cell_value = str(row[i]) if i < len(row) and row[i] else ""
                cell_value = self._fit_text(pdf, cell_value, w - 1)

                # First column (subject names) left-aligned, rest centered
                align = "L" if i == 0 else "C"
                pdf.cell(w, cell_height, cell_value, border=1, fill=fill, align=align)
            pdf.ln()

    def _calculate_column_widths(self, pdf, columns, rows, num_cols, usable_width):
        """Calculate optimal column widths based on content."""
        # Start with minimum widths based on content
        pdf.set_font("Helvetica", "B", 7)

        min_widths = []
        for i in range(num_cols):
            max_w = 10  # minimum column width

            # Check header width
            if columns and i < len(columns):
                hw = pdf.get_string_width(str(columns[i])) + 3
                max_w = max(max_w, hw)

            # Check data widths (sample first 5 rows)
            pdf.set_font("Helvetica", "", 7)
            for row in rows[:5]:
                if i < len(row) and row[i]:
                    dw = pdf.get_string_width(str(row[i])) + 3
                    max_w = max(max_w, dw)
            pdf.set_font("Helvetica", "B", 7)

            min_widths.append(min(max_w, usable_width / num_cols * 2))  # cap at 2x even share

        # Scale to fit page width
        total = sum(min_widths)
        if total > usable_width:
            scale = usable_width / total
            col_widths = [w * scale for w in min_widths]
        elif total < usable_width:
            # Distribute extra space proportionally
            extra = usable_width - total
            col_widths = [w + (extra / num_cols) for w in min_widths]
        else:
            col_widths = min_widths

        return col_widths

    def _fit_text(self, pdf, text, max_width):
        """Truncate text to fit within max_width."""
        if not text:
            return ""
        if pdf.get_string_width(text) <= max_width:
            return text
        # Truncate with ellipsis
        while len(text) > 1 and pdf.get_string_width(text + "..") > max_width:
            text = text[:-1]
        return text + ".."

    def _convert_master_array(self, records):
        """Convert Master transcript array to Columns/Rows format."""
        columns = ["Subject", "Mark", "Result", "Session"]
        rows = []
        for record in records:
            if isinstance(record, dict):
                rows.append([
                    record.get("Subject", ""),
                    record.get("Mark", ""),
                    record.get("Result", ""),
                    record.get("Session", ""),
                ])
        return {"Columns": columns, "Rows": rows}

    def _get_document_title(self, doc_type):
        """Get a human-readable title for the document type."""
        titles = {
            "Baccalaureate-Transcript-of-Marks-V1": "Baccalaureate Transcript of Marks",
            "Baccalaureate-Transcript-of-Marks-V2": "Baccalaureate Transcript of Marks",
            "Master-Transcript-of-Marks": "Master Transcript of Marks",
        }
        return titles.get(doc_type, "Translated Document")

    def _store_pdf_in_gridfs(self, file_path, session_id):
        """Store PDF in MongoDB GridFS for later retrieval."""
        username = quote_plus("yassinechettouch")
        password = quote_plus("0tr7$F1m!@OCRX")
        cluster = "ocrx-db.rpxyaec.mongodb.net"
        uri = f"mongodb+srv://{username}:{password}@{cluster}/?retryWrites=true&w=majority"

        client = MongoClient(uri, server_api=ServerApi("1"))
        db = client.get_database("OCRX-db")
        fs = gridfs.GridFS(db, collection="generated_pdfs")

        # Delete any existing PDF for this session
        existing = db.generated_pdfs.files.find_one({"filename": f"{session_id}.pdf"})
        if existing:
            fs.delete(existing["_id"])

        with open(file_path, "rb") as f:
            file_id = fs.put(f, filename=f"{session_id}.pdf", content_type="application/pdf")

        print(f"[OK] PDF stored in GridFS with ID: {file_id}")
        return file_id

    def _generate_via_apps_script(self, Session):
        """Original Google Apps Script generation method."""
        Document_Type = Session["Document Type"]
        Template_Id = None
        if Document_Type in TemplateIDs:
            Template_Id = TemplateIDs[Document_Type]
        else:
            return {
                "Error": "Error Generating PDF.",
                "Status": 400,
                "Message": "Document Type not found",
            }

        URL = os.environ.get("GOOGLE_SCRIPT_URL")

        DATA = {
            "TemplateId": Template_Id,
            "Session": Session,
            "tableOptions": {
                "fontSize": 8,
                "headerFontSize": 8,
                "cellPadding": 2,
                "fitToPageWidth": True,
            },
        }

        try:
            Response = requests.post(URL, data=json.dumps(DATA))
        except Exception as Error:
            print(f"[X] Error Sending the POST Request to the Script: {Error}")
            return {
                "Error": "Error Generating PDF.",
                "ErrorMessage": str(Error),
                "Status": 400,
                "Message": "Error Sending the POST Request to the Script",
            }

        if Response.status_code == 200 and Response.content is not None:
            try:
                ResponseData = Response.json()

                if ResponseData["status"] != "success":
                    print(f"[X] Error Generating PDF: {ResponseData['message']}")
                    return {
                        "Error": "Error Generating PDF.",
                        "ErrorMessage": ResponseData["message"],
                        "Status": 400,
                        "Message": "Error Generating PDF",
                    }

                Links = {
                    "PDF Link": ResponseData["pdfLink"],
                    "Google Docs Link": ResponseData["docLink"],
                    "Preview Link": ResponseData["previewLink"],
                }
                print(f"[OK] Apps Script PDF Link: {Links['PDF Link']}")
                return Links
            except Exception as Error:
                print(f"[X] Error parsing Apps Script response: {Error}")
                return {
                    "Error": "Error Generating PDF.",
                    "ErrorMessage": str(Error),
                    "Status": 400,
                    "Message": "Error Returning the Links to the Generated Document",
                }
        else:
            print(f"[X] Apps Script Response: {Response.status_code} {Response.reason}")
            return {
                "Error": "Error Generating PDF.",
                "Status": Response.status_code,
                "Message": Response.reason,
            }
