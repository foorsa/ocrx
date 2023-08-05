"use client";

import React, { useCallback, useState } from "react";
import Link from "next/link";
import {
    ArrowDown2,
    ArrowRight3,
    BoxTick,
    ChartSuccess,
    Check,
    CloseSquare,
    Code,
    Document,
    DocumentDownload,
    DocumentText,
    DocumentUpload,
    Google,
    LinkSquare,
    Timer,
} from "iconsax-react";
import FileUploadService from "./Core/A. Upload/C. FileUploadService";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button, Tooltip } from "flowbite-react";
import toast from "react-hot-toast";
import {
    resetDocumentType,
    setDocumentType,
} from "@/redux/actions/documentTypeActions";
import { Documents } from "@/redux/data/Documents";
import SelectDocType from "./Core/A. Upload/B. SelectDocType";
import Heading from "./Core/A. Upload/A. Heading";
import { nextStep, resetStep, setStep } from "@/redux/actions/stepActions";
import axios, { AxiosResponse, AxiosError } from "axios";
import { Doctype } from "@/redux/types/states/Document Type";
import Processing from "./Core/A. Upload/D. Processing";
import { setProcess } from "@/redux/actions/processActions";
import { resetFile } from "@/redux/actions/fileActions";
import { clearSession, setSession } from "@/redux/actions/sessionActions";
import { Session, Session as SessionType } from "@/redux/types/states/Session";
import { getApiServerUrl } from "@/utils/getApiServerUrl";
import { Steps } from "@/redux/types/states/Step";
import { DocumentCheckIcon } from "@heroicons/react/20/solid";

// Selection for Document Type

