export const excludeProperty = <T extends Record<string, unknown>, K extends keyof T>(obj: T, key: K): Omit<T, K> => {
	const { [key]: _, ...args } = obj;
	return args;
};
