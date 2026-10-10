// Prisma errors carry a code like "P2002". Read it without importing Prisma's error classes.
export function getPrismaErrorCode(error: unknown): string | undefined
{
    if (
        typeof error === 'object'
        && error !== null
        && 'code' in error
        && typeof error.code === 'string'
        && error.code.startsWith('P')
    )
    {
        return error.code;
    }
    return undefined;
}
