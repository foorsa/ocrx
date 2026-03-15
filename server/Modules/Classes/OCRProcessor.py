# import the necessary packages
import os
import io
import tempfile
from pdf2image import convert_from_path
import pytesseract
from ExtractTable import ExtractTable
from dotenv import load_dotenv
import json
from Modules.Classes.Utilities.GPTPrompts import VisionOCR


# Define the OCR Processor Class
class OCRProcessor:
    def __init__(self):
        self.ET_SESSION = ExtractTable(os.environ.get("ET_API_KEY"))
        pass

    # Read the Image File using GPT-4o Vision
    def ExtractTextFromImage(self, InformationType, SessionId, Image, Doctype=""):
        try:
            # Convert PIL Image to bytes for GPT-4o vision
            img_buffer = io.BytesIO()
            Image.save(img_buffer, format="PNG")
            img_bytes = img_buffer.getvalue()

            print("[OCR] Using GPT-4o Vision for text extraction...")
            TextContent = VisionOCR(img_bytes, Doctype)
            return TextContent
        except Exception as e:
            print(f"[OCR ERROR] Vision OCR failed, falling back to Tesseract: {str(e)}")
            try:
                TextContent = pytesseract.image_to_string(
                    Image,
                    lang="fra+ara",
                    config="",
                )
                return TextContent
            except Exception as e2:
                print(f"[OCR ERROR] Tesseract also failed: {str(e2)}")
                return ""

    def ExtractTextFromPDF(self, InformationType, SessionId, PDFBytes, Doctype=""):
        try:
            TEMPORARY_PDF_PATH = os.path.join(tempfile.gettempdir(), f"{SessionId}.pdf")

            # Write the PDF Bytes to a Temporary File
            with open(TEMPORARY_PDF_PATH, "wb") as f:
                f.write(PDFBytes.getbuffer())

            extracted_text = ""

            # Convert each Page to an Image and use GPT-4o vision
            pages = convert_from_path(TEMPORARY_PDF_PATH, 200)
            for page in pages:
                try:
                    # Convert page to bytes for GPT-4o vision
                    img_buffer = io.BytesIO()
                    page.save(img_buffer, format="PNG")
                    img_bytes = img_buffer.getvalue()

                    print("[OCR] Using GPT-4o Vision for PDF page extraction...")
                    page_text = VisionOCR(img_bytes, Doctype)
                    extracted_text += page_text + "\n"
                except Exception as e:
                    print(f"[OCR] Vision failed for page, falling back to Tesseract: {str(e)}")
                    page_text = pytesseract.image_to_string(page, lang="fra+ara", config="")
                    extracted_text += page_text
                finally:
                    page.close()

            # Clean up: remove the temporary PDF file
            os.remove(TEMPORARY_PDF_PATH)

            return extracted_text

        except Exception as e:
            print(f"Error reading PDF file: {str(e)}")
            return ""

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
