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

def FindTable(image):
    # Preprocess image to find table
    
    # 1. Convert to grayscale
    Gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
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
    Table = image[y:y + h, x:x + w]

    return Table

def OCR(image, conf_thres, distance_thres):
    pytesseract.pytesseract.tesseract_cmd = 'C:/Program Files/Tesseract-OCR/tesseract.exe'
    options = "--psm 11"
    results = pytesseract.image_to_data(
        cv2.cvtColor(image, cv2.COLOR_BGR2RGB),
        config=options,
        output_type=Output.DICT)
    coords = []
    ocrText = []

    for i in range(0, len(results["text"])):
        x = results["left"][i]
        y = results["top"][i]
        w = results["width"][i]
        h = results["height"][i]
        text = results["text"][i]
        conf = int(results["conf"][i])
        if conf > conf_thres:
            coords.append((x, y, w, h))
            ocrText.append(text)

    xCoords = [(c[0], 0) for c in coords]
    clustering = AgglomerativeClustering(
        n_clusters=None,
        affinity="manhattan",
        linkage="complete",
        distance_threshold=distance_thres)
    clustering.fit(xCoords)
    sortedClusters = []

    # loop over all clusters
    for l in np.unique(clustering.labels_):
        # extract the indexes for the coordinates belonging to the
        # current cluster
        idxs = np.where(clustering.labels_ == l)[0]
        # verify that the cluster is sufficiently large
        if len(idxs) > 2:
            # compute the average x-coordinate value of the cluster and
            # update our clusters list with the current label and the
            # average x-coordinate
            avg = np.average([coords[i][0] for i in idxs])
            sortedClusters.append((l, avg))
    # sort the clusters by their average x-coordinate and initialize our
    # data frame
    sortedClusters.sort(key=lambda x: x[1])
    df = pd.DataFrame()

    # loop over the clusters again, this time in sorted order
    for (l, _) in sortedClusters:
        # extract the indexes for the coordinates belonging to the
        # current cluster
        idxs = np.where(clustering.labels_ == l)[0]
        # extract the y-coordinates from the elements in the current
        # cluster, then sort them from top-to-bottom
        yCoords = [coords[i][1] for i in idxs]
        sortedIdxs = idxs[np.argsort(yCoords)]
        # generate a random color for the cluster
        color = np.random.randint(0, 255, size=(3,), dtype="int")
        color = [int(c) for c in color]
        # loop over the sorted indexes
        
        for i in sortedIdxs:
            # extract the text bounding box coordinates and draw the
            # bounding box surrounding the current element
            (x, y, w, h) = coords[i]
            cv2.rectangle(image, (x, y), (x + w, y + h), color, 2)
            # extract the OCR'd text for the current column, then construct
            # a data frame for the data where the first entry in our column
            # serves as the header
        cols = [ocrText[i].strip() for i in sortedIdxs]
        currentDF = pd.DataFrame({cols[0]: cols[1:]})
        # concatenate *original* data frame with the *current* data
        # frame (we do this to handle columns that may have a varying
        # number of rows)
        df = pd.concat([df, currentDF], axis=1)
    
    df.fillna("", inplace=True)

    return image, df

def rotate_image(image, angle):
    rows, cols = image.shape[:2]
    center = (cols/2, rows/2)

    M = cv2.getRotationMatrix2D(center, angle, scale=1.0)

    # Perform the rotation
    rotated_img = cv2.warpAffine(image, M, (cols, rows))
    return rotated_img


# Allow user to upload an image
image_file = st.file_uploader("Upload an image", type=["jpg", "jpeg", "png"])
# rotate_angle = st.radio("select rotation angle",
#         [0, 90, 180, 270],
#         key=None)

conf = st.slider('Set confident threshold for OCR', 0.0, 1.00, 0.0)
dist = st.slider('Set distance threshold for Clustering', 0, 500, 70)

if image_file is not None:
    # Open the image
    image = Image.open(image_file)
    image = np.array(image)
    # image = rotate_image(image, rotate_angle)

    table =  find_table(image)
    img,df = OCR(table, conf, dist)
    
    # Drop duplicate columns
    dup = df.columns[df.columns.duplicated()].tolist()
    df = df.drop(dup, axis=1)

    # Show the image
    st.image(img, caption='Result', use_column_width=True)

    #Show table
    st.table(df)
