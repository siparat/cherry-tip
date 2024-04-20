import {
	Body,
	Controller,
	Delete,
	ForbiddenException,
	Get,
	NotFoundException,
	Param,
	ParseIntPipe,
	Post,
	Put,
	UseGuards,
	UsePipes,
	ValidationPipe
} from '@nestjs/common';
import { RecipeModel, RoleEnum, UserModel } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { RecipeService } from './recipe.service';
import { RecipeRepository } from './repositories/recipe.repository';
import { RecipeErrorMessages } from './recipe.constants';
import { User } from 'src/decorators/user.decorator';

@Controller('recipe')
export class RecipeController {
	constructor(
		private recipeService: RecipeService,
		private recipeRepository: RecipeRepository
	) {}

	@UseGuards(JwtAuthGuard)
	@UsePipes(ValidationPipe)
	@Post()
	async createRecipe(@User() user: UserModel, @Body() dto: CreateRecipeDto): Promise<RecipeModel> {
		return this.recipeService.createRecipe(user.id, dto);
	}

	@Get(':id')
	async getRecipeById(@Param('id', ParseIntPipe) id: number): Promise<RecipeModel> {
		const recipe = await this.recipeRepository.findById(id);
		if (!recipe) {
			throw new NotFoundException(RecipeErrorMessages.NOT_FOUND);
		}
		return recipe;
	}

	@UseGuards(JwtAuthGuard)
	@UsePipes(ValidationPipe)
	@Put(':id')
	async editRecipe(
		@User() user: UserModel,
		@Param('id', ParseIntPipe) id: number,
		@Body() dto: CreateRecipeDto
	): Promise<RecipeModel> {
		const recipe = await this.recipeRepository.findById(id);
		if (!recipe) {
			throw new NotFoundException(RecipeErrorMessages.NOT_FOUND);
		}
		if (recipe.userId !== user.id && user.role !== RoleEnum.Admin) {
			throw new ForbiddenException(RecipeErrorMessages.FORBIDDEN_EDIT_RECIPE);
		}
		return this.recipeService.editRecipe(id, dto);
	}

	@UseGuards(JwtAuthGuard)
	@Delete(':id')
	async deleteRecipeById(@User() user: UserModel, @Param('id', ParseIntPipe) id: number): Promise<RecipeModel> {
		const existedRecipe = await this.recipeRepository.findById(id);
		if (!existedRecipe) {
			throw new NotFoundException(RecipeErrorMessages.NOT_FOUND);
		}
		if (existedRecipe.userId !== user.id && user.role !== RoleEnum.Admin) {
			throw new ForbiddenException(RecipeErrorMessages.FORBIDDEN_DELETE_RECIPE);
		}
		return this.recipeRepository.editRecipeById(id);
	}
}
