import os
from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
from Modules.OCRProcessor import OCRProcessor
from Modules.GPTCorrector import GPTCorrector
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app, resources={r"*": {"origins": "*"}})

# Create instances of OCRProcessor and GPTCorrector
OCR = OCRProcessor()
GPT = GPTCorrector("gpt-3.5-turbo")


UPLOAD_FOLDER = "uploads"
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Remove temporary files
if os.path.exists(UPLOAD_FOLDER):
    for file in os.listdir(UPLOAD_FOLDER):
        os.remove(os.path.join(UPLOAD_FOLDER, file))

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER


@app.route("/api/process", methods=["POST"])
@cross_origin()
def process_request():
    # Check if file and document_type fields are present in the request
    if "file" not in request.files or "document_type" not in request.form:
        if "file" not in request.files:
            return jsonify({"error": "File field is required."}), 400
        elif "document_type" not in request.form:
            return jsonify({"error": "Document_type field is required."}), 400

        return jsonify({"error": "File and document_type fields are required."}), 400

    File = request.files["file"]
    Doctype = request.form["document_type"]

    # Check if file is present and has an allowed extension (e.g., PDF, PNG, JPG)
    if File.filename == "":
        return jsonify({"error": "No file selected."}), 400

    AllowedExtensions = {"pdf", "png", "jpg", "jpeg"}
    FileExtension = File.filename.rsplit(".", 1)[1].lower()
    if FileExtension not in AllowedExtensions:
        return jsonify({"error": "Invalid file extension."}), 400

    # Save the file to the UPLOAD_FOLDER
    filename = secure_filename(File.filename)
    File.save(os.path.join(app.config["UPLOAD_FOLDER"], filename))

    # Return the file and document type in the response
    response = {"file": filename, "document_type": Doctype}

    # The File could be a PDF, or an Image.
    # The Document Type could be: Baccalaureate Diploma, Language Diploma, or a Master Diploma.

    Content = None
    if File.filename.endswith(".pdf"):
        Content = OCR.Read_PDF(os.path.join(app.config["UPLOAD_FOLDER"], filename))

    elif (
        File.filename.endswith(".png")
        or File.filename.endswith(".jpg")
        or File.filename.endswith(".jpeg")
    ):
        Content = OCR.Read_Image(os.path.join(app.config["UPLOAD_FOLDER"], filename))
    else:
        return "Invalid file type. Please upload a PDF or an Image file."

    if Content == None:
        return "Error reading file. Please try again."

    print("Content: ", Content)

    # Correct the OCR output using GPT-3.5-turbo
    Corrected = GPT.Correct(Content, "Baccalaureate Diploma")

    print("Corrected: ", Corrected)

    # Parsed = GPT.Parse(Content)

    # Return the corrected JSON text as the response
    return Corrected, 200, {"Content-Type": "application/json"}


if __name__ == "__main__":
    app.run()
