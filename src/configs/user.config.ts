import { ActivityEnum } from '@prisma/client';

export const getActivityCoefficient = (activity: ActivityEnum): number => {
	switch (activity) {
		case ActivityEnum.Low:
			return 1.2;
		case ActivityEnum.Medium:
			return 1.4;
		case ActivityEnum.High:
			return 1.64;
	}
};
