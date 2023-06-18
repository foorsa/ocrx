import { Doctype } from "./Document Type";

interface Session {
    sessionId: string;
    documentType?: string;
    fileName?: string;
    filePath?: string;
    publicFilePath?: string;
    status?: string;
    error?: string;
    RAW?: string;
    Description?: string;
    Corrected?: string;
}

export type { Session };

