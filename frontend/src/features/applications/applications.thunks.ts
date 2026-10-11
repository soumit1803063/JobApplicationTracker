import type { AppThunk } from '@/app/redux';
import * as applicationsApi from '@/features/applications/applications.api';
import {
    applicationCreated,
    applicationDeleted,
    applicationUpdated,
    listFailed,
    listLoaded,
    listRequested,
    saveFailed,
    saveRequested,
    selectedFailed,
    selectedLoaded,
    selectedRequested,
} from '@/features/applications/applications.slice';
import type {
    ApplicationFilters,
    ApplicationPayload,
    JobApplication,
} from '@/features/applications/applications.types';
import { getErrorMessage } from '@/shared/utils';

export function loadApplications(filters: ApplicationFilters): AppThunk
{
    return async (dispatch): Promise<void> =>
    {
        dispatch(listRequested());
        try
        {
            dispatch(listLoaded(await applicationsApi.getApplications(filters)));
        }
        catch (error: unknown)
        {
            dispatch(listFailed(getErrorMessage(error)));
        }
    };
}

export function loadApplication(id: string): AppThunk
{
    return async (dispatch): Promise<void> =>
    {
        dispatch(selectedRequested());
        try
        {
            dispatch(selectedLoaded(await applicationsApi.getApplication(id)));
        }
        catch (error: unknown)
        {
            dispatch(selectedFailed(getErrorMessage(error)));
        }
    };
}

export function createApplication(payload: ApplicationPayload): AppThunk<Promise<JobApplication | null>>
{
    return async (dispatch): Promise<JobApplication | null> =>
    {
        dispatch(saveRequested());
        try
        {
            const created: JobApplication = await applicationsApi.createApplication(payload);
            dispatch(applicationCreated());
            return created;
        }
        catch (error: unknown)
        {
            dispatch(saveFailed(getErrorMessage(error)));
            return null;
        }
    };
}

export function updateApplication(
    id: string,
    payload: Partial<ApplicationPayload>,
): AppThunk<Promise<JobApplication | null>>
{
    return async (dispatch): Promise<JobApplication | null> =>
    {
        dispatch(saveRequested());
        try
        {
            const updated: JobApplication = await applicationsApi.updateApplication(id, payload);
            dispatch(applicationUpdated(updated));
            return updated;
        }
        catch (error: unknown)
        {
            dispatch(saveFailed(getErrorMessage(error)));
            return null;
        }
    };
}

export function deleteApplication(id: string): AppThunk<Promise<boolean>>
{
    return async (dispatch): Promise<boolean> =>
    {
        try
        {
            await applicationsApi.deleteApplication(id);
            dispatch(applicationDeleted(id));
            return true;
        }
        catch
        {
            return false;
        }
    };
}
