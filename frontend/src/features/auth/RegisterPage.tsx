import { useAppDispatch, useAppSelector } from '@/app/redux';
import { authErrorCleared } from '@/features/auth/auth.slice';
import { registerUser } from '@/features/auth/auth.thunks';
import { Button } from '@/shared/components/Button';
import { ErrorMessage } from '@/shared/components/Feedback';
import { Field, Input } from '@/shared/components/Field';
import { AppRoutes } from '@/shared/constants';
import { RequestStatus } from '@/shared/types';
import { useEffect, useState } from 'react';
import type { JSX, SubmitEvent } from 'react';
import { Link, Navigate } from 'react-router';

export function RegisterPage(): JSX.Element
{
    const dispatch = useAppDispatch();
    const { user, status, error } = useAppSelector((state) => state.auth);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect((): void =>
    {
        dispatch(authErrorCleared());
    }, [dispatch]);

    if (user)
    {
        return <Navigate to={AppRoutes.Applications} replace />;
    }

    function handleSubmit(event: SubmitEvent<HTMLFormElement>): void
    {
        event.preventDefault();
        void dispatch(registerUser({ email, password, name: name.trim() || undefined }));
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-700">Create an account</h2>
            <ErrorMessage message={error} />
            <Field label="Name (optional)" htmlFor="name">
                <Input id="name" value={name} onChange={(event): void => setName(event.target.value)} />
            </Field>
            <Field label="Email" htmlFor="email">
                <Input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(event): void => setEmail(event.target.value)}
                />
            </Field>
            <Field label="Password (at least 8 characters)" htmlFor="password">
                <Input
                    id="password"
                    type="password"
                    required
                    minLength={8}
                    value={password}
                    onChange={(event): void => setPassword(event.target.value)}
                />
            </Field>
            <Button type="submit" className="w-full" isLoading={status === RequestStatus.Loading}>
                Create account
            </Button>
            <p className="text-center text-sm text-slate-600">
                Already have an account?{' '}
                <Link to={AppRoutes.Login} className="font-medium text-indigo-600 hover:underline">
                    Log in
                </Link>
            </p>
        </form>
    );
}
