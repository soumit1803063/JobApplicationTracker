export const API_BASE_URL = '/api';

export const TOKEN_STORAGE_KEY = 'jat.accessToken';

export enum ApiEndpoints
{
    AuthRegister = '/auth/register',
    AuthLogin = '/auth/login',
    AuthMe = '/auth/me',
    Applications = '/applications',
    ApplicationById = '/applications/:id',
}

export enum AppRoutes
{
    Home = '/',
    Login = '/login',
    Register = '/register',
    Applications = '/applications',
    ApplicationCreate = '/applications/new',
    ApplicationDetails = '/applications/:id',
    ApplicationEdit = '/applications/:id/edit',
}
