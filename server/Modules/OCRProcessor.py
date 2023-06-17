# This class can have methods for reading different file types (PDF, PNG, JPG)
# and extracting the text content.
# You can utilize existing libraries like PyPDF2 for PDF extraction and OCR libraries
# like pytesseract for image-based text extraction.

from pdf2image import convert_from_path, convert_from_bytes
import pytesseract
from pytesseract import Output
from PIL import Image


class OCRProcessor:
    def __init__(self):
        self.file_path = None
        self.file_content = None

    def Read_PDF(self, file_path):
        self.file_path = file_path
        try:
            pages = convert_from_path(file_path, 500)
            text_content = ""
            for page in pages:
                text_content += pytesseract.image_to_string(page, lang="fra")
            self.file_content = text_content
            return text_content
        except Exception as e:
            print(f"Error reading PDF file: {str(e)}")

    def Read_Image(self, file_path):
        self.file_path = file_path
        try:
            image = Image.open(file_path)
            text_content = pytesseract.image_to_string(
                image,
                lang="fra",
                config="",
            )
            self.file_content = text_content
            return text_content
        except Exception as e:
            print(f"Error reading image file: {str(e)}")

    def Get_File_Content(self):
        return self.file_content
