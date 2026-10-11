import { DEFAULT_FILTERS } from '@/features/applications/applications.constants';
import type { ApplicationFilters, ApplicationsState, JobApplication } from '@/features/applications/applications.types';
import { RequestStatus } from '@/shared/types';
import type { Page } from '@/shared/types';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction, Reducer } from '@reduxjs/toolkit';

const initialState: ApplicationsState = {
    filters: DEFAULT_FILTERS,
    items: [],
    meta: null,
    listStatus: RequestStatus.Idle,
    listError: null,
    selected: null,
    selectedStatus: RequestStatus.Idle,
    selectedError: null,
    saveStatus: RequestStatus.Idle,
    saveError: null,
};

const applicationsSlice = createSlice({
    name: 'applications',
    initialState,
    reducers: {
        filtersChanged: (state, action: PayloadAction<Partial<ApplicationFilters>>): void =>
        {
            state.filters = { ...state.filters, page: 1, ...action.payload };
        },
        filtersReset: (state): void =>
        {
            state.filters = DEFAULT_FILTERS;
        },
        saveErrorCleared: (state): void =>
        {
            state.saveError = null;
        },
        listRequested: (state): void =>
        {
            state.listStatus = RequestStatus.Loading;
            state.listError = null;
        },
        listLoaded: (state, action: PayloadAction<Page<JobApplication>>): void =>
        {
            state.listStatus = RequestStatus.Succeeded;
            state.items = action.payload.items;
            state.meta = action.payload.meta;
        },
        listFailed: (state, action: PayloadAction<string>): void =>
        {
            state.listStatus = RequestStatus.Failed;
            state.listError = action.payload;
        },
        selectedRequested: (state): void =>
        {
            state.selectedStatus = RequestStatus.Loading;
            state.selectedError = null;
            state.selected = null;
        },
        selectedLoaded: (state, action: PayloadAction<JobApplication>): void =>
        {
            state.selectedStatus = RequestStatus.Succeeded;
            state.selected = action.payload;
        },
        selectedFailed: (state, action: PayloadAction<string>): void =>
        {
            state.selectedStatus = RequestStatus.Failed;
            state.selectedError = action.payload;
        },
        saveRequested: (state): void =>
        {
            state.saveStatus = RequestStatus.Loading;
            state.saveError = null;
        },
        saveFailed: (state, action: PayloadAction<string>): void =>
        {
            state.saveStatus = RequestStatus.Failed;
            state.saveError = action.payload;
        },
        applicationCreated: (state): void =>
        {
            state.saveStatus = RequestStatus.Succeeded;
        },
        applicationUpdated: (state, action: PayloadAction<JobApplication>): void =>
        {
            state.saveStatus = RequestStatus.Succeeded;
            state.items = state.items.map((item) => item.id === action.payload.id ? action.payload : item);
            if (state.selected?.id === action.payload.id)
            {
                state.selected = action.payload;
            }
        },
        applicationDeleted: (state, action: PayloadAction<string>): void =>
        {
            state.items = state.items.filter((item) => item.id !== action.payload);
            if (state.selected?.id === action.payload)
            {
                state.selected = null;
            }
        },
        applicationsCleared: (): ApplicationsState => initialState,
    },
});

export const {
    filtersChanged,
    filtersReset,
    saveErrorCleared,
    listRequested,
    listLoaded,
    listFailed,
    selectedRequested,
    selectedLoaded,
    selectedFailed,
    saveRequested,
    saveFailed,
    applicationCreated,
    applicationUpdated,
    applicationDeleted,
    applicationsCleared,
} = applicationsSlice.actions;

export const applicationsReducer: Reducer<ApplicationsState> = applicationsSlice.reducer;
