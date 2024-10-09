import { ChallengeModel, UserChallengeModel } from '@prisma/client';
import { PartialFields } from 'types/partial-fields.type';

export type IChallenge = ChallengeModel & { userChallenge?: Omit<UserChallengeModel, 'challengeId'> };

export type IChallengeEntity = PartialFields<ChallengeModel, 'id' | 'createdAt' | 'updatedAt' | 'difficulty'>;
