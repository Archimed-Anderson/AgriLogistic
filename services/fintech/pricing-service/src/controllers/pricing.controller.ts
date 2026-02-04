import { Request, Response } from 'express';
import { PricingEngine } from '../services/pricing.engine';

const engine = new PricingEngine();

export class PricingController {
  
  static async calculate(req: Request, res: Response) {
    try {
      const result = await engine.calculateCarrierPrice(req.body);
      res.json({ success: true, data: result });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error during calculation';
      res.status(400).json({ success: false, error: message });
    }
  }

  static async simulate(req: Request, res: Response) {
    try {
      const result = await engine.runSimulation(req.body);
      res.json({ success: true, data: result });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error during simulation';
      res.status(400).json({ success: false, error: message });
    }
  }

  static async getRules(req: Request, res: Response) {
    res.json({
      success: true,
      rules: [
        { id: 'R1', name: 'Nuit Surcharge', condition: 'hour > 20 || hour < 6', multiplier: 1.2, type: 'SURCHARGE' },
        { id: 'R2', name: 'Zone Difficile Access - Nord', condition: 'zone == "NORD_CI"', multiplier: 1.3, type: 'SURCHARGE' },
        { id: 'R3', name: 'Fidélité Platinium', condition: 'user_rank == "PLATINIUM"', multiplier: 0.95, type: 'DISCOUNT' }
      ]
    });
  }

  static async getZones(req: Request, res: Response) {
    res.json({
      success: true,
      zones: [
        { id: 'Z1', name: 'Abidjan Metropolitan', coefficient: 1.0, color: '#4CAF50' },
        { id: 'Z2', name: 'Zone de Conflit / Difficile', coefficient: 1.5, color: '#F44336' },
        { id: 'Z3', name: 'Zone Cacaoyère (Piste)', coefficient: 1.25, color: '#FF9800' }
      ]
    });
  }
}
