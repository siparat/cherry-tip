import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModuleAsyncOptions } from '@nestjs/jwt';

export const getJwtConfig = (): JwtModuleAsyncOptions => {
	return {
		imports: [ConfigModule],
		inject: [ConfigService],
		useFactory: (config: ConfigService) => ({ secret: config.get('SECRET') })
	};
};
