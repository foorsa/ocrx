import { getApiServerUrl } from '@/utils/getApiServerUrl';
import { FileType } from '../types/states/File';
import { Doctype } from '../types/states/Document Type';
import toast from 'react-hot-toast';
import Axios, { CancelTokenSource } from 'axios';
import { Session as SessionType } from '@/redux/types/states/Session';

const SERVER_API = getApiServerUrl();

// STEP ONE: Initialize the Operation (/api/v1/initialize)
export const initializeSessionAPI = async (doctype: Doctype, uploadedFile: FileType
) => {
    const PROCESS_URL = SERVER_API + "/api/v1/initialize";

    const formData = new FormData();
    formData.append("file", uploadedFile.file);
    formData.append("document_type", doctype?.id || "");

    const Response = await Axios.post(PROCESS_URL, formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }).then((res) => {
            if (res.status === 200 && res.data?.Session?.Status === "Initialized") {
                return {
                    Status: "Initialized",
                    Session: res.data.Session,
                    Error: null,
                };
            } else {
                return {
                    Status: "Failed",
                    Error: "Failed to initialize the session. Please try again.",
                    Session: null,
                };
            }
        }).catch((err) => {
            console.log(err);
            if (Axios.isCancel(err)) {
                console.log("Request Cancelled.");
                return {
                    Status: "Cancelled",
                    Error: "Request Cancelled.",
                    Session: null,

                };
            }

            return {
                Status: "Failed",
                Error: "Failed to initialize the session. Please try again.",
                Session: null,
            };
        });

    return Response;
};


// STEP TWO: Extract Text (/api/v1/extract-text)
export const extractTextAPI = async (Session: SessionType) => {
    const PROCESS_URL = SERVER_API + "/api/v1/extract-text";

    const Response = await Axios.post(PROCESS_URL +
        "?Session_Id=" + Session["Session Id"],
    ).then((res) => {
        if (res.status === 200 && res.data?.Session?.Status === "Extracted") {
            return {
                Status: "Extracted",
                Session: res.data.Session,
                Error: null,
            };
        } else {
            return {
                Status: "Failed",
                Error: "Failed to extract text. Please try again.",
                Session: null,
            };
        }
    }).catch((err) => {
        console.log(err);
        if (Axios.isCancel(err)) {
            console.log("Request Cancelled.");
            return {
                Status: "Cancelled",
                Session: null,

                Error: "Request Cancelled."
            };
        }

        return {
            Status: "Failed",
            Session: null,

            Error: "Failed to extract text. Please try again."
        };
    });

    return Response;
};


// STEP THREE: Extract Table (/api/v1/extract-table)
export const extractTableAPI = async (Session: SessionType) => {
    const PROCESS_URL = SERVER_API + "/api/v1/extract-tables";

    if (Session["Information Type"] == "Regular" || Session["Information Type"] != "Tabular") {
        return {
            Status: "Translated",
            Session: Session,
            Error: null,
        };
    }



    const Response = await Axios.post(PROCESS_URL +
        "?Session_Id=" + Session["Session Id"],
    ).then((res) => {
        if (res.status === 200 && res.data?.Session?.Status === "Extracted") {
            return {
                Status: "Extracted",
                Session: res.data.Session,
                Error: null,
            };
        } else {
            return {
                Status: "Failed",
                Error: "Failed to extract table. Please try again."
            };
        }
    }).catch((err) => {
        console.log(err);
        if (Axios.isCancel(err)) {
            console.log("Request Cancelled.");
            return {
                Status: "Cancelled",
                Session: null,
                Error: "Request Cancelled."
            };
        }

        return {
            Status: "Failed",
            Error: "Failed to extract table. Please try again."
        };
    });

    return Response;
};

// STEP FOUR: Correct Text (/api/v1/correct-text)
export const correctTextAPI = async (Session: SessionType) => {
    const PROCESS_URL = SERVER_API + "/api/v1/correct-text";

    const Response = await Axios.post(PROCESS_URL +
        "?Session_Id=" + Session["Session Id"],
    ).then((res) => {
        if (res.status === 200 && res.data?.Session?.Status === "Corrected") {
            return {
                Status: "Corrected",
                Session: res.data.Session,
                Error: null,
            };
        } else {
            return {
                Status: "Failed",
                Session: null,
                Error: "Failed to correct text, please try again."
            };
        }
    }).catch((err) => {
        console.log(err);
        if (Axios.isCancel(err)) {
            console.log("Request Cancelled.");
            return {
                Status: "Cancelled",
                Session: null,
                Error: "Request Cancelled."
            };
        }

        return {
            Status: "Failed",
            Session: null,
            Error: "Failed to correct text. Please try again."
        };
    });

    return Response;
};

