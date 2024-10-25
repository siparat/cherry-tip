import { ClassConstructor } from 'class-transformer';
import { validate } from 'class-validator';

export const validateProp = async <T extends object, K extends keyof T>(
	dto: ClassConstructor<T>,
	prop: K,
	value: T[K]
): Promise<string[]> => {
	const obj = new dto();
	obj[prop] = value;
	const errors = await validate(obj, { whitelist: true, skipMissingProperties: true, forbidUnknownValues: false });
	if (!errors.length || !errors[0].constraints) {
		return [];
	}
	return Object.values(errors[0].constraints);
};
