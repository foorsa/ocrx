import { Doctype } from "./Document Type";

export type TableCell = {
    value: string;
    colspan?: number;
    rowspan?: number;
};

export type TableRow = TableCell[] | string[];

export type TableData = {
    headers?: TableRow;
    rows: TableRow[];
};

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
        "Tables"?: TableData[];
    },
    "Correction"?: {
        "Text": {
            [key: string]: string;
        };
        "Tables"?: TableData[];
    },
    "Translation"?: {
        "Text": {
            [key: string]: string;
        };
        "Tables"?: TableData[];
    },
    "Generation"?: {
        "PDF Link": string;
        "Google Docs Link": string;
        "Preview Link": string;
    }
}

export type { Session };

