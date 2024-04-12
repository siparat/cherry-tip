import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';

@Module({
	controllers: [AppController],
	providers: [AppService],
	imports: [AuthModule, UserModule, ConfigModule.forRoot({ isGlobal: true })]
})
export class AppModule {}
