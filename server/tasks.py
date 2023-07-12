import time
import json
from Modules.SessionGenerator import SessionGenerator


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
            "status": "error",
            "message": ErrorMessage,
        }

    # Read the Document Content
    print("[...] Processing Task for OCR [...]")
    try:
        Session.Read()
        print("[OK] Processing Task for OCR Finished !")
    except Exception as e:
        ErrorMessage = str(e)
        Session.Error(ErrorMessage)
        return

    # Correct the Document Content
    try:
        Session.Correct()
        print("[OK] Processing Task for Correction Finished !")
    except Exception as e:
        ErrorMessage = str(e)
        Session.Error(ErrorMessage)
        print(f"[ERROR] {ErrorMessage}")
        return {
            "status": "error",
            "message": ErrorMessage,
        }

    # Load BSON Data from the database
    from bson import json_util

    def parse_json(Result):
        return json.loads(json_util.dumps(Result))

    print("[OK] Processing Task Finished !")

    return parse_json(Session.Get())
