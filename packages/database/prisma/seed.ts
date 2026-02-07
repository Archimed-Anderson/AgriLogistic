import { UserRole, MissionType, MissionStatus } from '../src/generated/client';
import { AgriDB } from '../src/index';

const url = 'postgresql://admin:AgriLogistic_db_2026@localhost:5432/agrilogistic';
const db = AgriDB.create(url);
const prisma = (db as any).prisma; 

async function main() {
  await db.connect();
  console.log('🌱 Professional Seeding Start...');

  // 1. Unified Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@agrologistic.com' },
    update: {},
    create: {
      email: 'admin@agrologistic.com',
      name: 'Command Center Admin',
      role: UserRole.ADMIN,
      password: 'hashed_password_here',
    },
  });

  // 2. Demonstration Users (Farmers & Drivers)
  const farmer = await prisma.user.upsert({
    where: { email: 'farmer@demo.com' },
    update: {},
    create: {
      email: 'farmer@demo.com',
      name: 'Yao Kouassi',
      role: UserRole.FARMER,
      farmerProfile: {
        create: {
          location: 'Yamoussoukro Region',
          farmSize: 15.5,
          mainCrops: ['Cocoa', 'Palm Oil'],
          experience: 12,
          agriScore: {
            create: {
              score: 820,
              riskLevel: 'LOW',
              paymentHistory: 95,
              yieldPerformance: 88,
              financialStability: 78,
              marketEngagement: 92,
              modelVersion: 'v2.1-stable'
            }
          }
        }
      }
    },
  });

  const driver = await prisma.user.upsert({
    where: { email: 'driver@logistics.demo' },
    update: {},
    create: {
      email: 'driver@logistics.demo',
      name: 'Moussa Traoré',
      role: UserRole.TRANSPORTER,
    }
  });

  // 3. Infrastructure: Vehicles & Devices
  const vehicle = await prisma.vehicle.create({
    data: {
      plateNumber: 'CI-TRUCK-001',
      model: 'Volvo FH16 Refrigirated',
      type: 'Cold-Chain Heavy',
      capacity: 25000,
      currentStatus: 'EN_ROUTE',
    }
  });

  await prisma.iot_devices.create({
    data: {
      uid: 'SENS-MESH-8842',
      type: 'MULTI_SENSOR_PRO',
      status: 'ACTIVE',
      vehicleId: vehicle.id,
      telemetry: {
        create: [
          { data: { temp: 4.2, humidity: 62, lat: 5.36, lon: -3.98 } },
          { data: { temp: 4.1, humidity: 63, lat: 5.37, lon: -3.99 } }
        ]
      }
    }
  });

  // 4. War Room Missions (LIVE)
  await prisma.mission.createMany({
    data: [
      {
        type: MissionType.COLLECTION,
        status: MissionStatus.IN_TRANSIT,
        priority: 5,
        cargoValue: 12500.00,
        cargoDescription: 'Organic Premium Cocoa Bulk',
        origin: 'Yamoussoukro Collection Point B',
        destination: 'Abidjan Export Terminal',
        requesterId: farmer.id,
        driverId: driver.id,
        vehicleId: vehicle.id,
        startedAt: new Date(Date.now() - 3600000), // 1 hour ago
      },
      {
        type: MissionType.DISTRIBUTION,
        status: MissionStatus.PENDING,
        priority: 3,
        cargoValue: 4500.00,
        cargoDescription: 'Fertilizer Batch A-42',
        origin: 'San Pedro Warehouse',
        destination: 'Soubré District Office',
        requesterId: admin.id,
      },
      {
        type: MissionType.COLLECTION,
        status: MissionStatus.ASSIGNED,
        priority: 4,
        cargoValue: 8900.00,
        cargoDescription: 'Coffee Beans - Grade A',
        origin: 'Man Cooperative Hub',
        destination: 'Abidjan Processing Plant',
        requesterId: farmer.id,
        driverId: driver.id,
      }
    ]
  });

  // 5. Tactical Incidents
  await prisma.incidents.createMany({
    data: [
      {
        type: 'COLD_CHAIN_ANOMALY',
        severity: 85,
        title: 'Temperature Deviation Detected',
        description: 'Unit CI-TRUCK-001 reporting 4.2°C (Threshold 4.0°C). Possible compressor lag.',
        status: 'PENDING',
        location: 'A3 Highway, Sector Delta',
        region: 'Lagunes',
        meta: { vehicleRef: 'CI-TRUCK-001', sensorId: 'SENS-MESH-8842' }
      },
      {
        type: 'ROUTE_DELAY',
        severity: 40,
        title: 'Logistical Congestion',
        description: 'Heavy traffic at Abidjan Port Entrance. Estimated 45min delay for 3 units.',
        status: 'PENDING',
        location: 'Port Boulevard',
        region: 'Abidjan',
        meta: { delayMins: 45, impactedUnits: 3 }
      }
    ]
  });

  // 6. Marketplace Data for Analytics
  await prisma.products.create({
    data: {
      title: 'Premium Cocoa Beans',
      description: 'High quality organic cocoa beans from Yamoussoukro.',
      price: 1500,
      quantity: 500,
      unit: 'kg',
      category: 'RAW_MATERIAL',
      sellerId: farmer.id,
    }
  });

  console.log('✅ Professional Seeding Complete. War Room is now Operational.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.disconnect();
  });
