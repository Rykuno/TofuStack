import { z } from 'zod';

const MAX_UPLOAD_SIZE = 1024 * 1024 * 3; // 3MB
const ACCEPTED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export const userDto = z.object({
	id: z.string(),
	email: z.string().email(),
	avatar: z
		.instanceof(File)
		.optional()
		.refine((file) => {
			if (!file) return 'File is required';
			return !file || file.size <= MAX_UPLOAD_SIZE;
		}, 'File size must be less than 3MB')
		.refine((file) => {
			if (!file) return 'File is required';	
			return ACCEPTED_FILE_TYPES.includes(file!.type);
		}, 'File must be a PNG')
});

export type UserDto = z.infer<typeof userDto>;
