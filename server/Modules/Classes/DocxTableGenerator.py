# DocxTableGenerator.py
# Generates PDF documents with compact tables for tabular document types.
# Used as an alternative to Google Apps Script for table-heavy documents.

import os
import io
import base64
import datetime
from fpdf import FPDF


TABULAR_TYPES = [
    "Master-Transcript-of-Marks",
    "Baccalaureate-Transcript-of-Marks-V1",
    "Baccalaureate-Transcript-of-Marks-V2",
]

DOWNLOAD_FOLDER = os.path.join(os.path.dirname(__file__), "..", "Downloads")


def _format_document_type(doc_type):
    return doc_type.replace("-", " ").title()


class _TranscriptPDF(FPDF):
    """Custom PDF class for transcript documents."""

    def header(self):
        pass  # handled manually per page

    def footer(self):
        self.set_y(-15)
        self.set_font("Helvetica", "I", 7)
        self.set_text_color(136, 136, 136)
        self.cell(0, 10, f"Page {self.page_no()}/{{nb}}", align="C")


class DocxTableGenerator:
    def is_tabular(self, session):
        return session.get("Information Type") == "Tabular" and \
               session.get("Document Type") in TABULAR_TYPES

    def generate(self, session):
        if not os.path.exists(DOWNLOAD_FOLDER):
            os.makedirs(DOWNLOAD_FOLDER)

        pdf = _TranscriptPDF()
        pdf.alias_nb_pages()
        pdf.set_auto_page_break(auto=True, margin=20)
        pdf.add_page()

        translation = session.get("Translation", {})
        text_fields = translation.get("Text", {})
        tables_data = translation.get("Tables", {})
        doc_type = session.get("Document Type", "")

        # Title
        pdf.set_font("Helvetica", "B", 16)
        pdf.set_text_color(26, 26, 46)
        pdf.cell(0, 12, _format_document_type(doc_type), align="C", new_x="LMARGIN", new_y="NEXT")
        pdf.ln(4)

        # Horizontal rule under title
        pdf.set_draw_color(26, 26, 46)
        pdf.set_line_width(0.5)
        pdf.line(pdf.l_margin, pdf.get_y(), pdf.w - pdf.r_margin, pdf.get_y())
        pdf.ln(6)

        # Text fields section
        field_order = [
            "Student Name", "Student National Code", "Institute",
            "Student Level", "Student Option", "Province",
            "City of issue", "Date of issue", "Year"
        ]

        fields_printed = False
        for key in field_order:
            value = text_fields.get(key, "")
            if value:
                fields_printed = True
                pdf.set_font("Helvetica", "B", 9)
                pdf.set_text_color(33, 33, 33)
                label_w = pdf.get_string_width(f"{key}: ") + 2
                pdf.cell(label_w, 6, f"{key}: ")
                pdf.set_font("Helvetica", "", 9)
                pdf.set_text_color(60, 60, 60)
                pdf.cell(0, 6, str(value), new_x="LMARGIN", new_y="NEXT")

        # Any remaining fields not in the order list
        for key, value in text_fields.items():
            if key not in field_order and value:
                fields_printed = True
                pdf.set_font("Helvetica", "B", 9)
                pdf.set_text_color(33, 33, 33)
                label_w = pdf.get_string_width(f"{key}: ") + 2
                pdf.cell(label_w, 6, f"{key}: ")
                pdf.set_font("Helvetica", "", 9)
                pdf.set_text_color(60, 60, 60)
                pdf.cell(0, 6, str(value), new_x="LMARGIN", new_y="NEXT")

        if fields_printed:
            pdf.ln(4)

        # Tables section
        if doc_type == "Master-Transcript-of-Marks":
            self._add_master_table(pdf, tables_data)
        elif doc_type in [
            "Baccalaureate-Transcript-of-Marks-V1",
            "Baccalaureate-Transcript-of-Marks-V2"
        ]:
            self._add_baccalaureate_tables(pdf, tables_data)

        # Footer info
        pdf.ln(8)
        pdf.set_font("Helvetica", "", 7)
        pdf.set_text_color(136, 136, 136)
        pdf.cell(0, 5, f"Session ID: {session.get('Session Id', '')}    Date: {session.get('Operation Date', '')}", align="L")

        # Save to file and buffer
        session_id = session.get("Session Id", "document")
        filename = f"{session_id}.pdf"
        filepath = os.path.join(DOWNLOAD_FOLDER, filename)
        pdf.output(filepath)

        # Also get base64 for direct download
        pdf_bytes = pdf.output()
        file_base64 = base64.b64encode(pdf_bytes).decode("utf-8")

        return filename, file_base64

    def _add_compact_table(self, pdf, headers, rows, title=None):
        if title:
            pdf.set_font("Helvetica", "B", 9)
            pdf.set_text_color(0, 102, 153)
            pdf.cell(0, 6, title, new_x="LMARGIN", new_y="NEXT")
            pdf.ln(1)

        num_cols = len(headers)
        available_width = pdf.w - pdf.l_margin - pdf.r_margin

        # Calculate column widths to match original document proportions
        if num_cols <= 4:
            # Overall table - equal distribution
            col_widths = [available_width / num_cols] * num_cols
        else:
            # Transcript table - subject column wider, grade columns narrow
            first_col_w = available_width * 0.18
            other_col_w = (available_width - first_col_w) / max(num_cols - 1, 1)
            col_widths = [first_col_w if i == 0 else other_col_w for i in range(num_cols)]

        row_height = 5

        # Header row
        pdf.set_font("Helvetica", "B", 5)
        pdf.set_fill_color(217, 217, 217)
        pdf.set_text_color(26, 26, 26)
        pdf.set_draw_color(153, 153, 153)
        pdf.set_line_width(0.15)

        for col_idx, header_text in enumerate(headers):
            pdf.cell(
                col_widths[col_idx], row_height,
                str(header_text),
                border=1, fill=True, align="C",
            )
        pdf.ln()

        # Data rows
        pdf.set_font("Helvetica", "", 5)
        pdf.set_text_color(33, 33, 33)
        pdf.set_draw_color(187, 187, 187)

        for row_idx, row_data in enumerate(rows):
            # Alternate row shading
            if row_idx % 2 == 1:
                pdf.set_fill_color(245, 245, 245)
                fill = True
            else:
                pdf.set_fill_color(255, 255, 255)
                fill = True

            # Check if we need a page break
            if pdf.get_y() + row_height > pdf.h - pdf.b_margin:
                pdf.add_page()
                # Reprint header on new page
                pdf.set_font("Helvetica", "B", 5)
                pdf.set_fill_color(217, 217, 217)
                pdf.set_text_color(26, 26, 26)
                pdf.set_draw_color(153, 153, 153)
                for col_idx, header_text in enumerate(headers):
                    pdf.cell(col_widths[col_idx], row_height, str(header_text), border=1, fill=True, align="C")
                pdf.ln()
                pdf.set_font("Helvetica", "", 5)
                pdf.set_text_color(33, 33, 33)
                pdf.set_draw_color(187, 187, 187)

            for col_idx in range(num_cols):
                cell_value = ""
                if col_idx < len(row_data):
                    cell_value = str(row_data[col_idx]) if row_data[col_idx] is not None else ""

                align = "L" if col_idx == 0 else "C"
                pdf.cell(
                    col_widths[col_idx], row_height,
                    cell_value,
                    border=1, fill=fill, align=align,
                )
            pdf.ln()

    def _add_master_table(self, pdf, tables_data):
        if not tables_data or not isinstance(tables_data, list):
            return

        headers = ["Subject", "Mark", "Result", "Session"]
        rows = []
        for item in tables_data:
            rows.append([
                item.get("Subject", ""),
                item.get("Mark", ""),
                item.get("Result", ""),
                item.get("Session", ""),
            ])

        self._add_compact_table(pdf, headers, rows, title="Transcript of Marks")

    def _add_baccalaureate_tables(self, pdf, tables_data):
        if not tables_data:
            return

        # Transcript table
        transcript = tables_data.get("Transcript")
        if transcript:
            columns = transcript.get("Columns", [])
            rows = transcript.get("Rows", [])
            if columns and rows:
                self._add_compact_table(pdf, columns, rows, title="Transcript of Marks")

        # Overall table
        overall = tables_data.get("Overall")
        if overall:
            columns = overall.get("Columns", [])
            rows = overall.get("Rows", [])
            if columns and rows:
                pdf.ln(4)
                self._add_compact_table(pdf, columns, rows, title="Overall Results")
