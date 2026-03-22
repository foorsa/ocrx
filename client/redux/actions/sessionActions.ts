import { Session as SessionType } from '@/redux/types/states/Session';

// sessionActions.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { processDocumentAPI, processDocumentStreamAPI, initializeSessionAPI, extractTextAPI, extractTableAPI, correctTextAPI, correctTableAPI, translateTextAPI, translateTableAPI, generateDocumentAPI } from '@/redux/apis/sessionAPI';
import { Doctype } from '../types/states/Document Type';
import { FileType, BatchFileType } from '../types/states/File';
import { toast } from 'react-hot-toast';
import { setPhase, updateStreamingField, setBatchProgress } from '@/redux/slices/sessionSlice';

// Generation counter — incremented every time a new single-doc stream starts.
// Each stream callback checks its captured generation against this value before
// dispatching any updates, so a superseded stream can never pollute a newer one.
let currentStreamGeneration = 0;

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
        // Claim a generation slot — any older running stream will see its
        // generation is stale and stop dispatching updates to Redux.
        const myGeneration = ++currentStreamGeneration;

        try {
            const session = await processDocumentStreamAPI(
                Doctype,
                UploadedFile,
                (eventData: any) => {
                    // Only dispatch if we are still the active stream
                    if (currentStreamGeneration !== myGeneration) return;
                    if (eventData.phase) dispatch(setPhase(eventData.phase));
                    if (eventData.type === 'streaming' && eventData.field) {
                        dispatch(updateStreamingField({ field: eventData.field, value: eventData.value }));
                    }
                }
            );

            // Guard final state update against a superseded stream
            if (currentStreamGeneration !== myGeneration) {
                return rejectWithValue("Stream superseded by newer request");
            }

            toast.success('Document processed successfully.');
            return session;
        } catch (streamError: any) {
            // Skip fallback if this stream has been superseded
            if (currentStreamGeneration !== myGeneration) {
                return rejectWithValue("Stream superseded");
            }

            console.warn("[STREAM] Streaming failed, falling back:", streamError?.message);
            try {
                const ProcessResponse: any = await toast.promise(processDocumentAPI(Doctype, UploadedFile), {
                    loading: 'Processing Document (fallback)...',
                    success: 'Document processed successfully.',
                    error: 'Failed to process document.',
                });
                if (currentStreamGeneration !== myGeneration) {
                    return rejectWithValue("Stream superseded during fallback");
                }
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

const BATCH_CONCURRENCY = 5;

export const processBatch = createAsyncThunk(
    'session/processBatch',
    async (
        { Doctype, Files }: { Doctype: Doctype; Files: BatchFileType[] },
        { dispatch, rejectWithValue }
    ) => {
        const results: SessionType[] = [];
        let completedCount = 0;
        for (const file of Files) {
            dispatch(setBatchProgress({ fileId: file.id, fileName: file.name, status: "pending", phase: "waiting", session: null, error: null }));
        }
        const queue = [...Files];
        const processOne = async (file: BatchFileType) => {
            dispatch(setBatchProgress({ fileId: file.id, fileName: file.name, status: "processing", phase: "starting", session: null, error: null }));
            try {
                const session = await processDocumentStreamAPI(Doctype, file, (eventData: any) => {
                    if (eventData.phase) {
                        dispatch(setBatchProgress({ fileId: file.id, fileName: file.name, status: "processing", phase: eventData.phase, session: null, error: null }));
                    }
                });
                results.push(session);
                completedCount++;
                dispatch(setBatchProgress({ fileId: file.id, fileName: file.name, status: "completed", phase: "complete", session, error: null }));
                toast.success(file.name + ' processed (' + completedCount + '/' + Files.length + ')', { duration: 2000 });
            } catch (err: any) {
                try {
                    const resp: any = await processDocumentAPI(Doctype, file);
                    if (resp.Session) {
                        results.push(resp.Session);
                        completedCount++;
                        dispatch(setBatchProgress({ fileId: file.id, fileName: file.name, status: "completed", phase: "complete", session: resp.Session, error: null }));
                        toast.success(file.name + ' processed (' + completedCount + '/' + Files.length + ')', { duration: 2000 });
                        return;
                    }
                } catch { }
                dispatch(setBatchProgress({ fileId: file.id, fileName: file.name, status: "failed", phase: "error", session: null, error: err?.message || "Failed to process" }));
            }
        };
        const runWithConcurrency = async () => {
            const executing = new Set<Promise<void>>();
            for (const file of queue) {
                const p = processOne(file).then(() => { executing.delete(p); });
                executing.add(p);
                if (executing.size >= BATCH_CONCURRENCY) await Promise.race(executing);
            }
            await Promise.all(executing);
        };
        try {
            await runWithConcurrency();
            toast.success('Batch complete: ' + completedCount + '/' + Files.length + ' processed');
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
