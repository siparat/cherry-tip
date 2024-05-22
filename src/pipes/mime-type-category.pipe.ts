import { BadRequestException, PipeTransform } from '@nestjs/common';
import { isMimeType } from 'class-validator';
import { CommonDtoErrors } from 'src/common/common.constants';
import { MimeTypeCategory } from 'src/common/common.interfaces';

export class MimeTypePipe implements PipeTransform {
	constructor(
		private category: MimeTypeCategory,
		private secondCategory?: string
	) {}

	transform(value?: Express.Multer.File): Express.Multer.File {
		if (!value || !isMimeType(value.mimetype)) {
			throw new BadRequestException(CommonDtoErrors.IS_NOT_MIME_TYPE);
		}
		const [category, secondCategory] = value.mimetype.split('/');
		if (category !== this.category || (this.secondCategory && secondCategory !== this.secondCategory)) {
			throw new BadRequestException(CommonDtoErrors.INVALID_MIME_TYPE);
		}
		return value;
	}
}
