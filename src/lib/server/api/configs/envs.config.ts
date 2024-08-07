import * as envs from '$env/static/private';

export const env = { ...envs, isProduction: process.env.NODE_ENV === 'production' };
