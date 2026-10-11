import { Button } from '@/shared/components/Button';
import type { PaginationMeta } from '@/shared/types';
import type { JSX } from 'react';

interface PaginationProps
{
    meta: PaginationMeta;
    onPageChange: (page: number) => void;
}

export function Pagination({ meta, onPageChange }: PaginationProps): JSX.Element
{
    return (
        <div className="flex items-center justify-between">
            <Button variant="secondary" disabled={!meta.hasPrev} onClick={(): void => onPageChange(meta.page - 1)}>
                Previous
            </Button>
            <span className="text-sm text-slate-600">Page {meta.page}</span>
            <Button variant="secondary" disabled={!meta.hasNext} onClick={(): void => onPageChange(meta.page + 1)}>
                Next
            </Button>
        </div>
    );
}
