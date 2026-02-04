import { Injectable, Logger } from '@nestjs/common';

interface Transaction {
  amount: number;
  userId: string;
  walletId?: string;
}

@Injectable()
export class AnomalyService {
  private readonly logger = new Logger(AnomalyService.name);

  // Détection des anomalies financières
  detectAnomalies(transaction: Transaction) {
    const alerts = [];

    // Seuil de transaction élevée
    if (transaction.amount > 10000) {
      alerts.push({
        type: 'HIGH_VALUE_TRANSACTION',
        severity: 'CRITICAL',
        message: `Transaction de ${transaction.amount}€ détectée pour l'utilisateur ${transaction.userId}. Validation 2FA requise.`,
      });
      this.logger.warn(`Security Alert: High value transaction detected: ${transaction.amount}`);
    }

    // Concentration soudaine sur un wallet (Simulation)
    if (transaction.walletId === 'W-SUSPECT') {
      alerts.push({
        type: 'WALLET_CONCENTRATION',
        severity: 'WARNING',
        message: 'Concentration de fonds anormale sur le wallet suspect.',
      });
    }

    return alerts;
  }

  // Monitoring des échecs de paiement
  monitorPaymentRetries(userId: string, attempts: number) {
    if (attempts >= 3) {
      return {
        type: 'FAILED_RETRY_THRESHOLD',
        severity: 'WARNING',
        message: `L'utilisateur ${userId} a échoué 3 fois au Mobile Money. Blocage temporaire actif.`,
      };
    }
    return null;
  }
}
