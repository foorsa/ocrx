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


# Intialize the Flask app
app = Flask(__name__)

# Enable CORS
CORS(app, resources={r"*": {"origins": "*"}})

# Enable debug mode
app.debug = True

# Load the traineddata file for Tesseract - Contains the language models (e.g., English, French, Arabic, etc.)
os.environ["TESSDATA_PREFIX"] = os.path.join(os.path.dirname(__file__), "tessdata")


# Route to Receive the Initial Request
# POST Request: File, Document Type
@app.route("/api/process", methods=["POST"])
@cross_origin()
def ProcessRequest():
    if "file" not in request.files or "document_type" not in request.form:
        if "file" not in request.files:
            return (
                jsonify({"error": "File field is required."}),
                400,
            )
        elif "document_type" not in request.form:
            return jsonify({"error": "Document Type field is required."}), 400

        return jsonify({"error": "File and Document Type fields are required."}), 400

    # Store the File
    Files = request.files.getlist("file")

    # Store the Document Type
    Doctype = request.form["document_type"]

    # Check if the File is Empty - No File Selected
    for File in Files:
        AllowedExtensions = {"pdf", "png", "jpg", "jpeg"}

        # Isolate the File Extension
        FileExtension = File.filename.rsplit(".", 1)[1].lower()

        # Check if the File Extension is Allowed
        if FileExtension not in AllowedExtensions:
            return jsonify({"error": "Invalid file extension."}), 400

    # Generate a Session - Creates a Unique ID
    Session = SessionGenerator(Files, Doctype)

    # Initialize the Session
    try:
        Session.Initialize()
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    # Read the Document Content
    try:
        Session.Read()
    except Exception as e:
        ErrorMessage = str(e)
        Session.Error(ErrorMessage)
        return (
            jsonify({"error": ErrorMessage}),
            400,
        )

    # Correct the Document Content
    try:
        Session.Correct()
    except Exception as e:
        ErrorMessage = str(e)
        Session.Error(ErrorMessage)
        return (
            jsonify({"error": ErrorMessage}),
            400,
        )

    # Load BSON Data from the database
    from bson import json_util

    def parse_json(data):
        return json.loads(json_util.dumps(data))

    return jsonify(Session.Get()), 200, {"Content-Type": "application/json"}


@app.route("/api/destroy/all", methods=["POST"])
@cross_origin()
def DestroyAll():
    Session = SessionGenerator(None, None)
    Session.DestroyAll()
    return (
        jsonify({"message": "All sessions have been destroyed."}),
        200,
        {"Content-Type": "application/json"},
    )


# Get the Uploaded File from the Server - Send the File to the Client
@app.route("/Sessions/<session_id>/Uploads/<filename>", methods=["GET"])
def get_file(session_id, filename):
    Session = SessionGenerator(None, None)

    File = Session.GetFile(session_id, filename)

    if File:
        return send_file(File)
    else:
        return "File not found", 404


# # Get the Generated PDF from the Server - Send the PDF to the Client
# @app.route("/Sessions/<session_id>/Results/<filename>", methods=["GET"])
# def get_pdf(session_id, filename):
#     file_path = os.path.join(os.getcwd(), "Sessions", session_id, "Results", filename)

#     if os.path.isfile(file_path):
#         return send_file(file_path)
#     else:
#         return "File not found", 404


# Route to Generate the PDF - Send the PDF Information to the Client
@app.route("/api/generate", methods=["POST"])
def GeneratePDF():
    # Get the Request Data as JSON
    DATA = request.get_json()
    SESSION = SessionGenerator(None, None)

    # Check if the Request Data is Empty
    if not DATA:
        return jsonify(error="Invalid request JSON"), 400

    # Set the Required Fields
    RequiredFields = ["SessionID", "DocumentType", "Fields"]

    # Check if the Required Fields are in the Request Data
    MissingFields = [Field for Field in RequiredFields if Field not in DATA]

    # Check if there are Missing Fields
    if MissingFields:
        return jsonify(error=f'Missing fields: {", ".join(MissingFields)}'), 400

    # Get the Session ID, Document Type, and Fields
    Session_Id = DATA["SessionID"]
    Document_Type = DATA["DocumentType"]
    Fields = DATA["Fields"]

    SESSION.GetSession(Session_Id)

    return (
        jsonify(
            {
                "message": "All Good to Go, keep going bruh.",
                "FoundSessionID": SESSION.Get(),
            }
        ),
        200,
    )


if __name__ == "__main__":
    from waitress import serve

    serve(app, host="0.0.0.0", port=8080)
