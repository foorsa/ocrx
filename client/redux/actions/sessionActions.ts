import { Session as SessionType } from '@/redux/types/states/Session';

// sessionActions.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { initializeSessionAPI, extractTextAPI, extractTableAPI, correctTextAPI, correctTableAPI, translateTextAPI, translateTableAPI, generateDocumentAPI, processAllAPI } from '@/redux/apis/sessionAPI';
import { Doctype } from '../types/states/Document Type';
import { FileType } from '../types/states/File';
import { toast } from 'react-hot-toast';


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
            // FAST PIPELINE: Single request does init + extract + correct + translate + generate
            const Response: any = await toast.promise(processAllAPI(Doctype, UploadedFile), {
                loading: 'Processing document (extracting, correcting, translating & generating)...',
                success: 'Document processed and generated successfully!',
                error: 'Failed to process document.',
            });

            if (Response.Status === "Failed" || !Response.Session) {
                toast.error(Response.Error || "Failed to process document.");
                return rejectWithValue(Response.Error || "Failed to process document.");
            }

            const ProcessedSession = Response.Session as SessionType;

            console.log("[FAST] Document processed successfully:", ProcessedSession["Session Id"]);

            return ProcessedSession;
        } catch (error: any) {
            const message = error?.message || "Failed to process document.";
            toast.error(message);
            return rejectWithValue(message);
        }
    })

export const generateDocument
    = createAsyncThunk('session/generate', async (
        { CorrectedSession }: { CorrectedSession: SessionType },
        { rejectWithValue }
    ) => {
        console.log("[OK] Generating Document Response: ", CorrectedSession["Session Id"]);

        // If already generated (from fast pipeline) and user hasn't changed values, skip re-generation
        if (CorrectedSession.Status === "Generated" && CorrectedSession.Generation?.["PDF Link"]) {
            console.log("[OK] Document already generated from fast pipeline, skipping re-generation.");
            toast.success('Document ready!');
            return CorrectedSession;
        }

        const loadingToast = toast.loading('Generating Document...');

        try {
            const GeneratedDocument = await generateDocumentAPI(CorrectedSession);

            toast.dismiss(loadingToast);

            if (GeneratedDocument.Status === "Failed" || !GeneratedDocument.Session) {
                toast.error(GeneratedDocument.Error || "Failed to generate document.");
                return rejectWithValue(GeneratedDocument.Error || "Failed to generate document.");
            }

            const ProcessedSession = GeneratedDocument.Session as SessionType;

            toast.success('Document generated successfully.');

            console.log("[OK] Generated document successfully: " + GeneratedDocument.Session["Session Id"]);

            return ProcessedSession;
        } catch (error: any) {
            toast.dismiss(loadingToast);
            const message = error?.message || "Failed to generate document.";
            toast.error(message);
            return rejectWithValue(message);
        }
    })