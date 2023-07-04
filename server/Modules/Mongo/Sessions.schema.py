from pymongo import MongoClient
from pymongo.errors import CollectionInvalid
from collections import OrderedDict

db = MongoClient("mongodb://localhost:27019/")["mydatabase"]

# Session schema
Session_Schema = {
    "Session Id": {"type": "string", "required": True},
    "Document Type": {"type": "string", "required": True},
    "Uploads": {
        "type": "list",
        "schema": {
            "type": "dict",
            "schema": {
                "Upload Id": {"type": "string", "required": True},
                "File": {"type": "binary", "required": True},
            },
        },
        "required": True,
    },
    "Extraction": {
        "type": "dict",
        "schema": {
            "RAW": {
                "type": "string",
                "required": True,
            },
            "Corrected": {"type": "string", "required": True},
            "Description": {"type": "string", "required": True},
            "required": False,
        },
    },
    "Generation": {
        "type": "dict",
        "schema": {
            "Generated PDF Link": {"type": "string", "required": True},
            "Google Docs Link": {"type": "string", "required": True},
        },
        "required": False,
    },
    "Status": {"type": "string", "required": True},
}
