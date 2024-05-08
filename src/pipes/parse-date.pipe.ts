import { BadRequestException, PipeTransform } from '@nestjs/common';
import { isISO8601 } from 'class-validator';
import { CommonDtoErrors } from 'src/common/common.constants';

export class ParseDatePipe implements PipeTransform {
	constructor(private setDefault: boolean = false) {}

	transform(value: string): Date {
		if (typeof value !== 'undefined' && isISO8601(value)) {
			return new Date(value);
		}
		if (!isISO8601(value) || !this.setDefault) {
			throw new BadRequestException(CommonDtoErrors.IS_NOT_DATE);
		}
		return new Date();
	}
}
