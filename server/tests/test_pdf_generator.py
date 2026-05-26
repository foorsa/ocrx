import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

import PDFGenerator as pdf_generator_module
from PDFGenerator import PDFGenerator


class _Response:
    def __init__(self, status_code, payload=None, headers=None, reason="OK"):
        self.status_code = status_code
        self._payload = payload or {}
        self.headers = headers or {}
        self.reason = reason
        self.content = b"{}"

    def json(self):
        return self._payload


def _regular_session():
    return {
        "Session Id": "LLS-TEST-TRS",
        "Operation Date": "Tuesday, 26 May 2026, 12:00PM UTC",
        "Document Type": "Baccalaureate-Certificate",
        "Information Type": "Regular",
        "Translation": {
            "Text": {
                "Student Name": "Test Student",
                "Institute": "Test Institute",
            },
            "Tables": [],
        },
    }


def test_apps_script_redirect_keeps_generation_payload(monkeypatch):
    monkeypatch.setenv("GOOGLE_SCRIPT_URL", "https://script.google.com/macros/s/test/exec")
    monkeypatch.setitem(
        pdf_generator_module.TemplateIDs,
        "Baccalaureate-Certificate",
        "template-id",
    )

    calls = {}

    def fake_post(url, **kwargs):
        calls["post"] = {"url": url, "kwargs": kwargs}
        return _Response(
            302,
            headers={"Location": "https://script.googleusercontent.com/macros/echo"},
            reason="Found",
        )

    def fake_get(url, **kwargs):
        calls["get"] = {"url": url, "kwargs": kwargs}
        return _Response(
            200,
            {
                "status": "success",
                "pdfLink": "https://docs.google.com/document/d/doc-id/export?format=pdf",
                "docLink": "https://docs.google.com/document/d/doc-id",
                "previewLink": "https://docs.google.com/document/d/doc-id/preview",
            },
        )

    monkeypatch.setattr(pdf_generator_module.requests, "post", fake_post)
    monkeypatch.setattr(pdf_generator_module.requests, "get", fake_get)

    def fail_if_local_pdf_runs(self, session):
        raise AssertionError("template success should not generate a local PDF")

    monkeypatch.setattr(PDFGenerator, "_generate_local_pdf", fail_if_local_pdf_runs)

    result = PDFGenerator().Generate(_regular_session())

    assert calls["post"]["url"] == "https://script.google.com/macros/s/test/exec"
    assert calls["post"]["kwargs"]["json"]["TemplateId"] == "template-id"
    assert calls["post"]["kwargs"]["json"]["Session"]["Session Id"] == "LLS-TEST-TRS"
    assert calls["post"]["kwargs"]["allow_redirects"] is False
    assert calls["get"]["url"] == "https://script.googleusercontent.com/macros/echo"
    assert result["Google Docs Link"] == "https://docs.google.com/document/d/doc-id"
    assert result["Generation Source"] == "Template"
    assert "File Data" not in result
    assert "File Name" not in result


def test_fallback_local_pdf_supports_regular_documents(monkeypatch):
    class DummyDocxTableGenerator:
        def is_tabular(self, session):
            return False

        def generate_text_pdf(self, session):
            return "fallback.pdf", "ZmFrZQ=="

    monkeypatch.setattr(pdf_generator_module, "DocxTableGenerator", DummyDocxTableGenerator)

    result = PDFGenerator()._fallback_local_pdf(_regular_session())

    assert result["PDF Link"] == "/api/v1/download/fallback.pdf"
    assert result["Preview Link"] == "/api/v1/download/fallback.pdf"
    assert result["Generation Source"] == "Local"
    assert result["File Name"] == "fallback.pdf"
    assert result["File Data"] == "ZmFrZQ=="
