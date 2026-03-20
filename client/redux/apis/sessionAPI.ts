import { getApiServerUrl } from '@/utils/getApiServerUrl';
import { FileType } from '../types/states/File';
import { Doctype } from '../types/states/Document Type';
import toast from 'react-hot-toast';
import Axios, { CancelTokenSource } from 'axios';
import { Session as SessionType } from '@/redux/types/states/Session';

const SERVER_API = getApiServerUrl();
const REQUEST_TIMEOUT = 120000; // 2 minutes


const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const executeOperationWithRetry: any = async (operationFunction: () => Promise<
    {
        Status: "Initialized" | "Extracted" | "Corrected" | "Translated" | "Generated" | "Failed";
        Error: string | null;
        Session: SessionType | null;
    }
>) => {
    const maxRetryAttempts = 5;
    let retryAttempts = 0;
    let lastError: Error | null = null;

    while (retryAttempts < maxRetryAttempts) {
        try {
            const response = await operationFunction();
            return response;
        } catch (error: any) {
            lastError = error;
            retryAttempts++;
            console.error(`Operation failed (attempt ${retryAttempts}/${maxRetryAttempts}). Error:`, error?.message || error);

            if (retryAttempts < maxRetryAttempts) {
                const backoffMs = Math.min(1000 * Math.pow(2, retryAttempts - 1), 16000);
                console.log(`Retrying in ${backoffMs}ms...`);
                await delay(backoffMs);
            }
        }
    }

    console.error(`Operation failed after ${maxRetryAttempts} attempts.`);
    throw lastError || new Error("Failed after multiple attempts.");
}


// STEP ONE: Initialize the Operation (/api/v1/initialize)
export const initializeSessionAPI = async (doctype: Doctype, uploadedFile: FileType) => {
    const PROCESS_URL = SERVER_API + "/api/v1/initialize";

    const formData = new FormData();
    formData.append("file", uploadedFile.file);
    formData.append("document_type", doctype?.id || "");

    return await executeOperationWithRetry(async () => {
        const Response = await Axios.post(PROCESS_URL, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            timeout: REQUEST_TIMEOUT,
        });

        if (Response.status === 200 && Response.data?.Session?.Status === "Initialized") {
            return {
                Status: "Initialized",
                Session: Response.data.Session,
                Error: null,
            };
        } else {
            throw new Error("Failed to initialize the session.");
        }
    });
};



// STEP TWO: Extract Text (/api/v1/extract-text)
export const extractTextAPI = async (Session: SessionType) => {
    const PROCESS_URL = SERVER_API + "/api/v1/extract-text";

    return await executeOperationWithRetry(async () => {
        const Response = await Axios.post(PROCESS_URL + "?Session_Id=" + Session["Session Id"], null, { timeout: REQUEST_TIMEOUT });

        if (Response.status === 200 && Response.data?.Session?.Status === "Extracted") {
            return {
                Status: "Extracted",
                Session: Response.data.Session,
                Error: null,
            };
        } else {
            throw new Error("Failed to extract text.");
        }
    });
};

// STEP THREE: Extract Table (/api/v1/extract-table)
export const extractTableAPI = async (Session: SessionType) => {
    const PROCESS_URL = SERVER_API + "/api/v1/extract-tables";

    if (Session["Information Type"] === "Regular" || Session["Information Type"] !== "Tabular") {
        return {
            Status: "Extracted",
            Session: Session,
            Error: null,
        };
    }

    return await executeOperationWithRetry(async () => {
        const Response = await Axios.post(PROCESS_URL + "?Session_Id=" + Session["Session Id"], null, { timeout: REQUEST_TIMEOUT });

        if (Response.status === 200 && Response.data?.Session?.Status === "Extracted") {
            return {
                Status: "Extracted",
                Session: Response.data.Session,
                Error: null,
            };
        } else {
            throw new Error("Failed to extract table.");
        }
    });
};


// STEP FOUR: Correct Text (/api/v1/correct-text)
export const correctTextAPI = async (Session: SessionType) => {
    const PROCESS_URL = SERVER_API + "/api/v1/correct-text";

    return await executeOperationWithRetry(async () => {
        const Response = await Axios.post(PROCESS_URL + "?Session_Id=" + Session["Session Id"], null, { timeout: REQUEST_TIMEOUT });

        if (Response.status === 200 && Response.data?.Session?.Status === "Corrected") {
            return {
                Status: "Corrected",
                Session: Response.data.Session,
                Error: null,
            };
        } else {
            throw new Error("Failed to correct text.");
        }
    });
};

