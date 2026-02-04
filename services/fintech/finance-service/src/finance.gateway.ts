import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'finance',
})
export class FinanceGateway implements OnGatewayInit {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('FinanceGateway');

  afterInit(_server: Server) {
    this.logger.log('Finance WebSocket Gateway Initialized');
  }

  // Envoi d'une notification de transaction en temps réel
  broadcastTransaction(transaction: { user: string; amount: number; type: string }) {
    this.server.emit('new_transaction', {
      ...transaction,
      timestamp: new Date().toISOString(),
    });
  }

  // Envoi d'une alerte d'anomalie
  broadcastAnomaly(alert: { type: string; severity: string; message: string }) {
    this.server.emit('financial_alert', alert);
  }
}
