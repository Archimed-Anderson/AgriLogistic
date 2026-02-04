import { create } from 'zustand';

export type TransactionType =
  | 'Payment'
  | 'KYC_Validation'
  | 'Contract_Update'
  | 'Offer_Modified'
  | 'Asset_Transfer';

export interface BlockchainTransaction {
  hash: string;
  blockNumber: number;
  timestamp: string;
  from: string;
  to: string;
  type: TransactionType;
  status: 'confirmed' | 'failed';
  gasUsed: string;
  data: any;
  integrityVerified: boolean;
}

export interface Block {
  number: number;
  hash: string;
  parentHash: string;
  timestamp: string;
  transactionsCount: number;
  size: string;
}

interface BlockchainStore {
  blocks: Block[];
  transactions: BlockchainTransaction[];
  searchQuery: string;
  selectedTx: BlockchainTransaction | null;
  networkStatus: {
    height: number;
    tps: number;
    nodesActive: number;
    avgLatency: string;
  };

  setSearchQuery: (query: string) => void;
  selectTx: (tx: BlockchainTransaction | null) => void;
  addTransaction: (tx: BlockchainTransaction) => void;
}

export const useBlockchainStore = create<BlockchainStore>((set) => ({
  blocks: [
    {
      number: 1422901,
      hash: '0x88...a2b',
      parentHash: '0x77...c1a',
      timestamp: '2024-03-21T10:45:00Z',
      transactionsCount: 12,
      size: '42KB',
    },
    {
      number: 1422900,
      hash: '0x77...c1a',
      parentHash: '0x66...f3e',
      timestamp: '2024-03-21T10:44:50Z',
      transactionsCount: 8,
      size: '28KB',
    },
  ],
  transactions: [
    {
      hash: '0x992b...ff81',
      blockNumber: 1422901,
      timestamp: '2024-03-21T10:45:22Z',
      from: '0xAgri...Admin',
      to: '0xKofi...Farmer',
      type: 'Payment',
      status: 'confirmed',
      gasUsed: '21,042',
      integrityVerified: true,
      data: { amount: '150,000 XOF', asset: 'Cocoa-Grade-A', contractId: 'CTR-889' },
    },
    {
      hash: '0x44a1...cc12',
      blockNumber: 1422901,
      timestamp: '2024-03-21T10:45:10Z',
      from: '0xKYC...Validator',
      to: '0xMamadou...Trader',
      type: 'KYC_Validation',
      status: 'confirmed',
      gasUsed: '45,000',
      integrityVerified: true,
      data: { status: 'Verified', level: 3, authority: 'CNIL-CI' },
    },
    {
      hash: '0x221a...ee99',
      blockNumber: 1422900,
      timestamp: '2024-03-21T10:44:55Z',
      from: '0xSystem...Config',
      to: '0xLog...Service',
      type: 'Contract_Update',
      status: 'confirmed',
      gasUsed: '120,440',
      integrityVerified: true,
      data: { change: 'Fee_Adjustment', old: '2.5%', new: '2.4%' },
    },
  ],
  searchQuery: '',
  selectedTx: null,
  networkStatus: {
    height: 1422901,
    tps: 42,
    nodesActive: 12,
    avgLatency: '140ms',
  },

  setSearchQuery: (query) => set({ searchQuery: query }),
  selectTx: (tx) => set({ selectedTx: tx }),
  addTransaction: (tx) => set((state) => ({ transactions: [tx, ...state.transactions] })),
}));
