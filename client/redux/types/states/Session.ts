import { Doctype } from "./Document Type";

interface Session {
    "Session Id": string;
    "Operation Date": string;
    "Document Type"?: string;
    "Information Type": "Regular" | "Tabular";
    "Status"?: string;
    "Error"?: any;
    "Uploads"?: {
        "File": string;
        "Upload Id": {
            "$oid": string;
        };
    }[];
    "Extraction"?: {
        "RAW"?: string;
        "RAW_TABLES": {}[] | any;
        "Corrected"?: {
            [key: string]: string;
        };
        "CorrectedTable"?: {}[] | any;
        "Description": string;
    },
    "Generation"?: {
        "PDF Link": string;
        "Google Docs Link": string;
        "Preview Link": string;
    }
}

export type { Session };

