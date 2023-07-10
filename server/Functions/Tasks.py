# Processing Task
from flask import jsonify
from Modules.SessionGenerator import SessionGenerator
import json

# Session Processing Code
def ProcessingTask(Files, Doctype):
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