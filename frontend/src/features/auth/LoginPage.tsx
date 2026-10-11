import { useAppDispatch, useAppSelector } from '@/app/redux';
import { authErrorCleared } from '@/features/auth/auth.slice';
import { loginUser } from '@/features/auth/auth.thunks';
import { Button } from '@/shared/components/Button';
import { ErrorMessage } from '@/shared/components/Feedback';
import { Field, Input } from '@/shared/components/Field';
import { AppRoutes } from '@/shared/constants';
import { RequestStatus } from '@/shared/types';
import { useEffect, useState } from 'react';
import type { JSX, SubmitEvent } from 'react';
import { Link, Navigate, useLocation } from 'react-router';

function redirectPathFrom(state: unknown): string
{
    if (typeof state === 'object' && state !== null && 'from' in state && typeof state.from === 'string')
    {
        return state.from;
    }
    return AppRoutes.Applications;
}

export function LoginPage(): JSX.Element
{
    const dispatch = useAppDispatch();
    const location = useLocation();
    const { user, status, error } = useAppSelector((state) => state.auth);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect((): void =>
    {
        dispatch(authErrorCleared());
    }, [dispatch]);

    if (user)
    {
        return <Navigate to={redirectPathFrom(location.state)} replace />;
    }

    function handleSubmit(event: SubmitEvent<HTMLFormElement>): void
    {
        event.preventDefault();
        void dispatch(loginUser({ email, password }));
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-700">Log in</h2>
            <ErrorMessage message={error} />
            <Field label="Email" htmlFor="email">
                <Input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(event): void => setEmail(event.target.value)}
                />
            </Field>
            <Field label="Password" htmlFor="password">
                <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(event): void => setPassword(event.target.value)}
                />
            </Field>
            <Button type="submit" className="w-full" isLoading={status === RequestStatus.Loading}>
                Log in
            </Button>
            <p className="text-center text-sm text-slate-600">
                No account yet?{' '}
                <Link to={AppRoutes.Register} className="font-medium text-indigo-600 hover:underline">
                    Create one
                </Link>
            </p>
        </form>
    );
}
