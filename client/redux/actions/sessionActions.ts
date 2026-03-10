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
        // STEP ONE: Initialize the Operation
        const InitializeResponse: any = await toast.promise(initializeSessionAPI(Doctype, UploadedFile), {
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
        let ExtractTableResponse = ExtractTextResponse;

        if (ExtractTextResponse.Session["Information Type"] == "Tabular") {
            ExtractTableResponse = await toast.promise(extractTableAPI(ExtractTextResponse.Session), {
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
        let CorrectTableResponse = CorrectTextResponse;

        if (CorrectTextResponse.Session["Information Type"] == "Tabular") {
            CorrectTableResponse = await toast.promise(correctTableAPI(CorrectTextResponse.Session), {
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
        let TranslateTableResponse = TranslateTextResponse;

        if (TranslateTextResponse.Session["Information Type"] == "Tabular") {
            // // Wait for 20 seconds before continuing
            // await toast.promise(new Promise((resolve) => setTimeout(resolve, 20000)), {
            //     loading: 'Hold on...',
            //     success: 'Proceeding...',
            //     error: "Failed to wait for 20 seconds."
            // }).then((Result) => {
            //     return Result
            // });

            TranslateTableResponse = await toast.promise(translateTableAPI(TranslateTextResponse.Session), {
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

        const ProcessedSession = TranslateTableResponse.Session as SessionType;

        console.log("[STEP ONE] Session Processed Successfully, setting Session in Redux Store.");

        console.log("[STEP TWO] Logging Session: ", ProcessedSession);

        return ProcessedSession
    })

export const generateDocument
    = createAsyncThunk('session/generate', async (
        { CorrectedSession }: { CorrectedSession: SessionType },
        { rejectWithValue }
    ) => {
        console.log("[OK] Generating Document Response: ", CorrectedSession["Session Id"]);

        const loadingToast = toast.loading('Generating Document...');

        const GeneratedDocument = await generateDocumentAPI(CorrectedSession);

        toast.dismiss(loadingToast);

        if (GeneratedDocument.Status === "Failed" || !GeneratedDocument.Session) {
            toast.error(GeneratedDocument.Error || "Failed to generate document.");
            return rejectWithValue(GeneratedDocument.Error || "Failed to generate document.");
        }

        const ProcessedSession = GeneratedDocument.Session as SessionType;

        toast.success('Document generated successfully.');

        console.log("[OK] Generated document successfully: " + GeneratedDocument.Session["Session Id"]);

        return ProcessedSession
    })