import { Mission, PrismaClient, MissionStatus } from '../generated/client';
import { BaseRepository } from './BaseRepository';

export class MissionRepository extends BaseRepository<
  Mission,
  any,
  any
> {
  constructor(prisma: PrismaClient) {
    super(prisma, (prisma as any).mission);
  }

  async findActiveMissionsByDriver(driverId: string) {
    return this.prisma.mission.findMany({
      where: {
        driverId,
        status: {
          in: [MissionStatus.ASSIGNED, MissionStatus.IN_TRANSIT]
        }
      },
      include: {
        vehicle: true,
        requester: true
      }
    });
  }

  async updateStatus(id: string, status: MissionStatus, eventMessage: string) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Update status
      const mission = await tx.mission.update({
        where: { id },
        data: { 
          status,
          ...(status === MissionStatus.IN_TRANSIT ? { startedAt: new Date() } : {}),
          ...(status === MissionStatus.COMPLETED ? { completedAt: new Date() } : {}),
        }
      });

      // 2. Log event
      await tx.missionEvent.create({
        data: {
          missionId: id,
          type: 'STATUS_CHANGE',
          message: eventMessage,
          metadata: { status }
        }
      });

      return mission;
    });
  }
}
