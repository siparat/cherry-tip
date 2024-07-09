import { IUnitsEntity } from '../user.interfaces';

export class UnitsEntity {
	userId: string;
	weight: number;
	targetWeight?: number;
	height: number;
	bloodGlucose?: number;

	constructor({ userId, weight, targetWeight, height, bloodGlucose }: IUnitsEntity) {
		this.userId = userId;
		this.weight = weight;
		this.targetWeight = targetWeight ?? undefined;
		this.height = height;
		this.bloodGlucose = bloodGlucose ?? undefined;
	}
}
