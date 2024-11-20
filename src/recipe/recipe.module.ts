import { Module } from '@nestjs/common';
import { RecipeController } from './recipe.controller';
import { RecipeService } from './recipe.service';
import { RecipeRepository } from './repositories/recipe.repository';
import { DatabaseModule } from 'src/database/database.module';
import { RecipeCategoryRepository } from './repositories/recipe-category.repository';
import { RecipeDietTypeRepository } from './repositories/recipe-diet.type.repository';
import { RecipePreparationRepository } from './repositories/recipe-preparation.repository';
import { FileModule } from 'src/file/file.module';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { LoggerModule } from 'src/logger/logger.module';

@Module({
	imports: [DatabaseModule, FileModule, AuthModule, UserModule, LoggerModule.forEach('RecipeModule')],
	controllers: [RecipeController],
	providers: [
		RecipeService,
		RecipeRepository,
		RecipeCategoryRepository,
		RecipeDietTypeRepository,
		RecipePreparationRepository
	],
	exports: [RecipeService, RecipeRepository]
})
export class RecipeModule {}
