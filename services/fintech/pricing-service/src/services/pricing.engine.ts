import { Logger } from '@nestjs/common';

export interface CarrierPricingParams {
  distanceKm: number;
  weightTons: number;
  roadType: 'GOUDRON' | 'PISTE';
  isRainySeason: boolean;
  urgencyLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  truckAvailability: number; // 0 to 1
}

export interface PricingRule {
  id: string;
  name: string;
  condition: string;
  multiplier: number;
  type: 'BASE' | 'SURCHARGE' | 'DISCOUNT';
  description: string;
}

export interface PricingResult {
  total: number;
  basePrice: number;
  commissions: number;
  breakdown: {
    label: string;
    amount: number;
    factor: number | string;
  }[];
  metadata: {
    engine_version: string;
    timestamp: string;
  };
}

export class PricingEngine {
  private static readonly logger = new Logger('PricingEngine');

  private static readonly BASE_KM_RATE = 2.5;
  private static readonly RAINY_SEASON_MULTIPLIER = 1.3;
  private static readonly PISTE_COEFFICIENT = 1.5;

  async calculateCarrierPrice(params: CarrierPricingParams): Promise<PricingResult> {
    const basePrice = params.distanceKm * PricingEngine.BASE_KM_RATE * params.weightTons;
    const breakdown: PricingResult['breakdown'] = [
      { label: 'Tarif base (km x poids)', amount: basePrice, factor: `${params.distanceKm}km @ ${PricingEngine.BASE_KM_RATE}€` }
    ];

    let currentTotal = basePrice;

    if (params.roadType === 'PISTE') {
      const surcharge = currentTotal * (PricingEngine.PISTE_COEFFICIENT - 1);
      currentTotal += surcharge;
      breakdown.push({ label: 'Difficulté Route (Piste)', amount: surcharge, factor: 'x1.5' });
    }

    if (params.isRainySeason) {
      const surcharge = currentTotal * (PricingEngine.RAINY_SEASON_MULTIPLIER - 1);
      currentTotal += surcharge;
      breakdown.push({ label: 'Saisonnalité (Pluie)', amount: surcharge, factor: 'x1.3' });
    }

    if (params.urgencyLevel === 'HIGH') {
      const surcharge = currentTotal * 0.5;
      currentTotal += surcharge;
      breakdown.push({ label: 'Urgence (< 2h)', amount: surcharge, factor: 'x1.5' });
    }

    if (params.truckAvailability < 0.2) {
      const surcharge = currentTotal * 0.2;
      currentTotal += surcharge;
      breakdown.push({ label: 'Faible Disponibilité Camions', amount: surcharge, factor: 'x1.2' });
    }

    const platformCommission = this.calculatePlatformCommission(currentTotal, params.weightTons);
    
    return {
      total: currentTotal + platformCommission,
      basePrice: currentTotal,
      commissions: platformCommission,
      breakdown: [
        ...breakdown,
        { label: 'Platform Fee (Progressive)', amount: platformCommission, factor: 'vol/rank based' }
      ],
      metadata: {
        engine_version: '2.0.1-vibrant',
        timestamp: new Date().toISOString()
      }
    };
  }

  private calculatePlatformCommission(amount: number, volume: number): number {
    if (volume < 5) return amount * 0.10;
    if (volume < 20) return amount * 0.08;
    return amount * 0.05;
  }

  async runSimulation(scenario: any): Promise<Record<string, unknown>> {
    const results = await this.calculateCarrierPrice(scenario as CarrierPricingParams);
    return {
      ...results,
      impactBusiness: {
        conversionEstimated: scenario.urgencyLevel === 'HIGH' ? '85%' : '60%',
        marginNet: results.commissions * 0.8
      }
    };
  }
}
