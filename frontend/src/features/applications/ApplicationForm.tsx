import { ApplyMedium, CURRENCIES } from '@/features/applications/applications.constants';
import type {
    ApplicationFormErrors,
    ApplicationFormValues,
    ApplicationPayload,
} from '@/features/applications/applications.types';
import { toPayload, validateForm } from '@/features/applications/applications.utils';
import { Button } from '@/shared/components/Button';
import { Field, Input, Select } from '@/shared/components/Field';
import { RichTextEditor } from '@/shared/components/RichTextEditor';
import { useState } from 'react';
import type { JSX, ReactNode, SubmitEvent } from 'react';

interface ApplicationFormProps
{
    initialValues: ApplicationFormValues;
    submitLabel: string;
    isSaving: boolean;
    onSubmit: (payload: ApplicationPayload) => void;
}

function Section({ title, children }: { title: string; children: ReactNode; }): JSX.Element
{
    return (
        <section className="space-y-4 rounded-xl bg-white p-6 shadow">
            <h2 className="text-base font-semibold text-slate-800">{title}</h2>
            {children}
        </section>
    );
}

export function ApplicationForm({ initialValues, submitLabel, isSaving, onSubmit }: ApplicationFormProps): JSX.Element
{
    const [values, setValues] = useState<ApplicationFormValues>(initialValues);
    const [errors, setErrors] = useState<ApplicationFormErrors>({});

    function setField<K extends keyof ApplicationFormValues>(field: K, value: ApplicationFormValues[K]): void
    {
        setValues((previous) => ({ ...previous, [field]: value }));
    }

    function handleSubmit(event: SubmitEvent<HTMLFormElement>): void
    {
        event.preventDefault();
        const validationErrors = validateForm(values);
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length === 0)
        {
            onSubmit(toPayload(values));
        }
    }

    return (
        <form onSubmit={handleSubmit} noValidate className="space-y-6">
            <Section title="Job">
                <Field label="Job post" htmlFor="jobPost" error={errors.jobPost}>
                    <Input
                        id="jobPost"
                        placeholder="Backend Engineer at Acme"
                        value={values.jobPost}
                        onChange={(event): void => setField('jobPost', event.target.value)}
                    />
                </Field>
                <Field label="Job post link" htmlFor="jobPostLink" error={errors.jobPostLink}>
                    <Input
                        id="jobPostLink"
                        type="url"
                        placeholder="https://..."
                        value={values.jobPostLink}
                        onChange={(event): void => setField('jobPostLink', event.target.value)}
                    />
                </Field>
                <Field label="Deadline" htmlFor="deadline">
                    <Input
                        id="deadline"
                        type="datetime-local"
                        value={values.deadline}
                        onChange={(event): void => setField('deadline', event.target.value)}
                    />
                </Field>
            </Section>

            <Section title="How to apply">
                <div className="flex gap-2">
                    {[ApplyMedium.Link, ApplyMedium.Mail].map((medium) => (
                        <Button
                            key={medium}
                            variant={values.applyMedium === medium ? 'primary' : 'secondary'}
                            onClick={(): void => setField('applyMedium', medium)}
                        >
                            {medium === ApplyMedium.Link ? 'Apply by link' : 'Apply by mail'}
                        </Button>
                    ))}
                </div>
                {values.applyMedium === ApplyMedium.Link
                    ? (
                        <Field label="Apply link" htmlFor="applyLink" error={errors.applyLink}>
                            <Input
                                id="applyLink"
                                type="url"
                                placeholder="https://..."
                                value={values.applyLink}
                                onChange={(event): void => setField('applyLink', event.target.value)}
                            />
                        </Field>
                    )
                    : (
                        <Field label="Application mail" htmlFor="applyMail" error={errors.applyMail}>
                            <RichTextEditor
                                id="applyMail"
                                value={values.applyMail}
                                onChange={(html): void => setField('applyMail', html)}
                            />
                        </Field>
                    )}
                <Field label="CV link (optional)" htmlFor="cvLink" error={errors.cvLink}>
                    <Input
                        id="cvLink"
                        type="url"
                        placeholder="https://drive.google.com/..."
                        value={values.cvLink}
                        onChange={(event): void => setField('cvLink', event.target.value)}
                    />
                </Field>
            </Section>

            <Section title="Salary (optional)">
                <div className="grid gap-4 sm:grid-cols-3">
                    <Field label="Minimum" htmlFor="salaryMin">
                        <Input
                            id="salaryMin"
                            type="number"
                            min={0}
                            value={values.salaryMin}
                            onChange={(event): void => setField('salaryMin', event.target.value)}
                        />
                    </Field>
                    <Field label="Maximum" htmlFor="salaryMax" error={errors.salaryMax}>
                        <Input
                            id="salaryMax"
                            type="number"
                            min={0}
                            value={values.salaryMax}
                            onChange={(event): void => setField('salaryMax', event.target.value)}
                        />
                    </Field>
                    <Field label="Currency" htmlFor="salaryCurrency">
                        <Select
                            id="salaryCurrency"
                            value={values.salaryCurrency}
                            onChange={(event): void => setField('salaryCurrency', event.target.value)}
                        >
                            <option value="">—</option>
                            {CURRENCIES.map((currency) => <option key={currency} value={currency}>{currency}</option>)}
                        </Select>
                    </Field>
                </div>
            </Section>

            <Section title="Status">
                <label className="flex items-center gap-2 text-sm text-slate-700">
                    <input
                        type="checkbox"
                        checked={values.isApplied}
                        onChange={(event): void => setField('isApplied', event.target.checked)}
                        className="h-4 w-4 rounded border-slate-300"
                    />
                    I have applied
                </label>
                {values.isApplied && (
                    <Field label="Applied at (leave empty for now)" htmlFor="appliedAt">
                        <Input
                            id="appliedAt"
                            type="datetime-local"
                            value={values.appliedAt}
                            onChange={(event): void => setField('appliedAt', event.target.value)}
                        />
                    </Field>
                )}
            </Section>

            <div className="flex justify-end">
                <Button type="submit" isLoading={isSaving}>{submitLabel}</Button>
            </div>
        </form>
    );
}
