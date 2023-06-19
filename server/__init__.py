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


app = Flask(__name__)
CORS(app, resources={r"*": {"origins": "*"}})
app.debug = True

# Create instances of OCRProcessor and GPTCorrector
OCR = OCRProcessor()
GPT = GPTCorrector("gpt-3.5-turbo")
PDF = PDFGenerator()

UploadFolder = "Uploads"
ResultsFolder = "Results"
SessionsFolder = "Sessions"

app.config["UPLOAD_FOLDER"] = UploadFolder
app.config["RESULTS_FOLDER"] = ResultsFolder
app.config["SESSIONS_FOLDER"] = SessionsFolder


@app.route("/api/process", methods=["POST"])
@cross_origin()
def ProcessRequest():
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

    # Generate a session for the user request
    Session = SessionGenerator(File, Doctype)

    SessionData = Session.Generate()

    # Perform OCR and correction operations on the file
    Content = None
    if FileExtension == "pdf":
        Content = OCR.Read_PDF(SessionData["File Path"])
    elif FileExtension in {"png", "jpg", "jpeg"}:
        # OCR.Fix_Orientation(SessionData["File Path"])
        # OCR.Fix_Orientation(SessionData["File Path"])
        Content = OCR.Read_Image(SessionData["File Path"])

    if Content is None:
        return "Error reading file. Please try again."

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

    # Return the response with session data and corrected content
    return jsonify(ResponseData), 200, {"Content-Type": "application/json"}


@app.route("/Sessions/<session_id>/Uploads/<filename>", methods=["GET"])
def get_file(session_id, filename):
    # Construct the file path based on the session ID and filename
    file_path = os.path.join(os.getcwd(), "Sessions", session_id, "Uploads", filename)

    # Check if the file exists
    if os.path.isfile(file_path):
        # Use Flask's send_file function to send the file in the response
        return send_file(file_path)
    else:
        return "File not found", 404


@app.route("/Sessions/<session_id>/Results/<filename>", methods=["GET"])
def get_pdf(session_id, filename):
    # Construct the file path based on the session ID and filename
    file_path = os.path.join(os.getcwd(), "Sessions", session_id, "Results", filename)

    # Check if the file exists
    if os.path.isfile(file_path):
        # Use Flask's send_file function to send the file in the response
        return send_file(file_path)
    else:
        return "File not found", 404


@app.route("/api/generate", methods=["POST"])
def GeneratePDF():
    # Validate the request JSON
    data = request.get_json()
    if not data:
        return jsonify(error="Invalid request JSON"), 400

    required_fields = ["SessionID", "DocumentType", "Fields"]
    missing_fields = [field for field in required_fields if field not in data]
    if missing_fields:
        return jsonify(error=f'Missing fields: {", ".join(missing_fields)}'), 400

    # Perform additional validations as needed

    # Access the values from the request JSON
    session_id = data["SessionID"]
    document_type = data["DocumentType"]
    fields = data["Fields"]

    # Process the document data
    PDF_Path = PDF.Generate(document_type, session_id, fields)

    # Generate a public URL for the PDF
    Public_PDF_Path = f"/Sessions/{session_id}/Results/Output.pdf"

    # Return a response
    response = {
        "success": True,
        "message": "Document processed successfully.",
        "session_id": session_id,
        "document_type": document_type,
        "PDF_Path": PDF_Path,
        "Public PDF Path": Public_PDF_Path,
    }
    return jsonify(response), 200


if __name__ == "__main__":
    from waitress import serve

    serve(app, host="0.0.0.0", port=8080)
