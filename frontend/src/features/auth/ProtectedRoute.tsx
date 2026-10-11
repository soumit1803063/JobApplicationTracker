import { useAppSelector } from '@/app/redux';
import { Spinner } from '@/shared/components/Feedback';
import { AppRoutes } from '@/shared/constants';
import type { JSX } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router';

export function ProtectedRoute(): JSX.Element
{
    const { user, isSessionChecked } = useAppSelector((state) => state.auth);
    const location = useLocation();

    if (!isSessionChecked)
    {
        return <Spinner fullPage />;
    }
    if (!user)
    {
        return <Navigate to={AppRoutes.Login} replace state={{ from: location.pathname }} />;
    }
    return <Outlet />;
}
