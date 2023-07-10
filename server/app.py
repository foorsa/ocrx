# Licensed under the Apache License, Version 2.0 (the "License");

# Libraries
import datetime
import os
from flask import (
    Blueprint,
    Flask,
    jsonify,
    request,
    send_file,
    send_from_directory,
    render_template,
)
from celery import Celery
from celery.backends.redis import RedisBackend
import redis
from rq import Queue
from flask_cors import CORS, cross_origin
from werkzeug.utils import secure_filename
import json

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

# Load the traineddata file for Tesseract - Contains the language models (e.g., English, French, Arabic, etc.)
os.environ["TESSDATA_PREFIX"] = os.path.join(os.path.dirname(__file__), "tessdata")


# Set up Celery
celery = Celery(app.name, broker='redis://localhost:6379/0')

# Set up Redis
R = redis.Redis(host='localhost', port=6379, db=0)

# Set up RQ
Q = Queue(connection=R)

# Define the Background Task
def BackgroundTask(Files, Doctype):
    # Session Processing Code
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

    return jsonify(Session.Get()), 200, {"Content-Type": "application/json"};

# Configure Redis as the result backend
celery.conf.update(
    result_backend='redis://localhost:6379/0',
    result_backend_transport_options={'visibility_timeout': 3600},  # Optional: Set visibility timeout for results
    result_serializer='json',  # Optional: Set result serializer
    result_extended=True,  # Optional: Enable extended result attributes
    task_ignore_result=False,  # Optional: Enable task result tracking
    task_track_started=True,  # Optional: Enable task started tracking
)

# Route to the Home Page
@app.route("/")
def hello_world():
    return render_template("index.html")

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
        AllowedExtensions = {"pdf", "png", "jpg", "jpeg"}

        # Isolate the File Extension
        FileExtension = File.filename.rsplit(".", 1)[1].lower()

        # Check if the File Extension is Allowed
        if FileExtension not in AllowedExtensions:
            return jsonify({"error": "Invalid file extension."}), 400
        
    SavedFiles = []
    # Save the Files to a Temporary Folder
    for File in Files:
        # Unique Filename
        Filename = datetime.datetime.now().strftime("%Y%m%d%H%M%S%f")
        
        # Secure the Filename
        Filename = secure_filename(Filename + "." + File.filename.rsplit(".", 1)[1].lower())

        # Save the File
        File.save(os.path.join(app.config["UPLOAD_FOLDER"], Filename))
        
        # Append the Saved File to the List
        SavedFiles.append(Filename)

    # Queue the file processing task
    Task = ProcessSession.apply_async(args=[SavedFiles, Doctype])

    # Return the task ID to the client
    return jsonify({'Task_Id': Task.id}), 202

# Route for checking task status
@app.route('/api/task/<Task_Id>', methods=['GET'])
def TaskStatus(Task_Id):
    Task = ProcessSession.AsyncResult(Task_Id)
    if Task.state == 'PENDING':
        response = {
            'state': Task.state,
            'status': 'Pending...'
        }
    elif Task.state == "SUCCESS":
        response = {
            'state': Task.state,
            'status': str(Task.info),  # this is the result returned by the task
            'result': Task.get()  # this is the value returned by the task
        }  
    elif Task.state != 'FAILURE':
        response = {
            'state': Task.state,
            'status': str(Task.info),  # this is the result you returned from your task
        }
    else:
        # something went wrong in the background job
        response = {
            'state': Task.state,
            'status': str(Task.info),  # this contains the exception raised
        }

    
    return jsonify(response), 200

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
