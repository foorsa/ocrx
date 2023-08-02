import { Doctype } from "./Document Type";

interface Session {
    "Session Id": string;
    "Operation Date"?: string;
    "Document Type"?: string;
    "Information Type"?: "Regular" | "Tabular";
    "Status"?: string;
    "Error"?: any;
    "Uploads"?: {
        "File": string;
        "Upload Id": {
            "$oid": string;
        };
    }[];
    "Extraction"?: {
        "Text": string;
        "Tables"?: [];
    },
    "Correction"?: {
        "Text": {
            [key: string]: string;
        };
        "Tables"?: [];
    },
    "Translation"?: {
        "Text": {
            [key: string]: string;
        };
        "Tables"?: [];
    },
    "Generation"?: {
        "PDF Link": string;
        "Google Docs Link": string;
        "Preview Link": string;
    }
}

export type { Session };

