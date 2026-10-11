import { useAppDispatch, useAppSelector } from '@/app/redux';
import { ApplicationForm } from '@/features/applications/ApplicationForm';
import { EMPTY_FORM_VALUES } from '@/features/applications/applications.constants';
import { saveErrorCleared } from '@/features/applications/applications.slice';
import { createApplication, loadApplication, updateApplication } from '@/features/applications/applications.thunks';
import type { ApplicationPayload } from '@/features/applications/applications.types';
import { toFormValues } from '@/features/applications/applications.utils';
import { ErrorMessage, Spinner } from '@/shared/components/Feedback';
import { AppRoutes } from '@/shared/constants';
import { RequestStatus } from '@/shared/types';
import { buildPath } from '@/shared/utils';
import { useEffect } from 'react';
import type { JSX } from 'react';
import { useNavigate, useParams } from 'react-router';

export function ApplicationFormPage(): JSX.Element
{
    const { id } = useParams<{ id: string; }>();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { selected, selectedStatus, selectedError, saveStatus, saveError } = useAppSelector(
        (state) => state.applications,
    );

    useEffect((): void =>
    {
        dispatch(saveErrorCleared());
        if (id)
        {
            void dispatch(loadApplication(id));
        }
    }, [dispatch, id]);

    async function handleSubmit(payload: ApplicationPayload): Promise<void>
    {
        const saved = id
            ? await dispatch(updateApplication(id, payload))
            : await dispatch(createApplication(payload));
        if (saved)
        {
            void navigate(buildPath(AppRoutes.ApplicationDetails, { id: saved.id }));
        }
    }

    if (id && selected?.id !== id)
    {
        return selectedStatus === RequestStatus.Failed ? <ErrorMessage message={selectedError} /> : <Spinner />;
    }

    return (
        <div className="mx-auto max-w-3xl space-y-6">
            <h1 className="text-2xl font-bold text-slate-800">{id ? 'Edit application' : 'New application'}</h1>
            <ErrorMessage message={saveError} />
            <ApplicationForm
                key={id ?? 'new'}
                initialValues={id && selected ? toFormValues(selected) : EMPTY_FORM_VALUES}
                submitLabel={id ? 'Save changes' : 'Create application'}
                isSaving={saveStatus === RequestStatus.Loading}
                onSubmit={(payload): void =>
                {
                    void handleSubmit(payload);
                }}
            />
        </div>
    );
}
