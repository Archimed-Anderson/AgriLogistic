import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MissionStatus } from '@prisma/client';
import { StorageService } from './storage.service';
import { RoutingService } from './routing.service';
import { NotificationService } from '../notifications/notification.service';

@Injectable()
export class MissionsService {
  constructor(
    private prisma: PrismaService,
    private storageService: StorageService,
    private routingService: RoutingService,
    private notificationService: NotificationService,
  ) {}

  async create(data: any) {
    const count = await this.prisma.mission.count();
    const orderNumber = `MS-${9000 + count + 1}`;

    let estimatedEta = null;
    if (data.originLat && data.destinationLat) {
      estimatedEta = await this.routingService.estimateEta(
        [data.originLat, data.originLng],
        [data.destinationLat, data.destinationLng]
      );
    }

    const mission = await this.prisma.mission.create({
      data: {
        ...data,
        orderNumber,
        estimatedEta,
        checkpoints: {
          create: {
            status: 'CREATED',
            notes: 'Mission initialisée via Admin Dashboard',
          }
        }
      },
      include: { checkpoints: true }
    });

    // Notify creation
    await this.notificationService.notifyStatusChange(
      mission.orderNumber,
      'CREATED',
      `Nouvelle mission pour ${mission.productName} créée.`
    );

    return mission;
  }

  async findAll() {
    return this.prisma.mission.findMany({
      include: { checkpoints: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findOne(id: string) {
    const mission = await this.prisma.mission.findUnique({
      where: { id },
      include: { checkpoints: true, documents: true }
    });
    if (!mission) throw new NotFoundException(`Mission ${id} not found`);
    return mission;
  }

  async updateStatus(id: string, status: MissionStatus, evidenceUrl?: string, notes?: string) {
    return this.prisma.$transaction(async (tx) => {
      const mission = await tx.mission.update({
        where: { id },
        data: { status }
      });

      await tx.checkpoint.create({
        data: {
          missionId: id,
          status,
          evidenceUrl,
          notes
        }
      });

      // Notify status change
      await this.notificationService.notifyStatusChange(
        mission.orderNumber,
        status,
        notes || `Statut mis à jour: ${status}`
      );

      return mission;
    });
  }

  async uploadPOD(id: string, buffer: Buffer, originalName: string, status: MissionStatus) {
    const fileName = `pod_${id}_${Date.now()}_${originalName}`;
    const fileUrl = await this.storageService.uploadFile(fileName, buffer, {
      'Content-Type': 'image/jpeg',
      'Mission-ID': id
    });

    return this.updateStatus(id, status, fileUrl, 'Preuve de livraison téléchargée (Photo/Signature)');
  }

  async suggestDrivers(missionId: string) {
    return [
      { driverId: 'D-1', name: 'Moussa Sylla', score: 98, distance: '5km' },
      { driverId: 'D-2', name: 'Ismael Diakité', score: 92, distance: '12km' }
    ];
  }
}
