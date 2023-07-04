# import the necessary packages
import io
import os
import tempfile
from PyPDF2 import PdfReader
import cv2
from gridfs import GridOut
import numpy as np
from pdf2image import convert_from_path, convert_from_bytes
import pytesseract
from pytesseract import Output
from PIL import Image
import argparse
import imutils


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

    # Fixing the Image Orientation
    def Fix_Orientation(self, image_path):
        # TODO: Fix image orientation

        # Load the input image, convert it from BGR to RGB channel ordering,
        # and use Tesseract to determine the text orientation
        image = cv2.imread(image_path)
        rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        results = pytesseract.image_to_osd(rgb, output_type=Output.DICT, lang="fra")
        # Display the orientation information
        print("[INFO] detected orientation: {}".format(results["orientation"]))
        print("[INFO] rotate by {} degrees to correct".format(results["rotate"]))
        print("[INFO] detected script: {}".format(results["script"]))

        # Rotate the image to correct the orientation
        rotated = imutils.rotate_bound(image, angle=results["rotate"])

        # Save the rotated image
        image_dir, image_name = os.path.split(image_path)
        rotated_image_path = os.path.join(image_dir, image_name)
        cv2.imwrite(rotated_image_path, rotated)

        # Return the rotated image path
        return rotated_image_path

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
                lang="fra",
                config="--psm 1 --oem 3 -c tessedit_char_whitelist=0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
            )
            self.file_content = text_content
            return text_content
        except Exception as e:
            print(f"Error reading image file: {str(e)}")

    def Get_File_Content(self):
        return self.file_content
