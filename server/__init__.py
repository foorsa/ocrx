# Licensed under the Apache License, Version 2.0 (the "License");

# Libraries
import datetime
import os
from flask import Flask, jsonify, request, send_file, send_from_directory
from flask_cors import CORS, cross_origin
from werkzeug.utils import secure_filename
import json


# Modules
from Modules.SessionGenerator import SessionGenerator
from Modules.OCRProcessor import OCRProcessor
from Modules.GPTCorrector import GPTCorrector
from Modules.PDFGenerator import PDFGenerator


# Intialize the Flask app
app = Flask(__name__)

# Enable CORS
CORS(app, resources={r"*": {"origins": "*"}})

# Enable debug mode
app.debug = True

# Create instances of OCRProcessor - GPTCorrector - PDFGenerator
OCR = OCRProcessor()
GPT = GPTCorrector("gpt-3.5-turbo")
PDF = PDFGenerator()

UploadFolder = "Uploads"
ResultsFolder = "Results"
SessionsFolder = "Sessions"

app.config["UPLOAD_FOLDER"] = UploadFolder
app.config["RESULTS_FOLDER"] = ResultsFolder
app.config["SESSIONS_FOLDER"] = SessionsFolder

# Load the traineddata file for Tesseract - Contains the language models (e.g., English, French, Arabic, etc.)
os.environ["TESSDATA_PREFIX"] = os.path.join(os.path.dirname(__file__), "tessdata")


# Route to Receive the Initial Request
# POST Request: File, Document Type
@app.route("/api/process", methods=["POST"])
@cross_origin()
def ProcessRequest():
    if "file" not in request.files or "document_type" not in request.form:
        if "file" not in request.files:
            return jsonify({"error": "File field is required."}), 400
        elif "document_type" not in request.form:
            return jsonify({"error": "Document Type field is required."}), 400

        return jsonify({"error": "File and Document Type fields are required."}), 400

    # Store the File
    File = request.files["file"]

    # Store the Document Type
    Doctype = request.form["document_type"]

    # Check if the File is Empty - No File Selected
    if File.filename == "":
        return jsonify({"error": "No file selected."}), 400

    # Check if the Document Type is Empty - No Document Type Selected
    AllowedExtensions = {"pdf", "png", "jpg", "jpeg"}

    # Check if the File Extension is Allowed
    FileExtension = File.filename.rsplit(".", 1)[1].lower()
    if FileExtension not in AllowedExtensions:
        return jsonify({"error": "Invalid file extension."}), 400

    # Generate a Session - Creates a Unique ID
    Session = SessionGenerator(File, Doctype)

    # Generate the Session Data: Session ID, Document Type, File Name, File Path, Public File Path, Status, Error
    SessionData = Session.Generate()

    # Set Content to None
    Content = None
    if FileExtension == "pdf":
        # If the File is a PDF, Read the PDF
        Content = OCR.Read_PDF(SessionData["Document Type"], SessionData["File Path"])
    elif FileExtension in {"png", "jpg", "jpeg"}:
        # If the File is an Image, Read the Image
        Content = OCR.Read_Image(SessionData["Document Type"], SessionData["File Path"])

    # Check if Content is None
    if Content is None:
        return jsonify({"error": "Error Reading File Content."}), 400

    import json

    Corrected = GPT.Correct(Content, Doctype)
    CorrectedObject = json.loads(Corrected)
    Description = GPT.Describe(Content, Doctype)
    # Prepare the response data
    ResponseData = {
        "Session": SessionData,
        "Description": Description,
        "Corrected": CorrectedObject,
        "RAW": Content,
    }

    return jsonify(ResponseData), 200, {"Content-Type": "application/json"}


# Get the Uploaded File from the Server - Send the File to the Client
@app.route("/Sessions/<session_id>/Uploads/<filename>", methods=["GET"])
def get_file(session_id, filename):
    file_path = os.path.join(os.getcwd(), "Sessions", session_id, "Uploads", filename)

    if os.path.isfile(file_path):
        return send_file(file_path)
    else:
        return "File not found", 404


# Get the Generated PDF from the Server - Send the PDF to the Client
@app.route("/Sessions/<session_id>/Results/<filename>", methods=["GET"])
def get_pdf(session_id, filename):
    file_path = os.path.join(os.getcwd(), "Sessions", session_id, "Results", filename)

    if os.path.isfile(file_path):
        return send_file(file_path)
    else:
        return "File not found", 404


# Route to Generate the PDF - Send the PDF Information to the Client
@app.route("/api/generate", methods=["POST"])
def GeneratePDF():
    # Get the Request Data as JSON
    data = request.get_json()

    # Check if the Request Data is Empty
    if not data:
        return jsonify(error="Invalid request JSON"), 400

    # Set the Required Fields
    required_fields = ["SessionID", "DocumentType", "Fields"]

    # Check if the Required Fields are in the Request Data
    missing_fields = [field for field in required_fields if field not in data]

    # Check if there are Missing Fields
    if missing_fields:
        return jsonify(error=f'Missing fields: {", ".join(missing_fields)}'), 400

    # Get the Session ID, Document Type, and Fields
    Session_Id = data["SessionID"]
    Document_Type = data["DocumentType"]
    Fields = data["Fields"]

    PDF_Path = PDF.Generate(Document_Type, Session_Id, Fields)

    Public_PDF_Path = f"/Sessions/{Session_Id}/Results/Output.pdf"

    response = {
        "success": True,
        "message": "Document processed successfully.",
        "session_id": session_id,
        "document_type": document_type,
        "PDF_Path": PDF_Path,
        "Public PDF Path": Public_PDF_Path,
    }
    return jsonify(response), 200


if __name__ == "__init__":
    from waitress import serve

    serve(app, host="0.0.0.0", port=8080)