// STEP FIVE: Extract Table (/api/v1/correct-table)
export const correctTableAPI = async (Session: SessionType) => {
    const PROCESS_URL = SERVER_API + "/api/v1/correct-tables";

    if (Session["Information Type"] == "Regular" || Session["Information Type"] != "Tabular") {
        return {
            Status: "Translated",
            Session: Session,
            Error: null,
        };
    }

    const Response = await Axios.post(PROCESS_URL +
        "?Session_Id=" + Session["Session Id"],
    ).then((res) => {
        if (res.status === 200 && res.data?.Session?.Status === "Corrected") {
            return {
                Status: "Corrected",
                Session: res.data.Session,
                Error: null,
            };
        } else {
            return {
                Status: "Failed",
                Session: null,
                Error: "Failed to correct table. Please try again."
            };
        }
    }).catch((err) => {
        console.log(err);
        if (Axios.isCancel(err)) {
            console.log("Request Cancelled.");
            return {
                Status: "Cancelled",
                Session: null,
                Error: "Request Cancelled."
            };
        }

        return {
            Status: "Failed",
            Session: null,
            Error: "Failed to correct table. Please try again."
        };
    });

    return Response;
};

// STEP SIX: Translate Text (/api/v1/translate-text)
export const translateTextAPI = async (Session: SessionType) => {
    const PROCESS_URL = SERVER_API + "/api/v1/translate-text";

    const Response = await Axios.post(PROCESS_URL +
        "?Session_Id=" + Session["Session Id"],
    ).then((res) => {
        if (res.status === 200 && res.data?.Session?.Status === "Translated") {
            return {
                Status: "Translated",
                Session: res.data.Session,
                Error: null,
            };
        } else {
            return {
                Status: "Failed",
                Session: null,
                Error: "Failed to translate text. Please try again."
            };
        }
    }).catch((err) => {
        console.log(err);
        if (Axios.isCancel(err)) {
            console.log("Request Cancelled.");
            return {
                Status: "Cancelled",
                Session: null,
                Error: "Request Cancelled."
            };
        }

        return {
            Status: "Failed",
            Session: null,
            Error: "Failed to translate text. Please try again."
        };
    });

    return Response;
};

// STEP SEVEN: Translate Table (/api/v1/translate-table)
export const translateTableAPI = async (Session: SessionType) => {
    const PROCESS_URL = SERVER_API + "/api/v1/translate-tables";

    if (Session["Information Type"] == "Regular" || Session["Information Type"] != "Tabular") {
        return {
            Status: "Translated",
            Session: Session,
            Error: null,
        };
    }

    const Response = await Axios.post(PROCESS_URL +
        "?Session_Id=" + Session["Session Id"],
    ).then((res) => {
        if (res.status === 200 && res.data?.Session?.Status === "Translated") {
            return {
                Status: "Translated",
                Session: res.data.Session,
                Error: null,
            };
        } else {
            return {
                Status: "Failed",
                Session: null,
                Error: "Failed to translate table. Please try again."
            };
        }
    }).catch((err) => {
        console.log(err);
        if (Axios.isCancel(err)) {
            console.log("Request Cancelled.");
            return {
                Status: "Cancelled",
                Session: null,
                Error: "Request Cancelled."
            };
        }

        return {
            Status: "Failed",
            Session: null,
            Error: "Failed to translate table. Please try again."
        };
    });

    return Response;
};


// STEP EIGHT: Generate Document (/api/v1/generate-document)
export const generateDocumentAPI = async (Session: SessionType) => {
    const PROCESS_URL = SERVER_API + "/api/v1/generate-document";


    const Response = await Axios.post(PROCESS_URL +
        "?Session_Id=" + Session["Session Id"],
        {
            Values: Session?.Translation?.Text
        }
    ).then((res) => {
        if (res.status === 200 && res.data?.Session?.Status === "Generated") {
            return {
                Status: "Generated",
                Session: res.data.Session,
                Error: null,
            };
        } else {
            return {
                Status: "Failed",
                Session: null,
                Error: "Failed to generate document. Please try again."
            };
        }
    }).catch((err) => {
        console.log(err);
        if (Axios.isCancel(err)) {
            console.log("Request Cancelled.");
            return {
                Status: "Cancelled",
                Session: null,
                Error: "Request Cancelled."
            };
        }

        return {
            Status: "Failed",
            Session: null,
            Error: "Failed to generate document. Please try again."
        };
    });

    return Response;
};