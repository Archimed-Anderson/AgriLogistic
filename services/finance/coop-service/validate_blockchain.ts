import { BlockchainService } from './services/blockchain.service';

/**
 * Script de validation rapide pour le module Blockchain
 */
async function validateBlockchain() {
  console.log('⛓️ [TEST] Validation du module Agri-Coop Blockchain...');
  
  const service = new BlockchainService();
  
  // Test 1: Génération de Hash (Immuabilité)
  const data = { batchId: 'B-2026-X', weight: 500, type: 'Mango' };
  const hash1 = service.generateBatchHash(data);
  const hash2 = service.generateBatchHash(data);
  const hash3 = service.generateBatchHash({ ...data, weight: 501 });

  if (hash1 === hash2 && hash1 !== hash3) {
    console.log('✅ Hashing SHA-256 : VALIDE (Intégrité des données garantie)');
  } else {
    console.log('❌ Hashing SHA-256 : ÉCHEC');
    return;
  }

  // Test 2: Ancrage Solana (Simulation)
  const sig = await service.anchorTraceabilityData('B-2026-X', hash1);
  if (sig.startsWith('sol_trace_')) {
    console.log(`✅ Ancrage Solana : VALIDE (Signature: ${sig})`);
  } else {
    console.log('❌ Ancrage Solana : ÉCHEC');
    return;
  }

  console.log('🎉 Tous les tests Blockchain sont passés !');
}

validateBlockchain().catch(console.error);
