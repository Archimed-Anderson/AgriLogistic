import { Injectable, Logger } from '@nestjs/common';
import { BlockchainService } from './blockchain.service';

export interface EscrowContract {
  id: string;
  buyer: string;
  seller: string;
  amount: number;
  conditions: string[];
  status: 'LOCKED' | 'RELEASED' | 'REFUNDED' | 'DISPUTED';
  metadata: Record<string, unknown>;
  timestamp: string;
}

@Injectable()
export class EscrowService {
  private readonly logger = new Logger(EscrowService.name);

  // Simulation of Escrow ledger for demo purposes when Fabric is not connected
  private mockEscrowLedger: Map<string, EscrowContract> = new Map();

  constructor() {
    // Initial mock data
    this.mockEscrowLedger.set('SC-84920', {
      id: 'SC-84920',
      buyer: 'Global Foods Ltd',
      seller: 'Coopérative ivoirienne',
      amount: 145000,
      conditions: ['TEMP_CHECK', 'POD_SIGNED'],
      status: 'LOCKED',
      metadata: { region: 'CI' },
      timestamp: new Date().toISOString()
    });
  }

  async createEscrow(contract: Omit<EscrowContract, 'status' | 'timestamp'>): Promise<EscrowContract> {
    const newContract: EscrowContract = {
      ...contract,
      status: 'LOCKED',
      timestamp: new Date().toISOString()
    };

    if (BlockchainService.isConnected()) {
      // Logic for Hyperledger Fabric transaction
      // await this.blockchainService.submitTransaction('EscrowContract:CreateEscrow', ...);
      this.logger.log(`Blockchain: Submitting Escrow ${contract.id} to Fabric`);
    }

    this.mockEscrowLedger.set(newContract.id, newContract);
    return newContract;
  }

  async releaseFonds(id: string, reason: string): Promise<boolean> {
    const contract = this.mockEscrowLedger.get(id);
    if (!contract) return false;

    contract.status = 'RELEASED';
    contract.metadata.releaseReason = reason;
    
    this.logger.log(`Escrow ${id} released. Reason: ${reason}`);
    return true;
  }

  async refundBuyer(id: string, reason: string): Promise<boolean> {
    const contract = this.mockEscrowLedger.get(id);
    if (!contract) return false;

    contract.status = 'REFUNDED';
    contract.metadata.refundReason = reason;
    
    this.logger.log(`Escrow ${id} refunded. Reason: ${reason}`);
    return true;
  }

  async getActiveEscrows(): Promise<EscrowContract[]> {
    return Array.from(this.mockEscrowLedger.values()).filter(c => c.status === 'LOCKED');
  }

  async getContractStats() {
    const all = Array.from(this.mockEscrowLedger.values());
    const totalLocked = all.filter(c => c.status === 'LOCKED').reduce((sum, c) => sum + c.amount, 0);
    
    return {
      totalLockedValue: totalLocked,
      activeCount: all.filter(c => c.status === 'LOCKED').length,
      releasedCount: all.filter(c => c.status === 'RELEASED').length,
      refundedCount: all.filter(c => c.status === 'REFUNDED').length,
    };
  }
}
