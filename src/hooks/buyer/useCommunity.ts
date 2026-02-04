/**
 * Community Hook
 * Manages community discussions and supplier network
 */
import { useQuery } from '@tanstack/react-query';

export interface Discussion {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    avatar?: string;
    role: string;
  };
  category: 'general' | 'quality' | 'logistics' | 'prices' | 'tips';
  createdAt: Date;
  repliesCount: number;
  likesCount: number;
  isLiked: boolean;
}

export interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  type: 'webinar' | 'meetup' | 'training';
  date: Date;
  location: string;
  attendeesCount: number;
  maxAttendees?: number;
  isRegistered: boolean;
}

const mockDiscussions: Discussion[] = [
  {
    id: 'd-1',
    title: 'Meilleures pratiques pour le stockage des tomates',
    content:
      'Quelles sont vos techniques pour conserver les tomates plus longtemps sans perte de qualité ?',
    author: { name: 'Amadou Diallo', role: 'Acheteur' },
    category: 'quality',
    createdAt: new Date('2026-01-22T10:30:00'),
    repliesCount: 12,
    likesCount: 24,
    isLiked: true,
  },
  {
    id: 'd-2',
    title: 'Évolution des prix du manioc ce mois',
    content:
      "Je constate une hausse significative des prix. Quelqu'un a des infos sur les causes ?",
    author: { name: 'Fatou Seck', role: 'Acheteur' },
    category: 'prices',
    createdAt: new Date('2026-01-21T14:15:00'),
    repliesCount: 8,
    likesCount: 15,
    isLiked: false,
  },
  {
    id: 'd-3',
    title: 'Recommandation transporteur zone Casamance',
    content: 'Je cherche un transporteur fiable pour la zone de Ziguinchor. Des recommandations ?',
    author: { name: 'Moussa Ndiaye', role: 'Acheteur' },
    category: 'logistics',
    createdAt: new Date('2026-01-20T09:00:00'),
    repliesCount: 6,
    likesCount: 8,
    isLiked: false,
  },
  {
    id: 'd-4',
    title: 'Astuce: Négocier avec les coopératives',
    content:
      'Partage de mon expérience sur comment obtenir de meilleurs prix avec les coopératives agricoles.',
    author: { name: 'Ibrahima Fall', role: 'Acheteur Pro' },
    category: 'tips',
    createdAt: new Date('2026-01-19T16:45:00'),
    repliesCount: 18,
    likesCount: 42,
    isLiked: true,
  },
];

const mockEvents: CommunityEvent[] = [
  {
    id: 'e-1',
    title: "Webinar: Optimiser sa chaîne d'approvisionnement",
    description: 'Formation en ligne sur les meilleures pratiques logistiques',
    type: 'webinar',
    date: new Date('2026-01-25T14:00:00'),
    location: 'En ligne - Zoom',
    attendeesCount: 45,
    maxAttendees: 100,
    isRegistered: true,
  },
  {
    id: 'e-2',
    title: 'Rencontre Acheteurs-Producteurs Dakar',
    description: 'Événement de networking avec les producteurs locaux',
    type: 'meetup',
    date: new Date('2026-01-28T09:00:00'),
    location: 'Hôtel Terrou-Bi, Dakar',
    attendeesCount: 32,
    maxAttendees: 50,
    isRegistered: false,
  },
  {
    id: 'e-3',
    title: 'Formation: Contrôle qualité des produits frais',
    description: 'Apprenez à évaluer la qualité des produits agricoles',
    type: 'training',
    date: new Date('2026-02-05T08:30:00'),
    location: 'Centre ISRA, Thiès',
    attendeesCount: 18,
    maxAttendees: 25,
    isRegistered: false,
  },
];

export function useCommunity() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['buyer', 'community'],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 600));
      return {
        discussions: mockDiscussions,
        events: mockEvents,
        membersCount: 1250,
        suppliersInNetwork: 48,
      };
    },
  });

  return {
    discussions: data?.discussions || [],
    events: data?.events || [],
    membersCount: data?.membersCount || 0,
    suppliersInNetwork: data?.suppliersInNetwork || 0,
    isLoading,
    error,
  };
}
