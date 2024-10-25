import { randomBytes } from 'crypto';

export const generateString = (length: number): string => {
	return randomBytes(Math.ceil(length / 2))
		.toString('hex')
		.slice(length % 2 == 0 ? 0 : 1);
};
