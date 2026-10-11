import type { JSX } from 'react';
import { Outlet } from 'react-router';

export function AuthLayout(): JSX.Element
{
    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
            <div className="w-full max-w-md rounded-xl bg-white p-8 shadow">
                <h1 className="mb-6 text-center text-2xl font-bold text-slate-800">Job Application Tracker</h1>
                <Outlet />
            </div>
        </div>
    );
}
