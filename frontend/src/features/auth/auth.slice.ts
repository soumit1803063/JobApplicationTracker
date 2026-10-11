import type { AuthState, User } from '@/features/auth/auth.types';
import { RequestStatus } from '@/shared/types';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction, Reducer } from '@reduxjs/toolkit';

const initialState: AuthState = {
    user: null,
    isSessionChecked: false,
    status: RequestStatus.Idle,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        authErrorCleared: (state): void =>
        {
            state.error = null;
        },
        sessionRestored: (state, action: PayloadAction<User | null>): void =>
        {
            state.user = action.payload;
            state.isSessionChecked = true;
        },
        authRequested: (state): void =>
        {
            state.status = RequestStatus.Loading;
            state.error = null;
        },
        authSucceeded: (state, action: PayloadAction<User>): void =>
        {
            state.status = RequestStatus.Succeeded;
            state.user = action.payload;
            state.isSessionChecked = true;
        },
        authFailed: (state, action: PayloadAction<string>): void =>
        {
            state.status = RequestStatus.Failed;
            state.error = action.payload;
        },
        loggedOut: (state): void =>
        {
            state.user = null;
            state.status = RequestStatus.Idle;
        },
    },
});

export const { authErrorCleared, sessionRestored, authRequested, authSucceeded, authFailed, loggedOut } =
    authSlice.actions;

export const authReducer: Reducer<AuthState> = authSlice.reducer;
