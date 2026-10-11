import { AppLayout } from '@/app/AppLayout';
import { AuthLayout } from '@/app/AuthLayout';
import { NotFoundPage } from '@/app/NotFoundPage';
import { ApplicationDetailsPage } from '@/features/applications/ApplicationDetailsPage';
import { ApplicationFormPage } from '@/features/applications/ApplicationFormPage';
import { ApplicationsPage } from '@/features/applications/ApplicationsPage';
import { LoginPage } from '@/features/auth/LoginPage';
import { ProtectedRoute } from '@/features/auth/ProtectedRoute';
import { RegisterPage } from '@/features/auth/RegisterPage';
import { AppRoutes } from '@/shared/constants';
import type { JSX } from 'react';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router';

const router = createBrowserRouter([
    { path: AppRoutes.Home, element: <Navigate to={AppRoutes.Applications} replace /> },
    {
        element: <AuthLayout />,
        children: [
            { path: AppRoutes.Login, element: <LoginPage /> },
            { path: AppRoutes.Register, element: <RegisterPage /> },
        ],
    },
    {
        element: <ProtectedRoute />,
        children: [
            {
                element: <AppLayout />,
                children: [
                    { path: AppRoutes.Applications, element: <ApplicationsPage /> },
                    { path: AppRoutes.ApplicationCreate, element: <ApplicationFormPage /> },
                    { path: AppRoutes.ApplicationDetails, element: <ApplicationDetailsPage /> },
                    { path: AppRoutes.ApplicationEdit, element: <ApplicationFormPage /> },
                ],
            },
        ],
    },
    { path: '*', element: <NotFoundPage /> },
]);

export function AppRouter(): JSX.Element
{
    return <RouterProvider router={router} />;
}
