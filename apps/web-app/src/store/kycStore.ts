import { create } from 'zustand';

export type KycStatus =
  | 'received'
  | 'verifying'
  | 'auto_fix'
  | 'manual_review'
  | 'approved'
  | 'rejected';
export type ActorType = 'farmer' | 'transporter' | 'buyer' | 'cooperative';

export interface KycDocument {
  id: string;
  type: string;
  url: string;
  extractedData: any;
  ocrConfidence: number;
  expiryDate: string;
}

export interface KycApplication {
  id: string;
  actorName: string;
  actorType: ActorType;
  status: KycStatus;
  submissionDate: string;
  documents: KycDocument[];
  faceMatchScore?: number;
  addressVerified: boolean;
  blockchainHash?: string;
  lastCommunication?: string;
  mobileMoneyVerified: boolean;
}

interface KycStore {
  applications: KycApplication[];
  selectedApplication: KycApplication | null;
  filter: ActorType | 'all';

  selectApplication: (app: KycApplication | null) => void;
  setFilter: (filter: ActorType | 'all') => void;
  updateStatus: (id: string, status: KycStatus) => void;
  batchApprove: (ids: string[]) => void;
}

export const useKycStore = create<KycStore>((set) => ({
  applications: [
    {
      id: 'KYC-1001',
      actorName: 'Kofi Annan',
      actorType: 'farmer',
      status: 'manual_review',
      submissionDate: '2024-03-15T10:30:00Z',
      faceMatchScore: 94,
      addressVerified: true,
      mobileMoneyVerified: true,
      documents: [
        {
          id: 'DOC-1',
          type: 'Identité Nationale (CI)',
          url: '/docs/id_kofi.pdf',
          ocrConfidence: 0.98,
          expiryDate: '2028-12-01',
          extractedData: { name: 'Kofi Annan', dob: '1985-05-12', id_number: 'CI-882299' },
        },
      ],
    },
    {
      id: 'KYC-1002',
      actorName: 'Traoré Logistique SARL',
      actorType: 'transporter',
      status: 'verifying',
      submissionDate: '2024-03-18T14:20:00Z',
      addressVerified: false,
      mobileMoneyVerified: true,
      documents: [
        {
          id: 'DOC-2',
          type: 'RCCM',
          url: '/docs/rccm_traore.pdf',
          ocrConfidence: 0.85,
          expiryDate: '2030-01-01',
          extractedData: { company: 'Traoré Logistique', rccm: 'ABJ-2023-B-123' },
        },
      ],
    },
    {
      id: 'KYC-1003',
      actorName: 'Coopérative Union des Planteurs',
      actorType: 'cooperative',
      status: 'received',
      submissionDate: '2024-03-20T09:15:00Z',
      addressVerified: true,
      mobileMoneyVerified: false,
      documents: [],
    },
  ],
  selectedApplication: null,
  filter: 'all',

  selectApplication: (app) => set({ selectedApplication: app }),
  setFilter: (filter) => set({ filter }),
  updateStatus: (id, status) =>
    set((state) => ({
      applications: state.applications.map((app) => (app.id === id ? { ...app, status } : app)),
    })),
  batchApprove: (ids) =>
    set((state) => ({
      applications: state.applications.map((app) =>
        ids.includes(app.id) ? { ...app, status: 'approved' } : app
      ),
    })),
}));
