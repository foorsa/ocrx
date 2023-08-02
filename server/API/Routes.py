# ./API/Routes.py
#
# Libraries
#
import os
from flask import (
    Blueprint,
    Flask,
    jsonify,
    request,
    render_template,
)
from flask_cors import CORS, cross_origin
from werkzeug.utils import secure_filename
import json
from flask import Blueprint, jsonify, request

# Import any other required modules
from Modules.SessionGenerator import SessionGenerator
from Config import UPLOAD_FOLDER

# Create a Blueprint object for the API routes
API_BLUEPRINT = Blueprint("API", __name__, template_folder="templates")


@API_BLUEPRINT.route("/api/v1", methods=["GET"])
def Home():
    return render_template("index.html")


# PING API
@API_BLUEPRINT.route("/api/v1/ping", methods=["GET", "POST"])
def Ping():
    # Heroku puts the server to sleep after 30 minutes of inactivity
    # This endpoint is used to wake the server up
    return jsonify({"Status": "OK"}), 200


# INITIALIZATION API
@API_BLUEPRINT.route("/api/v1/initialize", methods=["POST"])
def Initialize():
    print("[STEP 1] Initializing an empty Session")

    print("[...] Validating the Request Parameters...")

    # Request Validation Code
    if "file" not in request.files or "document_type" not in request.form:
        if "file" not in request.files:
            print("[X] File field is required.")
            return (jsonify({"error": "File field is required."}), 400, 2)
        elif "document_type" not in request.form:
            print("[X] Document Type field is required.")
            return jsonify({"error": "Document Type field is required."}), 400

        print("[X] File and Document Type fields are required.")
        return jsonify({"error": "File and Document Type fields are required."}), 400

    # Store the File
    Files = request.files.getlist("file")

    # Store the Document Type
    Doctype = request.form["document_type"]

    # Check if the File is Empty - No File Selected
    for File in Files:
        # Declare Allowed File Extensions
        AllowedExtensions = {"pdf", "png", "jpg", "jpeg"}

        # Isolate the File Extension of the Request File
        FileExtension = File.filename.rsplit(".", 1)[1].lower()

        # Check if the File Extension is Allowed
        if FileExtension not in AllowedExtensions:
            print("[X] Invalid file extension.")
            return jsonify({"error": "Invalid file extension."}), 400

    # Save files to a temporary directory
    SavedFiles = []
    print("[...] Saving Files to Temporary Directory [...]")
    for File in Files:
        filename = secure_filename(File.filename)
        FilePath = os.path.join(UPLOAD_FOLDER, filename)
        File.save(FilePath)

        WindowsPath = FilePath

        SavedFiles.append(WindowsPath)

    print("[OK] Saving Files to Temporary Directory Finished !")

    # Queue the file processing task

    # Generate a Session
    Session = SessionGenerator()

    print("[...] Saving Session to Database...")
    Session.Initialize(Doctype, SavedFiles)
    print("[OK] Saving Session to Database Finished !")

    # DEBUG PRINT
    print("[!] Session Generated !")

    # Return the Session ID
    return jsonify({"Session": Session.Get()}), 200


# EXTRACTION API
@API_BLUEPRINT.route("/api/v1/extract-text", methods=["POST"])
def ExtractText():
    print("[STEP 2] Extracting the Text from the Session File")

    print("[...] Retrieving Session Id...")
    Session_Id = request.args.get("Session_Id")
    print("[OK] Retrieving Session Id Finished !")

    print("[...] Retrieving Session from Database...")
    Session = SessionGenerator()

    Session.Set(Session_Id)
    print("[OK] Retrieving Session from Database Finished !")

    print("[...] Extracting Text from Session File...")
    try:
        Session.ExtractText()
        print("[OK] Extracting Text from Session File Finished !")
        return jsonify({"Session": Session.Get()}), 200
    except Exception as e:
        ErrorMessage = str(e)
        Session.Error(ErrorMessage)
        print(f"[ERROR] {ErrorMessage}")
        return jsonify({"Status": "Error", "Error": ErrorMessage}), 500


