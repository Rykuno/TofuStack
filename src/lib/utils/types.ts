import type { api } from '$lib/utils/api';
import type {
	CreateMutationOptions,
	CreateQueryOptions,
	DefaultError
} from '@tanstack/svelte-query';
import type { InferRequestType, InferResponseType } from 'hono';

export type ApiMutation<T> = CreateMutationOptions<
	InferResponseType<T>,
	DefaultError,
	InferRequestType<T>,
	unknown
>;
export type ApiQuery<T> = CreateQueryOptions<InferResponseType<T>>;
export type Api = ReturnType<typeof api>;
