import { DifficultyEnum, StatusEnum, UserChallengeModel } from '@prisma/client';
import { IChallenge, IChallengeEntity } from '../challenge.interfaces';
import { ChallengeErrorMessages } from '../challenge.constants';

export class ChallengeEntity {
	id?: number;
	title: string;
	description: string;
	image: string;
	color: string;
	durationDays: number;
	difficulty: DifficultyEnum;
	tips: string[];
	userChallenge?: Omit<UserChallengeModel, 'challengeId'>;

	constructor(challenge: IChallengeEntity) {
		this.id = challenge.id;
		this.title = challenge.title;
		this.description = challenge.description;
		this.image = challenge.image;
		this.color = challenge.color;
		this.durationDays = challenge.durationDays;
		this.tips = challenge.tips;
		this.difficulty = challenge.difficulty ?? DifficultyEnum.Easy;
	}

	getPublicInfo(): IChallenge {
		if (!this.id) {
			throw new Error(ChallengeErrorMessages.ID_IS_MISSING_IN_ENTITY.en);
		}
		return {
			...this,
			id: this.id,
			userChallenge: this.userChallenge ?? null
		};
	}

	setUserStatus(userChallenge: typeof this.userChallenge): this {
		this.userChallenge = userChallenge;
		return this;
	}

	durationIsExpired(): boolean {
		const duration = this.durationDays * 1000 * 60 * 60 * 24;
		if (this.userChallenge?.status !== StatusEnum.Started) {
			return false;
		}
		return new Date(this.userChallenge.startDate).getTime() + duration < Date.now();
	}
}
