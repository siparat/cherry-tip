import { Module } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { CalendarController } from './calendar.controller';
import { DayRepository } from './repositories/day.repository';
import { DatabaseModule } from 'src/database/database.module';
import { UserModule } from 'src/user/user.module';

@Module({
	imports: [DatabaseModule, UserModule],
	providers: [CalendarService, DayRepository],
	controllers: [CalendarController],
	exports: [CalendarService, DayRepository]
})
export class CalendarModule {}
