import { Kafka, Consumer, EachMessagePayload } from 'kafkajs';
import { ClickHouseClient } from '../config/clickhouse';
import { v4 as uuidv4 } from 'uuid';

let consumer: Consumer | null = null;
let connected = false;

export class KafkaConsumer {
  static async connect(): Promise<void> {
    try {
      const kafka = new Kafka({
        clientId: 'analytics-service',
        brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
      });

      consumer = kafka.consumer({ groupId: 'analytics-consumer' });
      await consumer.connect();
      connected = true;

      // Subscribe to topics
      await consumer.subscribe({ topics: ['user-events', 'order-events', 'product-events'], fromBeginning: false });

      // Process messages
      await consumer.run({
        eachMessage: async (payload: EachMessagePayload) => {
          await this.processMessage(payload);
        },
      });

      console.log('✅ Kafka consumer connected');
    } catch (error) {
      console.error('❌ Kafka connection failed:', error);
      console.warn('⚠️ Running without Kafka - events will be stored directly');
    }
  }

  static isConnected(): boolean {
    return connected;
  }

  static async disconnect(): Promise<void> {
    if (consumer) {
      await consumer.disconnect();
      connected = false;
      console.log('Kafka consumer disconnected');
    }
  }

  private static async processMessage(payload: EachMessagePayload): Promise<void> {
    const { topic, message } = payload;

    if (!message.value) return;

    try {
      const event = JSON.parse(message.value.toString());

      switch (topic) {
        case 'user-events':
          await this.processUserEvent(event);
          break;
        case 'order-events':
          await this.processOrderEvent(event);
          break;
        case 'product-events':
          await this.processProductEvent(event);
          break;
      }
    } catch (error) {
      console.error('Error processing message:', error);
    }
  }

  private static async processUserEvent(event: any): Promise<void> {
    await ClickHouseClient.insert('user_events', [{
      event_id: event.eventId || uuidv4(),
      user_id: event.userId || 'anonymous',
      session_id: event.sessionId || '',
      event_type: event.type || 'unknown',
      event_data: JSON.stringify(event.data || {}),
      page_url: event.pageUrl || '',
      referrer: event.referrer || '',
      user_agent: event.userAgent || '',
      ip_address: event.ipAddress || '',
      created_at: event.timestamp || new Date().toISOString(),
    }]);
  }

  private static async processOrderEvent(event: any): Promise<void> {
    if (event.type === 'order_completed') {
      const items = event.data?.items || [];
      const salesData = items.map((item: any) => ({
        date: new Date().toISOString().split('T')[0],
        product_id: item.productId,
        category: item.category || 'unknown',
        total_quantity: item.quantity,
        total_revenue: item.price * item.quantity,
        order_count: 1,
      }));
      
      if (salesData.length > 0) {
        await ClickHouseClient.insert('sales_daily', salesData);
      }
    }
  }

  private static async processProductEvent(event: any): Promise<void> {
    if (event.type === 'product_viewed') {
      await ClickHouseClient.insert('product_views_daily', [{
        date: new Date().toISOString().split('T')[0],
        product_id: event.productId,
        views: 1,
        unique_users: 1,
      }]);
    }
  }
}

export default KafkaConsumer;
