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
import tempfile
from flask import Blueprint, jsonify, request

# Import any other required modules
from Modules.SessionGenerator import SessionGenerator
from Config import UPLOAD_FOLDER, DOWNLOAD_FOLDER

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
    from Modules.Classes.Utilities.GPTPrompts import (
        StreamTextCorrectionAndTranslation,
        StreamTextAndTablesFromText,
        StreamVisionExtractAll,
    )
    import traceback
    import time
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

            # --- Prepare page images for combined vision call ---
            # Convert PDF pages to base64 images ONCE, then send directly to GPT
            # This eliminates the separate OCR step (saves ~11s)
            from Modules.Classes.OCRProcessor import OCR as _ocr_singleton
            from PyPDF2 import PdfReader as _PdfReader
            from pdf2image import convert_from_path
            from PIL import Image as _PILImage
            import io as _io

            base64_images = []
            has_embedded_text = False
            embedded_text = ""

            for File in Session.session.get("Uploads", []):
                file_id = File["Upload Id"]
                cached = Session._get_file_bytes(file_id)
                ext = cached["filename"].rsplit(".", 1)[1].lower()

                if ext == "pdf":
                    pdf_bytes = _io.BytesIO(cached["bytes"])
                    # Check for embedded text first (digital PDFs)
                    pdf_bytes.seek(0)
                    reader = _PdfReader(pdf_bytes)
                    direct_text = ""
                    for page in reader.pages:
                        page_text = page.extract_text()
                        if page_text:
                            direct_text += page_text

                    if direct_text.strip():
                        has_embedded_text = True
                        embedded_text = direct_text
                        print(f"[OCR] Extracted text directly from PDF ({len(direct_text)} chars)")
                    else:
                        # Scanned PDF: convert to images for vision
                        print("[OCR] No embedded text, converting pages for vision...")
                        TEMP_PATH = os.path.join(tempfile.gettempdir(), f"{session_id}_stream.pdf")
                        pdf_bytes.seek(0)
                        with open(TEMP_PATH, "wb") as f:
                            f.write(pdf_bytes.getbuffer())
                        pages = convert_from_path(TEMP_PATH, 100)
                        for page in pages:
                            base64_images.append(_ocr_singleton._image_to_base64(page))
                            page.close()
                        os.remove(TEMP_PATH)

                elif ext in {"png", "jpg", "jpeg"}:
                    img = _PILImage.open(_io.BytesIO(cached["bytes"]))
                    base64_images.append(_ocr_singleton._image_to_base64(img))
                    img.close()

            # --- SINGLE GPT CALL for everything (fields + tables if tabular) ---
            yield sse_event({"phase": "extracted", "textLength": 0})
            if is_tabular:
                yield sse_event({"phase": "tables_extracted"})

            if has_embedded_text:
                # Digital PDF with embedded text
                Session.session["Extraction"]["Text"] = embedded_text
                if is_tabular:
                    # SINGLE GPT call: extracts fields + tables from text (no ExtractTable API)
                    for partial in StreamTextAndTablesFromText(Doctype, embedded_text):
                        accumulated_json += partial
                        yield sse_event({"phase": "streaming", "partial": accumulated_json})
                else:
                    for partial in StreamTextCorrectionAndTranslation(Doctype, embedded_text):
                        accumulated_json += partial
                        yield sse_event({"phase": "streaming", "partial": accumulated_json})

            elif base64_images:
                # Scanned PDF: ONE vision call extracts fields + tables together
                for partial in StreamVisionExtractAll(Doctype, base64_images, is_tabular=is_tabular):
                    accumulated_json += partial
                    yield sse_event({"phase": "streaming", "partial": accumulated_json})
            else:
                yield sse_event({"phase": "error", "message": "No content to extract"})
                return

            # Parse results and populate session
            try:
                parsed = json.loads(accumulated_json)

                if is_tabular:
                    # Both vision and text calls return {"fields": {...}, "tables": {...}}
                    fields = parsed.get("fields", parsed)
                    tables = parsed.get("tables", None)

                    Session.session["Correction"] = {"Text": fields}
                    Session.session["Translation"] = {"Text": fields}
                    if tables:
                        Session.session["Correction"]["Tables"] = tables
                        Session.session["Translation"]["Tables"] = tables
                else:
                    # Flat field JSON (non-tabular)
                    Session.session["Correction"] = {"Text": parsed}
                    Session.session["Translation"] = {"Text": parsed}

                Session.session["Status"] = "Translated"
            except json.JSONDecodeError as e:
                print(f"[STREAM] Failed to parse JSON: {e}")

            # Save to database in background thread (don't block SSE response)
            threading.Thread(target=Session.SaveToDatabase, daemon=True).start()

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
    if not os.path.exists(os.path.join(DOWNLOAD_FOLDER, filename)):
        return jsonify({"error": "File not found"}), 404
    mimetype = "application/pdf" if filename.endswith(".pdf") else \
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    return send_from_directory(
        DOWNLOAD_FOLDER,
        filename,
        as_attachment=True,
        mimetype=mimetype,
    )
