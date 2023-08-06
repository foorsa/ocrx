import { SessionAction, SET_SESSION, CLEAR_SESSION } from '@/redux/types/actions/sessionActionTypes';
import { Session } from '@/redux/types/states/Session';

// sessionActions.js

import { createAsyncThunk } from '@reduxjs/toolkit';
import { initializeSessionAPI, extractTextAPI, extractTableAPI, ... } from '../api'; // Import your API functions

export const initializeSession = createAsyncThunk('session/initialize', async () => {
    const response = await initializeSessionAPI();
    return response.Session;
});

export const extractText = createAsyncThunk('session/extractText', async () => {
    const response = await extractTextAPI();
    return response.Session;
});

// Define similar async actions for the remaining API calls (extractTable, correctText, correctTable, translateText, translateTable, generateDocument)
