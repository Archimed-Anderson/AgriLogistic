import { create } from 'zustand';

export type TicketPriority = 'P0' | 'P1' | 'P2';
export type TicketStatus = 'open' | 'pending' | 'resolved' | 'closed';
export type TicketType = 'General' | 'Finance' | 'Logistics' | 'Technical' | 'Dispute';
export type DisputeStage = 'Opening' | 'Mediation' | 'Arbitration' | 'Resolution' | 'Closed';

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  type: 'client' | 'agent' | 'system' | 'internal';
  attachments?: string[];
}

export interface SupportTicket {
  id: string;
  subject: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  type: TicketType;
  createdAt: string;
  updatedAt: string;
  clientId: string;
  clientName: string;
  agentId?: string;
  messages: Message[];
  slaLimit: string; // ISO date for SLA breach
  category: string;

  // Dispute specific fields
  disputeData?: {
    stage: DisputeStage;
    involvedParties: { id: string; name: string; role: string }[];
    claimAmount: string;
    suggestedCompensation?: string;
    evidence: { id: string; type: string; url: string; description: string }[];
    iotDataRef?: string;
    blockchainRef?: string;
  };
}

interface SupportStore {
  tickets: SupportTicket[];
  selectedTicket: SupportTicket | null;
  filter: {
    status: TicketStatus | 'all';
    priority: TicketPriority | 'all';
    type: TicketType | 'all';
  };

  selectTicket: (ticket: SupportTicket | null) => void;
  setFilter: (filter: Partial<SupportStore['filter']>) => void;
  addMessage: (ticketId: string, message: Omit<Message, 'id' | 'timestamp'>) => void;
  updateTicketStatus: (ticketId: string, status: TicketStatus) => void;
  updateDisputeStage: (ticketId: string, stage: DisputeStage) => void;
  assignTicket: (ticketId: string, agentId: string) => void;
}

export const useSupportStore = create<SupportStore>((set) => ({
  tickets: [
    {
      id: 'TICK-4501',
      subject: 'Paiement non reçu - Contrat #992',
      description: 'Le paiement pour la livraison de cacao du 15 Mars est toujours bloqué.',
      priority: 'P0',
      status: 'open',
      type: 'Dispute',
      createdAt: '2024-03-21T08:30:00Z',
      updatedAt: '2024-03-21T09:15:00Z',
      clientId: 'C-772',
      clientName: 'Kofi Annan',
      category: 'Finance',
      slaLimit: '2024-03-21T10:30:00Z',
      messages: [
        {
          id: 'm1',
          senderId: 'C-772',
          senderName: 'Kofi Annan',
          content: "Bonjour, j'ai livré mon cacao mais l'argent ne s'affiche pas dans mon wallet.",
          timestamp: '2024-03-21T08:30:00Z',
          type: 'client',
        },
        {
          id: 'm2',
          senderId: 'System',
          senderName: 'AgroDeep AI',
          content: 'Priority P0 detected. Finance team notified.',
          timestamp: '2024-03-21T08:31:00Z',
          type: 'system',
        },
      ],
      disputeData: {
        stage: 'Mediation',
        involvedParties: [
          { id: 'C-772', name: 'Kofi Annan', role: 'Farmer' },
          { id: 'B-112', name: 'Global Foods CI', role: 'Buyer' },
        ],
        claimAmount: '450,000 XOF',
        evidence: [
          {
            id: 'ev1',
            type: 'Receipt',
            url: '/docs/receipt_992.pdf',
            description: 'Bordereau de livraison',
          },
        ],
        blockchainRef: '0x992b...ff81',
      },
    },
    {
      id: 'TICK-4202',
      subject: 'Retard livraison - Zone Bouaké',
      description: 'Le camion TR-88 est bloqué à un barrage.',
      priority: 'P1',
      status: 'pending',
      type: 'Logistics',
      createdAt: '2024-03-21T09:45:00Z',
      updatedAt: '2024-03-21T10:00:00Z',
      clientId: 'T-99',
      clientName: 'Diallo Transports',
      category: 'Logistics',
      slaLimit: '2024-03-21T13:45:00Z',
      messages: [],
    },
  ],
  selectedTicket: null,
  filter: {
    status: 'all',
    priority: 'all',
    type: 'all',
  },

  selectTicket: (ticket) => set({ selectedTicket: ticket }),
  setFilter: (newFilter) => set((state) => ({ filter: { ...state.filter, ...newFilter } })),

  addMessage: (ticketId, message) =>
    set((state) => ({
      tickets: state.tickets.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              messages: [
                ...t.messages,
                { ...message, id: Math.random().toString(36), timestamp: new Date().toISOString() },
              ],
              updatedAt: new Date().toISOString(),
            }
          : t
      ),
      selectedTicket:
        state.selectedTicket?.id === ticketId
          ? {
              ...state.selectedTicket,
              messages: [
                ...state.selectedTicket.messages,
                { ...message, id: Math.random().toString(36), timestamp: new Date().toISOString() },
              ],
              updatedAt: new Date().toISOString(),
            }
          : state.selectedTicket,
    })),

  updateTicketStatus: (ticketId, status) =>
    set((state) => ({
      tickets: state.tickets.map((t) => (t.id === ticketId ? { ...t, status } : t)),
    })),

  updateDisputeStage: (ticketId, stage) =>
    set((state) => ({
      tickets: state.tickets.map((t) =>
        t.id === ticketId && t.disputeData ? { ...t, disputeData: { ...t.disputeData, stage } } : t
      ),
    })),

  assignTicket: (ticketId, agentId) =>
    set((state) => ({
      tickets: state.tickets.map((t) => (t.id === ticketId ? { ...t, agentId } : t)),
    })),
}));
