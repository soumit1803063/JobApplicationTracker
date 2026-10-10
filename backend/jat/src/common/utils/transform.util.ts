import type { TransformFnParams } from 'class-transformer';

// Reusable class-transformer functions, used as @Transform(toBoolean) etc.

// Query strings are always strings: "true"/"false" -> real booleans.
export const toBoolean = ({ value }: TransformFnParams): unknown =>
    value === 'true' ? true : value === 'false' ? false : value;

export const toTrimmedUpperCase = ({ value }: TransformFnParams): unknown =>
    typeof value === 'string' ? value.trim().toUpperCase() : value;

export const toTrimmedLowerCase = ({ value }: TransformFnParams): unknown =>
    typeof value === 'string' ? value.trim().toLowerCase() : value;
