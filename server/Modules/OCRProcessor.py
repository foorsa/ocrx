# import the necessary packages
import os
from pdf2image import convert_from_path, convert_from_bytes
import pytesseract
from pytesseract import Output
from PIL import Image
import argparse
import imutils
# import cv2


class OCRProcessor:
    def __init__(self):
        self.file_path = None
        self.file_content = None

    # def Fix_Orientation(self, image_path):
    #     # TODO: Fix image orientation

    #     # Load the input image, convert it from BGR to RGB channel ordering,
    #     # and use Tesseract to determine the text orientation
    #     image = cv2.imread(image_path)
    #     rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    #     results = pytesseract.image_to_osd(rgb, output_type=Output.DICT, lang="fra")
    #     # Display the orientation information
    #     print("[INFO] detected orientation: {}".format(results["orientation"]))
    #     print("[INFO] rotate by {} degrees to correct".format(results["rotate"]))
    #     print("[INFO] detected script: {}".format(results["script"]))

    #     # Rotate the image to correct the orientation
    #     rotated = imutils.rotate_bound(image, angle=results["rotate"])

    #     # Save the rotated image
    #     image_dir, image_name = os.path.split(image_path)
    #     rotated_image_path = os.path.join(image_dir, image_name)
    #     cv2.imwrite(rotated_image_path, rotated)

    #     # Return the rotated image path
    #     return rotated_image_path

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
