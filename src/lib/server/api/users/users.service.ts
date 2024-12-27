import { inject, injectable } from '@needle-di/core';
import { UsersRepository } from './users.repository';
import type { UpdateUserDto } from './dtos/update-user.dto';
import { StorageService } from '../storage/storage.service';

@injectable()
export class UsersService {
	constructor(
		private usersRepository = inject(UsersRepository),
		private storageService = inject(StorageService)
	) {}

	async update(userId: string, updateUserDto: UpdateUserDto) {
		if (updateUserDto?.avatar) {
			const { key } = await this.storageService.upload({ file: updateUserDto.avatar });
			await this.usersRepository.update(userId, { avatar: key });
		}
		return this.usersRepository.update(userId, { email: updateUserDto?.email });
	}

	async create(email: string) {
		return this.usersRepository.create({ avatar: null, email });
	}
}
