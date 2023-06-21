import cv2
import numpy as np
import pytesseract
from pytesseract import Output


def process_image_with_ocr(image_path, template_path):
    # Read the image using OpenCV
    image = cv2.imread(image_path)

    # Convert to grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Apply thresholding to enhance the contrast
    _, thresholded = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

    # Find contours of text regions
    contours, _ = cv2.findContours(
        thresholded, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE
    )

    # Find the largest contour (assuming it's the document area)
    largest_contour = max(contours, key=cv2.contourArea)

    # Get the rotated bounding box of the largest contour
    rect = cv2.minAreaRect(largest_contour)
    box = cv2.boxPoints(rect)
    box = np.int0(box)

    # Crop the image based on the rotated bounding box
    cropped_image = image.copy()
    cv2.drawContours(cropped_image, [box], 0, (0, 255, 0), 2)
    cropped_image_gray = cv2.cvtColor(cropped_image, cv2.COLOR_BGR2GRAY)
    x, y, w, h = cv2.boundingRect(box)
    cropped_image_gray = cropped_image_gray[y : y + h, x : x + w]

    # Sharpen the cropped image using a sharpening kernel
    kernel = np.array([[0, -1, 0], [-1, 5, -1], [0, -1, 0]])
    sharpened_image = cv2.filter2D(cropped_image_gray, -1, kernel)

    # Apply additional pre-processing steps as needed
    # Example: Denoise the image using a bilateral filter
    denoised_image = cv2.bilateralFilter(sharpened_image, 9, 75, 75)

    preprocessed_image = cv2.threshold(
        denoised_image, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU
    )[1]

    template = cv2.imread(template_path, 0)
    w, h = template.shape[::-1]

    res = cv2.matchTemplate(preprocessed_image, template, cv2.TM_CCOEFF_NORMED)
    threshold = 0.45
    loc = np.where(res >= threshold)

    for pt in zip(*loc[::-1]):
        cv2.rectangle(preprocessed_image, pt, (pt[0] + w, pt[1] + h), (0, 0, 255), 2)
        roi = preprocessed_image[pt[1] : pt[1] + h, pt[0] : pt[0] + w]
        config = "--oem 3 -l eng --psm 6"
        text = pytesseract.image_to_string(roi, config=config).strip()
        print(text)
        cv2.putText(
            preprocessed_image,
            text,
            (pt[0] + w, pt[1] + h),
            cv2.FONT_HERSHEY_SIMPLEX,
            1.2,
            (0, 0, 255),
            3,
        )

    cv2.imwrite("results.png", preprocessed_image)


# Specify the paths to the image and template
image_path = "./Images/Input.jpeg"
template_path = "./Images/Template.png"
output_path = "./Images/Output.png"

# Process the image with OCR
process_image_with_ocr(image_path, template_path, output_path)
