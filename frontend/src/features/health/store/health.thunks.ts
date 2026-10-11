import { createAppAsyncThunk } from '@/app/thunk';
import { getHealth } from '@/features/health/api/health.api';
import type { HealthStatus } from '@/features/health/types/health.types';

export const fetchHealth = createAppAsyncThunk<HealthStatus, undefined>(
    'health/fetch',
    async (_arg, { rejectWithValue }) =>
    {
        try
        {
            return await getHealth();
        }
        catch (error: unknown)
        {
            return rejectWithValue(error instanceof Error ? error.message : 'API unreachable');
        }
    },
);
