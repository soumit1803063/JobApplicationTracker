import { applicationsReducer } from '@/features/applications/applications.slice';
import { authReducer } from '@/features/auth/auth.slice';
import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        applications: applicationsReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
