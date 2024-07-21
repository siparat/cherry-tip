import { BadRequestException, PipeTransform } from '@nestjs/common';

export class FileSizePipe implements PipeTransform {
	constructor(private sizeKb: number) {}

	transform(value: Express.Multer.File): Express.Multer.File {
		if (value.size && value.size > this.sizeKb * 1024) {
			throw new BadRequestException(`Maximum file size – ${this.sizeKb}KB`);
		}
		return value;
	}
}
