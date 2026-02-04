import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InfluxDB, Point } from '@influxdata/influxdb-client';
import * as mqtt from 'mqtt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TelemetryService implements OnModuleInit {
  private readonly logger = new Logger(TelemetryService.name);
  private influxWriteApi: any;
  private mqttClient: mqtt.MqttClient;

  constructor(private configService: ConfigService) {
    const url = this.configService.get<string>('INFLUXDB_URL');
    const token = this.configService.get<string>('INFLUXDB_TOKEN');
    const org = this.configService.get<string>('INFLUXDB_ORG', 'AgroDeep');
    const bucket = this.configService.get<string>('INFLUXDB_BUCKET', 'telemetry');

    if (url && token) {
        const influxDB = new InfluxDB({ url, token });
        this.influxWriteApi = influxDB.getWriteApi(org, bucket);
    }
  }

  onModuleInit() {
    const mqttUrl = this.configService.get<string>('MQTT_URL');
    if (mqttUrl) {
        this.mqttClient = mqtt.connect(mqttUrl);
        this.mqttClient.on('connect', () => {
          this.logger.log('Connected to MQTT Broker');
          this.mqttClient.subscribe('fleet/+/telemetry');
        });

        this.mqttClient.on('message', (topic, message) => {
          this.handleTelemetry(topic, message.toString());
        });
    }
  }

  private handleTelemetry(topic: string, message: string) {
    try {
      const data = JSON.parse(message);
      const vehicleId = topic.split('/')[1];

      this.logger.debug(`Telemetry from ${vehicleId}: ${message}`);

      // Write to InfluxDB
      if (this.influxWriteApi) {
          const point = new Point('vehicle_metrics')
            .tag('vehicleId', vehicleId)
            .floatField('temp', data.temp)
            .floatField('humidity', data.humidity)
            .floatField('fuel', data.fuel)
            .floatField('lat', data.lat)
            .floatField('lng', data.lng)
            .stringField('doors', data.doors)
            .stringField('engine', data.engine);
          
          this.influxWriteApi.writePoint(point);
      }

      // TODO: Forward to AlertService for threshold checking
    } catch (e) {
      this.logger.error(`Failed to handle telemetry: ${e.message}`);
    }
  }

  async getLatestMetrics(vehicleId: string) {
      // Mock for now
      return {
          vehicleId,
          temp: 13.5,
          fuel: 78,
          timestamp: new Date().toISOString()
      };
  }
}
