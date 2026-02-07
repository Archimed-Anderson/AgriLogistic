import paho.mqtt.client as mqtt
import json
import time
from influxdb_client import InfluxDBClient, Point, WritePrecision
from influxdb_client.client.write_api import SYNCHRONOUS

# Configuration InfluxDB
INFLUX_URL = "http://localhost:8086"
INFLUX_TOKEN = "my-super-secret-auth-token"
INFLUX_ORG = "agrilogistic"
INFLUX_BUCKET = "cold_chain"

# Configuration MQTT
MQTT_BROKER = "localhost"
MQTT_TOPIC = "truck/+/telemetry"

client_influx = InfluxDBClient(url=INFLUX_URL, token=INFLUX_TOKEN, org=INFLUX_ORG)
write_api = client_influx.write_api(write_options=SYNCHRONOUS)

def on_connect(client, userdata, flags, rc):
    print(f"Connected to MQTT Broker with result code {rc}")
    client.subscribe(MQTT_TOPIC)

def on_message(client, userdata, msg):
    try:
        payload = json.loads(msg.payload.decode())
        truck_id = msg.topic.split('/')[1]
        
        temp = payload.get('temp')
        humidity = payload.get('humidity')
        
        print(f"Truck {truck_id}: Temp={temp}°C, Humidity={humidity}%")
        
        # Envoi vers InfluxDB
        point = Point("telemetry") \
            .tag("truck_id", truck_id) \
            .field("temperature", float(temp)) \
            .field("humidity", float(humidity)) \
            .time(time.time_ns(), WritePrecision.NS)
        
        write_api.write(bucket=INFLUX_BUCKET, record=point)
        
    except Exception as e:
        print(f"Error processing message: {e}")

# MQTT Client Setup
mqtt_client = mqtt.Client()
mqtt_client.on_connect = on_connect
mqtt_client.on_message = on_message

print(f"Connecting to MQTT Broker at {MQTT_BROKER}...")
mqtt_client.connect(MQTT_BROKER, 1883, 60)

# Blocking loop
mqtt_client.loop_forever()
