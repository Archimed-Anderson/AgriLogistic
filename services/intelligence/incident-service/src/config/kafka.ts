import { Kafka, Producer, Consumer } from 'kafkajs';

const brokers = (process.env.KAFKA_BROKERS || 'localhost:9092').split(',');

export const kafka = new Kafka({
  clientId: 'incident-service',
  brokers,
});

export let producer: Producer | null = null;
export let consumer: Consumer | null = null;

export async function initKafkaProducer(): Promise<Producer | null> {
  try {
    producer = kafka.producer();
    await producer.connect();
    console.log('✅ Kafka producer connected');
    return producer;
  } catch (error) {
    console.error('❌ Kafka producer failed:', error);
    return null;
  }
}

export async function initKafkaConsumer(
  onIncident: (event: Record<string, any>) => void
): Promise<Consumer | null> {
  try {
    consumer = kafka.consumer({ groupId: 'incident-war-room-consumer' });
    await consumer.connect();
    await consumer.subscribe({ topics: ['incident.events', 'incident-events'], fromBeginning: false });

    await consumer.run({
      eachMessage: async ({ topic, message }) => {
        if (!message.value) return;
        try {
          const event = JSON.parse(message.value.toString());
          onIncident(event);
        } catch (err) {
          console.error('Kafka message parse error:', err);
        }
      },
    });

    console.log('✅ Kafka consumer connected (incident-events)');
    return consumer;
  } catch (error) {
    console.error('❌ Kafka consumer failed:', error);
    return null;
  }
}

export async function produceIncident(event: Record<string, any>): Promise<void> {
  if (!producer) return;
  await producer.send({
    topic: 'incident.events',
    messages: [{ value: JSON.stringify(event) }],
  });
}
