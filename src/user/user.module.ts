import { Module } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { DatabaseModule } from 'src/database/database.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ProfileRepository } from './repositories/profile.repository';
import { UnitsRepository } from './repositories/units.repository';
import { GoalRepository } from './repositories/goal.repository';
import { LoggerModule } from 'src/logger/logger.module';

@Module({
	imports: [DatabaseModule, LoggerModule.forEach('UserModule')],
	controllers: [UserController],
	providers: [UserRepository, UserService, ProfileRepository, UnitsRepository, GoalRepository],
	exports: [UserRepository, UserService, ProfileRepository, UnitsRepository, GoalRepository]
})
export class UserModule {}
