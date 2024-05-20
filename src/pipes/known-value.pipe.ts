import { PipeTransform } from '@nestjs/common';

export class KnownValuePipe<T> implements PipeTransform {
	constructor(
		private validValues: T[],
		private defaultValue: T
	) {}

	transform(value: unknown): T {
		const valueIsDefined = this.validValues.some((v) => v == value);
		if (valueIsDefined) {
			return value as T;
		}
		return this.defaultValue;
	}
}
