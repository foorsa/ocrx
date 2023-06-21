import cv2
import numpy as np
import pytesseract
from PIL import Image
from skimage.transform import rotate
import re
import matplotlib.pyplot as plt


def correct_rotation(image):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    edges = cv2.Canny(gray, 50, 150, apertureSize=3)
    lines = cv2.HoughLines(edges, 1, np.pi / 180, threshold=100)

    angles = []
    for line in lines:
        for rho, theta in line:
            angle = theta * 180 / np.pi
            angles.append(angle)

    median_angle = np.median(angles)
    rotated_image = rotate(image, median_angle, resize=True)

    return rotated_image


def preprocess_image(image):
    # Apply pre-processing steps such as color removal, shadow removal, tilt correction, etc.
    # Implement your own pre-processing logic based on the specific requirements of your images

    # Example: Convert image to grayscale
    gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    return gray_image


def create_template(image):
    # Perform text detection using Tesseract OCR
    ocr_output = pytesseract.image_to_string(image, lang="eng")

    # Determine the document type and define the regions of interest (ROIs)
    document_type = detect_document_type(ocr_output)
    if document_type == "Baccaulaureate Diploma":
        # Define the ROIs for extracting specific information
        rois = {
            "Serial Number": (3, y1, x2, y2),
            "Candidate Name": (x1, y1, x2, y2),
            # Add more ROIs as needed
        }
        template = {
            "document_type": document_type,
            "language": ["Arabic", "French"],
            "rois": rois,
        }
    else:
        template = None

    return template


def detect_document_type(ocr_output):
    # Implement your own logic to detect the document type based on the OCR output
    # You can use regular expressions or any other pattern matching methods

    # Example: Check if the OCR output contains specific keywords indicating the document type
    if re.search(r"baccaulaureate diploma", ocr_output, re.IGNORECASE):
        return "Baccaulaureate Diploma"
    else:
        return "Unknown"


def process_ocr_output(ocr_output):
    # Use OpenAI or any other method to process the OCR output and extract the necessary information
    # You can use natural language processing techniques, keyword extraction, or any other methods

    # Example: Extract candidate name
    candidate_name = extract_candidate_name(ocr_output)

    processed_output = {
        "candidate_name": candidate_name,
        # Add more extracted information as needed
    }

    return processed_output


def extract_candidate_name(ocr_output):
    # Implement your own logic to extract the candidate name from the OCR output
    # You can use regular expressions or any other methods based on the pattern you expect

    # Example: Extract text after "Name:" or similar patterns
    candidate_name = re.search(r"Name:\s*(.*)", ocr_output, re.IGNORECASE)
    if candidate_name:
        return candidate_name.group(1)
    else:
        return None


def generate_bounding_boxes(image, template):
    # Apply OCR on the image using Tesseract
    ocr_output = pytesseract.image_to_string(image, lang="eng")

    # Process the OCR output to extract the relevant information
    processed_output = process_ocr_output(ocr_output)

    # Extract the ROIs from the template
    rois = template["rois"]

    # Create bounding boxes around the detected text based on the ROIs
    for roi_name, roi_coords in rois.items():
        x1, y1, x2, y2 = roi_coords
        cv2.rectangle(image, (x1, y1), (x2, y2), (0, 0, 255), 2)
        cv2.putText(
            image,
            roi_name,
            (x1, y1 - 10),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.9,
            (0, 0, 255),
            2,
        )

    return image


def save_image(image, output_path):
    cv2.imwrite(output_path, image)


# Main function
def process_image(image_path, output_path):
    # Step 1: Read the image using OpenCV
    image = cv2.imread(image_path)

    # Step 2: Correct the rotation of the image
    rotated_image = correct_rotation(image)

    # Step 3: Preprocess the image
    preprocessed_image = preprocess_image(rotated_image)

    # Step 4: Create a template for document type and ROIs
    template = create_template(preprocessed_image)

    # Step 5: Use OpenAI or any other method to process the OCR output
    processed_output = process_ocr_output(template)

    # Step 6: Generate bounding boxes around the detected text
    output_image = generate_bounding_boxes(preprocessed_image, template)

    # Step 7: Save the output image
    save_image(output_image, output_path)


# Usage example
image_path = "./Images/Input.jpeg"
output_path = "./Images/Output.jpeg"
process_image(image_path, output_path)
