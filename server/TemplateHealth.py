import os
from datetime import UTC, datetime

import requests

from PDFGenerator import TemplateIDs


DEFAULT_DOCUMENT_TYPE = "Baccalaureate-Certificate"


def _json_response(response):
    try:
        return response.json()
    except ValueError:
        return {
            "status": "error",
            "message": "Template service returned non-JSON response",
            "contentType": response.headers.get("content-type", ""),
            "bodyPreview": response.text[:300],
        }


def _fetch_apps_script(payload=None, timeout=60):
    url = os.environ.get("GOOGLE_SCRIPT_URL")
    if not url:
        return {
            "ok": False,
            "statusCode": None,
            "payload": {
                "status": "error",
                "message": "GOOGLE_SCRIPT_URL is not configured",
            },
        }

    if payload is None:
        response = requests.get(url, timeout=timeout)
    else:
        response = requests.post(url, json=payload, allow_redirects=False, timeout=timeout)
        if response.status_code in (301, 302, 303, 307, 308):
            redirect_url = response.headers.get("Location")
            if not redirect_url:
                return {
                    "ok": False,
                    "statusCode": response.status_code,
                    "payload": {
                        "status": "error",
                        "message": "Google Apps Script redirected without a Location header",
                    },
                }
            response = requests.get(redirect_url, timeout=timeout)

    payload = _json_response(response)
    return {
        "ok": response.status_code == 200 and payload.get("status") == "success",
        "statusCode": response.status_code,
        "payload": payload,
    }


def _canary_session(document_type):
    now = datetime.now(UTC).strftime("%A, %d %B %Y, %I:%M%p UTC")
    return {
        "Session Id": "OCRX-TEMPLATE-HEALTH",
        "Operation Date": now,
        "Document Type": document_type,
        "Information Type": "Regular",
        "Translation": {
            "Text": {
                "Student Name": "OCRX Template Health Check",
                "Birth Date": "01/01/2000",
                "Birth Place": "Health Check",
                "Diploma Number": "OCRX-TEMPLATE-HEALTH",
                "Graduation Date": now,
            },
            "Tables": [],
        },
    }


def check_template_service(deep=False, document_type=None):
    document_type = document_type or os.environ.get(
        "TEMPLATE_HEALTH_DOCUMENT_TYPE",
        DEFAULT_DOCUMENT_TYPE,
    )
    template_id = TemplateIDs.get(document_type)

    result = {
        "Status": "OK",
        "Service": "OCRX Template Generation",
        "Document Type": document_type,
        "Template Id": template_id,
        "Deep Check": bool(deep),
        "Checks": [],
    }

    if not template_id:
        result["Status"] = "Error"
        result["Checks"].append({
            "name": "template_id",
            "ok": False,
            "message": f"No template ID configured for {document_type}",
        })
        return result

    light = _fetch_apps_script(timeout=30)
    result["Checks"].append({
        "name": "apps_script_reachable",
        "ok": light["ok"],
        "statusCode": light["statusCode"],
        "response": light["payload"],
    })

    if not light["ok"]:
        result["Status"] = "Error"
        return result

    if not deep:
        return result

    payload = {
        "TemplateId": template_id,
        "Session": _canary_session(document_type),
    }
    template = _fetch_apps_script(payload=payload, timeout=120)
    response_payload = template["payload"]
    pdf_link = response_payload.get("pdfLink", "")
    doc_link = response_payload.get("docLink", "")
    template_ok = (
        template["ok"]
        and pdf_link.startswith("https://docs.google.com/document/")
        and doc_link.startswith("https://docs.google.com/document/")
    )

    result["Checks"].append({
        "name": "template_generation",
        "ok": template_ok,
        "statusCode": template["statusCode"],
        "response": response_payload,
    })

    if not template_ok:
        result["Status"] = "Error"

    return result
