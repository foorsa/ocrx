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
    DocumentUpload,
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
import axios, { AxiosError } from "axios";
import { Doctype } from "@/redux/types/states/Document Type";
import Processing from "./Core/A. Upload/D. Processing";
import { setProcess } from "@/redux/actions/processActions";
import { resetFile } from "@/redux/actions/fileActions";
import { clearSession, setSession } from "@/redux/actions/sessionActions";
import { Session, Session as SessionType } from "@/redux/types/states/Session";
import { getApiServerUrl } from "@/utils/getApiServerUrl";
import { Steps } from "@/redux/types/states/Step";

// Selection for Document Type

export default function First_DocumentUpload() {
    const Dispatch = useAppDispatch();
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

        Dispatch(
            setProcess({
                isLoading: true,
                name: "Uploading File",
                description: "Uploading your file to the server...",
            })
        );
        const API_URL: string = getApiServerUrl();

        let TASK_ID: string = "";

        try {
            const PROCESS_URL = API_URL + "/api/process";

            const FormularData = new FormData();
            FormularData.append("file", UploadedFile.file);
            FormularData.append("document_type", Doctype.id);

            const Response = await axios.post(PROCESS_URL, FormularData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            const { status, data } = Response;
            TASK_ID = data?.Task_Id || "";

            switch (status) {
                case 202:
                    if (TASK_ID === "") {
                        return toast.error(
                            "The server is not responding, please try again later."
                        );
                    }
                    break;
                case 400:
                    Dispatch(
                        setProcess({
                            isLoading: false,
                        })
                    );
                    return toast.error(
                        "Please reset the current file and try again."
                    );
                default:
                    Dispatch(
                        setProcess({
                            isLoading: false,
                        })
                    );
                    return toast.error("The server is not responding.");
            }

            // All good, continue with the next steps
        } catch (Error: any) {
            console.log("Error while Queueing Task: ", Error);

            let ErrorMessage = "An error occurred.";

            if (Error.response && Error.response.data) {
                const ErrorData = Error.response.data;

                if (ErrorData.Error || ErrorData.error) {
                    ErrorMessage = ErrorData.Error || ErrorData.error;
                }
            }

            Dispatch(
                setProcess({
                    isLoading: false,
                })
            );

            Error.status == 400
                ? (ErrorMessage =
                      "Your file has expired, please re-upload it and try again.")
                : null;

            return toast.error(ErrorMessage);
        }

        // All good, keep going.

        //
        //
        // Second Step: Check the Task ID until it's completed
        const TASK_URL = API_URL + "/api/task/" + TASK_ID;

        let ProcessResult: SessionType | null = null;

        let QueueMessage: string = "Your file is added to the Redis Queue...";

        const QueuePromise = new Promise<SessionType>((resolve, reject) => {
            const interval = setInterval(async () => {
                try {
                    const response = await axios.get(TASK_URL);
                    const TaskData: {
                        ID: string;
                        Status: string;
                        Result: SessionType;
                    } = response.data;

                    if (TaskData.Status === "FINISHED") {
                        console.log("Task finished: ", TaskData);
                        clearInterval(interval);
                        resolve(TaskData.Result);
                    } else if (TaskData.Status === "FAILED") {
                        console.log("Task failed: ", TaskData);
                        clearInterval(interval);
                        reject(TaskData);
                    } else if (TaskData.Status === "QUEUED") {
                        console.log("Task is queued: ", TaskData);
                        QueueMessage =
                            "Your file is added to the Redis Queue...";
                    } else if (TaskData.Status === "STARTED") {
                        console.log("Task is started: ", TaskData);
                        QueueMessage = "Your file is being processed...";
                    }
                } catch (error) {
                    clearInterval(interval);
                    reject(error);
                }
            }, 1000);
        });

        await toast
            .promise(QueuePromise, {
                loading: QueueMessage,
                success: "Your file has been processed successfully.",
                error: "An error occurred while processing your file.",
            })
            .then((SessionData: SessionType | null) => {
                // Check Session Validity
                if (SessionData?.Error !== null && SessionData?.Error !== "") {
                    console.log("Error while processing: ", SessionData);
                    Dispatch(
                        setProcess({
                            isLoading: false,
                        })
                    );
                    toast.error(
                        "Bip bip, please try again, the task seems to be stuck."
                    );
                }

                // Rest of the function
                ProcessResult = SessionData;

                return;
            })
            .catch((error) => {
                console.log("Error while checking task status: ", error);
                toast.error(
                    "Bip bip, please try again, the task seems to be stuck."
                );

                return;
            });

        //
        //
        // Third Step: Set the Session Data

        //     console.log("Session Response: ", SessionResponse);

        //     // Set the Session Data in the redux store

        //     const SessionData: Session = {
        //         "Session Id": SessionResponse["Session Id"],
        //         "Document Type": SessionResponse["Document Type"],
        //         Uploads: SessionResponse["Uploads"],
        //         Extraction: SessionResponse["Extraction"],
        //         Status: SessionResponse["Status"],
        //         Error: SessionResponse["Error"],
        //     };

        //     dispatch(setSession(SessionData));

        //     // Change the Fields Values in the redux Store
        //     const ExtractedData = Doctype.fields.map((field: any) => {
        //         const value: string = SessionResponse.Extraction?.Corrected
        //             ? SessionResponse?.Extraction?.Corrected[field.name]
        //             : "";

        //         return {
        //             ...field,
        //             value: value,
        //         };
        //     });

        //     // Create a new Doctype object with updated fields
        //     const updatedDoctype = {
        //         ...Doctype,
        //         fields: ExtractedData,
        //     };

        //     // Set the extracted data in the redux store
        //     dispatch(setDocumentType(updatedDoctype));

        //     dispatch(
        //         setProcess({
        //             isLoading: false,
        //             name: "Success",
        //             description: "Your file has been processed successfully.",
        //         })
        //     );

        //     // Reset the process
        //     dispatch(
        //         setProcess({
        //             isLoading: true,
        //             name: "Generating PDF",
        //             description: "Generating your PDF...",
        //         })
        //     );

        //     const RequestData = {
        //         SessionID: Session["Session Id"],
        //         DocumentType: Doctype.name,
        //         Fields: Doctype.fields,
        //     };

        //     console.log("Request Data: ", RequestData);

        //     const Generate_URL = API_URL + "/api/generate";

        //     try {
        //         const Response = await axios.post(Generate_URL, RequestData);

        //         if (Response.status === 200) {
        //             console.log("Generated PDF successfully: ", Response.data);
        //             // Reset the process
        //             dispatch(
        //                 setProcess({
        //                     isLoading: false,
        //                     name: "Success",
        //                     description: "Your PDF has been generated.",
        //                 })
        //             );

        //             const Res = Response.data;

        //             const SessionData: SessionType = {
        //                 "Session Id": Res["Session ID"],
        //                 "Document Type": Res["Document Type"],
        //                 Uploads: Res["Uploads"],
        //                 Extraction: Res["Extraction"],
        //                 Generation: Res["Generation"],
        //                 Status: Res["Status"],
        //                 Error: Res["Error"],
        //             };

        //             dispatch(setSession(SessionData));

        //             dispatch(setStep(Steps.Finish));

        //             toast.success(
        //                 "Your Document has been generated successfully."
        //             );
        //         } else {
        //             console.log("Error while generating PDF: ", Response.data);

        //             // Reset the process

        //             dispatch(
        //                 setProcess({
        //                     isLoading: false,
        //                     name: "Error",
        //                     description: "An error has occured.",
        //                 })
        //             );

        //             toast.error(
        //                 Response.data.message ||
        //                     "An error has occured on the server !"
        //             );
        //         }
        //     } catch (err: any) {
        //         console.log("Error while sending request: ", err);
        //         // Reset the process
        //         dispatch(
        //             setProcess({
        //                 isLoading: false,
        //                 name: "Error",
        //                 description: "An error has occured.",
        //             })
        //         );

        //         toast.error(err.message);
        //     }
        // } catch (error: any) {
        //     // Handle errors
        //     console.error("Error:", error.message);
        //     toast.error("Error: " + error.message);

        //     // Simulate delay before setting isLoading to false
        //     dispatch(
        //         setProcess({
        //             isLoading: false,
        //             name: "Error",
        //             description: "An error occured while processing the file.",
        //         })
        //     );
        // }
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
                    className="inline-flex text-center w-full items-center justify-center px-3 py-2 text-sm font-medium text-white bg-purple-700 rounded-lg hover:bg-purple-800 focus:outline-none dark:bg-purple-600 dark:hover:bg-purple-700 focus:bg-purple-500 active:bg-purple-900 transition duration-150 ease-in-out"
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
                        className="text-white w-full bg-black hover:bg-purple-800 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 inline-flex items-center justify-center"
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
                        className="inline-flex w-full justify-center items-center font-medium text-sm px-5 py-2.5 text-center bg-white rounded-lg border border-zinc-200 hover:bg-zinc-100 text-zinc-900 hover:text-purple-700 focus:z-10 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-600 dark:hover:text-white dark:hover:bg-zinc-700"
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
