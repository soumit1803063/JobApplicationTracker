// Copies `patch` onto `base`, skipping undefined values.
// For PATCH requests: undefined = "field not sent, keep current", null = "clear it".
export function mergeDefined<T extends object>(base: T, patch: Partial<T>): T
{
    const result = { ...base };
    for (const key of Object.keys(patch) as (keyof T)[])
    {
        const value = patch[key];
        if (value !== undefined)
        {
            result[key] = value as T[keyof T];
        }
    }
    return result;
}
