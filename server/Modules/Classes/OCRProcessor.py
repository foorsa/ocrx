# import the necessary packages
import os
import tempfile
from PyPDF2 import PdfReader
from gridfs import GridOut
from pdf2image import convert_from_path
import pytesseract
from pytesseract import Output
from ExtractTable import ExtractTable
from dotenv import load_dotenv
import json


# Define the OCR Processor Class
class OCRProcessor:
    def __init__(self):
        self.ET_SESSION = ExtractTable(os.environ.get("ET_API_KEY"))
        pass

    # Read the Image File
    def ExtractTextFromImage(self, InformationType, SessionId, Image):
        Extracted = ""

        try:
            TextContent = pytesseract.image_to_string(
                Image,
                lang="fra+ara",
                config="",
            )

            Extracted = TextContent
        except Exception as e:
            print(f"[OCR ERROR] Error reading image file: {str(e)}")

        return Extracted

    def ExtractTextFromPDF(self, InformationType, SessionId, PDFBytes):
        Extracted = ""

        # Temporary File Path
        TEMPORARY_PDF_PATH = os.path.join(tempfile.gettempdir(), f"{SessionId}.pdf")

        # Write the PDF Bytes to a Temporary File
        with open(TEMPORARY_PDF_PATH, "wb") as f:
            f.write(PDFBytes.getbuffer())

        # Convert each Page to an Image
        try:
            Pages = convert_from_path(TEMPORARY_PDF_PATH, 500)
            for Page in Pages:
                # Add the Extracted Text to the Extracted RAW Key
                Extracted += pytesseract.image_to_string(
                    Page,
                    lang="fra+ara",
                    config="",
                )

            return Extracted
        except Exception as e:
            print(f"Error reading PDF file: {str(e)}")

    def ExtractTableFromImage(self, InformationType, SessionId, Image):
        print("[...] Extracting Table from Image ...")
        try:
            # Save Image to a temporary file - this will be used by the ExtractTable library

            # Temporary File Path
            TEMPORARY_IMAGE_PATH = os.path.join(
                tempfile.gettempdir(), f"{SessionId}.png"
            )

            # Write the Image to a Temporary File
            Image.save(TEMPORARY_IMAGE_PATH, "PNG")

            # Process the Table
            TABLES = self.ET_SESSION.process_file(
                TEMPORARY_IMAGE_PATH, output_format="json"
            )

            print("[OK] Extracting Table from Image Finished !")

            # DEBUG PRINT
            print(f"[COUNT] {len(TABLES)} Table(s) Found !")

            PROCESSED_TABLES = []

            for TABLE in TABLES:
                print(f"[...] Processing Table No. {TABLES.index(TABLE) + 1}.")

                JSON_TABLE = json.loads(TABLE)  # Load JSON string to a dictionary

                TABLE_DATA = []

                # Get the Columns Count
                COL_COUNT = len(JSON_TABLE)

                # Get the Rows Count
                ROW_COUNT = len(next(iter(JSON_TABLE.values())))

                # Concat Columns to Array of Rows
                for ROW in range(ROW_COUNT):
                    ROW_DATA = []
                    for COL in range(COL_COUNT):
                        try:
                            ROW_DATA.append(JSON_TABLE[str(COL)][str(ROW)])
                        except KeyError:
                            ROW_DATA.append("")  # Handle missing data as empty string
                    TABLE_DATA.append(ROW_DATA)

                PROCESSED_TABLES.append(TABLE_DATA)

            return PROCESSED_TABLES
        except Exception as e:
            print(f"Error processing table: {str(e)}")
            return f"Error processing table: {str(e)}"

    def ExtractTableFromPDF(self, InformationType, SessionId, PDFBytes):
        # Extract information from PDF (Table Information)
        try:
            print("[...] Extracting Table from PDF ...")

            # Temporary File Path
            TEMPORARY_PDF_PATH = os.path.join(tempfile.gettempdir(), f"{SessionId}.pdf")

            # Write the PDF Bytes to a Temporary File
            with open(TEMPORARY_PDF_PATH, "wb") as f:
                f.write(PDFBytes.getbuffer())

            # Process the Table
            TABLES = self.ET_SESSION.process_file(
                TEMPORARY_PDF_PATH, output_format="json"
            )

            print("[OK] Extracting Table from PDF Finished !")

            # DEBUG PRINT
            print(f"[COUNT] {len(TABLES)} Table(s) Found !")

            PROCESSED_TABLES = []

            for TABLE in TABLES:
                print(f"[...] Processing Table No. {TABLES.index(TABLE) + 1}.")

                JSON_TABLE = json.loads(TABLE)

                TABLE_DATA = []

                # Get the Columns Count
                COL_COUNT = len(JSON_TABLE)

                # Get the Rows Count
                ROW_COUNT = len(next(iter(JSON_TABLE.values())))

                # Concat Columns to Array of Rows
                for ROW in range(ROW_COUNT):
                    ROW_DATA = []
                    for COL in range(COL_COUNT):
                        try:
                            ROW_DATA.append(JSON_TABLE[str(COL)][str(ROW)])
                        except KeyError:
                            ROW_DATA.append("")  # Handle missing data as empty string
                    TABLE_DATA.append(ROW_DATA)

                PROCESSED_TABLES.append(TABLE_DATA)
        except Exception as e:
            print(f"[ERROR] Error processing table: {str(e)}")
            return f"Error processing table: {str(e)}"

    def Check_API_USAGE(self):
        return self.ET_SESSION.check_usage()

    def Get_File_Content(self):
        return self.file_content


# Optical Character Recognition Processor
OCR = OCRProcessor()

print("API Key: " + str(os.environ.get("ET_API_KEY")))

# USAGE
USAGE = OCR.Check_API_USAGE()

CREDITS = USAGE["credits"]
USED = USAGE["used"]
PERCENTAGE = USED / CREDITS * 100

print(
    f"[Extract Table] API Usage: Credits: {CREDITS}, Used: {USED}, Percentage: {PERCENTAGE}%."
)
