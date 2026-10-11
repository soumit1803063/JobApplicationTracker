import { useEffect } from 'react';
import type React from 'react';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { fetchHealth } from './features/health/store/health.thunks';
import type { HealthState } from './features/health/types/health.types';
import { RequestStatus } from './shared/types/request-status.types';

function statusText({ data, status, error }: HealthState): string
{
    switch (status)
    {
        case RequestStatus.Idle:
        case RequestStatus.Loading:
            return 'checking...';
        case RequestStatus.Succeeded:
            return data?.status ?? 'unknown';
        case RequestStatus.Failed:
            return error ?? 'unreachable';
    }
}

function App(): React.JSX.Element
{
    const dispatch = useAppDispatch();
    const health = useAppSelector((state) => state.health);

    useEffect((): void =>
    {
        void dispatch(fetchHealth());
    }, [dispatch]);

    const isFailed = health.status === RequestStatus.Failed;

    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-100">
            <div className="rounded-xl bg-white p-8 shadow">
                <h1 className="text-2xl font-bold text-slate-800">Job Application Tracker</h1>
                <p className="mt-2 text-slate-600">
                    API status:{' '}
                    <span className={isFailed ? 'font-semibold text-red-600' : 'font-semibold text-emerald-600'}>
                        {statusText(health)}
                    </span>
                </p>
            </div>
        </main>
    );
}

export default App;
