import type { ComponentProps, JSX, ReactNode } from 'react';

const CONTROL_CLASSES =
    'w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200';

interface FieldProps
{
    label: string;
    htmlFor: string;
    error?: string | undefined;
    children: ReactNode;
}

export function Field({ label, htmlFor, error, children }: FieldProps): JSX.Element
{
    return (
        <div className="space-y-1">
            <label htmlFor={htmlFor} className="block text-sm font-medium text-slate-700">
                {label}
            </label>
            {children}
            {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
    );
}

export function Input({ className = '', ...props }: ComponentProps<'input'>): JSX.Element
{
    return <input {...props} className={`${CONTROL_CLASSES} ${className}`} />;
}

export function Select({ className = '', ...props }: ComponentProps<'select'>): JSX.Element
{
    return <select {...props} className={`${CONTROL_CLASSES} ${className}`} />;
}
