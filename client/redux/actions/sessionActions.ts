import { Session as SessionType } from '@/redux/types/states/Session';

// sessionActions.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { initializeSessionAPI, extractTextAPI, extractTableAPI, correctTextAPI, correctTableAPI, translateTextAPI, translateTableAPI, generateDocumentAPI } from '@/redux/apis/sessionAPI';
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
        }
    ) => {
        const MINUTE_MS = 60000; // 1 minute in milliseconds
        const REQUESTS_PER_MINUTE = 1; // Number of requests allowed per minute
        const REQUEST_DELAY = MINUTE_MS / REQUESTS_PER_MINUTE; // Delay between requests

        let requestCount = 0;
        let lastRequestTime = 0;

        // Function to wait for the remaining time in the minute if needed
        const waitForRemainingTime = async () => {
            const currentTime = Date.now();
            const elapsedSinceLastRequest = currentTime - lastRequestTime;

            if (requestCount >= REQUESTS_PER_MINUTE && elapsedSinceLastRequest < MINUTE_MS) {
                const remainingTime = MINUTE_MS - elapsedSinceLastRequest;
                await toast.promise(new Promise((resolve) => setTimeout(resolve, remainingTime + 10000)), {
                    loading: 'Hold on...',
                    success: 'Time waited successfully. ',
                    error: 'Failed to wait for remaining time.',
                }).then((Result) => {
                    return Result
                });
            }

            requestCount++;
            lastRequestTime = Date.now();
        };


        // STEP ONE: Initialize the Operation
        const InitializeResponse = await toast.promise(initializeSessionAPI(Doctype, UploadedFile), {
            loading: 'Initializing Session...',
            success: 'Session initialized successfully.',
            error: 'Failed to initialize session.',
        }).then((Result) => {
            return Result
        });


        if (InitializeResponse.Status === "Failed" || !InitializeResponse.Session) {
            toast.error(InitializeResponse.Error);
            return null

        }

        // STEP TWO: Extract Text
        const ExtractTextResponse = await toast.promise(extractTextAPI(InitializeResponse.Session), {
            loading: 'Extracting Text...',
            success: 'Text extracted successfully.',
            error: "Failed to extract text from file."
        }).then((Result) => {
            return Result
        });

        if (ExtractTextResponse.Status === "Failed" || !ExtractTextResponse.Session) {
            toast.error(ExtractTextResponse.Error);
            return null
        }

        // STEP THREE: Extract Table
        const ExtractTableResponse = ExtractTextResponse;

        if (ExtractTextResponse.Session["Information Type"] == "Tabular") {
            const ExtractTableResponse = await toast.promise(extractTableAPI(ExtractTextResponse.Session), {
                loading: 'Extracting Tables...',
                success: 'Tables extracted successfully.',
                error: "Failed to extract tables from file."
            }).then((Result) => {
                return Result
            });

            if (ExtractTableResponse.Status === "Failed" || !ExtractTableResponse.Session) {
                toast.error(ExtractTableResponse.Error);
                return null
            }
        }

        // Step FOUR: Correct Text
        await waitForRemainingTime();
        const CorrectTextResponse = await toast.promise(correctTextAPI(ExtractTableResponse.Session), {
            loading: 'Correcting Text...',
            success: 'Text corrected successfully.',
            error: "Failed to correct text."
        }).then((Result) => {
            return Result
        });

        if (CorrectTextResponse.Status === "Failed" || !CorrectTextResponse.Session) {
            toast.error(CorrectTextResponse.Error);
            return null

        }

        // Step FIVE: Correct Table
        await waitForRemainingTime();
        const CorrectTableResponse = CorrectTextResponse;

        if (CorrectTextResponse.Session["Information Type"] == "Tabular") {
            const CorrectTableResponse = await toast.promise(correctTableAPI(CorrectTextResponse.Session), {
                loading: 'Correcting Tables...',
                success: 'Tables corrected successfully.',
                error: "Failed to correct tables."
            }).then((Result) => {
                return Result
            });

            if (CorrectTableResponse.Status === "Failed" || !CorrectTableResponse.Session) {
                toast.error(CorrectTableResponse.Error);
                return null
            }
        }

        // Step SIX: Translate Text
        await waitForRemainingTime();
        const TranslateTextResponse = await toast.promise(translateTextAPI(CorrectTableResponse.Session), {
            loading: 'Translating Text...',
            success: 'Text translated successfully.',
            error: "Failed to translate text."
        }).then((Result) => {
            return Result
        });

        if (TranslateTextResponse.Status === "Failed" || !TranslateTextResponse.Session) {
            toast.error(TranslateTextResponse.Error);
            return null
        }

        // Step SEVEN: Translate Table
        await waitForRemainingTime();
        const TranslateTableResponse = TranslateTextResponse;

        if (TranslateTextResponse.Session["Information Type"] == "Tabular") {
            const TranslateTableResponse = await toast.promise(translateTableAPI(TranslateTextResponse.Session), {
                loading: 'Translating Tables...',
                success: 'Tables translated successfully.',
                error: "Failed to translate tables."
            }).then((Result) => {
                return Result
            });

            if (TranslateTableResponse.Status === "Failed" || !TranslateTableResponse.Session) {
                toast.error(TranslateTableResponse.Error);
                return null
            }
        }

        // Step EIGHT: Generate Document
        const GenerateDocumentResponse = await toast.promise(generateDocumentAPI(TranslateTableResponse.Session), {
            loading: 'Generating Document...',
            success: 'Document generated successfully.',
            error: "Failed to generate document."
        }).then((Result) => {
            return Result
        });

        if (GenerateDocumentResponse.Status === "Failed" || !GenerateDocumentResponse.Session) {
            toast.error(GenerateDocumentResponse.Error);
            return null

        }

        const ProcessedSession = GenerateDocumentResponse.Session as SessionType;

        console.log("[STEP ONE] Session Processed Successfully, setting Session in Redux Store.");

        console.log("[STEP TWO] Logging Session: ", ProcessedSession);

        return ProcessedSession
    })

export const generateDocument
    = createAsyncThunk('session/generate', async (
        { CorrectedSession }: { CorrectedSession: SessionType }
    ) => {
        console.log("[OK] Generating Document Response: ", CorrectedSession["Session Id"]);

        const GeneratedDocument = await toast.promise(generateDocumentAPI(CorrectedSession), {
            loading: 'Generating Document...',
            success: 'Document generated successfully.',
            error: "Failed to generate document function."
        }).then((Result) => {
            return Result
        });

        if (GeneratedDocument.Status === "Failed" || !GeneratedDocument.Session) {
            toast.error(GeneratedDocument.Error);
            return CorrectedSession
        }

        const ProcessedSession = GeneratedDocument.Session as SessionType;

        console.log("[OK] Generated document successfully: " + GeneratedDocument.Session["Session Id"]);

        return ProcessedSession
    })


