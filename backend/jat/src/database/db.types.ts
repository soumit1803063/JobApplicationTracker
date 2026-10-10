import type { DbContext } from './db-context.js';

// Query-argument types derived from the DbContext table sets, so repositories can type
// their helper methods without importing Prisma's generated namespace.
//   type ApplicationWhere = WhereOf<'applications'>;

type Table = 'users' | 'applications';
type FindManyArgs<T extends Table> = NonNullable<Parameters<DbContext[T]['findMany']>[0]>;

// The `where` filter object of a table.
export type WhereOf<T extends Table> = NonNullable<FindManyArgs<T>['where']>;

// A single `orderBy` entry of a table (not the array form).
export type OrderByOf<T extends Table> = Exclude<NonNullable<FindManyArgs<T>['orderBy']>, unknown[]>;
