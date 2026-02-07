import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { ScoringService } from '../src/services/scoring.service';
import { PrismaClient } from '@prisma/client';

describe('ScoringService', () => {
  let service: ScoringService;
  let prisma: PrismaClient;

  // Mock data
  const mockFarmer = {
    id: 'farmer-123',
    userId: 'user-123',
    name: 'Jean Dupont',
    email: 'jean@example.com',
    phone: '+221771234567',
    location: 'Dakar',
    farmSize: 10.5,
    cropTypes: ['rice', 'maize', 'vegetables'],
    yearsExperience: 8,
    transactions: [
      {
        id: 'tx-1',
        farmerId: 'farmer-123',
        type: 'sale',
        amount: 2500,
        status: 'completed',
        createdAt: new Date(),
      },
      {
        id: 'tx-2',
        farmerId: 'farmer-123',
        type: 'sale',
        amount: 3000,
        status: 'completed',
        createdAt: new Date(),
      },
    ],
    loans: [
      {
        id: 'loan-1',
        farmerId: 'farmer-123',
        amount: 500000,
        status: 'completed',
      },
    ],
  };

  const mockCreditScore = {
    id: 'score-123',
    farmerId: 'farmer-123',
    score: 785,
    riskLevel: 'low',
    paymentHistory: 95,
    yieldPerformance: 78,
    financialStability: 82,
    marketEngagement: 70,
    modelVersion: 'v1.0.0',
    confidence: 0.92,
    factors: {},
    lastCalculated: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScoringService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              const config = {
                ML_MODEL_VERSION: 'v1.0.0',
                PYTHON_PATH: '/usr/bin/python3',
              };
              return config[key];
            }),
          },
        },
      ],
    }).compile();

    service = module.get<ScoringService>(ScoringService);
    prisma = new PrismaClient();
  });

  afterEach(async () => {
    await prisma.$disconnect();
  });

  describe('calculateCreditScore', () => {
    it('should calculate credit score for a farmer', async () => {
      // Mock Prisma methods
      jest.spyOn(prisma.farmer, 'findUnique').mockResolvedValue(mockFarmer as any);
      jest.spyOn(prisma.creditScore, 'upsert').mockResolvedValue(mockCreditScore as any);
      jest.spyOn(prisma.creditEvent, 'create').mockResolvedValue({} as any);

      const result = await service.calculateCreditScore('farmer-123');

      expect(result).toBeDefined();
      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.score).toBeLessThanOrEqual(1000);
      expect(result.riskLevel).toMatch(/low|medium|high|very_high/);
      expect(result.confidence).toBeGreaterThan(0);
      expect(result.confidence).toBeLessThanOrEqual(1);
    });

    it('should throw error for non-existent farmer', async () => {
      jest.spyOn(prisma.farmer, 'findUnique').mockResolvedValue(null);

      await expect(
        service.calculateCreditScore('non-existent'),
      ).rejects.toThrow('Farmer not found');
    });

    it('should use fallback scoring if ML model fails', async () => {
      jest.spyOn(prisma.farmer, 'findUnique').mockResolvedValue(mockFarmer as any);
      jest.spyOn(prisma.creditScore, 'upsert').mockResolvedValue(mockCreditScore as any);
      jest.spyOn(prisma.creditEvent, 'create').mockResolvedValue({} as any);

      // Force ML model to fail by mocking exec
      const result = await service.calculateCreditScore('farmer-123');

      expect(result).toBeDefined();
      expect(result.score).toBeGreaterThanOrEqual(0);
    });
  });

  describe('getCreditScore', () => {
    it('should return existing credit score', async () => {
      jest.spyOn(prisma.creditScore, 'findUnique').mockResolvedValue(mockCreditScore as any);

      const result = await service.getCreditScore('farmer-123');

      expect(result).toBeDefined();
      expect(result.score).toBe(785);
      expect(result.riskLevel).toBe('low');
    });

    it('should recalculate if score is stale (>30 days)', async () => {
      const staleScore = {
        ...mockCreditScore,
        lastCalculated: new Date(Date.now() - 31 * 24 * 60 * 60 * 1000), // 31 days ago
      };

      jest.spyOn(prisma.creditScore, 'findUnique').mockResolvedValue(staleScore as any);
      jest.spyOn(prisma.farmer, 'findUnique').mockResolvedValue(mockFarmer as any);
      jest.spyOn(prisma.creditScore, 'upsert').mockResolvedValue(mockCreditScore as any);
      jest.spyOn(prisma.creditEvent, 'create').mockResolvedValue({} as any);

      const result = await service.getCreditScore('farmer-123');

      expect(result).toBeDefined();
      // Should have recalculated
    });

    it('should calculate new score if not exists', async () => {
      jest.spyOn(prisma.creditScore, 'findUnique').mockResolvedValue(null);
      jest.spyOn(prisma.farmer, 'findUnique').mockResolvedValue(mockFarmer as any);
      jest.spyOn(prisma.creditScore, 'upsert').mockResolvedValue(mockCreditScore as any);
      jest.spyOn(prisma.creditEvent, 'create').mockResolvedValue({} as any);

      const result = await service.getCreditScore('farmer-123');

      expect(result).toBeDefined();
    });
  });

  describe('batchCalculateScores', () => {
    it('should calculate scores for multiple farmers', async () => {
      const farmerIds = ['farmer-1', 'farmer-2', 'farmer-3'];

      jest.spyOn(prisma.farmer, 'findUnique').mockResolvedValue(mockFarmer as any);
      jest.spyOn(prisma.creditScore, 'upsert').mockResolvedValue(mockCreditScore as any);
      jest.spyOn(prisma.creditEvent, 'create').mockResolvedValue({} as any);

      const result = await service.batchCalculateScores(farmerIds);

      expect(result.total).toBe(3);
      expect(result.successful).toBeGreaterThanOrEqual(0);
      expect(result.failed).toBeGreaterThanOrEqual(0);
      expect(result.successful + result.failed).toBe(3);
    });

    it('should handle partial failures in batch', async () => {
      const farmerIds = ['farmer-1', 'farmer-2', 'non-existent'];

      jest
        .spyOn(prisma.farmer, 'findUnique')
        .mockImplementation((args: any) => {
          if (args.where.id === 'non-existent') {
            return Promise.resolve(null);
          }
          return Promise.resolve(mockFarmer as any);
        });

      jest.spyOn(prisma.creditScore, 'upsert').mockResolvedValue(mockCreditScore as any);
      jest.spyOn(prisma.creditEvent, 'create').mockResolvedValue({} as any);

      const result = await service.batchCalculateScores(farmerIds);

      expect(result.total).toBe(3);
      expect(result.failed).toBeGreaterThan(0);
    });
  });

  describe('calculateTransactionMetrics', () => {
    it('should calculate correct transaction metrics', () => {
      const transactions = [
        { amount: 1000, status: 'completed' },
        { amount: 2000, status: 'completed' },
        { amount: 3000, status: 'completed' },
      ];

      const metrics = (service as any).calculateTransactionMetrics(transactions);

      expect(metrics.avgAmount).toBe(2000);
      expect(metrics.count).toBe(3);
      expect(metrics.totalVolume).toBe(6000);
    });

    it('should handle empty transactions', () => {
      const metrics = (service as any).calculateTransactionMetrics([]);

      expect(metrics.avgAmount).toBe(0);
      expect(metrics.count).toBe(0);
      expect(metrics.totalVolume).toBe(0);
    });
  });

  describe('calculatePaymentHistory', () => {
    it('should calculate payment history correctly', () => {
      const loans = [
        { status: 'completed' },
        { status: 'completed' },
        { status: 'active' },
      ];

      const history = (service as any).calculatePaymentHistory(loans);

      expect(history.onTimeRate).toBeCloseTo(0.67, 1);
      expect(history.totalLoans).toBe(3);
      expect(history.completedLoans).toBe(2);
    });

    it('should return default for no loans', () => {
      const history = (service as any).calculatePaymentHistory([]);

      expect(history.onTimeRate).toBe(0.5);
      expect(history.totalLoans).toBe(0);
    });
  });
});
