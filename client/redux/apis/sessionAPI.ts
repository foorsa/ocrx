import { getApiServerUrl } from '@/utils/getApiServerUrl';
import { FileType } from '../types/states/File';
import { Doctype } from '../types/states/Document Type';
import toast from 'react-hot-toast';
import Axios, { CancelTokenSource } from 'axios';
import { Session as SessionType } from '@/redux/types/states/Session';

const SERVER_API = getApiServerUrl();


async function executeOperationWithRetry(operationFunction: () => Promise<
    {
        Status: "Initialized" | "Extracted" | "Corrected" | "Translated" | "Generated" | "Failed";
        Error?: string | null;
        Session: SessionType | null;
    }
>) {
    const maxRetryAttempts = 3;
    let retryAttempts = 0;
    let response = null;

    while (retryAttempts < maxRetryAttempts) {
        try {
            response = await operationFunction();
            break; // Exit the loop if the operation is successful
        } catch (error) {
            console.error(`Operation failed. Retrying attempt ${retryAttempts + 1}. Error:`, error);
            retryAttempts++;
        }
    }

    if (retryAttempts === maxRetryAttempts) {
        console.error(`Operation failed after ${maxRetryAttempts} attempts.`);
        return {
            Status: "Failed",
            Error: "Failed after multiple attempts.",
            Session: null,
        };
    }

    return response;
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
        const Response = await Axios.post(PROCESS_URL + "?Session_Id=" + Session["Session Id"]);

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
            Status: "Translated",
            Session: Session,
            Error: null,
        };
    }

    return await executeOperationWithRetry(async () => {
        const Response = await Axios.post(PROCESS_URL + "?Session_Id=" + Session["Session Id"]);

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
        const Response = await Axios.post(PROCESS_URL + "?Session_Id=" + Session["Session Id"]);

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

// STEP FIVE: Extract Table (/api/v1/correct-table)
export const correctTableAPI = async (Session: SessionType) => {
    const PROCESS_URL = SERVER_API + "/api/v1/correct-tables";

    if (Session["Information Type"] === "Regular" || Session["Information Type"] !== "Tabular") {
        return {
            Status: "Translated",
            Session: Session,
            Error: null,
        };
    }

    return await executeOperationWithRetry(async () => {
        const Response = await Axios.post(PROCESS_URL + "?Session_Id=" + Session["Session Id"]);

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
        const Response = await Axios.post(PROCESS_URL + "?Session_Id=" + Session["Session Id"]);

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
        const Response = await Axios.post(PROCESS_URL + "?Session_Id=" + Session["Session Id"]);

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



// STEP EIGHT: Generate Document (/api/v1/generate-document)
export const generateDocumentAPI = async (Session: SessionType) => {
    const PROCESS_URL = SERVER_API + "/api/v1/generate-document";

    return await executeOperationWithRetry(async () => {
        const Response = await Axios.post(PROCESS_URL + "?Session_Id=" + Session["Session Id"], {
            Values: Session?.Translation?.Text
        });

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
