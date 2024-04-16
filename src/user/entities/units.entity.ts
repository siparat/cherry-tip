import { IUnitsEntity } from '../user.interfaces';

export class UnitsEntity {
	userId: string;
	weight: number;
	height: number;
	bloodGlucose?: number;

	constructor({ userId, weight, height, bloodGlucose }: IUnitsEntity) {
		this.userId = userId;
		this.weight = weight;
		this.height = height;
		this.bloodGlucose = bloodGlucose ?? undefined;
	}
}
