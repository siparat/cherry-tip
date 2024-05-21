import { BadRequestException, PipeTransform } from '@nestjs/common';
import { CommonErrorMessages } from 'src/common/common.constants';
import { IPaginationParams } from 'src/common/common.interfaces';

export class LimitPaginationPipe implements PipeTransform {
	constructor(
		private data: number,
		private throwError: boolean = true
	) {}

	transform(value: IPaginationParams): IPaginationParams {
		const valueIsPaginationParams = this.isPaginationParams(value);
		if ((!valueIsPaginationParams && this.throwError) || Number.isNaN(this.data)) {
			throw new BadRequestException(CommonErrorMessages.IS_NOT_PAGINATION_PARAMS);
		}
		const take = !value.take ? this.data : Math.min(value.take, this.data);
		if (!valueIsPaginationParams) {
			return { take };
		}
		return { skip: value.skip && Math.max(0, value.skip), take };
	}

	private isPaginationParams(obj: object): obj is IPaginationParams {
		if (
			!('take' in obj) ||
			!('skip' in obj) ||
			!['number', 'undefined'].includes(typeof obj.take) ||
			!['number', 'undefined'].includes(typeof obj.skip)
		) {
			return false;
		}
		return true;
	}
}
