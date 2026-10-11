import { AppRoutes } from '@/shared/constants';
import type { JSX } from 'react';
import { Link } from 'react-router';

export function NotFoundPage(): JSX.Element
{
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-100">
            <h1 className="text-6xl font-bold text-slate-300">404</h1>
            <p className="text-slate-600">This page does not exist.</p>
            <Link to={AppRoutes.Applications} className="font-medium text-indigo-600 hover:underline">
                Back to applications
            </Link>
        </div>
    );
}
