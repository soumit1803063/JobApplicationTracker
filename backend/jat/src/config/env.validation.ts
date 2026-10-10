import Joi from 'joi';

export interface EnvironmentVariables
{
    NODE_ENV: 'development' | 'production' | 'test';
    PORT: number;
    DATABASE_URL: string;
    JWT_SECRET: string;
    JWT_EXPIRES_IN: number;
}

export const envValidationSchema: Joi.ObjectSchema<EnvironmentVariables> = Joi.object<EnvironmentVariables>({
    NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
    PORT: Joi.number().default(3000),
    DATABASE_URL: Joi.string().uri({ scheme: ['postgresql', 'postgres'] }).required(),
    JWT_SECRET: Joi.string().min(16).required(),
    JWT_EXPIRES_IN: Joi.number().integer().positive().default(86400),
});
