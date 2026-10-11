import type { ComponentProps, JSX } from 'react';
import { Link } from 'react-router';

type ButtonVariant = 'primary' | 'secondary' | 'danger';

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
    secondary: 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50',
    danger: 'bg-red-600 text-white hover:bg-red-700',
};

function buttonClasses(variant: ButtonVariant, className: string): string
{
    return `inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
        VARIANT_CLASSES[variant]
    } ${className}`;
}

interface ButtonProps extends ComponentProps<'button'>
{
    variant?: ButtonVariant;
    isLoading?: boolean;
}

export function Button({
    variant = 'primary',
    isLoading = false,
    className = '',
    type = 'button',
    disabled,
    children,
    ...props
}: ButtonProps): JSX.Element
{
    return (
        <button
            {...props}
            type={type}
            disabled={disabled === true || isLoading}
            className={buttonClasses(variant, className)}
        >
            {isLoading ? 'Please wait...' : children}
        </button>
    );
}

interface LinkButtonProps extends ComponentProps<typeof Link>
{
    variant?: ButtonVariant;
}

export function LinkButton({ variant = 'primary', className = '', ...props }: LinkButtonProps): JSX.Element
{
    return <Link {...props} className={buttonClasses(variant, typeof className === 'string' ? className : '')} />;
}
