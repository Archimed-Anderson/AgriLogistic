import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger, Inject } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { AgriDB, MissionStatus } from '@agrologistic/database';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'war-room',
})
export class WarRoomGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('WarRoomGateway');

  constructor(@Inject('AGRI_DB') private readonly db: AgriDB) {}

  afterInit(server: Server) {
    this.logger.log('War Room Gateway Initialized');
    
    // Periodically broadcast live statistics to all connected operators
    setInterval(async () => {
      await this.broadcastLiveStats();
    }, 5000);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Operator connected: ${client.id}`);
    client.emit('welcome', { message: 'Connected to Mission Control Multi-link' });
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Operator disconnected: ${client.id}`);
  }

  @SubscribeMessage('request_fleet_status')
  async handleFleetStatusRequest(client: Socket) {
    const missions = await this.db.missions.findPaginated({
      where: {
        status: {
          in: [MissionStatus.ASSIGNED, MissionStatus.IN_TRANSIT]
        }
      },
      include: {
        vehicle: true,
        requester: true
      }
    });

    client.emit('fleet_status_update', {
      timestamp: new Date().toISOString(),
      activeMissions: missions.data,
      totalCount: missions.meta.total
    });
  }

  private async broadcastLiveStats() {
    try {
      const [pending, active, completed] = await Promise.all([
        this.db.missions.count({ status: MissionStatus.PENDING }),
        this.db.missions.count({ status: MissionStatus.IN_TRANSIT }),
        this.db.missions.count({ status: MissionStatus.COMPLETED }),
      ]);

      const incidents = await this.db.missions.prisma.incident.findMany({
        where: { status: 'PENDING' },
        orderBy: { severity: 'desc' },
        take: 5
      });

      this.server.emit('live_ops_stats', {
        missions: { pending, active, completed },
        incidents: incidents.map(i => ({
          id: i.id,
          title: i.title,
          severity: i.severity,
          type: i.type,
          location: i.location
        })),
        networkStatus: 'STABLE',
        intelMesh: 'ACTIVE',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      this.logger.error('Failed to broadcast live stats', error);
    }
  }

  /**
   * Internal method to broadcast a mission update when it happens
   */
  async notifyMissionUpdate(missionId: string, status: MissionStatus, message: string) {
    this.server.emit('mission_event', {
      missionId,
      status,
      message,
      timestamp: new Date().toISOString()
    });
    
    // Also trigger full stats refresh
    await this.broadcastLiveStats();
  }
}
