import { PrismaClient } from './generated/client';
import type { Prisma } from './generated/client';
import { UserRepository } from './repositories/UserRepository';
import { MissionRepository } from './repositories/MissionRepository';
import { EquipmentRepository } from './repositories/EquipmentRepository';
import { CreditRepository } from './repositories/CreditRepository';

export * from '@prisma/client';
export * from './repositories/BaseRepository';
export * from './repositories/UserRepository';
export * from './repositories/MissionRepository';
export * from './repositories/EquipmentRepository';
export * from './repositories/CreditRepository';

export class AgriDB {
  public users: UserRepository;
  public missions: MissionRepository;
  public equipment: EquipmentRepository;
  public credit: CreditRepository;

  constructor(private prisma: PrismaClient) {
    this.users = new UserRepository(this.prisma);
    this.missions = new MissionRepository(this.prisma);
    this.equipment = new EquipmentRepository(this.prisma);
    this.credit = new CreditRepository(this.prisma);
  }

  static create(url?: string) {
    const prisma = new PrismaClient({
      datasourceUrl: url || (globalThis as any).process?.env?.DATABASE_URL,
    } as any);
    return new AgriDB(prisma);
  }

  async connect() {
    await this.prisma.$connect();
  }

  async disconnect() {
    await this.prisma.$disconnect();
  }
}
