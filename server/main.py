import cv2
import numpy as np
import pytesseract
from pytesseract import Output


def Read_Image(image_path):
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

    # Save the preprocessed image for testing
    cv2.imwrite("./Output.png", denoised_image)

    # Configure Tesseract
    custom_config = r"--oem 3 -l ara+fra --psm 6"

    # Perform OCR
    ocr_result = pytesseract.image_to_string(image, config=custom_config)

    # Words list
    word_list = ["example", "words", "highlight"]

    # Perform OCR using Tesseract to get the bounding boxes of words
    data = pytesseract.image_to_data(
        image, config=custom_config, output_type=Output.DICT
    )

    # Iterate over the detected words
    for i in range(len(data["text"])):
        # Get the word and its bounding box coordinates
        word = data["text"][i]
        x, y, w, h = (
            data["left"][i],
            data["top"][i],
            data["width"][i],
            data["height"][i],
        )

        # Check if the word is in the list of words to highlight
        if word in words:
            # Draw a red bounding box around the word
            cv2.rectangle(image, (x, y), (x + w, y + h), (0, 0, 255), 2)

    # Save the image with highlighted words
    cv2.imwrite("highlighted_image.png", image)

    return ocr_result


text = Read_Image("./Input.jpeg")
print(text)
