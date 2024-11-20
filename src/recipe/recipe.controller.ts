import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	ForbiddenException,
	Get,
	Header,
	Headers,
	Logger,
	NotFoundException,
	Param,
	ParseIntPipe,
	Post,
	Put,
	Query,
	UnauthorizedException,
	UploadedFile,
	UseGuards,
	UseInterceptors,
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
import { IRecipeTagModels, IRecipeTags } from './recipe.interfaces';
import { Pagination } from 'src/decorators/pagination.decorator';
import { LimitPaginationPipe } from 'src/pipes/limit-pagination.pipe';
import { IPaginationParams, MimeTypeCategory } from 'src/common/common.interfaces';
import { FileInterceptor } from '@nestjs/platform-express';
import { MimeTypePipe } from 'src/pipes/mime-type-category.pipe';
import { CommonErrorMessages } from 'src/common/common.constants';
import { FileSizePipe } from 'src/pipes/file-size.pipe';
import { AuthService } from 'src/auth/auth.service';
import { AuthErrorMessages } from 'src/auth/auth.constants';
import { UserRepository } from 'src/user/repositories/user.repository';

@Controller('recipe')
export class RecipeController {
	constructor(
		private authService: AuthService,
		private userRepository: UserRepository,
		private recipeService: RecipeService,
		private recipeRepository: RecipeRepository,
		private logger: Logger
	) {}

	@Get('search')
	async search(
		@Pagination(false, new LimitPaginationPipe(30)) options: IPaginationParams,
		@Query('q') q: string,
		@Query('category', new ParseIntPipe({ optional: true })) categoryId?: number,
		@Query('preparation', new ParseIntPipe({ optional: true })) preparationId?: number,
		@Query('diet', new ParseIntPipe({ optional: true })) dietsTypeId?: number
	): Promise<RecipeModel[]> {
		const tags: IRecipeTags = { categoryId, preparationId, dietsTypeId };
		return this.recipeRepository.search(q, options, tags);
	}

	@UseGuards(JwtAuthGuard)
	@Get('my')
	async getMyRecipes(
		@User() user: UserModel,
		@Pagination(false, new LimitPaginationPipe(30)) options: IPaginationParams
	): Promise<RecipeModel[]> {
		return this.recipeRepository.findMineRecipes(user.id, options);
	}

	@Header('Content-Type', 'text/plain')
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(FileInterceptor('file'))
	@Post('upload/image')
	async uploadImage(
		@UploadedFile(new MimeTypePipe(MimeTypeCategory.Image), new FileSizePipe(1500)) file?: Express.Multer.File
	): Promise<string> {
		if (!file) {
			throw new BadRequestException(CommonErrorMessages.FILE_UNDEFINED);
		}
		return this.recipeService.saveImage(file);
	}

	@Get('tags')
	async getAllTags(): Promise<IRecipeTagModels> {
		return this.recipeService.getAllTags();
	}

	@UseGuards(JwtAuthGuard)
	@UsePipes(ValidationPipe)
	@Post()
	async createRecipe(@User() user: UserModel, @Body() dto: CreateRecipeDto): Promise<RecipeModel> {
		return this.recipeService.createRecipe(user.id, dto);
	}

	@Get(':id')
	async getRecipeById(
		@Param('id', new ParseIntPipe({ optional: true })) id: number,
		@Headers('Authorization') token: string = ''
	): Promise<RecipeModel> {
		const recipe = await this.recipeRepository.findById(id);
		if (!recipe) {
			throw new NotFoundException(RecipeErrorMessages.NOT_FOUND);
		}
		if (!recipe.userId) {
			return recipe;
		}
		const payload = await this.authService.authenticationToken(token.slice(7));
		if (!payload) {
			throw new UnauthorizedException(AuthErrorMessages.UNAUTHORIZED);
		}

		const user = await this.userRepository.findByEmail(payload.email);
		if (!user || (user.id !== recipe.userId && user.role !== RoleEnum.Admin)) {
			throw new ForbiddenException(RecipeErrorMessages.FORBIDDEN_VIEW_RECIPE);
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
		const result = await this.recipeRepository.editRecipeById(id);
		this.logger.log(`Recipe ${result.title} was deleted by user ${result.userId}`);
		return result;
	}
}
