import { Doctype } from "./Document Type";

interface Session {
    "Session Id": string;
    "Document Type"?: string;
    "Status"?: string;
    "Error"?: any;
    "Uploads"?: {
        "File": string;
        "Upload Id": {
            "$oid": string;
        };
    }[];
    "Extraction"?: {
        "Corrected"?: string;
        "RAW"?: string;
        "Description": string;
    },
    "Generation"?: {
        "PDF Link": string;
        "Google Docs Link": string;
    }
}

export type { Session };

