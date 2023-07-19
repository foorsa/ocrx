"use client";

import React, { useCallback, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import {
    ArrowLeft3,
    ArrowRight3,
    CloseSquare,
    Link,
    LinkSquare,
} from "iconsax-react";
import Heading from "./Core/B. Correct/A. Heading";
import Fields from "./Core/B. Correct/C. Fields";
import Preview from "./Core/B. Correct/B. Preview";
import { resetProcess, setProcess } from "@/redux/actions/processActions";
import { nextStep, resetStep, setStep } from "@/redux/actions/stepActions";
import {
    resetDocumentType,
    setDocumentType,
} from "@/redux/actions/documentTypeActions";
import Baccalaureate from "@/redux/data/core/Baccalaureate/Docs/Baccalaureate Certificate";
import { toast } from "react-hot-toast";
import { Field } from "@/redux/types/states/Document Type";
import Processing from "./Core/B. Correct/D. Processing";
import axios from "axios";
import { clearSession, setSession } from "@/redux/actions/sessionActions";
import { resetFile } from "@/redux/actions/fileActions";
import { getApiServerUrl } from "@/utils/getApiServerUrl";
import { Session as SessionType } from "@/redux/types/states/Session";
import { Steps } from "@/redux/types/states/Step";

// Selection for Document Type

export default function Second_CorrectData() {
    const dispatch = useAppDispatch();
    const Process = useAppSelector((state) => state.process);
    const Doctype = useAppSelector((state) => state.documentType);
    const Session = useAppSelector((state) => state.session);
    const File = useAppSelector((state) => state.file);

    const handleCancelOperation = () => {
        // Reset the process
        dispatch(
            setProcess({
                isLoading: false,
                name: "Cancelling",
                description: "Cancelling the operation...",
            })
        );
    };

    const handleResetOperation = () => {
        // Reset the process
        dispatch(
            setProcess({
                isLoading: false,
                name: "Cancelling",
                description: "Cancelling the operation...",
            })
        );

        // Reset the entire states
        dispatch(clearSession());
        dispatch(resetStep());
        // dispatch(resetFile());
        // dispatch(resetDocumentType());
        dispatch(resetProcess());
    };

    const handleNextStep = async () => {
        // Verify the presence of all the fields in the document type
        var isValid = true;

        if (!Doctype?.fields) {
            isValid = false;
            return toast.error("Please select a document type.");
        }

        // Verify the presence of all the fields in the document type
        const StateFields = Doctype?.fields;

        const RequiredFields: Field[] = [];

        StateFields?.forEach((StateField) => {
            if (StateField.required === true) {
                RequiredFields.push(StateField);
            }
        });

        let MissingFields = [];

        RequiredFields?.forEach((StateField) => {
            if (
                !StateField.value ||
                StateField.value === "" ||
                StateField.value === null
            ) {
                isValid = false;
                MissingFields.push(StateField.name);
            }
        });

        if (isValid) {
            try {
                toast.loading("Generating PDF...", {
                    id: "Generating",
                });

                // Set the process
                dispatch(
                    setProcess({
                        isLoading: true,
                    })
                );

                // Check Session ID
                if (!Session["Session Id"]) {
                    // Reset the process
                    dispatch(
                        setProcess({
                            isLoading: false,
                            name: "Error",
                            description: "An error has occured.",
                        })
                    );
                    toast.dismiss("Generating");

                    return toast.error("Session ID not found.");
                }

                // Start the Process
                const GENERATION_URL = `${getApiServerUrl()}/api/v1/generate?Session_Id=${
                    Session["Session Id"]
                }`;

                const Response = await axios.post(GENERATION_URL, {
                    Values: Session.Extraction?.Corrected,
                });

                console.log(
                    "Given Values to Generation URL: ",
                    Session.Extraction?.Corrected
                );

                console.log("Response from Generation URL: ", Response);

                if (Response.status === 200 && Response.data?.Session != null) {
                    toast.dismiss("Generating");
                    toast.success("PDF Generated Successfully.");

                    // Set the process
                    dispatch(
                        setProcess({
                            isLoading: false,
                        })
                    );

                    // Set the session
                    dispatch(setSession(Response.data?.Session as SessionType));

                    // Set the step
                    dispatch(setStep(Steps.Finish));
                } else {
                    // Reset the process
                    dispatch(
                        setProcess({
                            isLoading: false,
                            name: "Error",
                            description: "An error has occured.",
                        })
                    );
                    toast.dismiss("Generating");

                    return toast.error("Error while generating PDF.");
                }
            } catch (Error) {
                console.log("Error while sending request: ", Error);
                // Reset the process
                dispatch(
                    setProcess({
                        isLoading: false,
                        name: "Error",
                        description: "An error has occured.",
                    })
                );
                toast.error(`${Error}`);
            }
        }
    };

    return (
        <div className="relative w-full">
            {!Process.isLoading && (
                <>
                    <Heading />
                    {
                        // If the file exists
                        File?.file && <Preview />
                    }
                    <Fields />
                </>
            )}
            {Process.isLoading && <Processing />}
            {/* Next Step */}

            {!Process.isLoading && (
                <>
                    <button
                        type="button"
                        onClick={handleNextStep}
                        className="inline-flex text-center w-full mb-2 gap-1 items-center justify-center px-3 py-2 text-sm font-medium text-white bg-purple-700 rounded-lg hover:bg-purple-800 focus:outline-none dark:bg-purple-600 dark:hover:bg-purple-700 focus:bg-purple-500 active:bg-purple-900 transition duration-150 ease-in-out"
                    >
                        Generate PDF
                        <ArrowRight3 color="currentColor" variant="Bulk" />
                    </button>
                    <button
                        type="button"
                        className="inline-flex w-full justify-center gap-1 items-center font-medium text-sm px-5 py-2.5 text-center bg-white rounded-lg border border-zinc-200 hover:bg-zinc-100 text-zinc-900 hover:text-purple-700 focus:z-10 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-600 dark:hover:text-white dark:hover:bg-zinc-700"
                        onClick={handleResetOperation}
                    >
                        <ArrowLeft3 color="currentColor" variant="Bulk" />
                        Back to Upload
                    </button>
                </>
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
                        onClick={handleCancelOperation}
                        className="inline-flex w-full justify-center items-center font-medium text-sm px-5 py-2.5 text-center bg-white rounded-lg border border-zinc-200 hover:bg-zinc-100 text-zinc-900 hover:text-purple-700 focus:z-10 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-600 dark:hover:text-white dark:hover:bg-zinc-700"
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
