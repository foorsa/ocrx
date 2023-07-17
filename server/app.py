# Licensed under the Apache License, Version 2.0 (the "License");

# Libraries
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
from celery import Celery
from celery.exceptions import SoftTimeLimitExceeded
import json
from celery.result import AsyncResult
import dotenv
import redis


# Modules
from Modules.SessionGenerator import SessionGenerator
from API.Routes import API_BLUEPRINT

UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), "Uploads")


def CreateFlaskApp():
    FlaskApp = Flask(__name__)
    CORS(FlaskApp, resources={r"*": {"origins": "*"}})
    # Enable debug mode
    FlaskApp.debug = True

    # Set the Upload Folder
    FlaskApp.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

    # Flask Timezone
    FlaskApp.config["TIMEZONE"] = "Africa/Casablanca"

    # Setup the Celery Config in Flask Application
    FlaskApp.config["CELERY_BROKER"] = dotenv.get_key(".env", "CELERY_BROKER")
    FlaskApp.config["CELERY_BROKER_URL"] = dotenv.get_key(".env", "CELERY_BROKER_URL")
    FlaskApp.config["CELERY_BACKEND"] = dotenv.get_key(".env", "CELERY_BACKEND")
    FlaskApp.config["CELERY_RESULT_BACKEND"] = dotenv.get_key(
        ".env", "CELERY_RESULT_BACKEND"
    )
    FlaskApp.config["CELERY_REDIS_PASSWORD"] = dotenv.get_key(
        ".env", "CELERY_REDIS_PASSWORD"
    )
    FlaskApp.config["CELERY_REDIS_USERNAME"] = dotenv.get_key(
        ".env", "CELERY_REDIS_USERNAME"
    )
    FlaskApp.config["CELERY_REDIS_HOST"] = dotenv.get_key(".env", "CELERY_REDIS_HOST")
    FlaskApp.config["CELERY_REDIS_PORT"] = dotenv.get_key(".env", "CELERY_REDIS_PORT")

    # Configuration for views Folder
    Blueprint("views", __name__, template_folder="templates")

    # Create The Upload Folder if it doesn't exist
    if not os.path.exists(FlaskApp.config["UPLOAD_FOLDER"]):
        os.makedirs(FlaskApp.config["UPLOAD_FOLDER"])

    WindowsTessData = os.path.join(os.path.dirname(__file__), "tessdata")

    # Load the traineddata file for Tesseract - Contains the language models (e.g., English, French, Arabic, etc.)
    os.environ["TESSDATA_PREFIX"] = WindowsTessData

    # TESSDATA_PREFIX for UNIX Systems
    os.environ["TESSDATA_PREFIX"] = WindowsTessData.replace("\\", "/").replace(
        "C:", "/mnt/c"
    )

    FlaskApp.register_blueprint(API_BLUEPRINT)

    print("Tessdata Path: ", os.environ["TESSDATA_PREFIX"])

    # Register the blueprint for API routes

    # Rest of your app configuration
    return FlaskApp


FlaskApp = CreateFlaskApp()

# Initialize Celery
CeleryApp = Celery(
    FlaskApp.name,
    broker=FlaskApp.config["CELERY_BROKER_URL"],
    backend=FlaskApp.config["CELERY_RESULT_BACKEND"],
    include=["API.Routes"],  # Include the API routes module here
)

CeleryApp.conf.update(
    worker_send_task_event=True,
    task_time_limit=60,
    task_soft_time_limit=60,
    task_acks_late=True,
    rate_limit="10/m",
    broker_connection_retry_on_startup=True,
)


@FlaskApp.route("/")
def hello_world():
    return render_template("index.html")


# Route to Generate a Session
@FlaskApp.route("/api/session/generate", methods=["POST"])
def GenerateSession():
    # DEBUG PRINT
    print("[!] Request Received !")

    # Request Validation Code
    if "file" not in request.files or "document_type" not in request.form:
        if "file" not in request.files:
            print("[X] File field is required.")
            return (
                jsonify({"error": "File field is required."}),
                400,
            )
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
        FilePath = os.path.join(FlaskApp.config["UPLOAD_FOLDER"], filename)
        File.save(FilePath)

        WindowsPath = FilePath

        UnixPath = WindowsPath.replace("C:", "/mnt/c").replace("\\", "/")

        # print(
        #     f"The Default Windows Path - {WindowsPath} - is converted to a UNIX Path - {UnixPath}"
        # )

        SavedFiles.append(UnixPath)

    print("[OK] Saving Files to Temporary Directory Finished !")

    # Queue the file processing task

    # Generate a Session
    Session = SessionGenerator(Doctype, SavedFiles)

    # DEBUG PRINT
    print("[!] Session Generated !")

    # Return the Session ID
    return jsonify({"session_id": Session.SessionID}), 200


# Route to Generate the PDF - Send the PDF Information to the Client
@FlaskApp.route("/api/generate", methods=["POST"])
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

    SESSION.Generate(Fields)

    return jsonify(SESSION.Get()), 200, {"Content-Type": "application/json"}


