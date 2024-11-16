import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { RecipeModel } from '@prisma/client';
import { RecipeEntity } from './entities/recipe.entity';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { RecipeRepository } from './repositories/recipe.repository';
import { IRecipeTagModels, IRecipeTags } from './recipe.interfaces';
import { RecipeCategoryRepository } from './repositories/recipe-category.repository';
import { RecipeDietTypeRepository } from './repositories/recipe-diet.type.repository';
import { RecipePreparationRepository } from './repositories/recipe-preparation.repository';
import { RecipeErrorMessages } from './recipe.constants';
import { FileService } from 'src/file/file.service';
import { randomUUID } from 'crypto';

@Injectable()
export class RecipeService {
	constructor(
		private fileService: FileService,
		private recipeRepository: RecipeRepository,
		private recipeCategoryRepository: RecipeCategoryRepository,
		private recipeDietTypeRepository: RecipeDietTypeRepository,
		private recipePreparationRepository: RecipePreparationRepository
	) {}

	async createRecipe(userId: string, dto: CreateRecipeDto): Promise<RecipeModel> {
		const existWithThisName = await this.recipeRepository.findByTitle(dto.title);
		if (existWithThisName) {
			throw new ConflictException(RecipeErrorMessages.ALREADY_EXIST_WITH_THIS_NAME);
		}
		const options = {
			categoryId: dto.categoryId,
			dietsTypeId: dto.dietsTypeId,
			preparationId: dto.preparationId
		};
		const tagsIsExist = await this.recipeTagsIsExist(options);
		if (!tagsIsExist) {
			throw new NotFoundException(RecipeErrorMessages.TAG_NOT_FOUND);
		}

		const entity = new RecipeEntity({ ...dto, userId });
		return this.recipeRepository.createRecipe(entity);
	}

	async editRecipe(id: number, dto: CreateRecipeDto): Promise<RecipeModel> {
		const existWithThisName = await this.recipeRepository.findByTitle(dto.title);
		if (existWithThisName && existWithThisName.id !== id) {
			throw new ConflictException(RecipeErrorMessages.ALREADY_EXIST_WITH_THIS_NAME);
		}

		const options = {
			categoryId: dto.categoryId,
			dietsTypeId: dto.dietsTypeId,
			preparationId: dto.preparationId
		};
		const tagsIsExist = await this.recipeTagsIsExist(options);
		if (!tagsIsExist) {
			throw new NotFoundException(RecipeErrorMessages.TAG_NOT_FOUND);
		}

		const entity = new RecipeEntity({ ...existWithThisName, ...dto });
		return this.recipeRepository.editRecipe(id, entity);
	}

	async saveImage(file: Pick<Express.Multer.File, 'buffer'>): Promise<string> {
		const name = randomUUID() + '.webp';
		const buffer = await this.fileService.toAvif(file.buffer);
		const url = await this.fileService.writeFile(name, buffer);
		return url;
	}

	async getAllTags(): Promise<IRecipeTagModels> {
		const categories = await this.recipeCategoryRepository.findAll();
		const preparations = await this.recipePreparationRepository.findAll();
		const diets = await this.recipeDietTypeRepository.findAll();
		return { categories, preparations, diets };
	}

	private async recipeTagsIsExist(tags: IRecipeTags): Promise<boolean> {
		const opts = [
			{ repo: this.recipeCategoryRepository, id: tags.categoryId },
			{ repo: this.recipeDietTypeRepository, id: tags.dietsTypeId },
			{ repo: this.recipePreparationRepository, id: tags.preparationId }
		];

		for (const { repo, id } of opts) {
			if (!id && typeof id !== 'number') {
				continue;
			}
			const tag = await repo.findById(id);
			if (!tag) {
				return false;
			}
		}

		return true;
	}
}
