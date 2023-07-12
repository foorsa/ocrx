# import the necessary packages
import os
import tempfile
from PyPDF2 import PdfReader
from gridfs import GridOut
from pdf2image import convert_from_path
import pytesseract
from pytesseract import Output


# # Check if running on the production server
# if os.getenv("ENV_MODE") == "production":
#     # Set the TESSDATA_PREFIX environment variable for production
#     os.environ[
#         "TESSDATA_PREFIX"
#     ] = "./.apt/usr/share/tesseract-ocr/4.00/tessdata/"


# Define the OCR Processor Class
class OCRProcessor:
    def __init__(self):
        pass

    # Read the PDF File
    def Read_PDF(self, Document_Type, SessionId, PDF_Bytes):
        Extracted = ""

        # Temporary File Path
        Temporary_PDF_Path = os.path.join(tempfile.gettempdir(), f"{SessionId}.pdf")

        # Write the PDF Bytes to a Temporary File
        with open(Temporary_PDF_Path, "wb") as f:
            f.write(PDF_Bytes.getbuffer())

        # Convert each Page to an Image
        try:
            pages = convert_from_path(Temporary_PDF_Path, 500)
            Extracted = ""
            for page in pages:
                Extracted += pytesseract.image_to_string(page, lang="fra")
            return Extracted
        except Exception as e:
            print(f"Error reading PDF file: {str(e)}")

    # Read the Image File
    def Read_Image(self, DocumentType, Image):
        try:
            text_content = pytesseract.image_to_string(
                Image,
                lang="fra+ara",
                config="",
            )
            self.file_content = text_content
            return text_content
        except Exception as e:
            print(f"Error reading image file: {str(e)}")

    def Get_File_Content(self):
        return self.file_content
