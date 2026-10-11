import { useAppDispatch, useAppSelector } from '@/app/redux';
import { ApplyMedium } from '@/features/applications/applications.constants';
import { deleteApplication, loadApplication, updateApplication } from '@/features/applications/applications.thunks';
import { formatSalary } from '@/features/applications/applications.utils';
import { StatusBadge } from '@/features/applications/StatusBadge';
import { Button, LinkButton } from '@/shared/components/Button';
import { ErrorMessage, Spinner } from '@/shared/components/Feedback';
import { AppRoutes } from '@/shared/constants';
import { RequestStatus } from '@/shared/types';
import { buildPath, formatDateTime } from '@/shared/utils';
import { useEffect } from 'react';
import type { JSX, ReactNode } from 'react';
import { useNavigate, useParams } from 'react-router';

function DetailRow({ label, children }: { label: string; children: ReactNode; }): JSX.Element
{
    return (
        <div className="grid gap-1 py-3 sm:grid-cols-3">
            <dt className="text-sm font-medium text-slate-500">{label}</dt>
            <dd className="text-sm text-slate-800 sm:col-span-2">{children}</dd>
        </div>
    );
}

function ExternalLink({ href }: { href: string | null; }): JSX.Element
{
    if (!href)
    {
        return <>—</>;
    }
    return (
        <a href={href} target="_blank" rel="noreferrer" className="break-all text-indigo-600 hover:underline">
            {href}
        </a>
    );
}

export function ApplicationDetailsPage(): JSX.Element
{
    const { id = '' } = useParams<{ id: string; }>();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { selected, selectedStatus, selectedError } = useAppSelector((state) => state.applications);

    useEffect((): void =>
    {
        void dispatch(loadApplication(id));
    }, [dispatch, id]);

    async function handleDelete(): Promise<void>
    {
        if (!selected || !window.confirm(`Delete "${selected.jobPost}"?`))
        {
            return;
        }
        if (await dispatch(deleteApplication(selected.id)))
        {
            void navigate(AppRoutes.Applications);
        }
    }

    if (selectedStatus === RequestStatus.Failed)
    {
        return <ErrorMessage message={selectedError} />;
    }
    if (!selected || selected.id !== id)
    {
        return <Spinner />;
    }

    return (
        <div className="mx-auto max-w-3xl space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">{selected.jobPost}</h1>
                    <div className="mt-2">
                        <StatusBadge isApplied={selected.isApplied} />
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="secondary"
                        onClick={(): void =>
                        {
                            void dispatch(
                                updateApplication(selected.id, { isApplied: !selected.isApplied }),
                            );
                        }}
                    >
                        {selected.isApplied ? 'Mark as not applied' : 'Mark as applied'}
                    </Button>
                    <LinkButton variant="secondary" to={buildPath(AppRoutes.ApplicationEdit, { id: selected.id })}>
                        Edit
                    </LinkButton>
                    <Button
                        variant="danger"
                        onClick={(): void =>
                        {
                            void handleDelete();
                        }}
                    >
                        Delete
                    </Button>
                </div>
            </div>

            <dl className="divide-y divide-slate-100 rounded-xl bg-white px-6 shadow">
                <DetailRow label="Job post link">
                    <ExternalLink href={selected.jobPostLink} />
                </DetailRow>
                <DetailRow label="Deadline">{formatDateTime(selected.deadline)}</DetailRow>
                <DetailRow label="Apply via">
                    {selected.applyMedium === ApplyMedium.Link ? <ExternalLink href={selected.applyLink} /> : 'Mail'}
                </DetailRow>
                <DetailRow label="CV link">
                    <ExternalLink href={selected.cvLink} />
                </DetailRow>
                <DetailRow label="Salary">{formatSalary(selected)}</DetailRow>
                <DetailRow label="Applied at">{formatDateTime(selected.appliedAt)}</DetailRow>
                <DetailRow label="Added">{formatDateTime(selected.createdAt)}</DetailRow>
            </dl>

            {selected.applyMedium === ApplyMedium.Mail && selected.applyMail && (
                <section className="rounded-xl bg-white p-6 shadow">
                    <h2 className="mb-3 text-base font-semibold text-slate-800">Application mail</h2>
                    <div
                        className="rich-text text-sm text-slate-800"
                        dangerouslySetInnerHTML={{ __html: selected.applyMail }}
                    />
                </section>
            )}
        </div>
    );
}
