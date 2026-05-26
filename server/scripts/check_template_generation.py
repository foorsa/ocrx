#!/usr/bin/env python3
import argparse
import json
import sys
import urllib.error
import urllib.parse
import urllib.request


DEFAULT_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzspNerlOkrZ5DqQf8Kp5YscJ55EzhQr6m0-Jn7JxSvijhHPWwAXBvlT6poBCH11uwvtg/exec"
DEFAULT_TEMPLATE_ID = "1G4MkDqydk7FppspfLYjH50mg2v15PGe0lj6GDX5drNY"


class NoRedirectHandler(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None


def _read_json_response(request, timeout=180, allow_redirects=True):
    opener = urllib.request.build_opener() if allow_redirects else urllib.request.build_opener(NoRedirectHandler)
    try:
        with opener.open(request, timeout=timeout) as response:
            status_code = response.status
            headers = response.headers
            body = response.read().decode("utf-8")
    except urllib.error.HTTPError as error:
        status_code = error.code
        headers = error.headers
        body = error.read().decode("utf-8", errors="replace")

    try:
        payload = json.loads(body)
    except json.JSONDecodeError:
        payload = {
            "status": "error",
            "message": "Non-JSON response",
            "bodyPreview": body[:300],
        }

    return status_code, headers, payload


def _direct_payload(template_id):
    return {
        "TemplateId": template_id,
        "Session": {
            "Session Id": "OCRX-TEMPLATE-HEALTH",
            "Operation Date": "Tuesday, 26 May 2026, 09:00AM UTC",
            "Document Type": "Baccalaureate-Certificate",
            "Information Type": "Regular",
            "Translation": {
                "Text": {
                    "Student Name": "OCRX Template Health Check",
                    "Birth Date": "01/01/2000",
                    "Birth Place": "Health Check",
                    "Diploma Number": "OCRX-TEMPLATE-HEALTH",
                    "Graduation Date": "26/05/2026",
                },
                "Tables": [],
            },
        },
    }


def _check_direct(script_url, template_id, deep):
    get_request = urllib.request.Request(script_url, headers={"Accept": "application/json"})
    status_code, headers, payload = _read_json_response(get_request)
    result = {
        "Status": "OK" if status_code == 200 and payload.get("status") == "success" else "Error",
        "Service": "OCRX Apps Script Direct Check",
        "Script URL": script_url,
        "Template Id": template_id,
        "Deep Check": bool(deep),
        "Checks": [
            {
                "name": "apps_script_reachable",
                "ok": status_code == 200 and payload.get("status") == "success",
                "statusCode": status_code,
                "response": payload,
            }
        ],
    }
    if result["Status"] != "OK" or not deep:
        return result

    body = json.dumps(_direct_payload(template_id)).encode("utf-8")
    post_request = urllib.request.Request(
        script_url,
        data=body,
        headers={"Content-Type": "application/json", "Accept": "application/json"},
        method="POST",
    )
    status_code, headers, payload = _read_json_response(post_request, allow_redirects=False)
    if status_code in (301, 302, 303, 307, 308):
        location = headers.get("Location")
        if location:
            status_code, headers, payload = _read_json_response(urllib.request.Request(location))
        else:
            payload = {"status": "error", "message": "Redirect missing Location header"}

    pdf_link = payload.get("pdfLink", "")
    doc_link = payload.get("docLink", "")
    ok = (
        status_code == 200
        and payload.get("status") == "success"
        and pdf_link.startswith("https://docs.google.com/document/")
        and doc_link.startswith("https://docs.google.com/document/")
    )
    result["Checks"].append({
        "name": "template_generation",
        "ok": ok,
        "statusCode": status_code,
        "response": payload,
    })
    if not ok:
        result["Status"] = "Error"
    return result


def main():
    parser = argparse.ArgumentParser(description="Check OCRX template generation health.")
    parser.add_argument(
        "--api-url",
        default="https://ocrx-api.foorsa.co",
        help="OCRX API base URL",
    )
    parser.add_argument(
        "--deep",
        action="store_true",
        help="Create a small canary document through Google Apps Script.",
    )
    parser.add_argument(
        "--direct",
        action="store_true",
        help="Check the Google Apps Script URL directly instead of the OCRX API endpoint.",
    )
    parser.add_argument(
        "--script-url",
        default=DEFAULT_SCRIPT_URL,
        help="Google Apps Script web app URL for direct checks.",
    )
    parser.add_argument(
        "--template-id",
        default=DEFAULT_TEMPLATE_ID,
        help="Google Docs template ID for direct deep checks.",
    )
    args = parser.parse_args()

    if args.direct:
        payload = _check_direct(args.script_url, args.template_id, args.deep)
        print(json.dumps(payload, indent=2))
        failed = [check for check in payload.get("Checks", []) if not check.get("ok")]
        return 0 if payload.get("Status") == "OK" and not failed else 1

    query = "?deep=1" if args.deep else ""
    url = urllib.parse.urljoin(args.api_url.rstrip("/") + "/", "api/v1/health/templates") + query

    try:
        status_code, headers, payload = _read_json_response(urllib.request.Request(url))
    except Exception as error:
        print(f"Template health check request failed: {error}", file=sys.stderr)
        return 2

    print(json.dumps(payload, indent=2))

    if status_code != 200 or payload.get("Status") != "OK":
        return 1

    failed = [check for check in payload.get("Checks", []) if not check.get("ok")]
    if failed:
        return 1

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
