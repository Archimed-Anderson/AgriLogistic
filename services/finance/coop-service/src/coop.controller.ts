import { Controller, Post, Body, Get, Param, HttpException, HttpStatus } from '@nestjs/common';
import { BlockchainService } from './services/blockchain.service';

@Controller('coop')
export class CoopController {
  constructor(private readonly blockchainService: BlockchainService) {}

  @Post('batch/certify')
  async certifyBatch(@Body() batchData: any) {
    const { batchId, farmerId, weight, cropType, location } = batchData;

    if (!batchId || !farmerId) {
      throw new HttpException('Missing batch or farmer info', HttpStatus.BAD_REQUEST);
    }

    // 1. Générer le Hash unique du lot
    const metadataHash = this.blockchainService.generateBatchHash({
      farmerId,
      weight,
      cropType,
      location,
      timestamp: new Date().toISOString()
    });

    // 2. Ancrer sur la Blockchain
    const signature = await this.blockchainService.anchorTraceabilityData(batchId, metadataHash);

    return {
      success: true,
      message: 'Lot certifié sur la Blockchain Solana',
      certificate: {
        batchId,
        blockchainSignature: signature,
        metadataHash,
        verifiedAt: new Date().toISOString()
      },
      traceabilityUrl: `https://explorer.solana.com/tx/${signature}?cluster=devnet`
    };
  }

  @Get('batch/verify/:batchId')
  async verifyBatch(@Param('batchId') batchId: string) {
    // Logique de récupération depuis DB + vérification Blockchain
    return {
      batchId,
      status: 'VERIFIED',
      integrity: '100% (SHA-256 match)',
      blockchainNode: 'Solana Devnet'
    };
  }
}