export default function First_DocumentUpload() {
    const Dispatch = useAppDispatch() as any;
    const Doctype = useAppSelector((state) => state.documentType);
    const UploadedFile = useAppSelector((state) => state.file);
    const Process = useAppSelector((state) => state.process);
    const Session = useAppSelector((state) => state.session);

    const handleNextStep = async () => {
        if (!UploadedFile) {
            return toast.error("Please upload a file");
        }

        if (!Doctype?.name) {
            return toast.error("Please select a document type");
        }

        // Clear the session
        Dispatch(clearSession());

        Dispatch(
            setProcess({
                isLoading: true,
                name: "Uploading File",
                description: "Uploading your file to the server...",
            })
        );

        const SERVER_API: string = getApiServerUrl();

        // [STEP 0] Ping the server - Heroku puts the server to sleep after 30 minutes of inactivity
        toast.loading("Connecting to the server...", {
            id: "Checking",
        });

        try {
            const PING_URL = SERVER_API + "/api/v1/ping";
            await axios.get(PING_URL);
        } catch (e) {
            console.log("Error while pinging the server: ", e);
        }

        // Wait for 1 second before executing next commands
        await new Promise((resolve) =>
            setTimeout(() => {
                resolve(true);
                return toast.dismiss("Checking");
            }, 1000)
        );

        toast.loading("Uploading your file to the server...", {
            id: "Uploading",
        });

        var newState = null;

        // [STEP 1] Initialize the session
        try {
            const PROCESS_URL = SERVER_API + "/api/v1/initialize";

            const formData = new FormData();
            formData.append("file", UploadedFile.file);
            formData.append("document_type", Doctype.id);

            const response = await axios.post(PROCESS_URL, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            const { status, data } = response;

            if (status == 200 && data.Session.Status == "Initialized") {
                Dispatch(
                    setProcess({
                        isLoading: true,
                        name: "Extracting",
                        description: "Extracting your file's data...",
                    })
                );

                newState = data.Session;

                await Dispatch(setSession(data.Session)); // Wait for the session state to be updated

                // Pause for 1 second after setting the session in Redux
                await new Promise((resolve) =>
                    setTimeout(() => {
                        resolve(true);
                        return toast.dismiss("Uploading");
                    }, 1000)
                );
            } else {
                Dispatch(
                    setProcess({
                        isLoading: false,
                    })
                );

                toast.dismiss("Uploading");

                toast.error("An error occurred. Please try again later.");
            }
            // All good, continue with the next steps
        } catch (error: any) {
            console.log("Error while Initializing Session: ", error);
            toast.dismiss("Uploading...");

            Dispatch(
                setProcess({
                    isLoading: false,
                })
            );

            // Check if the error contains a response
            if (error.response) {
                const { status, data } = error.response;
                switch (status) {
                    case 400:
                        return toast.error(
                            "Please reset the current file and try again."
                        );
                    case 500:
                        return toast.error("The server is not responding.");
                    default:
                        return toast.error(
                            "Could not initialize the session. Please try again."
                        );
                }
            } else {
                // Handle other types of errors (e.g., network errors, timeout)
                return toast.error(
                    error.message ||
                        "Server is not responding, please try again later."
                );
            }
        }

        // [STEP 2] Extract the Data from the file
        toast.loading("Extracting Text from your file...", {
            id: "Extracting Text",
        });

        try {
            const SESSION_ID = Session["Session Id"];

            if (!SESSION_ID || SESSION_ID == "") {
                Dispatch(
                    setProcess({
                        isLoading: false,
                    })
                );

                console.log("Session Identifier is missing in: ", Session);

                toast.dismiss("Extracting Text");
                return toast.error(
                    "Session Identifier is missing, the server was probably inactive, please try again in few seconds."
                );
            }

            const EXTRACT_URL =
                SERVER_API + `/api/v1/extract-text?Session_Id=${SESSION_ID}`;

            const response = await axios.post(EXTRACT_URL, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            const { status, data } = response;

            if (status == 200 && data.Session.Status == "Extracted") {
                Dispatch(
                    setProcess({
                        isLoading: true,
                        name: "Correcting",
                        description: "Correcting your file...",
                    })
                );

                toast.dismiss("Extracting Text");

                // Wait for the session state to be updated
                await Dispatch(setSession(data.Session));
            } else {
                Dispatch(
                    setProcess({
                        isLoading: false,
                    })
                );

                toast.dismiss("Extracting Text");

                return toast.error(
                    "An error occurred while extracting the data. Please try again later."
                );
            }
        } catch (error: any) {
            console.log("[SERVER] Error while Extracting Data: ", error);

            Dispatch(
                setProcess({
                    isLoading: false,
                })
            );

            toast.dismiss("Extracting Text");

            // Check if the error contains a response
            if (error.response) {
                const { status, data } = error.response;
                switch (status) {
                    case 400:
                        return toast.error(
                            "The server got an invalid request. Please try again later."
                        );
                    case 500:
                        return toast.error(
                            "The server is not responding. Please try again later."
                        );
                    default:
                        return toast.error(
                            "Server returned an unknown error. Please try again later."
                        );
                }
            } else {
                // Handle other types of errors (e.g., network errors, timeout)
                return toast.error(
                    error.message ||
                        "Server is not responding, please try again later."
                );
            }
        }
        // [STEP 3] Presence of Tabular Data - Extract Tables from the file
        if (Session["Information Type"] == "Tabular") {
            toast.loading("Extracting Tables from your file...", {
                id: "Extracting Tables",
            });

            try {
                const SESSION_ID = Session["Session Id"];

                if (!SESSION_ID || SESSION_ID == "") {
                    Dispatch(
                        setProcess({
                            isLoading: false,
                        })
                    );

                    console.log("Session Identifier is missing in: ", Session);

                    toast.dismiss("Extracting Text");
                    return toast.error(
                        "Session Identifier is missing, the server was probably inactive, please try again in few seconds."
                    );
                }

                const EXTRACT_URL =
                    SERVER_API +
                    `/api/v1/extract-tables?Session_Id=${SESSION_ID}`;

                const response = await axios.post(EXTRACT_URL, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });

                const { status, data } = response;

                if (status == 200 && data.Session.Status == "Extracted") {
                    Dispatch(
                        setProcess({
                            isLoading: true,
                        })
                    );

                    toast.dismiss("Extracting Tables");

                    await Dispatch(setSession(data.Session));
                } else {
                    Dispatch(
                        setProcess({
                            isLoading: false,
                        })
                    );

                    toast.dismiss("Extracting Tables");

                    return toast.error(
                        "An error occurred while extracting the tables. Please try again later."
                    );
                }
            } catch (error: any) {
                console.log("[SERVER] Error while Extracting Tables: ", error);

                Dispatch(
                    setProcess({
                        isLoading: false,
                    })
                );

                toast.dismiss("Extracting Tables");

                // Check if the error contains a response
                if (error.response) {
                    const { status, data } = error.response;
                    switch (status) {
                        case 400:
                            return toast.error(
                                "The server got an invalid request. Please try again later."
                            );
                        case 500:
                            return toast.error(
                                "The server is not responding. Please try again later."
                            );
                        default:
                            return toast.error(
                                "Server returned an unknown error. Please try again later."
                            );
                    }
                } else {
                    // Handle other types of errors (e.g., network errors, timeout)
                    return toast.error(
                        error.message ||
                            "Server is not responding, please try again later."
                    );
                }
            }
        }

        // [STEP 4] Correct the Text with AI (Correction)
        toast.loading("Processing the extracted Text...", {
            id: "Correcting Text",
        });

        try {
            const SESSION_ID = Session["Session Id"];

            if (!SESSION_ID || SESSION_ID == "") {
                Dispatch(
                    setProcess({
                        isLoading: false,
                    })
                );

                console.log("Session ID is missing in: ", Session);

                toast.dismiss("Correcting Text");
                return toast.error("Session ID is missing.");
            }

            const TRANSLATE_URL =
                SERVER_API + `/api/v1/correct-text?Session_Id=${SESSION_ID}`;

            const response = await axios.post(TRANSLATE_URL, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            const { status, data } = response;

            if (status == 200 && data.Session.Status == "Corrected") {
                Dispatch(
                    setProcess({
                        isLoading: true,
                    })
                );

                toast.dismiss("Correcting Text");

                await Dispatch(setSession(data.Session));
            } else {
                Dispatch(
                    setProcess({
                        isLoading: false,
                    })
                );

                toast.dismiss("Correcting Text");

                return toast.error(
                    "AI returned an error. Please try again later."
                );
            }
        } catch (Error: any) {
            console.log("Error while Correcting Text: ", Error);

            Dispatch(
                setProcess({
                    isLoading: false,
                })
            );

            toast.dismiss("Correcting Text");

            // Check if the error contains a response
            if (Error.response) {
                const { status, data } = Error.response;
                switch (status) {
                    case 400:
                        return toast.error(
                            "AI got an invalid request. Please try again later."
                        );
                    case 500:
                        return toast.error(
                            "AI is not responding, please try again later."
                        );
                    default:
                        return toast.error("AI returned an unknown error.");
                }
            } else {
                // Handle other types of errors (e.g., network errors, timeout)
                return toast.error(
                    Error.message ||
                        "AI is not responding, please try again later."
                );
            }
        }
        // [STEP 5] Tabular Information: AI Correction
        async function correctTable() {
            if (Session["Information Type"] === "Tabular") {
                toast.loading("Processing the Extracted Table....", {
                    id: "Correcting Table",
                });

                try {
                    const SESSION_ID = Session["Session Id"];

                    if (!SESSION_ID || SESSION_ID === "") {
                        Dispatch(
                            setProcess({
                                isLoading: false,
                            })
                        );

                        console.log("Session ID is missing in: ", Session);

                        toast.dismiss("Correcting Table");
                        return toast.error("Session ID is missing.");
                    }

                    const TRANSLATE_URL =
                        SERVER_API +
                        `/api/v1/correct-tables?Session_Id=${SESSION_ID}`;

                    const response = await makeRequestWithRetry(TRANSLATE_URL);

                    const { status, data } = response;

                    if (status === 200 && data.Session.Status === "Corrected") {
                        Dispatch(
                            setProcess({
                                isLoading: true,
                            })
                        );

                        toast.dismiss("Correcting Table");

                        Dispatch(setSession(data.Session));
                    } else {
                        Dispatch(
                            setProcess({
                                isLoading: false,
                            })
                        );

                        toast.dismiss("Correcting Table");

                        return toast.error(
                            "The Transcripts AI returned an error, please try again later."
                        );
                    }
                } catch (error: any) {
                    console.log("Error while Correcting Text: ", error);

                    Dispatch(
                        setProcess({
                            isLoading: false,
                        })
                    );

                    toast.dismiss("Correcting Table");

                    // Check if the error contains a response
                    if (error.response) {
                        const { status, data } = error.response;
                        switch (status) {
                            case 400:
                                return toast.error(
                                    "The Transcripts AI got an invalid request. Please try again later."
                                );
                            case 500:
                                return toast.error(
                                    "The Transcripts AI is not responding, please try again later."
                                );
                            default:
                                return toast.error(
                                    "The Transcripts AI returned an unknown error."
                                );
                        }
                    } else {
                        // Handle other types of errors (e.g., network errors, timeout)
                        return toast.error(
                            error.message ||
                                "The Transcripts AI is not responding, please try again later."
                        );
                    }
                }
            }
        }

        // Helper function to make the Axios request with retry
        async function makeRequestWithRetry(
            url: string,
            maxRetries = 3,
            currentRetry = 0
        ) {
            try {
                const response = await axios.post(url, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });

                return response;
            } catch (error: any) {
                if (
                    currentRetry < maxRetries &&
                    (axios.isAxiosError(error) || error.code === "ECONNABORTED")
                ) {
                    // Retry the request by recursively calling the function after a short delay
                    await new Promise((resolve) => setTimeout(resolve, 1000));
                    return makeRequestWithRetry(
                        url,
                        maxRetries,
                        currentRetry + 1
                    );
                } else {
                    throw error; // Reject the promise for non-retryable errors
                }
            }
        }

        await correctTable();

        // [STEP 6] Translate the Text with AI (Correction)
        toast.loading("Translating the extracted Text...", {
            id: "Translating Text",
        });

        try {
            const SESSION_ID = Session["Session Id"];

            if (!SESSION_ID || SESSION_ID == "") {
                Dispatch(
                    setProcess({
                        isLoading: false,
                    })
                );

                console.log("Session ID is missing in: ", Session);

                toast.dismiss("Translating Text");
                return toast.error("Session ID is missing.");
            }

            const TRANSLATE_URL =
                SERVER_API + `/api/v1/translate-text?Session_Id=${SESSION_ID}`;

            const response = await axios.post(TRANSLATE_URL, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            const { status, data } = response;

            if (status == 200 && data.Session.Status == "Translated") {
                Dispatch(
                    setProcess({
                        isLoading: true,
                    })
                );

                toast.dismiss("Translating Text");

                Dispatch(setSession(data.Session));
            } else {
                Dispatch(
                    setProcess({
                        isLoading: false,
                    })
                );

                toast.dismiss("Translating Text");

                return toast.error(
                    "AI returned an error. Please try again later."
                );
            }
        } catch (Error: any) {
            console.log("Error while Translating Text: ", Error);

            Dispatch(
                setProcess({
                    isLoading: false,
                })
            );

            toast.dismiss("Translating Text");

            // Check if the error contains a response
            if (Error.response) {
                const { status, data } = Error.response;
                switch (status) {
                    case 400:
                        return toast.error(
                            "AI got an invalid request. Please try again later."
                        );
                    case 500:
                        return toast.error(
                            "AI is not responding, please try again later."
                        );
                    default:
                        return toast.error("AI returned an unknown error.");
                }
            } else {
                // Handle other types of errors (e.g., network errors, timeout)
                return toast.error(
                    Error.message ||
                        "AI is not responding, please try again later."
                );
            }
        }

        // [STEP 7] Tabular Information: AI Translation
        if (Session["Information Type"] == "Tabular") {
            toast.loading("Translating the Extracted Table....", {
                id: "Translating Table",
            });

            try {
                const SESSION_ID = Session["Session Id"];

                if (!SESSION_ID || SESSION_ID == "") {
                    Dispatch(
                        setProcess({
                            isLoading: false,
                        })
                    );

                    console.log("Session ID is missing in: ", Session);

                    toast.dismiss("Translating Table");
                    return toast.error("Session ID is missing.");
                }

                const TRANSLATE_URL =
                    SERVER_API +
                    `/api/v1/translate-tables?Session_Id=${SESSION_ID}`;

                const response = await axios.post(TRANSLATE_URL, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });

                const { status, data } = response;

                if (status == 200 && data.Session.Status == "Translated") {
                    Dispatch(
                        setProcess({
                            isLoading: true,
                        })
                    );

                    toast.dismiss("Translating Table");

                    Dispatch(setSession(data.Session));
                } else {
                    Dispatch(
                        setProcess({
                            isLoading: false,
                        })
                    );

                    toast.dismiss("Translating Table");

                    return toast.error(
                        "The Transcripts AI returned an error, please try again later."
                    );
                }
            } catch (Error: any) {
                console.log("Error while Correcting Text: ", Error);

                Dispatch(
                    setProcess({
                        isLoading: false,
                    })
                );

                toast.dismiss("Translating Table");

                // Check if the error contains a response
                if (Error.response) {
                    const { status, data } = Error.response;
                    switch (status) {
                        case 400:
                            return toast.error(
                                "The Transcripts AI  got an invalid request. Please try again later."
                            );
                        case 500:
                            return toast.error(
                                "The Transcripts AI  is not responding, please try again later."
                            );
                        default:
                            return toast.error(
                                "The Transcripts AI  returned an unknown error."
                            );
                    }
                } else {
                    // Handle other types of errors (e.g., network errors, timeout)
                    return toast.error(
                        Error.message ||
                            "The Transcripts AI is not responding, please try again later."
                    );
                }
            }
        }

        toast.loading("Generating Final Document...", {
            id: "Generating",
        });

        try {
            const SESSION_ID = Session["Session Id"];

            if (!SESSION_ID || SESSION_ID == "") {
                Dispatch(
                    setProcess({
                        isLoading: false,
                    })
                );

                console.log("Session ID is missing in: ", Session);

                toast.dismiss("Generating");
                return toast.error(
                    "Session Identifier is missing, please restart the process."
                );
            }

            const GENERATE_URL =
                SERVER_API +
                `/api/v1/generate-document?Session_Id=${SESSION_ID}`;

            const response = await axios.post(GENERATE_URL, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            const { status, data } = response;

            if (status == 200) {
                Dispatch(
                    setProcess({
                        isLoading: true,
                    })
                );

                await Dispatch(setSession(data.Session));

                await new Promise((resolve) =>
                    setTimeout(() => {
                        resolve(true);
                        return toast.dismiss("Generating");
                    }, 1000)
                );

                console.log("Final Session Information: ", data.Session);
            } else {
                Dispatch(
                    setProcess({
                        isLoading: false,
                    })
                );

                toast.dismiss("Generating");

                return toast.error(
                    "Google Cloud returned an error. Please try again later."
                );
            }
        } catch (Error: any) {
            console.log(
                "[CLOUD] Error while Generating Google Docs File: ",
                Error
            );

            Dispatch(
                setProcess({
                    isLoading: false,
                })
            );

            toast.dismiss("Generating");

            // Check if the error contains a response
            if (Error.response) {
                const { status, data } = Error.response;
                switch (status) {
                    case 400:
                        return toast.error(
                            "Google Cloud got an invalid request. Please try again later."
                        );
                    case 500:
                        return toast.error("Google Cloud is not responding.");
                    default:
                        return toast.error(
                            "Unknown error occurred on Google Cloud."
                        );
                }
            } else {
                // Handle other types of errors (e.g., network errors, timeout)
                return toast.error(
                    Error.message ||
                        "A problem occured with the Cloud. Please try again later."
                );
            }
        }

        Dispatch(
            setProcess({
                isLoading: false,
            })
        );

        toast.dismiss("Generating");

        // Change the Step
        Dispatch(setStep(Steps.Finish));

        toast.custom((t) => (
            <div
                id="toast-interactive"
                className={`relative z-10 w-full max-w-xs p-4 text-zinc-500 bg-white rounded-lg shadow-2xl dark:bg-zinc-900 dark:text-zinc-400`}
                role="alert"
            >
                <div className="flex">
                    <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-blue-500 bg-blue-100 rounded-lg dark:text-blue-300 dark:bg-blue-900">
                        <DocumentDownload
                            className="w-4 h-4"
                            aria-hidden="true"
                            variant="Bulk"
                        />
                        <span className="sr-only">
                            File is Ready to Download !
                        </span>
                    </div>
                    <div className="ml-3 text-sm font-normal">
                        <span className="mb-1 text-sm font-semibold text-zinc-900 dark:text-white">
                            File is Ready to Download !
                        </span>
                        <div className="mb-2 text-sm font-normal">
                            <span className="text-zinc-500 dark:text-zinc-400">
                                Click on the buttons below to download the file
                                or edit it on Google Docs.
                            </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <a
                                    href={
                                        Session?.Generation
                                            ? Session.Generation[
                                                  "Google Docs Link"
                                              ]
                                            : "#"
                                    }
                                    target="_blank"
                                    className="inline-flex justify-center w-full px-2 py-1.5 text-xs font-medium text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none dark:bg-blue-500 dark:hover:bg-blue-600"
                                >
                                    Google Docs
                                </a>
                            </div>
                            <div>
                                <a
                                    href={
                                        Session?.Generation
                                            ? Session.Generation["PDF Link"]
                                            : "#"
                                    }
                                    target="_blank"
                                    className="inline-flex justify-center w-full px-2 py-1.5 text-xs font-medium text-center text-zinc-900 bg-white border border-zinc-300 rounded-lg hover:bg-zinc-100 focus:outline-none dark:bg-zinc-600 dark:text-white dark:border-zinc-600 dark:hover:bg-zinc-700 dark:hover:border-zinc-700"
                                >
                                    Download
                                </a>
                            </div>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => toast.remove(t.id)}
                        className="ml-auto -mx-1.5 -my-1.5 bg-white items-center justify-center flex-shrink-0 text-zinc-400 hover:text-zinc-900 rounded-lg p-1.5 hover:bg-zinc-100 inline-flex h-8 w-8 dark:text-zinc-500 dark:hover:text-white dark:bg-zinc-800 dark:hover:bg-zinc-700"
                        data-dismiss-target="#toast-interactive"
                        aria-label="Close"
                    >
                        <span className="sr-only">Close</span>
                        <svg
                            className="w-3 h-3"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 14 14"
                        >
                            <path
                                stroke="currentColor"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        ));
    };

    const handleCancelOperation = () => {
        // Reset the process
        Dispatch(
            setProcess({
                isLoading: false,
                name: "Cancelling",
                description: "Cancelling the operation...",
            })
        );

        // Reset the session
        Dispatch(clearSession());

        // Reset the step
        Dispatch(resetStep());
    };

    return (
        <div className="relative w-full">
            {/* Step Title */}
            {/* Form Fields */}
            <div className="w-full flex flex-col flex-wrap mb-6 gap-3 max-w-full">
                {!Process.isLoading && (
                    <>
                        <Heading />
                        <SelectDocType />
                        <FileUploadService />
                    </>
                )}
                {Process.isLoading && <Processing />}
            </div>

            {/* Next Step */}
            {!Process.isLoading && (
                <button
                    onClick={handleNextStep}
                    className="inline-flex text-center w-full items-center justify-center px-3 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:outline-none dark:bg-blue-600 dark:hover:bg-blue-700 focus:bg-blue-500 active:bg-blue-900 transition duration-150 ease-in-out"
                >
                    Process
                    <ArrowRight3 color="currentColor" variant="Bulk" />
                </button>
            )}

            {Process.isLoading && (
                <>
                    <button
                        disabled
                        type="button"
                        className="text-white w-full bg-black hover:bg-blue-800 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 inline-flex items-center justify-center"
                    >
                        <svg
                            aria-hidden="true"
                            role="status"
                            className="inline w-4 h-4 mr-3 text-white animate-spin"
                            viewBox="0 0 100 101"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                fill="#E5E7EB"
                            />
                            <path
                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                fill="currentColor"
                            />
                        </svg>
                        Processing...
                    </button>
                    <button
                        type="button"
                        className="inline-flex w-full justify-center items-center font-medium text-sm px-5 py-2.5 text-center bg-white rounded-lg border border-zinc-200 hover:bg-zinc-100 text-zinc-900 hover:text-blue-700 focus:z-10 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-600 dark:hover:text-white dark:hover:bg-zinc-700"
                        onClick={handleCancelOperation}
                    >
                        <CloseSquare
                            color="currentColor"
                            variant="Bulk"
                            className="inline w-4 h-4 mr-3"
                        />
                        Cancel Operation
                    </button>
                </>
            )}
        </div>
    );
}

async function makeRequestWithRetry(
    url: string,
    maxRetries = 3,
    currentRetry = 0
) {
    try {
        const response = await axios.post(url, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return response;
    } catch (error: any) {
        if (
            currentRetry < maxRetries &&
            (axios.isAxiosError(error) || error.code === "ECONNABORTED")
        ) {
            // Retry the request by recursively calling the function after a short delay
            await new Promise((resolve) => setTimeout(resolve, 1000));
            return makeRequestWithRetry(url, maxRetries, currentRetry + 1);
        } else {
            throw error; // Reject the promise for non-retryable errors
        }
    }
}