// STEP FIVE: Correct Table (/api/v1/correct-table)
export const correctTableAPI = async (Session: SessionType) => {
    const PROCESS_URL = SERVER_API + "/api/v1/correct-tables";

    if (Session["Information Type"] === "Regular" || Session["Information Type"] !== "Tabular") {
        return {
            Status: "Corrected",
            Session: Session,
            Error: null,
        };
    }

    return await executeOperationWithRetry(async () => {
        const Response = await Axios.post(PROCESS_URL + "?Session_Id=" + Session["Session Id"], null, { timeout: REQUEST_TIMEOUT });

        if (Response.status === 200 && Response.data?.Session?.Status === "Corrected") {
            return {
                Status: "Corrected",
                Session: Response.data.Session,
                Error: null,
            };
        } else {
            throw new Error("Failed to correct table.");
        }
    });
};


// STEP SIX: Translate Text (/api/v1/translate-text)
export const translateTextAPI = async (Session: SessionType) => {
    const PROCESS_URL = SERVER_API + "/api/v1/translate-text";

    return await executeOperationWithRetry(async () => {
        const Response = await Axios.post(PROCESS_URL + "?Session_Id=" + Session["Session Id"], null, { timeout: REQUEST_TIMEOUT });

        if (Response.status === 200 && Response.data?.Session?.Status === "Translated") {
            return {
                Status: "Translated",
                Session: Response.data.Session,
                Error: null,
            };
        } else {
            throw new Error("Failed to translate text.");
        }
    });
};

// STEP SEVEN: Translate Table (/api/v1/translate-table)
export const translateTableAPI = async (Session: SessionType) => {
    const PROCESS_URL = SERVER_API + "/api/v1/translate-tables";

    if (Session["Information Type"] === "Regular" || Session["Information Type"] !== "Tabular") {
        return {
            Status: "Translated",
            Session: Session,
            Error: null,
        };
    }

    return await executeOperationWithRetry(async () => {
        const Response = await Axios.post(PROCESS_URL + "?Session_Id=" + Session["Session Id"], null, { timeout: REQUEST_TIMEOUT });

        if (Response.status === 200 && Response.data?.Session?.Status === "Translated") {
            return {
                Status: "Translated",
                Session: Response.data.Session,
                Error: null,
            };
        } else {
            throw new Error("Failed to translate table.");
        }
    });
};



// FAST PIPELINE: Single request does everything (init + extract + correct + translate + generate)
export const processAllAPI = async (doctype: Doctype, uploadedFile: FileType) => {
    const PROCESS_URL = SERVER_API + "/api/v1/process-all";

    const formData = new FormData();
    formData.append("file", uploadedFile.file);
    formData.append("document_type", doctype?.id || "");

    return await executeOperationWithRetry(async () => {
        const Response = await Axios.post(PROCESS_URL, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            timeout: 300000, // 5 minutes for full pipeline
        });

        if (Response.status === 200 && Response.data?.Session?.Status === "Generated") {
            return {
                Status: "Generated",
                Session: Response.data.Session,
                Error: null,
            };
        } else if (Response.status === 200 && Response.data?.Session) {
            return {
                Status: Response.data.Session.Status,
                Session: Response.data.Session,
                Error: null,
            };
        } else {
            throw new Error("Failed to process document.");
        }
    });
};

// STEP EIGHT: Generate Document (/api/v1/generate-document)
export const generateDocumentAPI = async (Session: SessionType) => {
    const PROCESS_URL = SERVER_API + "/api/v1/generate-document";

    return await executeOperationWithRetry(async () => {
        const Response = await Axios.post(PROCESS_URL + "?Session_Id=" + Session["Session Id"], {
            Values: Session?.Translation?.Text
        }, { timeout: REQUEST_TIMEOUT });

        if (Response.status === 200 && Response.data?.Session?.Status === "Generated") {
            return {
                Status: "Generated",
                Session: Response.data.Session,
                Error: null,
            };
        } else {
            throw new Error("Failed to generate document.");
        }
    });
};
