import { Module } from '@nestjs/common';
import { ChallengeService } from './challenge.service';
import { ChallengeController } from './challenge.controller';
import { ChallengeRepository } from './repositories/challenge.repository';
import { DatabaseModule } from 'src/database/database.module';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';

@Module({
	imports: [DatabaseModule, AuthModule, UserModule],
	controllers: [ChallengeController],
	providers: [ChallengeService, ChallengeRepository],
	exports: [ChallengeService, ChallengeRepository]
})
export class ChallengeModule {}
