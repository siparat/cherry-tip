export const resetDateTime = (date: Date): Date => {
	return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
};