# Route to queue the task and return immediately
@FlaskApp.route("/api/task/process", methods=["POST"])
@cross_origin()
def ProcessRequest():
    # DEBUG PRINT
    print("[!] Request Received !")

    # Request Validation Code
    if "file" not in request.files or "document_type" not in request.form:
        if "file" not in request.files:
            print("[X] File field is required.")
            return (
                jsonify({"error": "File field is required."}),
                400,
            )
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
        FilePath = os.path.join(FlaskApp.config["UPLOAD_FOLDER"], filename)
        File.save(FilePath)

        WindowsPath = FilePath

        UnixPath = WindowsPath.replace("C:", "/mnt/c").replace("\\", "/")

        # print(
        #     f"The Default Windows Path - {WindowsPath} - is converted to a UNIX Path - {UnixPath}"
        # )

        SavedFiles.append(UnixPath)

    print("[OK] Saving Files to Temporary Directory Finished !")

    # Queue the file processing task

    print("[...] Processing Task for File Correction [...]")
    Task = ProcessTask.delay(SavedFiles, Doctype)

    print("[OK] Processing Task for File Correction Finished !")

    print("[!] Proccessing Task Queued ! [OK]")
    print("[!] Task ID: ", Task.id)

    # Return the task ID to the client
    return (
        jsonify(
            {
                "Task_Id": Task.id,
            }
        ),
        202,
    )


# Route for checking task status
@FlaskApp.route("/api/task/<TaskId>", methods=["GET"])
@cross_origin()
def TaskStatus(TaskId: str):
    try:
        result = AsyncResult(TaskId, app=CeleryApp)
    except Exception as e:
        return jsonify({"Error": "Task does not exist.", "ID": TaskId}), 404

    jobStatus = result.status

    # UPPERCASE the Job Status
    jobStatus = jobStatus.upper()

    Response = None

    if jobStatus == "SUCCESS":
        Response = {"Status": jobStatus, "ID": TaskId, "Result": result.result}
    elif jobStatus == "FAILURE":
        Response = {
            "ID": TaskId,
            "Status": jobStatus,
            "Reason": str(result.info),
        }
    else:
        Response = {"Status": jobStatus, "ID": TaskId}

    return jsonify(Response), 200


# Destroy All Sessions in the Database (To free up space)
@FlaskApp.route("/api/destroy/all", methods=["POST", "GET"])
@cross_origin()
def DestroyAll():
    Session = SessionGenerator(None, None)
    Session.DestroyAll()
    return (
        jsonify({"message": "All sessions have been destroyed."}),
        200,
        {"Content-Type": "application/json"},
    )


# Route to list all Queued Tasks - For Testing Purposes and Debugging
@FlaskApp.route("/api/tasks")
@cross_origin()
def ListTasks():
    # Get all the Tasks in the Queue
    Tasks = CeleryApp.control.inspect().active()

    # Check if the Queue is Empty
    if Tasks is None:
        return jsonify(
            {
                "Tasks": [],
                "Message": "No Tasks in the Queue.",
                "Status": "OK",
            }
        )

    # Return the List of Tasks
    return jsonify(
        {
            "Tasks": Tasks,
            "Message": "Successfully Retrieved the List of Tasks.",
            "Status": "OK",
        }
    )


# Destroy all Tasks and Cancel all Operations
@FlaskApp.route("/api/destroy")
@cross_origin()
def DestroyTasks():
    # Get all the Tasks in the Queue
    Tasks = CeleryApp.control.inspect().active()

    # Check if the Queue is Empty
    if Tasks is None:
        return jsonify(
            {
                "Tasks": [],
                "Message": "No Tasks in the Queue.",
                "Status": "OK",
            }
        )

    # Destroy all the Tasks
    for Task in Tasks:
        for TaskID in Tasks[Task]:
            CeleryApp.control.revoke(TaskID["id"], terminate=True)

    # Return the List of Tasks
    return jsonify(
        {
            "Tasks": Tasks,
            "Message": "Successfully Destroyed all Tasks.",
            "Status": "OK",
        }
    )


# Task for Processing the Operation
@CeleryApp.task
def ProcessTask(Files, DocumentType):
    try:
        print("[...] Processing Task Started !")

        Session = SessionGenerator(Files, DocumentType)

        # Initialize the Session
        print("[...] Intializing the Session Object [...]")
        try:
            Session.Initialize()
            print("[OK] Session Object Initialized !")
        except Exception as e:
            ErrorMessage = str(e)
            print(f"[ERROR] {ErrorMessage}")
            return {
                "Status": "Error",
                "Message": e,
            }

        # Read the Document Content
        print("[...] Processing Task for OCR [...]")
        try:
            Session.Read()
            print("[OK] Processing Task for OCR Finished !")
        except Exception as e:
            ErrorMessage = str(e)
            return {
                "Status": "Error",
                "Message": e,
            }
        # Correct the Document Content
        print("[...] Processing Task for AI Correction [...]")
        try:
            Session.Correct()
            print("[OK] Processing Task for Correction Finished !")
        except Exception as e:
            ErrorMessage = str(e)
            Session.Error(ErrorMessage)
            print(f"[ERROR] {ErrorMessage}")
            return {
                "Status": "Error",
                "Message": ErrorMessage,
            }

        # Load BSON Data from the database
        print("[...] Processing Task for JSON Serialization [...]")
        from bson import json_util

        def parse_json(Result):
            return json.loads(json_util.dumps(Result))

        print("[...] Processing Task for JSON Serialization Finished !")

        print("[OK] Processing Task Finished !")

        SessionObject = Session.Get()

        return parse_json(SessionObject)
    except SoftTimeLimitExceeded:
        print("[ERROR] Task Timeout !")
        return {
            "Status": "Error",
            "Message": "Task Timeout !",
        }
