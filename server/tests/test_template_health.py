import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

import TemplateHealth as template_health


class _Response:
    def __init__(self, status_code, payload=None, headers=None, text=None):
        self.status_code = status_code
        self._payload = payload
        self.headers = headers or {}
        self.text = text or ""

    def json(self):
        if self._payload is None:
            raise ValueError("not json")
        return self._payload


def test_light_health_fails_when_google_script_url_missing(monkeypatch):
    monkeypatch.delenv("GOOGLE_SCRIPT_URL", raising=False)

    result = template_health.check_template_service()

    assert result["Status"] == "Error"
    assert result["Checks"][0]["response"]["message"] == "GOOGLE_SCRIPT_URL is not configured"


def test_light_health_detects_authorized_apps_script(monkeypatch):
    monkeypatch.setenv("GOOGLE_SCRIPT_URL", "https://script.google.com/macros/s/test/exec")

    def fake_get(url, timeout):
        return _Response(200, {"status": "success", "message": "Service is running"})

    monkeypatch.setattr(template_health.requests, "get", fake_get)

    result = template_health.check_template_service()

    assert result["Status"] == "OK"
    assert result["Checks"][0]["name"] == "apps_script_reachable"
    assert result["Checks"][0]["ok"] is True


def test_light_health_fails_on_google_html_error(monkeypatch):
    monkeypatch.setenv("GOOGLE_SCRIPT_URL", "https://script.google.com/macros/s/test/exec")

    def fake_get(url, timeout):
        return _Response(403, None, {"content-type": "text/html"}, "<html>Access denied</html>")

    monkeypatch.setattr(template_health.requests, "get", fake_get)

    result = template_health.check_template_service()

    assert result["Status"] == "Error"
    assert result["Checks"][0]["ok"] is False
    assert "non-JSON" in result["Checks"][0]["response"]["message"]


def test_deep_health_requires_google_docs_links(monkeypatch):
    monkeypatch.setenv("GOOGLE_SCRIPT_URL", "https://script.google.com/macros/s/test/exec")

    calls = []

    def fake_get(url, timeout):
        calls.append(("get", url))
        return _Response(
            200,
            {
                "status": "success",
                "docLink": "https://docs.google.com/document/d/doc-id",
                "pdfLink": "https://docs.google.com/document/d/doc-id/export?format=pdf",
                "previewLink": "https://docs.google.com/document/d/doc-id/preview",
            } if "googleusercontent" in url else {"status": "success", "message": "Service is running"},
        )

    def fake_post(url, **kwargs):
        calls.append(("post", url, kwargs))
        return _Response(
            302,
            headers={"Location": "https://script.googleusercontent.com/macros/echo"},
        )

    monkeypatch.setattr(template_health.requests, "get", fake_get)
    monkeypatch.setattr(template_health.requests, "post", fake_post)

    result = template_health.check_template_service(deep=True)

    assert result["Status"] == "OK"
    assert result["Checks"][1]["name"] == "template_generation"
    assert result["Checks"][1]["ok"] is True
    assert calls[1][2]["allow_redirects"] is False
