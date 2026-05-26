#!/usr/bin/env python3
import argparse
import json
import sys
import urllib.error
import urllib.parse
import urllib.request


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
    args = parser.parse_args()

    query = "?deep=1" if args.deep else ""
    url = urllib.parse.urljoin(args.api_url.rstrip("/") + "/", "api/v1/health/templates") + query

    try:
        with urllib.request.urlopen(url, timeout=180) as response:
            status_code = response.status
            body = response.read().decode("utf-8")
    except urllib.error.HTTPError as error:
        status_code = error.code
        body = error.read().decode("utf-8", errors="replace")
    except Exception as error:
        print(f"Template health check request failed: {error}", file=sys.stderr)
        return 2

    try:
        payload = json.loads(body)
    except json.JSONDecodeError:
        print(f"Template health check returned non-JSON response ({status_code}): {body[:300]}", file=sys.stderr)
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
