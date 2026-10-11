import { useAppDispatch, useAppSelector } from '@/app/redux';
import { ApplicationFilters } from '@/features/applications/ApplicationFilters';
import { filtersChanged } from '@/features/applications/applications.slice';
import { deleteApplication, loadApplications, updateApplication } from '@/features/applications/applications.thunks';
import type { JobApplication } from '@/features/applications/applications.types';
import { ApplicationsTable } from '@/features/applications/ApplicationsTable';
import { LinkButton } from '@/shared/components/Button';
import { ErrorMessage, Spinner } from '@/shared/components/Feedback';
import { Pagination } from '@/shared/components/Pagination';
import { AppRoutes } from '@/shared/constants';
import { RequestStatus } from '@/shared/types';
import { useEffect } from 'react';
import type { JSX } from 'react';

export function ApplicationsPage(): JSX.Element
{
    const dispatch = useAppDispatch();
    const { filters, items, meta, listStatus, listError } = useAppSelector((state) => state.applications);

    useEffect((): void =>
    {
        void dispatch(loadApplications(filters));
    }, [dispatch, filters]);

    function handleToggleApplied(application: JobApplication): void
    {
        void dispatch(updateApplication(application.id, { isApplied: !application.isApplied }));
    }

    async function handleDelete(application: JobApplication): Promise<void>
    {
        if (!window.confirm(`Delete "${application.jobPost}"?`))
        {
            return;
        }
        await dispatch(deleteApplication(application.id));
        if (items.length === 1 && filters.page > 1)
        {
            dispatch(filtersChanged({ page: filters.page - 1 }));
        }
        else
        {
            void dispatch(loadApplications(filters));
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-800">Applications</h1>
                <LinkButton to={AppRoutes.ApplicationCreate}>+ New application</LinkButton>
            </div>

            <ApplicationFilters />
            <ErrorMessage message={listError} />

            {listStatus === RequestStatus.Loading && items.length === 0 && <Spinner />}

            {listStatus === RequestStatus.Succeeded && items.length === 0 && (
                <p className="rounded-xl bg-white p-12 text-center text-slate-500 shadow">
                    No applications found.
                </p>
            )}

            {items.length > 0 && (
                <ApplicationsTable
                    applications={items}
                    onToggleApplied={handleToggleApplied}
                    onDelete={(application): void =>
                    {
                        void handleDelete(application);
                    }}
                />
            )}

            {meta && items.length > 0 && (
                <Pagination
                    meta={meta}
                    onPageChange={(page): void => void dispatch(filtersChanged({ page }))}
                />
            )}
        </div>
    );
}
