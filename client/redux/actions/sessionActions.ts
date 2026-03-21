import { Session as SessionType } from '@/redux/types/states/Session';

// sessionActions.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { processDocumentAPI, processDocumentStreamAPI, initializeSessionAPI, extractTextAPI, extractTableAPI, correctTextAPI, correctTableAPI, translateTextAPI, translateTableAPI, generateDocumentAPI } from '@/redux/apis/sessionAPI';
import { Doctype } from '../types/states/Document Type';
import { FileType } from '../types/states/File';
import { toast } from 'react-hot-toast';
import { setPhase, updateStreamingField } from '@/redux/slices/sessionSlice';


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

            console.log("[OK] Session Processed Successfully, setting Session in Redux Store.");
            console.log("[OK] Session: ", ProcessedSession);

            return ProcessedSession;
        } catch (error: any) {
            const message = error?.message || "Failed to process document.";
            toast.error(message);
            return rejectWithValue(message);
        }
    })

export const processDocumentStream
    = createAsyncThunk('session/processStream', async (
        {
            Doctype, UploadedFile
        }: {
            Doctype: Doctype;
            UploadedFile: FileType;
        },
        { dispatch, rejectWithValue }
    ) => {
        const loadingToast = toast.loading('Processing Document (streaming)...');

        try {
            const session = await processDocumentStreamAPI(
                Doctype,
                UploadedFile,
                (eventData: any) => {
                    // Handle different event types from the SSE stream
                    if (eventData.phase) {
                        dispatch(setPhase(eventData.phase));
                    }

                    if (eventData.type === 'streaming' && eventData.field) {
                        dispatch(updateStreamingField({
                            field: eventData.field,
                            value: eventData.value,
                        }));
                    }
                }
            );

            toast.dismiss(loadingToast);
            toast.success('Document processed successfully.');

            console.log("[OK] Session Processed via Stream Successfully, setting Session in Redux Store.");
            console.log("[OK] Session: ", session);

            return session;
        } catch (streamError: any) {
            console.warn("[STREAM] Streaming failed, falling back to standard processing:", streamError?.message);
            toast.dismiss(loadingToast);

            // Fallback to the existing processDocumentAPI
            try {
                const ProcessResponse: any = await toast.promise(processDocumentAPI(Doctype, UploadedFile), {
                    loading: 'Processing Document (fallback)...',
                    success: 'Document processed successfully.',
                    error: 'Failed to process document.',
                });

                if (ProcessResponse.Status === "Failed" || !ProcessResponse.Session) {
                    toast.error(ProcessResponse.Error);
                    return rejectWithValue(ProcessResponse.Error || "Failed to process document.");
                }

                const ProcessedSession = ProcessResponse.Session as SessionType;

                console.log("[OK] Session Processed via Fallback Successfully.");
                console.log("[OK] Session: ", ProcessedSession);

                return ProcessedSession;
            } catch (fallbackError: any) {
                const message = fallbackError?.message || "Failed to process document.";
                toast.error(message);
                return rejectWithValue(message);
            }
        }
    })

export const generateDocument
    = createAsyncThunk('session/generate', async (
        { CorrectedSession }: { CorrectedSession: SessionType },
        { rejectWithValue }
    ) => {
        console.log("[OK] Generating Document Response: ", CorrectedSession["Session Id"]);

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