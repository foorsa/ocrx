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
import json
import dotenv

# Modules
from Modules.SessionGenerator import SessionGenerator
from Routes import API_BLUEPRINT

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

    # Configuration for views Folder
    Blueprint("views", __name__, template_folder="templates")

    # Create The Upload Folder if it doesn't exist
    if not os.path.exists(FlaskApp.config["UPLOAD_FOLDER"]):
        os.makedirs(FlaskApp.config["UPLOAD_FOLDER"])

    WindowsTessData = os.path.join(os.path.dirname(__file__), "tessdata")

    # Load the traineddata file for Tesseract - Contains the language models (e.g., English, French, Arabic, etc.)
    os.environ["TESSDATA_PREFIX"] = WindowsTessData

    # Register the blueprint for API routes
    FlaskApp.register_blueprint(API_BLUEPRINT)

    # Rest of your app configuration
    return FlaskApp


FlaskApp = CreateFlaskApp()


@FlaskApp.route("/")
def hello_world():
    return render_template("index.html")
