import { User, PrismaClient, Mission, MissionStatus } from '../generated/client';
import { BaseRepository } from './BaseRepository';

export class UserRepository extends BaseRepository<
  User,
  any,
  any
> {
  constructor(prisma: PrismaClient) {
    super(prisma, (prisma as any).user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  /**
   * Complex query example: Find farmers with high agri-scores
   */
  async findTopFarmers(minScore: number = 800) {
    return this.prisma.user.findMany({
      where: {
        role: 'FARMER',
        farmerProfile: {
          agriScore: {
            score: { gte: minScore }
          }
        }
      },
      include: {
        farmerProfile: {
          include: {
            agriScore: true
          }
        }
      }
    });
  }
}
