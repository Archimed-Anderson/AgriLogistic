import { Injectable, Logger } from '@nestjs/common';

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
}

export interface RevenueBreakdown {
  commissions: number;
  subscriptions: number;
  transport: number;
  dataMonetization: number;
  valueAddedServices: number;
  total: number;
}

@Injectable()
export class MonetizationService {
  private readonly logger = new Logger(MonetizationService.name);

  private readonly plans: SubscriptionPlan[] = [
    { 
      id: 'free', 
      name: 'Free', 
      price: 0, 
      currency: 'EUR', 
      interval: 'month', 
      features: ['Basic Analytics', '10 transactions/month'] 
    },
    { 
      id: 'pro', 
      name: 'Pro', 
      price: 49, 
      currency: 'EUR', 
      interval: 'month', 
      features: ['Advanced Analytics', 'Unlimited transactions', 'Priority Support'] 
    },
    { 
      id: 'enterprise', 
      name: 'Enterprise', 
      price: 299, 
      currency: 'EUR', 
      interval: 'month', 
      features: ['API Access', 'Custom Reports', 'Dedicated Account Manager'] 
    },
  ];

  async getRevenueDashboard() {
    // Mock data for the dashboard
    const breakdown: RevenueBreakdown = {
      commissions: 45200,
      subscriptions: 22100,
      transport: 12500,
      dataMonetization: 5400,
      valueAddedServices: 3200,
      total: 88400,
    };

    return {
      mrr: 21500,
      arr: 258000,
      breakdown,
      ltv: {
        farmer: 1200,
        buyer: 4500,
        carrier: 2800,
      },
      growth: '+12.5%',
      churnRate: '2.4%',
    };
  }

  async getSubscriptions() {
    return {
      plans: this.plans,
      stats: {
        activeUsers: 1240,
        proUsers: 450,
        enterpriseUsers: 45,
        churnHistory: [
          { month: 'Jan', rate: 2.1 },
          { month: 'Feb', rate: 2.4 },
        ]
      }
    };
  }

  async generateInvoice(userId: string, month: string) {
    this.logger.log(`Generating invoice for user ${userId} for ${month}`);
    return {
      invoiceId: `INV-${Date.now()}`,
      userId,
      amount: 49,
      currency: 'EUR',
      tax: 9.8, // 20% VAT example
      total: 58.8,
      status: 'PAID',
      url: `https://api.agrologistic.com/billing/invoices/INV-${Date.now()}.pdf`,
    };
  }

  async calculateSplit(transactionAmount: number, carrierDistance: number) {
    // Logic: Vente 1000€ → Agriculteur 900€, Plateforme 80€, Transporteur 20€
    const platformFeePercent = 0.08;
    const transportFee = carrierDistance * 0.5; // Example calculation
    const platformCommission = transactionAmount * platformFeePercent;
    const netSeller = transactionAmount - platformCommission - transportFee;

    return {
      total: transactionAmount,
      seller: netSeller,
      platform: platformCommission,
      carrier: transportFee,
    };
  }

  async getAnalytics() {
    return {
      cac: {
        facebook: 15,
        field: 45,
        partners: 25,
      },
      paybackPeriodMonths: 4.2,
      forecast: {
        nextMonth: 95000,
        confidence: 0.88,
      }
    };
  }
}
