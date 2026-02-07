import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Consumer, Kafka, EachMessagePayload } from 'kafkajs';
import { BlockchainService } from '../../coop-service/src/services/blockchain.service';

/**
 * TokenDistributionService
 * Écoute les événements Kafka pour distribuer les tokens CTT aux agriculteurs.
 */
@Injectable()
export class TokenDistributionService implements OnModuleInit {
  private readonly logger = new Logger(TokenDistributionService.name);
  private readonly kafka = new Kafka({
    clientId: 'token-service',
    brokers: ['localhost:9092'],
  });
  private readonly consumer: Consumer = this.kafka.consumer({ groupId: 'token-distribution-group' });

  constructor(private readonly blockchainService: BlockchainService) {}

  async onModuleInit() {
    await this.consumer.connect();
    await this.consumer.subscribe({ topic: 'harvest.delivered', fromBeginning: true });

    await this.consumer.run({
      eachMessage: async (payload: EachMessagePayload) => {
        const message = JSON.parse(payload.message.value.toString());
        this.logger.log(`📥 Événement Reçu: Récolte livrée pour le lot ${message.batchId}`);
        await this.processTokenReward(message);
      },
    });
  }

  /**
   * Logique de Tokenomics: Distribue CTT (Cooperative Treasury Tokens)
   */
  private async processTokenReward(data: any) {
    const { farmerId, weight, qualityScore = 1 } = data;
    
    // Algorithme de calcul du reward : 10 CTT par kilo * score de qualité
    const rewardAmount = weight * 10 * qualityScore;
    
    this.logger.log(`💎 Distribution de ${rewardAmount} CTT à l'agriculteur ${farmerId}...`);

    try {
      // Appel au Smart Contract via le service Blockchain précédemment créé
      const tx = await this.blockchainService.anchorTraceabilityData(
        `REWARD_${data.batchId}`,
        `REWARD_${rewardAmount}_CTT`
      );
      
      this.logger.log(`✅ Tokens distribués! Signature Blockchain: ${tx}`);
    } catch (error) {
      this.logger.error(`❌ Échec de la distribution de tokens: ${error.message}`);
    }
  }
}
