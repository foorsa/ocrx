import { Session, Session as SessionType } from '@/redux/types/states/Session';

// sessionActions.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { initializeSessionAPI, extractTextAPI, extractTableAPI, correctTextAPI, correctTableAPI, translateTextAPI, translateTableAPI, generateDocumentAPI } from '@/redux/apis/sessionAPI';
import { Doctype } from '../types/states/Document Type';
import { FileType } from '../types/states/File';
import { toast } from 'react-hot-toast';
import Axios, { CancelTokenSource } from 'axios';
import { create } from 'domain';
import { TableDocument } from 'iconsax-react';

const cancelSignal = Axios.CancelToken.source();

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
        // const GenerateDocumentResponse = await generateDocumentAPI(TranslateTableResponse.Session);
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

        return ProcessedSession
    }) as any

export const generateDocument
    = createAsyncThunk('session/generate', async (
        Session: SessionType
    ) => {
        const GeneratedDocument = await toast.promise(generateDocumentAPI(Session), {
            loading: 'Generating Document...',
            success: 'Document generated successfully.',
            error: "Failed to generate document function."
        }).then((Result) => {
            return Result
        }
        );

        if (GeneratedDocument.Status === "Failed" || !GeneratedDocument.Session) {
            toast.error(GeneratedDocument.Error);
            return Session
        }

        const ProcessedSession = GeneratedDocument.Session as SessionType;

        return ProcessedSession
    }) as any


