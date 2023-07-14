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
import redis
from flask_cors import CORS, cross_origin
from werkzeug.utils import secure_filename
from rq import Queue
from rq.job import Job
from worker import conn  # Redis connection
from tasks import ProcessTask

# Modules
from Modules.SessionGenerator import SessionGenerator


app = Flask(__name__)
CORS(app, resources={r"*": {"origins": "*"}})
# Enable debug mode
app.debug = True

# Set the Upload Folder
app.config["UPLOAD_FOLDER"] = os.path.join(os.path.dirname(__file__), "Uploads")

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


# Connect to Redis
Redis = redis.Redis(host="localhost", port=6379, db=0)
Q = Queue(connection=conn)


# Route to the Home Page
@app.route("/")
def hello_world():
    return render_template("index.html")


# Route to list all Queued Tasks - For Testing Purposes and Debugging
@app.route("/api/tasks")
@cross_origin()
def ListTasks():
    # Get all the Tasks in the Queue
    Tasks = Q.jobs

    # Create a List of Tasks
    TaskList = []
    for Task in Tasks:
        TaskList.append(
            {
                "Task Id": Task.id,
                "Task Status": Task.get_status(),
                "Task Result": Task.result,
            }
        )

    # Return the List of Tasks
    return jsonify(
        {
            "Tasks": TaskList,
            "Message": "Successfully Retrieved the List of Tasks.",
            "Status": "OK",
        }
    )


# Route to queue the task and return immediately
@app.route("/api/process", methods=["POST"])
@cross_origin()
def ProcessRequest():
    # Request Validation Code
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
        # Declare Allowed File Extensions
        AllowedExtensions = {"pdf", "png", "jpg", "jpeg"}

        # Isolate the File Extension of the Request File
        FileExtension = File.filename.rsplit(".", 1)[1].lower()

        # Check if the File Extension is Allowed
        if FileExtension not in AllowedExtensions:
            return jsonify({"error": "Invalid file extension."}), 400

    # Save files to a temporary directory
    SavedFiles = []
    for File in Files:
        filename = secure_filename(File.filename)
        FilePath = os.path.join(app.config["UPLOAD_FOLDER"], filename)
        File.save(FilePath)

        WindowsPath = FilePath

        UnixPath = WindowsPath.replace("C:", "/mnt/c").replace("\\", "/")

        print(
            f"The Default Windows Path - {WindowsPath} - is converted to a UNIX Path - {UnixPath}"
        )

        SavedFiles.append(UnixPath)

    # Queue the file processing task
    Task = Q.enqueue(ProcessTask, SavedFiles, Doctype)

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
        conn.ping()
    except ConnectionError as e:
        return jsonify({"Error": "Failed to connect to Redis.", "ID": TaskId}), 500

    try:
        job = Job.fetch(TaskId, connection=conn)
    except Exception as e:
        return jsonify({"Error": "Task does not exist.", "ID": TaskId}), 404

    jobStatus = job.get_status(refresh=True)

    # UPPERCASE the Job Status
    jobStatus = jobStatus.upper()

    Response = None

    if jobStatus == "FINISHED":
        Response = {"Status": jobStatus, "ID": TaskId, "Result": job.result}
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
