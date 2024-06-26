import { StatusCodes } from '$lib/constants/status-codes';
import { HTTPException } from 'hono/http-exception';

export function TooManyRequests(message: string = 'Too many requests') {
	return new HTTPException(StatusCodes.TOO_MANY_REQUESTS, { message });
}

export function Forbidden(message: string = 'Forbidden') {
	return new HTTPException(StatusCodes.FORBIDDEN, { message });
}

export function Unauthorized(message: string = 'Unauthorized') {
	return new HTTPException(StatusCodes.UNAUTHORIZED, { message });
}

export function NotFound(message: string = 'Not Found') {
	return new HTTPException(StatusCodes.NOT_FOUND, { message });
}

export function BadRequest(message: string = 'Bad Request') {
	return new HTTPException(StatusCodes.BAD_REQUEST, { message });
}

export function InternalError(message: string = 'Internal Error') {
	return new HTTPException(StatusCodes.INTERNAL_SERVER_ERROR, { message });
}
