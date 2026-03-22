import { Session as SessionType } from '@/redux/types/states/Session';

// sessionActions.ts - deploy trigger
import { createAsyncThunk } from '@reduxjs/toolkit';
import { processDocumentAPI, processDocumentStreamAPI, initializeSessionAPI, extractTextAPI, extractTableAPI, correctTextAPI, correctTableAPI, translateTextAPI, translateTableAPI, generateDocumentAPI } from '@/redux/apis/sessionAPI';
import { Doctype } from '../types/states/Document Type';
import { FileType, BatchFileType } from '../types/states/File';
import { toast } from 'react-hot-toast';
import { setPhase, updateStreamingField, setBatchProgress } from '@/redux/slices/sessionSlice';


export const processDocument
    = createAsyncThunk('session/process', async (
        {
            Doctype, UploadedFile
        }: {
            Doctype: Doctype;
            UploadedFile: FileType;
        },
        { rejectWithValue }
    ) => {
        try {
            // Single combined API call: Initialize → Extract → Correct → Translate
            const ProcessResponse: any = await toast.promise(processDocumentAPI(Doctype, UploadedFile), {
                loading: 'Processing Document...',
                success: 'Document processed successfully.',
                error: 'Failed to process document.',
            });

            if (ProcessResponse.Status === "Failed" || !ProcessResponse.Session) {
                toast.error(ProcessResponse.Error);
                return rejectWithValue(ProcessResponse.Error || "Failed to process document.");
            }

            const ProcessedSession = ProcessResponse.Session as SessionType;
            return ProcessedSession;
