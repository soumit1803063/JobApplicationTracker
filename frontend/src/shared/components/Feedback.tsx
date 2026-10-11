import type { JSX } from 'react';

export function Spinner({ fullPage = false }: { fullPage?: boolean; }): JSX.Element
{
    return (
        <div className={`flex items-center justify-center ${fullPage ? 'min-h-screen' : 'py-12'}`}>
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
        </div>
    );
}

export function ErrorMessage({ message }: { message: string | null; }): JSX.Element | null
{
    if (!message)
    {
        return null;
    }
    return <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{message}</p>;
}
