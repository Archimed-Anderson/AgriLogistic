import admin from 'firebase-admin';

interface PushOptions {
  token: string;
  title: string;
  body: string;
  data?: Record<string, string>;
  badge?: number;
  sound?: string;
}

export class PushProvider {
  private initialized = false;

  constructor() {
    if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY) {
      try {
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
          }),
        });
        this.initialized = true;
        console.log('✅ Firebase Cloud Messaging initialized');
      } catch (error) {
        console.error('Firebase init error:', error);
      }
    } else {
      console.warn('⚠️ Firebase credentials not configured - Push will be simulated');
    }
  }

  async send(options: PushOptions): Promise<{ messageId: string; simulated?: boolean }> {
    if (!this.initialized) {
      console.log(`[Push-SIM] Token: ${options.token.substring(0, 20)}..., Title: ${options.title}`);
      return { messageId: `push-sim-${Date.now()}`, simulated: true };
    }

    try {
      const message: admin.messaging.Message = {
        token: options.token,
        notification: {
          title: options.title,
          body: options.body,
        },
        data: options.data,
        android: {
          priority: 'high',
          notification: { sound: options.sound || 'default' },
        },
        apns: {
          payload: {
            aps: {
              badge: options.badge,
              sound: options.sound || 'default',
            },
          },
        },
      };

      const result = await admin.messaging().send(message);
      return { messageId: result };
    } catch (error: any) {
      console.error('[Push] FCM error:', error.message);
      throw new Error(`Push notification failed: ${error.message}`);
    }
  }

  async sendToTopic(topic: string, title: string, body: string, data?: Record<string, string>): Promise<string> {
    if (!this.initialized) {
      console.log(`[Push-SIM] Topic: ${topic}, Title: ${title}`);
      return `topic-sim-${Date.now()}`;
    }

    const result = await admin.messaging().send({
      topic,
      notification: { title, body },
      data,
    });
    return result;
  }
}

export default PushProvider;
