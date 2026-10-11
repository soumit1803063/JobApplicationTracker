import { useAppDispatch, useAppSelector } from '@/app/redux';
import { logoutUser } from '@/features/auth/auth.thunks';
import { AppRoutes } from '@/shared/constants';
import type { JSX } from 'react';
import { Link, Outlet } from 'react-router';

export function AppLayout(): JSX.Element
{
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.auth.user);

    return (
        <div className="min-h-screen bg-slate-100">
            <header className="border-b border-slate-200 bg-white">
                <nav className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
                    <Link to={AppRoutes.Applications} className="text-lg font-bold text-slate-800">
                        Job Tracker
                    </Link>
                    <span className="ml-auto text-sm text-slate-500">{user?.name ?? user?.email}</span>
                    <button
                        type="button"
                        onClick={(): void =>
                        {
                            dispatch(logoutUser());
                        }}
                        className="text-sm font-medium text-slate-600 hover:text-red-600"
                    >
                        Log out
                    </button>
                </nav>
            </header>
            <main className="mx-auto max-w-6xl px-4 py-8">
                <Outlet />
            </main>
        </div>
    );
}
