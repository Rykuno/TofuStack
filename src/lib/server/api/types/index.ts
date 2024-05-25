import type { Session, User } from 'lucia';

export type HonoTypes = {
	Variables: {
		session: Session | null;
		user: User | null;
	};
};
