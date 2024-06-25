import * as envs from '$env/static/private';

export const config = { ...envs, isProduction: process.env.NODE_ENV === 'production' };
