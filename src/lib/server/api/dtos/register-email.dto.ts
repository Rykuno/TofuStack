import { z } from 'zod';

/* -------------------------------------------------------------------------- */
/*                                     DTO                                    */
/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/* ---------------------------------- About --------------------------------- */
/*
Data Transfer Objects (DTOs) are used to define the shape of data that is passed.
They are used to validate data and ensure that the correct data is being passed
to the correct methods.
*/
/* ---------------------------------- Notes --------------------------------- */
/*
DTO's are pretty flexible. You can use them anywhere you want in this application to 
validate or shape data. They are especially useful in API routes and services to
ensure that the correct data is being passed around.
*/
/* -------------------------------------------------------------------------- */

export const registerEmailDto = z.object({
	email: z.string().email()
});

export type RegisterEmailDto = z.infer<typeof registerEmailDto>;
