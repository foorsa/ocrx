import { getApiServerUrl } from '@/utils/getApiServerUrl';
import { FileType } from '../types/states/File';
import { Doctype } from '../types/states/Document Type';
import toast from 'react-hot-toast';
import Axios, { CancelTokenSource } from 'axios';

const SERVER_API = getApiServerUrl();

// STEP ONE: Initialize the Operation (/api/v1/initialize)
export const initializeSessionAPI = async (dispatch: any, doctype: Doctype, uploadedFile: FileType, cancelSignal
    : CancelTokenSource
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
            cancelToken: cancelSignal.token,
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
                    Error: "Failed to initialize the session. Please try again."
                };
            }
        }).catch((err) => {
            console.log(err);
            if (Axios.isCancel(err)) {
                console.log("Request Cancelled.");
                return {
                    Status: "Cancelled",
                    Error: "Request Cancelled."
                };
            }

            return {
                Status: "Failed",
                Error: "Failed to initialize the session. Please try again."
            };
        });

    return Response;
};