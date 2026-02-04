import { create } from 'zustand';

export type IncidentType = 'iot_failure' | 'fraud_detected' | 'delay_risk' | 'quality_alert';

export interface Incident {
  id: string;
  type: IncidentType;
  title: string;
  description: string;
  location: [number, number];
  region: string;
  severity: number; // 0-100
  timestamp: string;
  status: 'pending' | 'resolving' | 'resolved';
  metadata?: {
    cargoValue?: string;
    temperature?: string;
    transportId?: string;
  };
}

interface WarRoomState {
  incidents: Incident[];
  selectedIncident: Incident | null;
  filter: IncidentType | 'all';
  isCrisisMode: boolean;

  // Actions
  setIncidents: (incidents: Incident[]) => void;
  addOrUpdateIncident: (incident: Incident) => void;
  selectIncident: (incident: Incident | null) => void;
  setFilter: (filter: IncidentType | 'all') => void;
  toggleCrisisMode: (status: boolean) => void;
  resolveIncident: (id: string) => void;
}

export const useWarRoomStore = create<WarRoomState>((set) => ({
  incidents: [
    {
      id: 'INC-942',
      type: 'fraud_detected',
      title: 'Anomalie KYC & Escrow',
      description:
        "Tentative d'usurpation d'identité sur le nœud #44 - Transaction $12,400 bloquée.",
      location: [14.7167, -17.4677],
      region: 'Sénégal',
      severity: 92,
      timestamp: new Date().toISOString(),
      status: 'pending',
      metadata: { cargoValue: '$12,400' },
    },
    {
      id: 'INC-881',
      type: 'iot_failure',
      title: 'Perte Signal ColdChain',
      description: 'Capteur T° HS dans le container TR-09. Risque perte marchandises périssables.',
      location: [5.36, -4.0083],
      region: "Côte d'Ivoire",
      severity: 85,
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      status: 'pending',
      metadata: { temperature: '-2°C (Warning)' },
    },
    {
      id: 'INC-742',
      type: 'delay_risk',
      title: 'Goulot Logistique',
      description: 'Retard critique à la frontière. Impact sur 5 contrats smart-contracts.',
      location: [6.3667, 2.4333],
      region: 'Bénin',
      severity: 65,
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      status: 'resolving',
    },
    {
      id: 'INC-102',
      type: 'quality_alert',
      title: 'Alerte Phytosanitaire',
      description: 'IA Vision a détecté des traces de moisissure sur le lot de cacao B-42.',
      location: [6.75, -1.61],
      region: 'Ghana',
      severity: 78,
      timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      status: 'pending',
    },
  ],
  selectedIncident: null,
  filter: 'all',
  isCrisisMode: true,

  setIncidents: (incidents) => set({ incidents }),
  addOrUpdateIncident: (incident) =>
    set((state) => ({
      incidents: [
        ...state.incidents.filter((i) => i.id !== incident.id),
        incident,
      ],
    })),
  selectIncident: (selectedIncident) => set({ selectedIncident }),
  setFilter: (filter) => set({ filter }),
  toggleCrisisMode: (isCrisisMode) => set({ isCrisisMode }),
  resolveIncident: (id) =>
    set((state) => ({
      incidents: state.incidents.map((inc) =>
        inc.id === id ? { ...inc, status: 'resolved' } : inc
      ),
    })),
}));
