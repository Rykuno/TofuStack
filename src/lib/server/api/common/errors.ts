import { HTTPException } from 'hono/http-exception';

export function Forbidden(message: string = 'Forbidden') {
	return new HTTPException(403, { message });
}

export function Unauthorized(message: string = 'Unauthorized') {
	return new HTTPException(401, { message });
}

export function NotFound(message: string = 'Not Found') {
	return new HTTPException(404, { message });
}

export function BadRequest(message: string = 'Bad Request') {
	return new HTTPException(400, { message });
}

export function InternalError(message: string = 'Internal Error') {
	return new HTTPException(500, { message });
}
