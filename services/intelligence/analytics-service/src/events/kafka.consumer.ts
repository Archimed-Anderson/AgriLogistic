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

      // Cahier des charges 1.2: topics avec points + compatibilité legacy (tirets)
      await consumer.subscribe({
        topics: [
          'user.events', 'order.events', 'logistics.events', 'payment.events', 'analytics.events', 'iot.telemetry',
          'user-events', 'order-events', 'product-events', 'incident-events',
        ],
        fromBeginning: false,
      });

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
        case 'user.events':
        case 'user-events':
          await this.processUserEvent(event);
          break;
        case 'order.events':
        case 'order-events':
          await this.processOrderEvent(event);
          break;
        case 'logistics.events':
          await this.processLogisticsEvent(event);
          break;
        case 'payment.events':
          await this.processPaymentEvent(event);
          break;
        case 'analytics.events':
          await this.processAnalyticsEvent(event);
          break;
        case 'iot.telemetry':
          await this.processIotTelemetry(event);
          break;
        case 'product-events':
          await this.processProductEvent(event);
          break;
        case 'incident-events':
          await this.processIncidentEvent(event);
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

  private static async processLogisticsEvent(event: any): Promise<void> {
    try {
      await ClickHouseClient.insert('logistics_events', [{
        event_id: event.eventId || uuidv4(),
        type: event.type || 'unknown',
        order_id: event.orderId || '',
        location_lat: event.location?.[0] || 0,
        location_lng: event.location?.[1] || 0,
        created_at: event.timestamp || new Date().toISOString(),
      }]);
    } catch (err) {
      console.warn('ClickHouse logistics_events table may not exist:', err);
    }
  }

  private static async processPaymentEvent(event: any): Promise<void> {
    try {
      await ClickHouseClient.insert('payment_events', [{
        event_id: event.eventId || uuidv4(),
        type: event.type || 'unknown',
        order_id: event.orderId || '',
        amount: event.amount ?? 0,
        created_at: event.timestamp || new Date().toISOString(),
      }]);
    } catch (err) {
      console.warn('ClickHouse payment_events table may not exist:', err);
    }
  }

  private static async processAnalyticsEvent(event: any): Promise<void> {
    try {
      await ClickHouseClient.insert('analytics_events', [{
        event_id: event.eventId || uuidv4(),
        event_type: event.type || 'unknown',
        event_data: JSON.stringify(event.data || {}),
        created_at: event.timestamp || new Date().toISOString(),
      }]);
    } catch (err) {
      console.warn('ClickHouse analytics_events table may not exist:', err);
    }
  }

  private static async processIotTelemetry(event: any): Promise<void> {
    try {
      await ClickHouseClient.insert('iot_telemetry', [{
        device_id: event.deviceId || '',
        type: event.type || 'unknown',
        payload: JSON.stringify(event.payload || {}),
        created_at: event.timestamp || new Date().toISOString(),
      }]);
    } catch (err) {
      console.warn('ClickHouse iot_telemetry table may not exist:', err);
    }
  }

  private static async processIncidentEvent(event: any): Promise<void> {
    // Incidents stockés en ClickHouse pour analytics War Room
    try {
      await ClickHouseClient.insert('incident_events', [{
        incident_id: event.id || uuidv4(),
        type: event.type || 'unknown',
        severity: event.severity || 0,
        region: event.region || '',
        location_lat: event.location?.[0] || 0,
        location_lng: event.location?.[1] || 0,
        title: event.title || '',
        created_at: event.timestamp || new Date().toISOString(),
      }]);
    } catch (err) {
      console.warn('ClickHouse incident_events table may not exist:', err);
    }
  }
}

export default KafkaConsumer;
