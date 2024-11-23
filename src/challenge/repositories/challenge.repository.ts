import { Injectable } from '@nestjs/common';
import { ChallengeModel, Prisma, StatusEnum, UserChallengeModel } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { ChallengeEntity } from '../entities/challenge.entity';
import { IChallenge } from '../challenge.interfaces';
import { IPaginationParams } from 'src/common/common.interfaces';

@Injectable()
export class ChallengeRepository {
	constructor(private database: DatabaseService) {}

	async createChallenge(entity: ChallengeEntity): Promise<ChallengeModel> {
		const { title, description, image, color, difficulty, tips, durationDays } = entity;
		const sql = Prisma.sql`
			INSERT INTO "ChallengeModel"("updatedAt", "title", "description", "image", "color", "difficulty", "tips", "durationDays") VALUES (
				now(),
				${title},
				${description},
				${image},
				${color},
				${Prisma.sql`${difficulty}::"DifficultyEnum"`},
				${tips},
				${durationDays}
			)
			RETURNING *
		`;
		const [challenge] = await this.database.$queryRaw<ChallengeModel[]>(sql);
		return challenge;
	}

	async editChallenge(id: number, entity: ChallengeEntity): Promise<ChallengeModel> {
		const sql = Prisma.sql`
			UPDATE "ChallengeModel"
			SET
				"updatedAt" = now(),
				"title" = ${entity.title},
				"description" = ${entity.description},
				"image" = ${entity.image},
				"color" = ${entity.color},
				"difficulty" = ${Prisma.sql`${entity.difficulty}::"DifficultyEnum"`},
				"tips" = ${entity.tips},
				"durationDays" = ${entity.durationDays}
			WHERE id = ${id}
			RETURNING *
		`;
		const [challenge] = await this.database.$queryRaw<ChallengeModel[]>(sql);
		return challenge;
	}

	async deleteById(id: number): Promise<ChallengeModel> {
		const sql = Prisma.sql`
			DELETE FROM "ChallengeModel"
			WHERE id = ${id}
			RETURNING *
		`;
		const [challenge] = await this.database.$queryRaw<ChallengeModel[]>(sql);
		return challenge;
	}

	async findByTitle(title: string): Promise<ChallengeModel | null> {
		const sql = Prisma.sql`
			SELECT * FROM "ChallengeModel"
			WHERE "title" = ${title}
			LIMIT 1
		`;
		const [challenge] = await this.database.$queryRaw<ChallengeModel[]>(sql);
		return challenge || null;
	}

	async findById(id: number): Promise<ChallengeModel | null> {
		const sql = Prisma.sql`SELECT * FROM "ChallengeModel" WHERE "id" = ${id}`;
		const [challenge] = await this.database.$queryRaw<ChallengeModel[]>(sql);
		return challenge || null;
	}

	async findMany(options: IPaginationParams): Promise<ChallengeModel[]> {
		const sql = Prisma.sql`
			SELECT * FROM "ChallengeModel" 
			LIMIT ${options.take || null} OFFSET ${options.skip || 0}
		`;
		const challenges = await this.database.$queryRaw<ChallengeModel[]>(sql);
		return challenges;
	}

	async findManyByStatus(
		status: StatusEnum | undefined,
		userId: string,
		options: IPaginationParams
	): Promise<IChallenge[]> {
		const sql = Prisma.sql`
			SELECT *, uc.id AS "userChallengeId", "challengeId" AS "id" FROM "ChallengeModel" c
			LEFT JOIN "UserChallengeModel" uc ON uc."challengeId" = c.id
			WHERE
				uc."userId" = ${userId}
				${status ? Prisma.sql`AND status = ${status}::"StatusEnum"` : Prisma.sql``}
			LIMIT ${options.take || null} OFFSET ${options.skip || 0}
		`;

		const challenges =
			await this.database.$queryRaw<(ChallengeModel & UserChallengeModel & { userChallengeId: number })[]>(sql);
		return challenges.map((c) => ({
			id: c.id,
			createdAt: c.createdAt,
			updatedAt: c.updatedAt,
			title: c.title,
			description: c.description,
			image: c.image,
			color: c.color,
			difficulty: c.difficulty,
			tips: c.tips,
			durationDays: c.durationDays,
			userChallenge: !c.userChallengeId
				? undefined
				: {
						id: c.userChallengeId,
						startDate: c.startDate,
						status: c.status,
						userId: c.userId
					}
		}));
	}

	async findWithUserInfo(challengeId: number, userId: string): Promise<IChallenge | null> {
		const sql = Prisma.sql`
			SELECT *, uc.id AS "userChallengeId", "challengeId" AS "id" FROM "ChallengeModel" c
			LEFT JOIN "UserChallengeModel" uc ON uc."challengeId" = c.id AND uc."userId" = ${userId}
			WHERE 
				c.id = ${challengeId}
			LIMIT 1
		`;
		const [challenge] =
			await this.database.$queryRaw<(ChallengeModel & UserChallengeModel & { userChallengeId: number })[]>(sql);
		if (!challenge) {
			return null;
		}
		return {
			id: challenge.id,
			createdAt: challenge.createdAt,
			updatedAt: challenge.updatedAt,
			title: challenge.title,
			description: challenge.description,
			image: challenge.image,
			color: challenge.color,
			difficulty: challenge.difficulty,
			tips: challenge.tips,
			durationDays: challenge.durationDays,
			userChallenge: !challenge.userChallengeId
				? undefined
				: {
						id: challenge.userChallengeId,
						startDate: challenge.startDate,
						status: challenge.status,
						userId: challenge.userId
					}
		};
	}

	async startChallenge(challengeId: number, userId: string): Promise<UserChallengeModel> {
		const sql = Prisma.sql`
			SELECT * FROM "UserChallengeModel"
			WHERE 
				"userId" = ${userId} AND
				"challengeId" = ${challengeId}
		`;
		const [userChallenge] = await this.database.$queryRaw<UserChallengeModel[]>(sql);
		if (userChallenge) {
			const sql = Prisma.sql`
				UPDATE "UserChallengeModel"
				SET
					"startDate" = now(),
					"status" = ${Prisma.sql`${StatusEnum.Started}::"StatusEnum"`}
				WHERE id = ${userChallenge.id}
				RETURNING *
			`;
			const [challenge] = await this.database.$queryRaw<UserChallengeModel[]>(sql);
			return challenge;
		}
		const sqlCreate = Prisma.sql`
				INSERT INTO "UserChallengeModel"("userId", "challengeId", "startDate") VALUES (
					${userId},
					${challengeId},
					now()
				)
				RETURNING *
			`;
		const [challenge] = await this.database.$queryRaw<UserChallengeModel[]>(sqlCreate);
		return challenge;
	}

	async cancelChallenge(userChallengeId: number): Promise<UserChallengeModel> {
		const sql = Prisma.sql`
				UPDATE "UserChallengeModel"
				SET "status" = ${Prisma.sql`${StatusEnum.Canceled}::"StatusEnum"`}
				WHERE id = ${userChallengeId}
				RETURNING *
			`;
		const [challenge] = await this.database.$queryRaw<UserChallengeModel[]>(sql);
		return challenge;
	}

	async finishChallenge(userChallengeId: number): Promise<UserChallengeModel> {
		const sql = Prisma.sql`
				UPDATE "UserChallengeModel"
				SET "status" = ${Prisma.sql`${StatusEnum.Finished}::"StatusEnum"`}
				WHERE id = ${userChallengeId}
				RETURNING *
			`;
		const [challenge] = await this.database.$queryRaw<UserChallengeModel[]>(sql);
		return challenge;
	}
}
