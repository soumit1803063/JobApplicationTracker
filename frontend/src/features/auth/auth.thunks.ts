import type { AppThunk } from '@/app/redux';
import { applicationsCleared } from '@/features/applications/applications.slice';
import * as authApi from '@/features/auth/auth.api';
import { authFailed, authRequested, authSucceeded, loggedOut, sessionRestored } from '@/features/auth/auth.slice';
import type { AuthResponse, LoginRequest, RegisterRequest } from '@/features/auth/auth.types';
import { clearToken, getToken, saveToken } from '@/shared/api';
import { getErrorMessage } from '@/shared/utils';

export function restoreSession(): AppThunk
{
    return async (dispatch): Promise<void> =>
    {
        if (!getToken())
        {
            dispatch(sessionRestored(null));
            return;
        }
        try
        {
            dispatch(sessionRestored(await authApi.getCurrentUser()));
        }
        catch
        {
            clearToken();
            dispatch(sessionRestored(null));
        }
    };
}

function authenticate(request: () => Promise<AuthResponse>): AppThunk
{
    return async (dispatch): Promise<void> =>
    {
        dispatch(authRequested());
        try
        {
            const { accessToken } = await request();
            saveToken(accessToken);
            dispatch(authSucceeded(await authApi.getCurrentUser()));
        }
        catch (error: unknown)
        {
            clearToken();
            dispatch(authFailed(getErrorMessage(error)));
        }
    };
}

export function loginUser(request: LoginRequest): AppThunk
{
    return authenticate(() => authApi.login(request));
}

export function registerUser(request: RegisterRequest): AppThunk
{
    return authenticate(() => authApi.register(request));
}

export function logoutUser(): AppThunk<void>
{
    return (dispatch): void =>
    {
        clearToken();
        dispatch(loggedOut());
        dispatch(applicationsCleared());
    };
}
