import { AgriScore, PrismaClient } from '../generated/client';
import { BaseRepository } from './BaseRepository';

export class CreditRepository extends BaseRepository<
  AgriScore,
  any,
  any
> {
  constructor(prisma: PrismaClient) {
    super(prisma, (prisma as any).agriScore);
  }

  async getLatestModel() {
    return this.prisma.mLModel.findFirst({
      where: { isActive: true },
      orderBy: { trainedAt: 'desc' }
    });
  }

  async recordCreditEvent(farmerId: string, type: string, oldVal: any, newVal: any) {
    return this.prisma.creditEvent.create({
      data: {
        farmerId,
        eventType: type,
        oldValue: oldVal,
        newValue: newVal
      }
    });
  }

  async findHighRiskLoans() {
    return this.prisma.loan.findMany({
      where: {
        status: 'ACTIVE',
        user: {
          farmerProfile: {
            agriScore: {
              riskLevel: 'high'
            }
          }
        }
      },
      include: {
        user: {
          include: {
            farmerProfile: {
              include: {
                agriScore: true
              }
            }
          }
        }
      }
    });
  }
}
