import cv2
import numpy as np
import pytesseract
from pytesseract import Output
import streamlit as st
import cv2
import numpy as np
import pandas as pd
import pytesseract
import imutils
import matplotlib.pyplot as plt
from sklearn.cluster import AgglomerativeClustering
from pytesseract import Output
from PIL import Image

def FindTable(Image):
    # Preprocess image to find table
    
    # 1. Convert to grayscale
    Gray = cv2.cvtColor(Image, cv2.COLOR_BGR2GRAY)
    Kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (51, 11))
    
    # 2. Blur image
    Blur = cv2.GaussianBlur(Gray, (3, 3), 0)
    
    # 3. Apply blackhat morphological operation
    BlackHat = cv2.morphologyEx(Blur, cv2.MORPH_BLACKHAT, Kernel)
    
    # 4. Compute Gradient along x-axis
    Gradient = cv2.Sobel(BlackHat, ddepth=cv2.CV_32F, dx=1, dy=0, ksize=-1)
    
    # 5. Find minimum and maximum values
    Gradient = np.absolute(Gradient)
    (minVal, maxVal) = (np.min(Gradient), np.max(Gradient))
    Gradient = (Gradient - minVal) / (maxVal - minVal)
    Gradient = (Gradient * 255).astype("uint8")
    
    # 6. Apply closing operation
    Gradient = cv2.morphologyEx(Gradient, cv2.MORPH_CLOSE, Kernel)
    
    # 7. Apply thresholding
    Thresholded = cv2.threshold(Gradient, 0, 255, cv2.THRESH_BINARY | cv2.THRESH_OTSU)[1]
    
    # 8. Apply closing operation again
    Thresholded = cv2.dilate(Thresholded, None, iterations=3)
    
    # 9. Find contours
    Contours = cv2.findContours(Thresholded.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    # 10. Grab contours
    Contours = imutils.grab_contours(Contours)
    
    # 11. Find table
    TableCountour = max(Contours, key=cv2.contourArea)
    
    # 12. Draw contours
    (x, y, w, h) = cv2.boundingRect(TableCountour)
    
    # 13. Crop image
    Table = Image[y:y + h, x:x + w]

    return Table

# Image Path
ImagePath = "C:\Users\YASSI\OneDrive\Documents\GitHub\OCRX\server\Tests\Images\Input.jpg";

Image = cv2.imread(ImagePath);

Table = FindTable(Image);

cv2.imshow("Table", Table);