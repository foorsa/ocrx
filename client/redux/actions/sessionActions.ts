import { Session, Session as SessionType } from '@/redux/types/states/Session';

// sessionActions.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { initializeSessionAPI } from '@/redux/apis/sessionAPI';
import { Doctype } from '../types/states/Document Type';
import { FileType } from '../types/states/File';
import { toast } from 'react-hot-toast';
import Axios, { CancelTokenSource } from 'axios';
import { create } from 'domain';

const cancelSignal = Axios.CancelToken.source();

export const initializeSession
    = createAsyncThunk('session/initialize', async (
        {
            Dispatch, Doctype, UploadedFile
        }: {
            Dispatch: any;
            Doctype: Doctype;
            UploadedFile: FileType;
        }
    ) => {

        const Response = await initializeSessionAPI(Dispatch, Doctype, UploadedFile, cancelSignal);

        console.log("Response: ", Response);

        toast.success("Session initialized successfully.");
        return {
            type: "session/initialize",
            payload: Response,
        }
    }) as any


export const abortOperation = createAsyncThunk('session/abort', async () => {
    toast.success("Session cancelled successfully.");

    cancelSignal.cancel("Operation Cancelled.");

    return {
        type: "session/cancel",
        payload: null,
    }
}) as any;

