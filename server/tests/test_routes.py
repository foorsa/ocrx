import io
import os
import sys
import types

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

import pytest
from flask import Flask


class _FakeSession:
    instances = []
    known_ids = set()

    def __init__(self):
        self.session = None
        self.initialized_with = None
        _FakeSession.instances.append(self)

    def Set(self, Session_Id):
        if Session_Id in _FakeSession.known_ids:
            self.session = {"Status": "Initialized", "Session Id": Session_Id}
            return True
        return False

    def Get(self):
        return self.session

    def Initialize(self, Doctype, Files, skip_db_write=False):
        self.initialized_with = (Doctype, list(Files))
        self.session = {"Session Id": "LLS-TEST-TRS", "Status": "Initialized"}


# Routes imports SessionGenerator, which connects to MongoDB at import time.
_fake_module = types.ModuleType("Modules.SessionGenerator")
_fake_module.SessionGenerator = _FakeSession
sys.modules["Modules.SessionGenerator"] = _fake_module

import Routes  # noqa: E402


@pytest.fixture
def client(tmp_path, monkeypatch):
    monkeypatch.setattr(Routes, "UPLOAD_FOLDER", str(tmp_path))
    _FakeSession.instances.clear()
    _FakeSession.known_ids = set()
    app = Flask(__name__)
    app.config["MAX_CONTENT_LENGTH"] = 1024 * 1024
    app.register_blueprint(Routes.API_BLUEPRINT)
    return app.test_client()


def _post(client, files, doctype="Baccalaureate-Certificate"):
    data = {"file": files}
    if doctype is not None:
        data["document_type"] = doctype
    return client.post("/api/v1/initialize", data=data, content_type="multipart/form-data")


def test_initialize_rejects_filename_without_extension(client):
    response = _post(client, [(io.BytesIO(b"x"), "scan")])
    assert response.status_code == 400
    assert response.get_json()["error"] == "Invalid file extension."


def test_initialize_requires_document_type(client):
    response = _post(client, [(io.BytesIO(b"x"), "scan.png")], doctype=None)
    assert response.status_code == 400


def test_initialize_rejects_oversized_body(client):
    response = _post(client, [(io.BytesIO(b"x" * (2 * 1024 * 1024)), "big.png")])
    assert response.status_code == 413


def test_initialize_rejects_too_many_files(client, monkeypatch):
    monkeypatch.setattr(Routes, "MAX_FILES_PER_REQUEST", 2)
    files = [(io.BytesIO(b"x"), f"scan{i}.png") for i in range(3)]
    response = _post(client, files)
    assert response.status_code == 400


def test_initialize_rejects_unreadable_pdf_and_cleans_up(client, tmp_path):
    response = _post(client, [(io.BytesIO(b"not a pdf"), "scan.pdf")])
    assert response.status_code == 400
    assert os.listdir(tmp_path) == []


def test_initialize_rejects_pdf_over_page_limit(client, tmp_path, monkeypatch):
    monkeypatch.setattr(Routes, "MAX_PDF_PAGES", 2)
    monkeypatch.setattr(Routes, "_pdf_page_count", lambda path: 3)
    response = _post(client, [(io.BytesIO(b"%PDF"), "scan.pdf")])
    assert response.status_code == 400
    assert "too many pages" in response.get_json()["error"]
    assert os.listdir(tmp_path) == []


def test_initialize_uses_unique_names_and_removes_local_copies(client, tmp_path):
    files = [(io.BytesIO(b"a"), "a.png"), (io.BytesIO(b"b"), "b.jpg")]
    response = _post(client, files)
    assert response.status_code == 200

    _, saved = _FakeSession.instances[-1].initialized_with
    assert len(set(os.path.basename(p) for p in saved)) == 2
    assert [p.rsplit(".", 1)[1] for p in saved] == ["png", "jpg"]
    assert os.listdir(tmp_path) == []


@pytest.mark.parametrize(
    "path",
    [
        "/api/v1/extract-text",
        "/api/v1/correct-text",
        "/api/v1/translate-text",
        "/api/v1/extract-tables",
        "/api/v1/correct-tables",
        "/api/v1/translate-tables",
    ],
)
def test_step_routes_return_404_for_unknown_session(client, path):
    response = client.post(path + "?Session_Id=LLS-NOPE-TRS")
    assert response.status_code == 404


def test_step_routes_require_session_id(client):
    response = client.post("/api/v1/extract-text")
    assert response.status_code == 400


def test_generate_rejects_non_object_values(client):
    _FakeSession.known_ids = {"LLS-OK-TRS"}

    def translated_set(self, Session_Id):
        self.session = {"Status": "Translated", "Translation": {"Text": {}}}
        return True

    _FakeSession.Set = translated_set
    try:
        response = client.post(
            "/api/v1/generate-document?Session_Id=LLS-OK-TRS",
            json={"Values": ["not", "a", "dict"]},
        )
    finally:
        del _FakeSession.Set
    assert response.status_code == 400


def test_deep_health_check_requires_token_when_configured(client, monkeypatch):
    monkeypatch.setenv("TEMPLATE_HEALTH_TOKEN", "s3cret")
    called = []
    monkeypatch.setattr(Routes, "check_template_service", lambda **kw: called.append(kw) or {"Status": "OK"})

    assert client.get("/api/v1/health/templates?deep=1").status_code == 401
    assert called == []

    response = client.get("/api/v1/health/templates?deep=1", headers={"X-Health-Token": "s3cret"})
    assert response.status_code == 200
    assert called and called[0]["deep"] is True