@API_BLUEPRINT.route("/api/v1/correct-text", methods=["POST"])
def CorrectText():
    print("[STEP 4] Correcting the Text from the Session File")

    print("[...] Retrieving Session Id...")
    Session_Id = request.args.get("Session_Id")
    print("[OK] Retrieving Session Id Finished !")

    print("[...] Retrieving Session from Database...")
    Session = SessionGenerator()

    Session.Set(Session_Id)
    print("[OK] Retrieving Session from Database Finished !")

    print("[...] Checking Presence of Extracted Text...")

    if (
        not Session.Get()["Status"] == "Extracted"
        and not Session.Get()["Status"] == "Corrected"
    ):
        print("[X] No Extracted Data Available.")
        return (
            jsonify(
                {
                    "Status": "Error",
                    "Error": "No Extracted Data Found.",
                }
            ),
            400,
        )

    print("[...] Processing AI Text Correction [...]")

    try:
        Session.CorrectText()
        print("[OK] Processing AI Text Correction Finished !")
    except Exception as e:
        ErrorMessage = str(e)
        Session.Error(ErrorMessage)
        print(f"[ERROR] {ErrorMessage}")
        return jsonify({"Session": Session.Get(), "Error": ErrorMessage}), 500
    print("[OK] Correcting Text from Session File Finished !")

    return jsonify({"Session": Session.Get()}), 200


@API_BLUEPRINT.route("/api/v1/translate-text", methods=["POST"])
def TranslateText():
    print("[STEP 6] Translating the Text from the Session File")

    print("[...] Retrieving Session Id...")
    Session_Id = request.args.get("Session_Id")
    print("[OK] Retrieving Session Id Finished !")

    print("[...] Retrieving Session from Database...")
    Session = SessionGenerator()

    Session.Set(Session_Id)
    print("[OK] Retrieving Session from Database Finished !")

    print("[...] Checking Presence of Corrected Text...")

    if (
        not Session.Get()["Status"] == "Corrected"
        and not Session.Get()["Status"] == "Translated"
    ):
        print("[X] No Extracted Text Available.")
        return (
            jsonify(
                {
                    "Status": "Error",
                    "Error": "No Extracted Text is Found.",
                }
            ),
            400,
        )

    print("[...] Processing Text Translation [...]")

    try:
        Session.TranslateText()
        print("[OK] Processing Text Translation Finished !")
    except Exception as e:
        ErrorMessage = str(e)
        Session.Error(ErrorMessage)
        print(f"[ERROR] {ErrorMessage}")
        return jsonify({"Session": Session.Get(), "Error": ErrorMessage}), 500
    print("[OK] Translating Text from Session File Finished !")

    return jsonify({"Session": Session.Get()}), 200


@API_BLUEPRINT.route("/api/v1/generate", methods=["POST"])
def Generate():
    print("[STEP 8] Generating a Document from the Session Information.")

    print("[...] Retrieving Session Identifier...")
    Session_Id = request.args.get("Session_Id")

    if not Session_Id:
        print("[X] No Session Identifier Provided.")
        return (
            jsonify(
                {
                    "Status": "Error",
                    "Error": "No Session Id Provided.",
                }
            ),
            400,
        )

    print("[OK] Retrieving Session Identifier Finished !")

    print("[...] Retrieving Session from Database...")
    Session = SessionGenerator()
    Session.Set(Session_Id)

    print("[OK] Retrieving Session from Database Finished !")

    print("[...] Checking Session Status...")

    if not Session.Get()["Status"] == "Translated":
        print("[X] The Session has not passed the Translation Phase.")
        return (
            jsonify(
                {
                    "Status": "Error",
                    "Error": "No Translated Data is Found.",
                }
            ),
            400,
        )
    # If the Request has Document Values
    print("[...] Retrieving Request Data...")
    try:
        DATA = request.get_json()
        Values = DATA["Values"]
    except:
        Values = None

    if not Values:
        print("[X] No Values Provided.")

        # Keep the Values as they are
        Values = Session.Get()["Translation"]["Text"]
    else:
        # TODO: Set the Values to the Corrected Session Values
        Session.SetValues(Values)

    print("[...] Generating Document from Session Information...")

    try:
        Session.GenerateDocument()
        print("[OK] Generating Document from Session Information Finished !")
    except Exception as e:
        ErrorMessage = str(e)
        Session.Error(ErrorMessage)
        print(f"[ERROR] {ErrorMessage}")
        return jsonify({"Session": Session.Get(), "Error": ErrorMessage}), 500

    print("[OK] Document Generation Finished !")

    return (
        jsonify(
            {
                "Session": Session.Get(),
            }
        ),
        200,
    )


