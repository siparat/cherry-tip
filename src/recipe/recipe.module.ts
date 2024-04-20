import { Module } from '@nestjs/common';
import { RecipeController } from './recipe.controller';
import { RecipeService } from './recipe.service';
import { RecipeRepository } from './repositories/recipe.repository';
import { DatabaseModule } from 'src/database/database.module';
import { RecipeCategoryRepository } from './repositories/recipe-category.repository';
import { RecipeDietTypeRepository } from './repositories/recipe-diet.type.repository';
import { RecipePreparationRepository } from './repositories/recipe-preparation.repository';

@Module({
	imports: [DatabaseModule],
	controllers: [RecipeController],
	providers: [
		RecipeService,
		RecipeRepository,
		RecipeCategoryRepository,
		RecipeDietTypeRepository,
		RecipePreparationRepository
	]
})
export class RecipeModule {}
