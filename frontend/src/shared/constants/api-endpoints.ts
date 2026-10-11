export const API_BASE_URL = '/api';

export enum ApiEndpoints
{
    Health = '/health',
    AuthRegister = '/auth/register',
    AuthLogin = '/auth/login',
    AuthMe = '/auth/me',
    Applications = '/applications',
    ApplicationById = '/applications/:id',
}
