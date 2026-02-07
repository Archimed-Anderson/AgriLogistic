import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { ScoringService } from '../services/scoring.service';

// DTOs
class CalculateScoreDto {
  farmerId: string;
}

class BatchCalculateDto {
  farmerIds: string[];
}

@Controller('credit')
export class CreditController {
  constructor(private readonly scoringService: ScoringService) {}

  /**
   * Calculate credit score for a farmer
   * POST /credit/score/:farmerId
   */
  @Post('score/:farmerId')
  @HttpCode(HttpStatus.OK)
  async calculateScore(@Param('farmerId') farmerId: string) {
    if (!farmerId) {
      throw new BadRequestException('Farmer ID is required');
    }

    try {
      const result = await this.scoringService.calculateCreditScore(farmerId);

      return {
        success: true,
        data: result,
        message: 'Credit score calculated successfully',
      };
    } catch (error) {
      throw new BadRequestException(
        `Failed to calculate credit score: ${error.message}`,
      );
    }
  }

  /**
   * Get current credit score
   * GET /credit/score/:farmerId
   */
  @Get('score/:farmerId')
  async getScore(@Param('farmerId') farmerId: string) {
    if (!farmerId) {
      throw new BadRequestException('Farmer ID is required');
    }

    try {
      const score = await this.scoringService.getCreditScore(farmerId);

      if (!score) {
        throw new NotFoundException(
          `Credit score not found for farmer: ${farmerId}`,
        );
      }

      return {
        success: true,
        data: score,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to get credit score: ${error.message}`,
      );
    }
  }

  /**
   * Batch calculate credit scores
   * POST /credit/score/batch
   */
  @Post('score/batch')
  @HttpCode(HttpStatus.OK)
  async batchCalculate(@Body() dto: BatchCalculateDto) {
    if (!dto.farmerIds || dto.farmerIds.length === 0) {
      throw new BadRequestException('Farmer IDs are required');
    }

    if (dto.farmerIds.length > 100) {
      throw new BadRequestException('Maximum 100 farmers per batch');
    }

    try {
      const result = await this.scoringService.batchCalculateScores(
        dto.farmerIds,
      );

      return {
        success: true,
        data: result,
        message: `Processed ${result.total} farmers`,
      };
    } catch (error) {
      throw new BadRequestException(
        `Batch calculation failed: ${error.message}`,
      );
    }
  }

  /**
   * Get credit history for a farmer
   * GET /credit/history/:farmerId
   */
  @Get('history/:farmerId')
  async getHistory(
    @Param('farmerId') farmerId: string,
    @Query('limit') limit?: string,
  ) {
    // TODO: Implement credit history retrieval
    // This will show historical credit scores and events

    return {
      success: true,
      data: {
        farmerId,
        history: [],
        message: 'History endpoint - to be implemented',
      },
    };
  }

  /**
   * Get credit score breakdown
   * GET /credit/breakdown/:farmerId
   */
  @Get('breakdown/:farmerId')
  async getBreakdown(@Param('farmerId') farmerId: string) {
    const score = await this.scoringService.getCreditScore(farmerId);

    if (!score) {
      throw new NotFoundException(
        `Credit score not found for farmer: ${farmerId}`,
      );
    }

    return {
      success: true,
      data: {
        score: score.score,
        riskLevel: score.riskLevel,
        components: {
          paymentHistory: score.paymentHistory,
          yieldPerformance: score.yieldPerformance,
          financialStability: score.financialStability,
          marketEngagement: score.marketEngagement,
        },
        factors: score.factors,
        confidence: score.confidence,
        lastCalculated: score.lastCalculated,
      },
    };
  }

  /**
   * Update farmer data and recalculate score
   * PUT /credit/update/:farmerId
   */
  @Put('update/:farmerId')
  async updateAndRecalculate(@Param('farmerId') farmerId: string) {
    try {
      const result = await this.scoringService.calculateCreditScore(farmerId);

      return {
        success: true,
        data: result,
        message: 'Credit score updated successfully',
      };
    } catch (error) {
      throw new BadRequestException(
        `Failed to update credit score: ${error.message}`,
      );
    }
  }

  /**
   * Get loan recommendations based on credit score
   * GET /credit/loan/recommend/:farmerId
   */
  @Get('loan/recommend/:farmerId')
  async getLoanRecommendations(@Param('farmerId') farmerId: string) {
    const score = await this.scoringService.getCreditScore(farmerId);

    if (!score) {
      throw new NotFoundException(
        `Credit score not found for farmer: ${farmerId}`,
      );
    }

    // Calculate recommended loan amounts based on risk level
    let maxLoanAmount: number;
    let interestRate: number;
    let maxDuration: number;

    switch (score.riskLevel) {
      case 'low':
        maxLoanAmount = 5000000; // 5M CFA
        interestRate = 8.0; // 8% annual
        maxDuration = 24; // 24 months
        break;
      case 'medium':
        maxLoanAmount = 2000000; // 2M CFA
        interestRate = 12.0; // 12% annual
        maxDuration = 18; // 18 months
        break;
      case 'high':
        maxLoanAmount = 500000; // 500K CFA
        interestRate = 18.0; // 18% annual
        maxDuration = 12; // 12 months
        break;
      default: // very_high
        maxLoanAmount = 100000; // 100K CFA
        interestRate = 24.0; // 24% annual
        maxDuration = 6; // 6 months
        break;
    }

    return {
      success: true,
      data: {
        farmerId,
        creditScore: score.score,
        riskLevel: score.riskLevel,
        recommendations: {
          maxLoanAmount,
          interestRate,
          maxDuration,
          eligibleProducts: this.getEligibleProducts(score.riskLevel),
        },
        message: 'Loan recommendations generated successfully',
      },
    };
  }

  /**
   * Get eligible loan products based on risk level
   */
  private getEligibleProducts(riskLevel: string): string[] {
    const products = {
      low: [
        'Premium Agricultural Loan',
        'Equipment Financing',
        'Expansion Loan',
        'Working Capital',
      ],
      medium: ['Standard Agricultural Loan', 'Seasonal Loan', 'Working Capital'],
      high: ['Micro Loan', 'Seasonal Loan'],
      very_high: ['Micro Loan'],
    };

    return products[riskLevel] || [];
  }

  /**
   * Health check endpoint
   * GET /credit/health
   */
  @Get('health')
  async healthCheck() {
    return {
      success: true,
      service: 'AgriCredit',
      status: 'healthy',
      timestamp: new Date().toISOString(),
    };
  }
}
