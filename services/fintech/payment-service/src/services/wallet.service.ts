import { Logger } from '@nestjs/common';

export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  currency: string;
  lastUpdated: string;
}

export interface Transaction {
  id: string;
  walletId: string;
  amount: number;
  type: 'CREDIT' | 'DEBIT' | 'TRANSFER';
  method: 'WAVE' | 'ORANGE_MONEY' | 'MTN' | 'STRIPE' | 'CASH';
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  meta?: any;
}

export class WalletService {
  private static readonly logger = new Logger('WalletService');
  
  // Simulation for multi-channel africa wallet
  private wallets: Map<string, Wallet> = new Map();
  private transactions: Transaction[] = [];

  constructor() {
    // Mock wallet for Admin/Platform
    this.wallets.set('W-PLATFORM', {
      id: 'W-PLATFORM',
      userId: 'admin',
      balance: 1840500,
      currency: 'EUR',
      lastUpdated: new Date().toISOString()
    });
  }

  async getWallet(userId: string): Promise<Wallet | undefined> {
    return Array.from(this.wallets.values()).find(w => w.userId === userId);
  }

  async processPayment(transaction: Omit<Transaction, 'id' | 'status'>): Promise<Transaction> {
    const id = `TX-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const newTx: Transaction = { ...transaction, id, status: 'PENDING' };
    
    this.transactions.push(newTx);
    WalletService.logger.log(`Processing ${transaction.method} payment: ${transaction.amount} for wallet ${transaction.walletId}`);

    // Simulation: Async operator confirmation
    setTimeout(() => this.finalizeTransaction(id), 2000);

    return newTx;
  }

  private async finalizeTransaction(txId: string) {
    const tx = this.transactions.find(t => t.id === txId);
    if (!tx) return;

    tx.status = 'COMPLETED';
    const wallet = this.wallets.get(tx.walletId);
    if (wallet) {
      wallet.balance += tx.type === 'CREDIT' ? tx.amount : -tx.amount;
      wallet.lastUpdated = new Date().toISOString();
    }
    
    WalletService.logger.log(`Transaction ${txId} finalized. New status: COMPLETED`);
  }

  async getFraudPatterns() {
    // Simple mock pattern detection
    return {
      suspiciousVelocity: this.transactions.length > 10,
      recentAnomalies: this.transactions.filter(tx => tx.amount > 5000 && tx.method === 'CASH'),
    };
  }
}
