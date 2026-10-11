import type { JobApplication } from '@/features/applications/applications.types';
import { formatSalary, isDeadlinePassed } from '@/features/applications/applications.utils';
import { StatusBadge } from '@/features/applications/StatusBadge';
import { AppRoutes } from '@/shared/constants';
import { buildPath, formatDate } from '@/shared/utils';
import type { JSX } from 'react';
import { Link } from 'react-router';

interface ApplicationsTableProps
{
    applications: JobApplication[];
    onToggleApplied: (application: JobApplication) => void;
    onDelete: (application: JobApplication) => void;
}

export function ApplicationsTable({ applications, onToggleApplied, onDelete }: ApplicationsTableProps): JSX.Element
{
    return (
        <div className="overflow-x-auto rounded-xl bg-white shadow">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <tr>
                        <th className="px-4 py-3">Job post</th>
                        <th className="px-4 py-3">Deadline</th>
                        <th className="px-4 py-3">Apply via</th>
                        <th className="px-4 py-3">Salary</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {applications.map((application) => (
                        <tr key={application.id} className="hover:bg-slate-50">
                            <td className="px-4 py-3">
                                <Link
                                    to={buildPath(AppRoutes.ApplicationDetails, { id: application.id })}
                                    className="font-medium text-slate-800 hover:text-indigo-600"
                                >
                                    {application.jobPost}
                                </Link>
                            </td>
                            <td
                                className={`px-4 py-3 ${
                                    isDeadlinePassed(application) ? 'text-red-600' : 'text-slate-600'
                                }`}
                            >
                                {formatDate(application.deadline)}
                            </td>
                            <td className="px-4 py-3 text-slate-600">{application.applyMedium}</td>
                            <td className="px-4 py-3 text-slate-600">{formatSalary(application)}</td>
                            <td className="px-4 py-3">
                                <button
                                    type="button"
                                    title="Click to change"
                                    onClick={(): void => onToggleApplied(application)}
                                >
                                    <StatusBadge isApplied={application.isApplied} />
                                </button>
                            </td>
                            <td className="space-x-3 whitespace-nowrap px-4 py-3 text-right">
                                <Link
                                    to={buildPath(AppRoutes.ApplicationEdit, { id: application.id })}
                                    className="font-medium text-indigo-600 hover:underline"
                                >
                                    Edit
                                </Link>
                                <button
                                    type="button"
                                    onClick={(): void => onDelete(application)}
                                    className="font-medium text-red-600 hover:underline"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
