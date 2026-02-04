import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { NotificationGateway } from './notification.gateway';

@Injectable()
export class NotificationService implements OnModuleInit {
  private useFirebase = false;

  constructor(
    private configService: ConfigService,
    private gateway: NotificationGateway
  ) {}

  onModuleInit() {
    const serviceAccountPath = this.configService.get('FIREBASE_SERVICE_ACCOUNT');
    if (serviceAccountPath) {
      try {
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccountPath),
        });
        this.useFirebase = true;
        console.log('🔥 Firebase Admin SDK Initialized');
      } catch (error) {
        console.warn('⚠️ Firebase initialization failed:', error.message);
      }
    }
  }

  /**
   * Envoie une notification (Push Mobile + Real-time Web)
   */
  async notifyStatusChange(missionOrder: string, status: string, details: string) {
    const title = `Mission ${missionOrder}: ${status}`;
    const body = details;

    // 1. Notifier le Web Admin via Socket.io
    this.gateway.sendNotification('mission_update', {
      order: missionOrder,
      status,
      message: body,
      timestamp: new Date(),
    });

    // 2. Envoyer Push Notification via FCM
    if (this.useFirebase) {
      const message = {
        notification: { title, body },
        topic: 'admin_notifications', // Les admins s'abonnent à ce topic
      };

      try {
        await admin.messaging().send(message);
        console.log('📲 Push notification sent via FCM');
      } catch (error) {
        console.error('❌ FCM Send Error:', error.message);
      }
    }
  }
}
