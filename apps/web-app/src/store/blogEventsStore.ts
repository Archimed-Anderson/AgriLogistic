import { create } from 'zustand';

export type ContentStatus = 'draft' | 'published' | 'scheduled' | 'archived';
export type ContentCategory = 'Technique' | 'Marché' | 'Actualités' | 'Témoignages';
export type EventType = 'Formation' | 'Webinaire' | 'Réunion' | 'Salon';

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: ContentCategory;
  tags: string[];
  status: ContentStatus;
  publishDate: string;
  views: number;
  likes: number;
  shares: number;
  seoScore: number;
  featuredImage: string;
}

export interface AgroEvent {
  id: string;
  title: string;
  type: EventType;
  date: string;
  time: string;
  location: string;
  description: string;
  participants: number;
  maxParticipants?: number;
  image: string;
}

export interface BlogEventsState {
  articles: Article[];
  events: AgroEvent[];
  activeTab: 'blog' | 'events' | 'media' | 'moderation';
  
  // Actions
  setActiveTab: (tab: 'blog' | 'events' | 'media' | 'moderation') => void;
  addArticle: (article: Article) => void;
  updateArticle: (id: string, updates: Partial<Article>) => void;
  deleteArticle: (id: string) => void;
  addEvent: (event: AgroEvent) => void;
}

export const useBlogEventsStore = create<BlogEventsState>((set) => ({
  articles: [
    {
      id: 'ART-001',
      title: 'Optimisation de l\'irrigation goutte-à-goutte en zone sahélienne',
      excerpt: 'Découvrez les meilleures pratiques pour maximiser le rendement de vos cultures avec un minimum d\'eau.',
      content: '...',
      author: 'Dr. Amadou Diallo',
      category: 'Technique',
      tags: ['Irrigation', 'Maïs', 'Rendement'],
      status: 'published',
      publishDate: '2024-03-25T10:00:00Z',
      views: 12450,
      likes: 850,
      shares: 120,
      seoScore: 92,
      featuredImage: 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&q=80&w=400',
    },
    {
      id: 'ART-002',
      title: 'Tendances du prix du cacao : Prévisions T2 2024',
      excerpt: 'Analyse approfondie des facteurs influençant le marché mondial du cacao cette saison.',
      content: '...',
      author: 'Sophie Kouamé',
      category: 'Marché',
      tags: ['Cacao', 'Export', 'Prix'],
      status: 'scheduled',
      publishDate: '2024-04-01T08:00:00Z',
      views: 0,
      likes: 0,
      shares: 0,
      seoScore: 85,
      featuredImage: 'https://images.unsplash.com/photo-1548946526-f69e2424cf45?auto=format&fit=crop&q=80&w=400',
    }
  ],
  events: [
    {
      id: 'EVT-001',
      title: 'Atelier de formation : Engrais Bio',
      type: 'Formation',
      date: '2024-04-15',
      time: '09:00',
      location: 'Ferme Expérimentale Yamoussoukro',
      description: 'Apprenez à produire vos propres engrais organiques à partir de déchets de récolte.',
      participants: 45,
      maxParticipants: 50,
      image: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&q=80&w=400',
    },
    {
      id: 'EVT-002',
      title: 'Webinaire : Digitalisation Agricole',
      type: 'Webinaire',
      date: '2024-04-20',
      time: '15:00',
      location: 'En ligne (AgroDeep Meet)',
      description: 'Comment les outils digitaux peuvent transformer votre productivité.',
      participants: 128,
      image: 'https://images.unsplash.com/photo-1591115710333-f150f2180b3e?auto=format&fit=crop&q=80&w=400',
    }
  ],
  activeTab: 'blog',

  setActiveTab: (tab) => set({ activeTab: tab }),
  addArticle: (article) => set((state) => ({ articles: [article, ...state.articles] })),
  updateArticle: (id, updates) => set((state) => ({
    articles: state.articles.map(a => a.id === id ? { ...a, ...updates } : a)
  })),
  deleteArticle: (id) => set((state) => ({ articles: state.articles.filter(a => a.id !== id) })),
  addEvent: (event) => set((state) => ({ events: [event, ...state.events] })),
}));
