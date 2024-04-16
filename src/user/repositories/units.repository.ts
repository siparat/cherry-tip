import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { UnitsEntity } from '../entities/units.entity';
import { UnitsModel } from '@prisma/client';

@Injectable()
export class UnitsRepository {
	constructor(private database: DatabaseService) {}

	createUnitsModel(unitsEntity: UnitsEntity): Promise<UnitsModel> {
		return this.database.unitsModel.create({ data: unitsEntity });
	}

	findByUserId(userId: string): Promise<UnitsModel | null> {
		return this.database.unitsModel.findUnique({ where: { userId } });
	}
}
