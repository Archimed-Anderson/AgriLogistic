import { Request, Response } from 'express';
import { WalletService } from '../services/wallet.service';

const walletService = new WalletService();

interface PaymentRequest {
  amount: number;
  method: 'WAVE' | 'ORANGE_MONEY' | 'MTN' | 'STRIPE' | 'CASH';
  walletId: string;
  metadata?: Record<string, unknown>;
}

export class PaymentController {
  
  static async getSummary(_req: Request, res: Response) {
    const fraud = await walletService.getFraudPatterns();
    res.json({
      success: true,
      data: {
        platformBalance: 1840500,
        currency: 'EUR',
        activeOperators: ['WAVE_SN', 'ORANGE_CI', 'MTN_BJ', 'STRIPE'],
        fraudAlerts: fraud
      }
    });
  }

  static async deposit(req: Request<Record<string, string>, unknown, PaymentRequest>, res: Response) {
    const { amount, method, walletId, metadata } = req.body;
    const tx = await walletService.processPayment({
      walletId,
      amount,
      type: 'CREDIT',
      method,
      meta: metadata,
    });
    res.status(202).json({ success: true, transaction: tx });
  }

  static async withdraw(req: Request<Record<string, string>, unknown, PaymentRequest>, res: Response) {
    const { amount, method, walletId, metadata } = req.body;
    // Implementation for manual validation queue would go here
    const tx = await walletService.processPayment({
      walletId,
      amount,
      type: 'DEBIT',
      method,
      meta: metadata,
    });
    res.status(202).json({ success: true, transaction: tx, message: 'Withdrawal request pending validation' });
  }

  static async getOperatorStatus(_req: Request, res: Response) {
    res.json({
      success: true,
      operators: [
        { name: 'Wave', status: 'ONLINE', latency: '40ms' },
        { name: 'Orange Money', status: 'ONLINE', latency: '60ms' },
        { name: 'MTN', status: 'DEGRADED', latency: '500ms' },
      ]
    });
  }
}
