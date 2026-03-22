import { Session as SessionType } from '@/redux/types/states/Session';

// sessionActions.ts
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
        try {
            const session = await processDocumentStreamAPI(
                Doctype,
                UploadedFile,
                (eventData: any) => {
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

            toast.success('Document processed successfully.');
            return session;
        } catch (streamError: any) {
            console.warn("[STREAM] Streaming failed, falling back to standard processing:", streamError?.message);

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

                return ProcessResponse.Session as SessionType;
            } catch (fallbackError: any) {
                const message = fallbackError?.message || "Failed to process document.";
                toast.error(message);
                return rejectWithValue(message);
            }
        }
    })


// Batch processing: process multiple files with concurrency control
const BATCH_CONCURRENCY = 5; // Max parallel streams

export const processBatch = createAsyncThunk(
    'session/processBatch',
    async (
        {
            Doctype,
            Files,
        }: {
            Doctype: Doctype;
            Files: BatchFileType[];
        },
        { dispatch, rejectWithValue }
    ) => {
        const results: SessionType[] = [];
        let completedCount = 0;

        // Initialize progress for all files
        for (const file of Files) {
            dispatch(setBatchProgress({
                fileId: file.id,
                fileName: file.name,
                status: "pending",
                phase: "waiting",
                session: null,
                error: null,
            }));
        }

        // Process with concurrency limit
        const queue = [...Files];
        const inFlight: Promise<void>[] = [];

        const processOne = async (file: BatchFileType) => {
            dispatch(setBatchProgress({
                fileId: file.id,
                fileName: file.name,
                status: "processing",
                phase: "starting",
                session: null,
                error: null,
            }));

            try {
                const session = await processDocumentStreamAPI(
                    Doctype,
                    file,
                    (eventData: any) => {
                        if (eventData.phase) {
                            dispatch(setBatchProgress({
                                fileId: file.id,
                                fileName: file.name,
                                status: "processing",
                                phase: eventData.phase,
                                session: null,
                                error: null,
                            }));
                        }
                    }
                );

                results.push(session);
                completedCount++;

                dispatch(setBatchProgress({
                    fileId: file.id,
                    fileName: file.name,
                    status: "completed",
                    phase: "complete",
                    session,
                    error: null,
                }));

                toast.success(`${file.name} processed (${completedCount}/${Files.length})`, { duration: 2000 });
            } catch (err: any) {
                // Fallback to sync API
                try {
                    const resp: any = await processDocumentAPI(Doctype, file);
                    if (resp.Session) {
                        results.push(resp.Session);
                        completedCount++;
                        dispatch(setBatchProgress({
                            fileId: file.id,
                            fileName: file.name,
                            status: "completed",
                            phase: "complete",
                            session: resp.Session,
                            error: null,
                        }));
                        toast.success(`${file.name} processed (${completedCount}/${Files.length})`, { duration: 2000 });
                        return;
                    }
                } catch {
                    // Both failed
                }

                dispatch(setBatchProgress({
                    fileId: file.id,
                    fileName: file.name,
                    status: "failed",
                    phase: "error",
                    session: null,
                    error: err?.message || "Failed to process",
                }));
            }
        };

        // Concurrency-limited execution
        const runWithConcurrency = async () => {
            const executing = new Set<Promise<void>>();

            for (const file of queue) {
                const p = processOne(file).then(() => {
                    executing.delete(p);
                });
                executing.add(p);

                if (executing.size >= BATCH_CONCURRENCY) {
                    await Promise.race(executing);
                }
            }

            await Promise.all(executing);
        };

        try {
            await runWithConcurrency();
            toast.success(`Batch complete: ${completedCount}/${Files.length} processed`);
            return results;
        } catch (error: any) {
            return rejectWithValue(error?.message || "Batch processing failed");
        }
    }
);


export const generateDocument
    = createAsyncThunk('session/generate', async (
        { CorrectedSession }: { CorrectedSession: SessionType },
        { rejectWithValue }
    ) => {
        try {
            const GeneratedDocument = await generateDocumentAPI(CorrectedSession);

            if (GeneratedDocument.Status === "Failed" || !GeneratedDocument.Session) {
                toast.error(GeneratedDocument.Error || "Failed to generate document.");
                return rejectWithValue(GeneratedDocument.Error || "Failed to generate document.");
            }

            const ProcessedSession = GeneratedDocument.Session as SessionType;

            toast.success('Document generated successfully.');
            return ProcessedSession;
        } catch (error: any) {
            const message = error?.message || "Failed to generate document.";
            toast.error(message);
            return rejectWithValue(message);
        }
    })
