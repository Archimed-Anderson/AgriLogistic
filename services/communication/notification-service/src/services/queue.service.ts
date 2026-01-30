import { Queue, Worker, Job } from 'bullmq';
import { EmailProvider } from '../providers/email.provider';
import { SMSProvider } from '../providers/sms.provider';
import { PushProvider } from '../providers/push.provider';
import { Database } from '../config/database';
import { v4 as uuidv4 } from 'uuid';

interface NotificationJob {
  id: string;
  type: 'email' | 'sms' | 'push';
  recipient: string;
  subject?: string;
  message: string;
  template?: string;
  data?: Record<string, any>;
  userId?: string;
  priority?: number;
  retryCount?: number;
}

let notificationQueue: Queue | null = null;
let worker: Worker | null = null;

const emailProvider = new EmailProvider();
const smsProvider = new SMSProvider();
const pushProvider = new PushProvider();

export class NotificationQueue {
  static async initialize(): Promise<void> {
    const redisConfig = {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD || 'redis_secure_2026',
    };

    notificationQueue = new Queue('notifications', {
      connection: redisConfig,
      defaultJobOptions: {
        attempts: 3,
        backoff: { type: 'exponential', delay: 2000 },
        removeOnComplete: 100,
        removeOnFail: 500,
      },
    });

    worker = new Worker('notifications', async (job: Job<NotificationJob>) => {
      return await processNotification(job);
    }, {
      connection: redisConfig,
      concurrency: 10,
    });

    worker.on('completed', (job) => {
      console.log(`[Queue] Notification ${job.id} completed`);
    });

    worker.on('failed', (job, err) => {
      console.error(`[Queue] Notification ${job?.id} failed:`, err.message);
    });

    console.log('âœ… Notification queue initialized');
  }

  static async add(notification: Omit<NotificationJob, 'id'>): Promise<string> {
    if (!notificationQueue) throw new Error('Queue not initialized');
    
    const id = uuidv4();
    const job = await notificationQueue.add('send', { ...notification, id }, {
      priority: notification.priority || 2,
    });
    
    return job.id || id;
  }

  static async addBulk(notifications: Omit<NotificationJob, 'id'>[]): Promise<string[]> {
    if (!notificationQueue) throw new Error('Queue not initialized');
    
    const jobs = notifications.map(n => ({
      name: 'send',
      data: { ...n, id: uuidv4() },
      opts: { priority: n.priority || 2 },
    }));
    
    await notificationQueue.addBulk(jobs);
    return jobs.map(j => j.data.id);
  }

  static async close(): Promise<void> {
    if (worker) await worker.close();
    if (notificationQueue) await notificationQueue.close();
    console.log('Queue closed');
  }
}

async function processNotification(job: Job<NotificationJob>): Promise<any> {
  const { id, type, recipient, subject, message, template, data, userId } = job.data;
  
  console.log(`[Queue] Processing ${type} notification to ${recipient}`);
  
  try {
    let result: any;
    
    switch (type) {
      case 'email':
        result = await emailProvider.send({ to: recipient, subject: subject || 'AgroLogistic', html: message, template, data });
        break;
      case 'sms':
        result = await smsProvider.send({ to: recipient, message });
        break;
      case 'push':
        result = await pushProvider.send({ token: recipient, title: subject || 'AgroLogistic', body: message, data });
        break;
      default:
        throw new Error(`Unknown notification type: ${type}`);
    }

    // Record in database
    await Database.query(
      `INSERT INTO notifications (id, user_id, type, recipient, subject, message, status, sent_at, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())`,
      [id, userId, type, recipient, subject, message, 'sent']
    );

    return { success: true, result };
  } catch (error) {
    await Database.query(
      `INSERT INTO notifications (id, user_id, type, recipient, subject, message, status, error, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
       ON CONFLICT (id) DO UPDATE SET status = $7, error = $8`,
      [id, userId, type, recipient, subject, message, 'failed', error.message]
    );
    throw error;
  }
}

export default NotificationQueue;
