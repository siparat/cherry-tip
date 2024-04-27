import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { RecipeModule } from './recipe/recipe.module';
import { ChallengeModule } from './challenge/challenge.module';

@Module({
	imports: [AuthModule, UserModule, RecipeModule, ChallengeModule, ConfigModule.forRoot({ isGlobal: true })]
})
export class AppModule {}
