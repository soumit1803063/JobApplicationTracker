import type { JSX } from 'react';

export function StatusBadge({ isApplied }: { isApplied: boolean; }): JSX.Element
{
    return isApplied
        ? (
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                Applied
            </span>
        )
        : (
            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                Not applied
            </span>
        );
}
