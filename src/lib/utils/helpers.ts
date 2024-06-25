import { createAvatar } from '@dicebear/core';
import { funEmoji } from '@dicebear/collection'; // you can choose any type
import { PUBLIC_IMAGE_URI } from '$env/static/public';

export function ciEquals(a: string, b: string) {
	return typeof a === 'string' && typeof b === 'string'
		? a.localeCompare(b, undefined, { sensitivity: 'accent' }) === 0
		: a === b;
}

export function getTimezoneAbbr(timezone: string) {
	return new Intl.DateTimeFormat('en-US', {
		timeZone: timezone,
		timeZoneName: 'short'
	})
		.format(new Date())
		.split(' ')[1];
}

export function getFileByKey(key: string) {
	if (key.startsWith('http')) return key;
	return `${PUBLIC_IMAGE_URI}/${key}`;
}

export function getUserAvatar({ id, avatar }: { id: string; avatar: string | null }) {
	return avatar
		? getFileByKey(avatar)
		: createAvatar(funEmoji, {
			seed: id
		}).toDataUri();
}