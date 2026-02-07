import { Injectable, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';

const execAsync = promisify(exec);

interface FarmerData {
  farmerId: string;
  farmSize?: number;
  yearsExperience?: number;
  cropTypes?: string[];
  location?: string;
}

interface CreditScoreResult {
  score: number;
  riskLevel: string;
  confidence: number;
  components: {
    paymentHistory: number;
    yieldPerformance: number;
    financialStability: number;
    marketEngagement: number;
  };
  factors: Record<string, number>;
  recommendations: Array<{
    type: string;
    message: string;
    impact: string;
  }>;
}

@Injectable()
export class ScoringService {
  private readonly logger = new Logger(ScoringService.name);
  private readonly prisma: PrismaClient;
  private readonly mlScriptPath: string;

  constructor() {
    this.prisma = new PrismaClient();
    this.mlScriptPath = path.join(__dirname, '../../ml/predict.py');
  }

  /**
   * Calculate credit score for a farmer
   */
  async calculateCreditScore(farmerId: string): Promise<CreditScoreResult> {
    this.logger.log(`Calculating credit score for farmer: ${farmerId}`);

    try {
      // 1. Fetch farmer data
      const farmer = await this.prisma.farmer.findUnique({
        where: { id: farmerId },
        include: {
          transactions: {
            where: { status: 'completed' },
            orderBy: { createdAt: 'desc' },
          },
          loans: {
            where: { status: { in: ['active', 'completed'] } },
          },
        },
      });

      if (!farmer) {
        throw new Error(`Farmer not found: ${farmerId}`);
      }

      // 2. Calculate transaction metrics
      const transactionMetrics = this.calculateTransactionMetrics(
        farmer.transactions,
      );

      // 3. Calculate payment history
      const paymentHistory = this.calculatePaymentHistory(farmer.loans);

      // 4. Prepare data for ML model
      const farmerData = {
        farm_size: farmer.farmSize || 0,
        years_experience: farmer.yearsExperience || 0,
        avg_transaction_amount: transactionMetrics.avgAmount,
        transaction_count: transactionMetrics.count,
        on_time_payment_rate: paymentHistory.onTimeRate,
        crop_types: farmer.cropTypes || [],
        location: farmer.location || 'unknown',
      };

      // 5. Call ML model for prediction
      const prediction = await this.callMLModel(farmerData);

      // 6. Save credit score to database
      await this.saveCreditScore(farmerId, prediction);

      // 7. Log event
      await this.logCreditEvent(farmerId, 'score_calculated', prediction);

      this.logger.log(
        `Credit score calculated: ${prediction.score} (${prediction.riskLevel})`,
      );

      return prediction;
    } catch (error) {
      this.logger.error(`Error calculating credit score: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get current credit score from database
   */
  async getCreditScore(farmerId: string) {
    const creditScore = await this.prisma.creditScore.findUnique({
      where: { farmerId },
      include: {
        farmer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!creditScore) {
      // Calculate if not exists
      return this.calculateCreditScore(farmerId);
    }

    // Check if score is stale (older than 30 days)
    const daysSinceUpdate =
      (Date.now() - creditScore.lastCalculated.getTime()) /
      (1000 * 60 * 60 * 24);

    if (daysSinceUpdate > 30) {
      this.logger.log(`Credit score is stale, recalculating...`);
      return this.calculateCreditScore(farmerId);
    }

    return creditScore;
  }

  /**
   * Calculate transaction metrics
   */
  private calculateTransactionMetrics(transactions: any[]) {
    if (transactions.length === 0) {
      return { avgAmount: 0, count: 0, totalVolume: 0 };
    }

    const totalAmount = transactions.reduce(
      (sum, t) => sum + Number(t.amount),
      0,
    );

    return {
      avgAmount: totalAmount / transactions.length,
      count: transactions.length,
      totalVolume: totalAmount,
    };
  }

  /**
   * Calculate payment history metrics
   */
  private calculatePaymentHistory(loans: any[]) {
    if (loans.length === 0) {
      return { onTimeRate: 0.5, totalLoans: 0 }; // Default neutral score
    }

    // Count completed loans vs defaulted
    const completedLoans = loans.filter((l) => l.status === 'completed').length;
    const totalLoans = loans.length;

    const onTimeRate = completedLoans / totalLoans;

    return {
      onTimeRate,
      totalLoans,
      completedLoans,
    };
  }

  /**
   * Call Python ML model for prediction
   */
  private async callMLModel(farmerData: any): Promise<CreditScoreResult> {
    try {
      // Create temp file with farmer data
      const inputData = JSON.stringify(farmerData);
      const tempFile = `/tmp/farmer_${Date.now()}.json`;

      // Write data to temp file
      const fs = require('fs');
      fs.writeFileSync(tempFile, inputData);

      // Call Python script
      const { stdout, stderr } = await execAsync(
        `python3 ${this.mlScriptPath} --input ${tempFile}`,
      );

      if (stderr) {
        this.logger.warn(`ML model stderr: ${stderr}`);
      }

      // Parse result
      const result = JSON.parse(stdout);

      // Clean up temp file
      fs.unlinkSync(tempFile);

      if (!result.success) {
        throw new Error(`ML prediction failed: ${result.error}`);
      }

      return result.prediction;
    } catch (error) {
      this.logger.error(`ML model error: ${error.message}`);

      // Fallback: simple rule-based scoring
      return this.fallbackScoring(farmerData);
    }
  }

  /**
   * Fallback scoring if ML model fails
   */
  private fallbackScoring(farmerData: any): CreditScoreResult {
    this.logger.warn('Using fallback rule-based scoring');

    const score = Math.min(
      1000,
      Math.max(
        0,
        farmerData.on_time_payment_rate * 400 +
          Math.log1p(farmerData.transaction_count) * 50 +
          Math.log1p(farmerData.farm_size) * 30 +
          farmerData.years_experience * 10,
      ),
    );

    const riskLevel =
      score >= 750 ? 'low' : score >= 600 ? 'medium' : score >= 400 ? 'high' : 'very_high';

    return {
      score: Math.round(score),
      riskLevel,
      confidence: 0.7,
      components: {
        paymentHistory: Math.round(farmerData.on_time_payment_rate * 100),
        yieldPerformance: 50,
        financialStability: 50,
        marketEngagement: 50,
      },
      factors: farmerData,
      recommendations: [],
    };
  }

  /**
   * Save credit score to database
   */
  private async saveCreditScore(
    farmerId: string,
    prediction: CreditScoreResult,
  ) {
    await this.prisma.creditScore.upsert({
      where: { farmerId },
      create: {
        farmerId,
        score: prediction.score,
        riskLevel: prediction.riskLevel,
        paymentHistory: prediction.components.paymentHistory,
        yieldPerformance: prediction.components.yieldPerformance,
        financialStability: prediction.components.financialStability,
        marketEngagement: prediction.components.marketEngagement,
        modelVersion: 'v1.0.0',
        confidence: prediction.confidence,
        factors: prediction.factors as any,
      },
      update: {
        score: prediction.score,
        riskLevel: prediction.riskLevel,
        paymentHistory: prediction.components.paymentHistory,
        yieldPerformance: prediction.components.yieldPerformance,
        financialStability: prediction.components.financialStability,
        marketEngagement: prediction.components.marketEngagement,
        confidence: prediction.confidence,
        factors: prediction.factors as any,
        lastCalculated: new Date(),
      },
    });
  }

  /**
   * Log credit event for audit trail
   */
  private async logCreditEvent(
    farmerId: string,
    eventType: string,
    data: any,
  ) {
    await this.prisma.creditEvent.create({
      data: {
        farmerId,
        eventType,
        newValue: data,
        triggeredBy: 'system',
      },
    });
  }

  /**
   * Batch calculate credit scores
   */
  async batchCalculateScores(farmerIds: string[]) {
    this.logger.log(`Batch calculating scores for ${farmerIds.length} farmers`);

    const results = await Promise.allSettled(
      farmerIds.map((id) => this.calculateCreditScore(id)),
    );

    const successful = results.filter((r) => r.status === 'fulfilled').length;
    const failed = results.filter((r) => r.status === 'rejected').length;

    this.logger.log(
      `Batch complete: ${successful} successful, ${failed} failed`,
    );

    return {
      total: farmerIds.length,
      successful,
      failed,
      results,
    };
  }
}
