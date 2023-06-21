import cv2


def create_template_image(image_path, roi_coordinates, template_path):
    # Read the image
    image = cv2.imread(image_path)

    # Extract the region of interest (ROI) from the image
    x, y, w, h = roi_coordinates
    roi = image[y : y + h, x : x + w]

    # Save the ROI as the template image
    cv2.imwrite(template_path, roi)


# Specify the path to the input image
image_path = "./Images/Input.jpeg"

# Specify the coordinates of the ROI in the input image (x, y, width, height)
roi_coordinates = (100, 100, 200, 50)

# Specify the path for saving the template image
template_path = "./Images/Template.png"

# Create the template image
create_template_image(image_path, roi_coordinates, template_path)
