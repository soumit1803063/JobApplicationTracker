import { useAppDispatch, useAppSelector } from '@/app/redux';
import {
    APPLY_MEDIUM_FILTERS,
    ApplyMedium,
    PAGE_SIZES,
    SORT_OPTIONS,
    SortField,
    SortOrder,
    STATUS_OPTIONS,
    StatusFilter,
} from '@/features/applications/applications.constants';
import { filtersChanged, filtersReset } from '@/features/applications/applications.slice';
import { Button } from '@/shared/components/Button';
import { Field, Input, Select } from '@/shared/components/Field';
import { parseEnum } from '@/shared/utils';
import { useEffect, useState } from 'react';
import type { JSX } from 'react';

export function ApplicationFilters(): JSX.Element
{
    const dispatch = useAppDispatch();
    const filters = useAppSelector((state) => state.applications.filters);
    const [search, setSearch] = useState(filters.search);

    useEffect((): (() => void) | undefined =>
    {
        if (search === filters.search)
        {
            return undefined;
        }
        const timer = window.setTimeout((): void =>
        {
            dispatch(filtersChanged({ search }));
        }, 400);
        return (): void => window.clearTimeout(timer);
    }, [dispatch, search, filters.search]);

    function handleReset(): void
    {
        setSearch('');
        dispatch(filtersReset());
    }

    function toggleSortOrder(): void
    {
        dispatch(filtersChanged({ sortOrder: filters.sortOrder === SortOrder.Asc ? SortOrder.Desc : SortOrder.Asc }));
    }

    return (
        <div className="grid gap-4 rounded-xl bg-white p-4 shadow sm:grid-cols-2 lg:grid-cols-6">
            <div className="lg:col-span-2">
                <Field label="Search" htmlFor="search">
                    <Input
                        id="search"
                        placeholder="Job post..."
                        value={search}
                        onChange={(event): void => setSearch(event.target.value)}
                    />
                </Field>
            </div>
            <Field label="Status" htmlFor="status">
                <Select
                    id="status"
                    value={filters.status}
                    onChange={(event): void =>
                    {
                        dispatch(
                            filtersChanged({
                                status: parseEnum(Object.values(StatusFilter), event.target.value, StatusFilter.All),
                            }),
                        );
                    }}
                >
                    {STATUS_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                </Select>
            </Field>
            <Field label="Apply via" htmlFor="applyMedium">
                <Select
                    id="applyMedium"
                    value={filters.applyMedium}
                    onChange={(event): void =>
                    {
                        dispatch(
                            filtersChanged({ applyMedium: parseEnum(APPLY_MEDIUM_FILTERS, event.target.value, '') }),
                        );
                    }}
                >
                    <option value="">Any</option>
                    <option value={ApplyMedium.Link}>Link</option>
                    <option value={ApplyMedium.Mail}>Mail</option>
                </Select>
            </Field>
            <Field label="Sort by" htmlFor="sortBy">
                <div className="flex gap-2">
                    <Select
                        id="sortBy"
                        value={filters.sortBy}
                        onChange={(event): void =>
                        {
                            dispatch(
                                filtersChanged({
                                    sortBy: parseEnum(
                                        Object.values(SortField),
                                        event.target.value,
                                        SortField.CreatedAt,
                                    ),
                                }),
                            );
                        }}
                    >
                        {SORT_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                    </Select>
                    <Button
                        variant="secondary"
                        onClick={toggleSortOrder}
                        title={filters.sortOrder === SortOrder.Asc ? 'Ascending' : 'Descending'}
                    >
                        {filters.sortOrder === SortOrder.Asc ? '↑' : '↓'}
                    </Button>
                </div>
            </Field>
            <Field label="Per page" htmlFor="limit">
                <div className="flex gap-2">
                    <Select
                        id="limit"
                        value={filters.limit}
                        onChange={(event): void =>
                        {
                            dispatch(filtersChanged({ limit: Number(event.target.value) }));
                        }}
                    >
                        {PAGE_SIZES.map((size) => <option key={size} value={size}>{size}</option>)}
                    </Select>
                    <Button variant="secondary" onClick={handleReset}>Reset</Button>
                </div>
            </Field>
        </div>
    );
}
