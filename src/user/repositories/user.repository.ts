import { Injectable } from '@nestjs/common';
import { UserModel } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class UserRepository {
	constructor(private database: DatabaseService) {}

	findByEmail(email: string): Promise<UserModel | null> {
		return this.database.userModel.findUnique({ where: { email } });
	}
}
