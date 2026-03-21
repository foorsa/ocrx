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
    send_from_directory,
    Response,
)
from flask_cors import CORS, cross_origin
from werkzeug.utils import secure_filename
import json
import datetime
import os
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
        # Filename should be the unique identifier of the file
        ID = datetime.datetime.now().strftime("%Y%m%d%H%M%S%f")
        Filename = secure_filename(ID + "." + File.filename.rsplit(".", 1)[1].lower())

        FilePath = os.path.join(UPLOAD_FOLDER, Filename)
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


# COMBINED PROCESSING API - Single endpoint that performs all steps at once
@API_BLUEPRINT.route("/api/v1/process", methods=["POST"])
def Process():
    """
    Combined endpoint: Initialize → Extract → Correct → Translate in one request.
    Parallelizes text/table operations where possible to minimize total latency.
    """
    from concurrent.futures import ThreadPoolExecutor, as_completed
    import traceback
    import time

    t_start = time.time()
    print("[PROCESS] Starting combined document processing pipeline")

    # --- Validation (same as Initialize) ---
    if "file" not in request.files or "document_type" not in request.form:
        return jsonify({"error": "File and Document Type fields are required."}), 400

    Files = request.files.getlist("file")
    Doctype = request.form["document_type"]

    for File in Files:
        AllowedExtensions = {"pdf", "png", "jpg", "jpeg"}
        FileExtension = File.filename.rsplit(".", 1)[1].lower()
        if FileExtension not in AllowedExtensions:
            return jsonify({"error": "Invalid file extension."}), 400

    # --- Save files ---
    SavedFiles = []
    for File in Files:
        ID = datetime.datetime.now().strftime("%Y%m%d%H%M%S%f")
        Filename = secure_filename(ID + "." + File.filename.rsplit(".", 1)[1].lower())
        FilePath = os.path.join(UPLOAD_FOLDER, Filename)
        File.save(FilePath)
        SavedFiles.append(FilePath)

    # --- Initialize Session (skip DB write — deferred to final save) ---
    Session = SessionGenerator()
    Session.Initialize(Doctype, SavedFiles, skip_db_write=True)
    t_init = time.time()
    print(f"[PROCESS] Session {Session.Get()['Session Id']} initialized (in-memory) [{t_init - t_start:.1f}s]")

    is_tabular = Session.Get()["Information Type"] == "Tabular"

    # --- Extract Text + Tables in parallel (for tabular docs) ---
    extract_errors = []

    def extract_text_task():
        try:
            Session.ExtractText(skip_db_write=True)
            print(f"[PROCESS] Text extraction complete [{time.time() - t_init:.1f}s]")
        except Exception as e:
            extract_errors.append(("text", e))

    def extract_tables_task():
        try:
            Session.ExtractTables(skip_db_write=True)
            print(f"[PROCESS] Table extraction complete [{time.time() - t_init:.1f}s]")
        except Exception as e:
            extract_errors.append(("tables", e))

    if is_tabular:
        # Text + Table extraction are independent — run in parallel
        with ThreadPoolExecutor(max_workers=2) as executor:
            futures = [
                executor.submit(extract_text_task),
                executor.submit(extract_tables_task),
            ]
            for f in as_completed(futures):
                f.result()
    else:
        extract_text_task()

    t_extract = time.time()
    print(f"[PROCESS] Extraction phase done [{t_extract - t_start:.1f}s total]")

    if extract_errors:
        error_msg = "; ".join(f"{t}: {e}" for t, e in extract_errors)
        Session.Error(error_msg)
        Session.SaveToDatabase()
        return jsonify({"Session": Session.Get(), "Error": error_msg}), 500

    # --- Combined Correct + Translate in parallel (one GPT call per type) ---
    ct_errors = []

    def correct_and_translate_text_task():
        try:
            Session.CorrectAndTranslateText(skip_db_write=True)
            print(f"[PROCESS] Text correction + translation complete [{time.time() - t_extract:.1f}s]")
        except Exception as e:
            ct_errors.append(("text", e))

    def correct_and_translate_tables_task():
        try:
            Session.CorrectAndTranslateTables(skip_db_write=True)
            print(f"[PROCESS] Table correction + translation complete [{time.time() - t_extract:.1f}s]")
        except Exception as e:
            ct_errors.append(("tables", e))

    if is_tabular:
        with ThreadPoolExecutor(max_workers=2) as executor:
            futures = [
                executor.submit(correct_and_translate_text_task),
                executor.submit(correct_and_translate_tables_task),
            ]
            for f in as_completed(futures):
                f.result()
    else:
        correct_and_translate_text_task()

    t_correct = time.time()
    print(f"[PROCESS] Correct+Translate phase done [{t_correct - t_extract:.1f}s, {t_correct - t_start:.1f}s total]")

    if ct_errors:
        error_msg = "; ".join(f"{t}: {e}" for t, e in ct_errors)
        Session.Error(error_msg)
        Session.SaveToDatabase()
        return jsonify({"Session": Session.Get(), "Error": error_msg}), 500

    # Single DB write at the end with final state (upsert since Initialize was skipped)
    Session.SaveToDatabase()

    t_end = time.time()
    print(f"[PROCESS] Pipeline complete for session {Session.Get()['Session Id']} [{t_end - t_start:.1f}s total]")
    return jsonify({"Session": Session.Get()}), 200


