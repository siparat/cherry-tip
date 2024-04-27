import { Module } from '@nestjs/common';
import { ChallengeService } from './challenge.service';
import { ChallengeController } from './challenge.controller';
import { ChallengeRepository } from './repositories/challenge.repository';
import { DatabaseModule } from 'src/database/database.module';

@Module({
	imports: [DatabaseModule],
	controllers: [ChallengeController],
	providers: [ChallengeService, ChallengeRepository]
})
export class ChallengeModule {}
