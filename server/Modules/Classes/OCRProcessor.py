# import the necessary packages
import os
import tempfile
from pdf2image import convert_from_path
import pytesseract
from ExtractTable import ExtractTable
from dotenv import load_dotenv
import json
from PyPDF2 import PdfReader


# Define the OCR Processor Class
class OCRProcessor:
    def __init__(self):
        self.ET_SESSION = ExtractTable(os.environ.get("ET_API_KEY"))
        pass

    # Read the Image File
    def ExtractTextFromImage(self, InformationType, SessionId, Image):
        try:
            TextContent = pytesseract.image_to_string(
                Image,
                lang="fra+ara+eng",
                config="",
            )
            return TextContent
        except Exception as e:
            print(f"[OCR ERROR] Error reading image file: {str(e)}")
            return ""

    def ExtractTextFromPDF(self, InformationType, SessionId, PDFBytes):
        try:
            # First, try direct text extraction from the PDF (works for digital PDFs)
            PDFBytes.seek(0)
            reader = PdfReader(PDFBytes)
            direct_text = ""
            for page in reader.pages:
                page_text = page.extract_text()
                if page_text:
                    direct_text += page_text

            if direct_text.strip():
                print(f"[OCR] Extracted text directly from PDF ({len(direct_text)} chars)")
                return direct_text

            # Fall back to OCR for scanned PDFs
            print("[OCR] No embedded text found, falling back to OCR...")
            TEMPORARY_PDF_PATH = os.path.join(tempfile.gettempdir(), f"{SessionId}.pdf")

            # Write the PDF Bytes to a Temporary File
            PDFBytes.seek(0)
            with open(TEMPORARY_PDF_PATH, "wb") as f:
                f.write(PDFBytes.getbuffer())

            extracted_text = ""

            # Convert each Page to an Image and extract text
            pages = convert_from_path(TEMPORARY_PDF_PATH, 200)
            for page in pages:
                page_text = pytesseract.image_to_string(page, lang="fra+ara+eng", config="")
                extracted_text += page_text
                # Close the image object
                page.close()

            # Clean up: remove the temporary PDF file
            os.remove(TEMPORARY_PDF_PATH)

            return extracted_text

        except Exception as e:
            print(f"Error reading PDF file: {str(e)}")
            raise Exception(f"Failed to extract text from PDF: {str(e)}")

    def ExtractTableFromImage(self, InformationType, SessionId, Image):
        print("[...] Extracting Table from Image ...")
        try:
            # Temporary File Path
            TEMPORARY_IMAGE_PATH = os.path.join(
                tempfile.gettempdir(), f"{SessionId}.png"
            )

            # Save the Image to a Temporary File
            Image.save(TEMPORARY_IMAGE_PATH, "PNG")

            PROCESSED_TABLES = []

            TABLES = self.ET_SESSION.process_file(
                TEMPORARY_IMAGE_PATH, output_format="json"
            )

            print("[OK] Extracting Table from Image Finished !")

            for TABLE in TABLES:
                print(f"[...] Processing Table No. {TABLES.index(TABLE) + 1}.")

                JSON_TABLE = json.loads(TABLE)  # Load JSON string to a dictionary

                TABLE_DATA = []

                # Get the Columns Count
                COL_COUNT = len(JSON_TABLE)

                # Get the Rows Count
                ROW_COUNT = len(next(iter(JSON_TABLE.values())))

                # Concatenate Columns to Array of Rows
                for ROW in range(ROW_COUNT):
                    ROW_DATA = []
                    for COL in range(COL_COUNT):
                        try:
                            ROW_DATA.append(JSON_TABLE[str(COL)][str(ROW)])
                        except KeyError:
                            ROW_DATA.append(
                                ""
                            )  # Handle missing data as an empty string
                    TABLE_DATA.append(ROW_DATA)

                PROCESSED_TABLES.append(TABLE_DATA)

            # Clean up: remove the temporary image file
            os.remove(TEMPORARY_IMAGE_PATH)

            return PROCESSED_TABLES
        except Exception as e:
            print(f"Error processing table: {str(e)}")
            return []

    def ExtractTableFromPDF(self, InformationType, SessionId, PDFBytes):
        try:
            print("[...] Extracting Table from PDF ...")

            # Temporary File Path
            TEMPORARY_PDF_PATH = os.path.join(tempfile.gettempdir(), f"{SessionId}.pdf")

            # Write the PDF Bytes to a Temporary File
            with open(TEMPORARY_PDF_PATH, "wb") as f:
                f.write(PDFBytes.getbuffer())

            PROCESSED_TABLES = []

            # Process the Table
            TABLES = self.ET_SESSION.process_file(
                TEMPORARY_PDF_PATH, output_format="json"
            )

            print("[OK] Extracting Table from PDF Finished !")

            for TABLE in TABLES:
                print(f"[...] Processing Table No. {TABLES.index(TABLE) + 1}.")

                JSON_TABLE = json.loads(TABLE)

                TABLE_DATA = []

                # Get the Columns Count
                COL_COUNT = len(JSON_TABLE)

                # Get the Rows Count
                ROW_COUNT = len(next(iter(JSON_TABLE.values())))

                # Concatenate Columns to Array of Rows
                for ROW in range(ROW_COUNT):
                    ROW_DATA = []
                    for COL in range(COL_COUNT):
                        try:
                            ROW_DATA.append(JSON_TABLE[str(COL)][str(ROW)])
                        except KeyError:
                            ROW_DATA.append("")  # Handle missing data as empty string
                    TABLE_DATA.append(ROW_DATA)

                PROCESSED_TABLES.append(TABLE_DATA)

            # Clean up: remove the temporary PDF file
            os.remove(TEMPORARY_PDF_PATH)

            return PROCESSED_TABLES
        except Exception as e:
            print(f"[ERROR] Error processing table: {str(e)}")
            return []

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
