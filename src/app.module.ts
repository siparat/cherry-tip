import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';

@Module({
	imports: [AuthModule, UserModule, ConfigModule.forRoot({ isGlobal: true })]
})
export class AppModule {}