# Exceptional Routes ----------------------------------------------------------
@API_BLUEPRINT.route("/api/v1/extract-table", methods=["POST"])
def ExtractTable():
    # Extract table from Document
    print("[STEP 3] Extracting the Table from the Session File")

    print("[...] Retrieving Session Id...")
    Session_Id = request.args.get("Session_Id")
    print("[OK] Retrieving Session Id Finished !")

    print("[...] Retrieving Session from Database...")
    Session = SessionGenerator()

    Session.Set(Session_Id)
    print("[OK] Retrieving Session from Database Finished !")

    print("[...] Extracting Table from Session File...")
    try:
        Session.ExtractTables()
        print("[OK] Extracting Table from Session File Finished !")
        return jsonify({"Session": Session.Get()}), 200
    except Exception as e:
        ErrorMessage = str(e)
        Session.Error(ErrorMessage)
        print(f"[ERROR] {ErrorMessage}")
        return jsonify({"Status": "Error", "Error": ErrorMessage}), 500


@API_BLUEPRINT.route("/api/v1/correct-table", methods=["POST"])
def CorrectTable():
    print("[STEP 5] Correcting the Table from the Session File")

    print("[...] Retrieving Session Id...")
    Session_Id = request.args.get("Session_Id")
    print("[OK] Retrieving Session Id Finished !")

    print("[...] Retrieving Session from Database...")
    Session = SessionGenerator()

    Session.Set(Session_Id)
    print("[OK] Retrieving Session from Database Finished !")

    print("[...] Checking Presence of Extracted Tables...")

    if (
        not Session.Get()["Status"] == "Extracted"
        and not Session.Get()["Status"] == "Corrected"
    ):
        print("[X] No Extracted Tables Available.")
        return (
            jsonify(
                {
                    "Status": "Error",
                    "Error": "No Extracted Data Found.",
                }
            ),
            400,
        )

    print("[...] Processing AI Table Correction [...]")

    try:
        Session.CorrectTables()
        print("[OK] Processing AI Table Correction Finished !")
    except Exception as e:
        ErrorMessage = str(e)
        Session.Error(ErrorMessage)
        print(f"[ERROR] {ErrorMessage}")
        return jsonify({"Session": Session.Get(), "Error": ErrorMessage}), 500
    print("[OK] Correcting Text from Session File Finished !")

    return jsonify({"Session": Session.Get()}), 200


@API_BLUEPRINT.route("/api/v1/translate-table", methods=["POST"])
def TranslateTable():
    print("[STEP 7] Translating the Table from the Session File")

    print("[...] Retrieving Session Id...")
    Session_Id = request.args.get("Session_Id")
    print("[OK] Retrieving Session Id Finished !")

    print("[...] Retrieving Session from Database...")
    Session = SessionGenerator()

    Session.Set(Session_Id)
    print("[OK] Retrieving Session from Database Finished !")

    print("[...] Checking Presence of Corrected Table...")

    if (
        not Session.Get()["Status"] == "Corrected"
        and not Session.Get()["Status"] == "Translated"
    ):
        print("[X] No Extracted Tables are Available.")
        return (
            jsonify(
                {
                    "Status": "Error",
                    "Error": "No Extracted Table is Found.",
                }
            ),
            400,
        )

    print("[...] Processing Table Translation [...]")

    try:
        Session.TranslateTables()
        print("[OK] Processing Table Translation Finished !")
    except Exception as e:
        ErrorMessage = str(e)
        Session.Error(ErrorMessage)
        print(f"[ERROR] {ErrorMessage}")
        return jsonify({"Session": Session.Get(), "Error": ErrorMessage}), 500
    print("[OK] Translating Table from Session File Finished !")

    return jsonify({"Session": Session.Get()}), 200
