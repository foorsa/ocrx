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
import json
from celery.result import AsyncResult
import dotenv
import gunicorn
import redis

# from celery import Celery

# Modules
from Modules.SessionGenerator import SessionGenerator


app = Flask(__name__)
CORS(app, resources={r"*": {"origins": "*"}})
# Enable debug mode
app.debug = True

# Set the Upload Folder
app.config["UPLOAD_FOLDER"] = os.path.join(os.path.dirname(__file__), "Uploads")

# Flask Timezone
app.config["TIMEZONE"] = "Africa/Casablanca"

# Setup the Celery Config in Flask Application
app.config["CELERY_BROKER_URL"] = dotenv.get_key(".env", "CELERY_BROKER_URL")
app.config["CELERY_RESULT_BACKEND"] = dotenv.get_key(".env", "CELERY_RESULT_BACKEND")
app.config["CELERY_REDIS_PASSWORD"] = dotenv.get_key(".env", "CELERY_REDIS_PASSWORD")
app.config["CELERY_REDIS_USERNAME"] = dotenv.get_key(".env", "CELERY_REDIS_USERNAME")
app.config["CELERY_REDIS_HOST"] = dotenv.get_key(".env", "CELERY_REDIS_HOST")
app.config["CELERY_REDIS_PORT"] = dotenv.get_key(".env", "CELERY_REDIS_PORT")


# Initialize Celery
celery = Celery(
    app.name,
)

celery.conf.update(
    broker_url=app.config["CELERY_BROKER_URL"],
    result_backend=app.config["CELERY_RESULT_BACKEND"],
    rate_limit="10/m",
    broker_connection_retry_on_startup=True,
    # Recommended settings for Celery and Redis for Production Server
)


# Task for Processing the Operation
@celery.task
def ProcessTask(Files, DocumentType):
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


# Configuration for views Folder
views = Blueprint("views", __name__, template_folder="templates")

# Create The Upload Folder if it doesn't exist
if not os.path.exists(app.config["UPLOAD_FOLDER"]):
    os.makedirs(app.config["UPLOAD_FOLDER"])


WindowsTessData = os.path.join(os.path.dirname(__file__), "tessdata")

# Load the traineddata file for Tesseract - Contains the language models (e.g., English, French, Arabic, etc.)
os.environ["TESSDATA_PREFIX"] = WindowsTessData

# TESSDATA_PREFIX for UNIX Systems
os.environ["TESSDATA_PREFIX"] = WindowsTessData.replace("\\", "/").replace(
    "C:", "/mnt/c"
)

print("Tessdata Path: ", os.environ["TESSDATA_PREFIX"])


# Route to the Home Page
@app.route("/")
def hello_world():
    return render_template("index.html")


# Destroy all Tasks and Cancel all Operations
@app.route("/api/destroy")
@cross_origin()
def DestroyTasks():
    # Get all the Tasks in the Queue
    Tasks = celery.control.inspect().active()

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
            celery.control.revoke(TaskID["id"], terminate=True)

    # Return the List of Tasks
    return jsonify(
        {
            "Tasks": Tasks,
            "Message": "Successfully Destroyed all Tasks.",
            "Status": "OK",
        }
    )


# Route to list all Queued Tasks - For Testing Purposes and Debugging
@app.route("/api/tasks")
@cross_origin()
def ListTasks():
    # Get all the Tasks in the Queue
    Tasks = celery.control.inspect().active()

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


# Route to queue the task and return immediately
@app.route("/api/process", methods=["POST"])
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
        FilePath = os.path.join(app.config["UPLOAD_FOLDER"], filename)
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
@app.route("/api/task/<TaskId>", methods=["GET"])
@cross_origin()
def TaskStatus(TaskId: str):
    try:
        result = AsyncResult(TaskId, app=celery)
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

    SESSION.Generate(Fields)

    return jsonify(SESSION.Get()), 200, {"Content-Type": "application/json"}


# Destroy All Sessions in the Database (To free up space)
@app.route("/api/destroy/all", methods=["POST", "GET"])
@cross_origin()
def DestroyAll():
    Session = SessionGenerator(None, None)
    Session.DestroyAll()
    return (
        jsonify({"message": "All sessions have been destroyed."}),
        200,
        {"Content-Type": "application/json"},
    )


if __name__ == "__main__":
    from waitress import serve

    serve(app, host="0.0.0.0", port=8080)
    # app.run(host="localhost", port=5000, debug=True)
