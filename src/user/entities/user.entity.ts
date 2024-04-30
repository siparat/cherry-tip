import { compare, hash } from 'bcrypt';
import { IUserEntity } from '../user.interfaces';
import { GoalTypeEnum, RoleEnum } from '@prisma/client';
import { ProfileEntity } from './profile.entity';
import { UnitsEntity } from './units.entity';
import { UserErrorMessages } from '../user.constants';
import { GoalEntity } from './goal.entity';
import { getActivityCoefficient } from 'src/configs/user.config';

export class UserEntity {
	id?: string;
	email: string;
	passwordHash: string;
	login: string;
	role: RoleEnum;
	profile?: ProfileEntity;
	units?: UnitsEntity;
	goal?: GoalEntity;

	constructor({ id, login, email, passwordHash, role }: IUserEntity) {
		this.id = id;
		this.email = email;
		this.passwordHash = passwordHash;
		this.login = login;
		this.role = role;
	}

	setProfile(profileEntity: ProfileEntity): this {
		this.profile = profileEntity;
		return this;
	}

	setUnits(unitsEntity: UnitsEntity): this {
		this.units = unitsEntity;
		return this;
	}

	setGoal(goalEntity: GoalEntity): this {
		this.goal = goalEntity;
		return this;
	}

	async setPassword(password: string): Promise<this> {
		const salt = 6;
		this.passwordHash = await hash(password, salt);
		return this;
	}

	comparePassword(password: string): Promise<boolean> {
		return compare(password, this.passwordHash);
	}

	calculateGoalCalorie(): number {
		if (!this.units || !this.profile || !this.goal) {
			throw new Error(UserErrorMessages.IMPOSSIBLE_CALCULATE);
		}
		const age = Math.abs(new Date(Date.now() - this.profile.birth.getTime()).getUTCFullYear() - 1970);
		const activityCoefficient = getActivityCoefficient(this.goal.activity);
		const goalCalorie = (this.units.weight * 10 + this.units.height * 6.25 - age * 5) * activityCoefficient;

		switch (this.goal.type) {
			case GoalTypeEnum.Stay:
				return goalCalorie;
			case GoalTypeEnum.Lose:
				return goalCalorie * 0.8;
			case GoalTypeEnum.Gain:
				return goalCalorie * 1.2;
		}
	}

	getMainInfo(): IUserEntity {
		return {
			id: this.id,
			login: this.login,
			email: this.email,
			passwordHash: this.passwordHash,
			role: this.role
		};
	}
}