# STREAMING PROCESSING API - SSE endpoint for real-time progress
@API_BLUEPRINT.route("/api/v1/process-stream", methods=["POST", "OPTIONS"])
@cross_origin()
def ProcessStream():
    """
    SSE streaming endpoint: Initialize -> Extract -> Correct+Translate with real-time progress.
    Returns Server-Sent Events with phase updates and streamed GPT output.
    """
    from concurrent.futures import ThreadPoolExecutor, as_completed
    from Modules.Classes.Utilities.GPTPrompts import (
        StreamTextCorrectionAndTranslation,
        StreamTableCorrectionAndTranslation,
    )
    import traceback
    import time
    import queue
    import threading

    # --- Validation (same as Process) ---
    if "file" not in request.files or "document_type" not in request.form:
        return jsonify({"error": "File and Document Type fields are required."}), 400

    Files = request.files.getlist("file")
    Doctype = request.form["document_type"]

    for File in Files:
        AllowedExtensions = {"pdf", "png", "jpg", "jpeg"}
        FileExtension = File.filename.rsplit(".", 1)[1].lower()
        if FileExtension not in AllowedExtensions:
            return jsonify({"error": "Invalid file extension."}), 400

    # --- Save files ---
    SavedFiles = []
    for File in Files:
        ID = datetime.datetime.now().strftime("%Y%m%d%H%M%S%f")
        Filename = secure_filename(ID + "." + File.filename.rsplit(".", 1)[1].lower())
        FilePath = os.path.join(UPLOAD_FOLDER, Filename)
        File.save(FilePath)
        SavedFiles.append(FilePath)

    # --- Initialize Session ---
    Session = SessionGenerator()
    Session.Initialize(Doctype, SavedFiles, skip_db_write=True)

    def sse_event(data):
        """Format a dict as an SSE data line."""
        return f"data: {json.dumps(data)}\n\n"

    def generate():
        t_start = time.time()
        try:
            session_data = Session.Get()
            session_id = session_data["Session Id"]
            is_tabular = session_data["Information Type"] == "Tabular"

            # Phase: initialized
            yield sse_event({"phase": "initialized", "sessionId": session_id})

            # Phase: extracting
            yield sse_event({"phase": "extracting"})

            accumulated_json = ""
            table_accumulated = ""
            event_queue = queue.Queue()

            if is_tabular:
                # --- PIPELINED: extraction → correction overlap ---
                # Each extraction feeds its correction immediately via the shared queue.
                # Text OCR (~11s) and table extraction (~4s) run in parallel.
                # As soon as tables finish (~4s), table correction starts while text OCR continues.
                # As soon as text OCR finishes (~11s), text correction starts while table correction continues.
                # This overlaps extraction and correction phases for maximum speed.

                text_extracted = threading.Event()
                tables_extracted = threading.Event()
                extracted_text_holder = [None]  # mutable container for thread result
                extracted_tables_holder = [None]
                pipeline_errors = []

                def extract_and_correct_text():
                    try:
                        Session.ExtractText(skip_db_write=True)
                        raw_text = Session.session.get("Extraction", {}).get("Text", "")
                        extracted_text_holder[0] = raw_text
                        text_extracted.set()
                        # Immediately start text correction in this same thread
                        for partial in StreamTextCorrectionAndTranslation(Doctype, raw_text):
                            event_queue.put(("text", partial))
                        event_queue.put(("text_done", None))
                    except Exception as e:
                        text_extracted.set()
                        pipeline_errors.append(("text", e))
                        event_queue.put(("error", f"text: {e}"))
                        event_queue.put(("text_done", None))

                def extract_and_correct_tables():
                    try:
                        Session.ExtractTables(skip_db_write=True)
                        tables = Session.session.get("Extraction", {}).get("Tables", [])
                        extracted_tables_holder[0] = tables
                        tables_extracted.set()
                        # Immediately start table correction in this same thread
                        if tables:
                            for partial in StreamTableCorrectionAndTranslation(Doctype, tables):
                                event_queue.put(("table", partial))
                        event_queue.put(("table_done", None))
                    except Exception as e:
                        tables_extracted.set()
                        pipeline_errors.append(("tables", e))
                        event_queue.put(("error", f"tables: {e}"))
                        event_queue.put(("table_done", None))

                t1 = threading.Thread(target=extract_and_correct_text, daemon=True)
                t2 = threading.Thread(target=extract_and_correct_tables, daemon=True)
                t1.start()
                t2.start()

                # Wait briefly for extraction to start, then send extracted event when text is ready
                text_extracted.wait(timeout=120)
                if extracted_text_holder[0] is not None:
                    yield sse_event({"phase": "extracted", "textLength": len(extracted_text_holder[0])})
                tables_extracted.wait(timeout=120)
                if extracted_tables_holder[0] is not None:
                    yield sse_event({"phase": "tables_extracted"})

                if pipeline_errors:
                    # Check if both failed
                    text_failed = any(t == "text" for t, _ in pipeline_errors)
                    table_failed = any(t == "tables" for t, _ in pipeline_errors)
                    if text_failed:
                        error_msg = "; ".join(f"{t}: {e}" for t, e in pipeline_errors)
                        yield sse_event({"phase": "error", "message": error_msg})
                        return

                # Stream correction results from both workers
                done_count = 0
                while done_count < 2:
                    try:
                        kind, data = event_queue.get(timeout=120)
                    except queue.Empty:
                        break
                    if kind == "text":
                        accumulated_json += data
                        yield sse_event({"phase": "streaming", "partial": accumulated_json})
                    elif kind == "table":
                        table_accumulated += data
                        yield sse_event({"phase": "streaming", "partial": table_accumulated, "type": "tables"})
                    elif kind in ("text_done", "table_done"):
                        done_count += 1
                    elif kind == "error":
                        print(f"[STREAM] Pipeline error: {data}")

                t1.join(timeout=5)
                t2.join(timeout=5)
            else:
                # Non-tabular: extract text then stream correction
                try:
                    Session.ExtractText(skip_db_write=True)
                except Exception as e:
                    yield sse_event({"phase": "error", "message": f"text: {e}"})
                    return

                raw_ocr_text = Session.session.get("Extraction", {}).get("Text", "")
                yield sse_event({"phase": "extracted", "textLength": len(raw_ocr_text)})

                for partial in StreamTextCorrectionAndTranslation(Doctype, raw_ocr_text):
                    accumulated_json += partial
                    yield sse_event({"phase": "streaming", "partial": accumulated_json})

            # Parse the completed text result — write directly to Session.session
            # (Session.Get() returns a deep copy, so we must mutate the internal dict)
            try:
                text_parsed = json.loads(accumulated_json)
                corrected_text = text_parsed.get("corrected", text_parsed)
                translated_text = text_parsed.get("translated", text_parsed)

                Session.session["Correction"] = {"Text": corrected_text}
                Session.session["Translation"] = {"Text": translated_text}
                Session.session["Status"] = "Translated"
            except json.JSONDecodeError as e:
                print(f"[STREAM] Failed to parse text JSON: {e}")

            # Parse the completed table result
            if is_tabular and table_accumulated:
                try:
                    table_parsed = json.loads(table_accumulated)
                    corrected_tables = table_parsed.get("corrected", table_parsed)
                    translated_tables = table_parsed.get("translated", table_parsed)

                    if "Correction" not in Session.session:
                        Session.session["Correction"] = {}
                    Session.session["Correction"]["Tables"] = corrected_tables
                    if "Translation" not in Session.session:
                        Session.session["Translation"] = {}
                    Session.session["Translation"]["Tables"] = translated_tables
                except json.JSONDecodeError as e:
                    print(f"[STREAM] Failed to parse table JSON: {e}")

            # Save to database
            Session.SaveToDatabase()

            t_end = time.time()
            print(f"[STREAM] Pipeline complete for session {session_id} [{t_end - t_start:.1f}s total]")

            # Phase: complete
            yield sse_event({"phase": "complete", "session": Session.Get()})

        except Exception as e:
            print(f"[STREAM] Error: {traceback.format_exc()}")
            yield sse_event({"phase": "error", "message": str(e)})

    resp = Response(generate(), mimetype="text/event-stream")
    resp.headers["Cache-Control"] = "no-cache"
    resp.headers["X-Accel-Buffering"] = "no"
    resp.headers["Connection"] = "keep-alive"
    return resp


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


@API_BLUEPRINT.route("/api/v1/generate-document", methods=["POST"])
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

    if (
        not Session.Get()["Status"] == "Translated"
        and not Session.Get()["Status"] == "Generated"
    ):
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
@API_BLUEPRINT.route("/api/v1/extract-tables", methods=["POST"])
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


@API_BLUEPRINT.route("/api/v1/correct-tables", methods=["POST"])
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


@API_BLUEPRINT.route("/api/v1/translate-tables", methods=["POST"])
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


# Download endpoint for locally generated documents
@API_BLUEPRINT.route("/api/v1/download/<filename>", methods=["GET"])
def DownloadFile(filename):
    download_folder = os.path.join(os.path.dirname(__file__), "..", "Downloads")
    if not os.path.exists(os.path.join(download_folder, filename)):
        return jsonify({"error": "File not found"}), 404
    mimetype = "application/pdf" if filename.endswith(".pdf") else \
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    return send_from_directory(
        download_folder,
        filename,
        as_attachment=True,
        mimetype=mimetype,
    )
