import { createSlice } from '@reduxjs/toolkit';
import type { Reducer } from '@reduxjs/toolkit';
import { RequestStatus } from '../../../shared/types/request-status.types';
import type { HealthState } from '../types/health.types';
import { fetchHealth } from './health.thunks';

const initialState: HealthState = {
    data: null,
    status: RequestStatus.Idle,
    error: null,
};

export const healthSlice = createSlice({
    name: 'health',
    initialState,
    reducers: {},
    extraReducers: (builder): void =>
    {
        builder
            .addCase(fetchHealth.pending, (state): void =>
            {
                state.status = RequestStatus.Loading;
                state.error = null;
            })
            .addCase(fetchHealth.fulfilled, (state, action): void =>
            {
                state.status = RequestStatus.Succeeded;
                state.data = action.payload;
            })
            .addCase(fetchHealth.rejected, (state, action): void =>
            {
                state.status = RequestStatus.Failed;
                state.error = action.payload ?? 'API unreachable';
            });
    },
});

export const healthReducer: Reducer<HealthState> = healthSlice.reducer;
