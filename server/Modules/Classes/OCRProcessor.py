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

os.environ["ET_API_KEY"] = "iZF4JybeL7C7yTmbenioUEnEkKJH13pKMxVWOHTM"


# Define the OCR Processor Class
class OCRProcessor:
    def __init__(self):
        self.ET_SESSION = ExtractTable(os.environ.get("ET_API_KEY"))
        pass

    def Read_PDF(self, InformationType, SessionId, PDFBytes):
        Extracted = {"RAW": "", "TABLES": []}

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
                Extracted["RAW"] += pytesseract.image_to_string(
                    Page,
                    lang="fra+ara",
                    config="",
                )

            if InformationType == "Tabular":
                # Add the Extracted Table to the Extracted Table Key
                Extracted["TABLES"] = self.Process_Table(TEMPORARY_PDF_PATH)
            return Extracted
        except Exception as e:
            print(f"Error reading PDF file: {str(e)}")

    # Read the Image File
    def Read_Image(self, InformationType, SessionId, Image):
        Extracted = {}

        try:
            TextContent = pytesseract.image_to_string(
                Image,
                lang="fra+ara",
                config="",
            )

            Extracted["RAW"] = TextContent

            if InformationType == "Tabular":
                # Temporary File Path
                TEMPORARY_IMAGE_PATH = os.path.join(
                    tempfile.gettempdir(), f"{SessionId}.jpg"
                )

                # Write the Image to a Temporary File
                Image.save(TEMPORARY_IMAGE_PATH, "JPEG")

                PROCESSED_TABLE = self.Process_Table(TEMPORARY_IMAGE_PATH)

                # Add the Extracted Table to the Extracted Table Key
                Extracted["TABLE"] = PROCESSED_TABLE

            return Extracted
        except Exception as e:
            print(f"Error reading image file: {str(e)}")

    def Process_Table(self, Image_Path):
        # Process the Table
        try:
            print("[...] Processing Table [...]")
            TABLES = self.ET_SESSION.process_file(Image_Path, output_format="json")
            print("[OK] Processing Table Finished !")

            # DEBUG PRINT
            print(f"[COUNT] {len(TABLES)} Table(s) Found !")

            JSON_TABLES = []
            for TABLE in TABLES:
                JSON_TABLES.append(json.loads(TABLE))

            return JSON_TABLES
        except Exception as e:
            print(f"Error processing table: {str(e)}")
            return f"Error processing table: {str(e)}"

    def Check_API_USAGE(self):
        return self.ET_SESSION.check_usage()

    def Get_File_Content(self):
        return self.file_content


# Optical Character Recognition Processor
OCR = OCRProcessor()

# USAGE
USAGE = OCR.Check_API_USAGE()

CREDITS = USAGE["credits"]
USED = USAGE["used"]
PERCENTAGE = USED / CREDITS * 100

print(
    f"[Extract Table] API Usage: Credits: {CREDITS}, Used: {USED}, Percentage: {PERCENTAGE}%."
)
