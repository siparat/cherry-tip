import { randomBytes } from 'crypto';

export const generateString = (length: number): string => {
	return randomBytes(Math.ceil(length / 2))
		.toString('hex')
		.slice(length % 2 == 0 ? 0 : 1);
};

export const declinate = (number: number, names: [string, string, string]): string => {
	const remains = number % 100;
	const numberStr = number.toString();
	const lastNumber = Number(numberStr.at(-1));
	if ((remains > 10 && remains < 15) || (lastNumber >= 5 && lastNumber <= 9)) {
		return names[2];
	}
	if (lastNumber == 1) {
		return names[0];
	}
	return names[1];
};
