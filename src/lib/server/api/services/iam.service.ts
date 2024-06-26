import { inject, injectable } from 'tsyringe';
import { LuciaProvider } from '../providers/lucia.provider';

/* -------------------------------------------------------------------------- */
/*                                   Service                                  */
/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/* ---------------------------------- About --------------------------------- */
/*
Services are responsible for handling business logic and data manipulation. 
They genreally call on repositories or other services to complete a use-case.
*/
/* ---------------------------------- Notes --------------------------------- */
/*
Services should be kept as clean and simple as possible. 

Create private functions to handle complex logic and keep the public methods as 
simple as possible. This makes the service easier to read, test and understand.
*/
/* -------------------------------------------------------------------------- */

@injectable()
export class IamService {
	constructor(
		@inject(LuciaProvider) private readonly lucia: LuciaProvider,
	) { }

	async logout(sessionId: string) {
		return this.lucia.invalidateSession(sessionId);
	}
}
