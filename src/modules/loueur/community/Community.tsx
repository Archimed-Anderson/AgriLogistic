/**
 * ============================================
 * COMMUNITY PLATFORM
 * ============================================
 * Social features for equipment rental community
 * - Discussion forums and threads
 * - Equipment reviews and ratings
 * - User recommendations and tips
 * - Farmer networking features
 * - Community interaction metrics
 */

import { useState, useMemo } from "react";
import {
  Users,
  MessageSquare,
  Star,
  ThumbsUp,
  MessageCircle,
  TrendingUp,
  Award,
  UserPlus,
  BookOpen,
  Lightbulb,
  Target,
  Calendar,
  MapPin,
  Eye,
  Heart,
  Share2,
  Flag,
  Send,
  Filter,
  Search,
  Plus,
} from "lucide-react";

export interface ForumThread {
  id: string;
  title: string;
  author: {
    name: string;
    avatar: string;
    verified: boolean;
    reputation: number;
  };
  category: string;
  content: string;
  createdAt: Date;
  views: number;
  replies: number;
  likes: number;
  tags: string[];
  lastActivity: Date;
  trending: boolean;
}

export interface EquipmentReview {
  id: string;
  equipmentId: string;
  equipmentName: string;
  equipmentCategory: string;
  reviewer: {
    name: string;
    avatar: string;
    totalReviews: number;
    verifiedRenter: boolean;
  };
  rating: number;
  title: string;
  content: string;
  pros: string[];
  cons: string[];
  createdAt: Date;
  helpful: number;
  verified: boolean;
}

export interface UserRecommendation {
  id: string;
  author: {
    name: string;
    avatar: string;
    expertise: string;
  };
  title: string;
  category: "tips" | "guide" | "warning" | "success-story";
  content: string;
  equipmentMentioned?: string[];
  likes: number;
  saves: number;
  createdAt: Date;
}

export interface NetworkingEvent {
  id: string;
  title: string;
  type: "meetup" | "workshop" | "demo" | "webinar";
  organizer: string;
  date: Date;
  location: string;
  attendees: number;
  maxAttendees: number;
  description: string;
}

interface Props {
  userId: string;
  userName: string;
}

export function Community({ userId, userName }: Props) {
  const [activeTab, setActiveTab] = useState<"forums" | "reviews" | "tips" | "events">("forums");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");

  // Mock data - in real app, fetch from API
  const forumThreads: ForumThread[] = useMemo(
    () => [
      {
        id: "THREAD-001",
        title: "Meilleurs tracteurs pour petites exploitations en 2026?",
        author: {
          name: "Marc Dubois",
          avatar: "https://i.pravatar.cc/150?img=12",
          verified: true,
          reputation: 892,
        },
        category: "Conseils Équipement",
        content: "Je cherche des recommandations pour un tracteur polyvalent adapté à une exploitation de 50 hectares. Budget autour de 80k€. Vos suggestions?",
        createdAt: new Date("2026-01-14T09:30:00"),
        views: 1247,
        replies: 23,
        likes: 45,
        tags: ["tracteur", "achat", "budget"],
        lastActivity: new Date("2026-01-16T14:20:00"),
        trending: true,
      },
      {
        id: "THREAD-002",
        title: "Retour d'expérience: Location vs Achat pour moissonneuses",
        author: {
          name: "Sophie Laurent",
          avatar: "https://i.pravatar.cc/150?img=25",
          verified: true,
          reputation: 1523,
        },
        category: "Économie & Gestion",
        content: "Après 3 ans de location de moissonneuses, voici mon analyse financière complète et mes recommandations...",
        createdAt: new Date("2026-01-13T15:45:00"),
        views: 2834,
        replies: 47,
        likes: 128,
        tags: ["moissonneuse", "ROI", "location", "achat"],
        lastActivity: new Date("2026-01-16T11:30:00"),
        trending: true,
      },
      {
        id: "THREAD-003",
        title: "Problème hydraulique sur pulvérisateur Kuhn - Solutions?",
        author: {
          name: "Jean Martin",
          avatar: "https://i.pravatar.cc/150?img=33",
          verified: false,
          reputation: 245,
        },
        category: "Support Technique",
        content: "Perte de pression dans le circuit hydraulique. Quelqu'un a déjà rencontré ce problème?",
        createdAt: new Date("2026-01-15T10:15:00"),
        views: 456,
        replies: 12,
        likes: 18,
        tags: ["pulvérisateur", "hydraulique", "maintenance"],
        lastActivity: new Date("2026-01-16T08:45:00"),
        trending: false,
      },
      {
        id: "THREAD-004",
        title: "Organisation collective pour location de matériel - Qui est intéressé?",
        author: {
          name: "Pierre Renault",
          avatar: "https://i.pravatar.cc/150?img=51",
          verified: true,
          reputation: 678,
        },
        category: "Collaboration",
        content: "Je propose de créer un groupe d'agriculteurs pour mutualiser la location d'équipements coûteux dans la région Hauts-de-France...",
        createdAt: new Date("2026-01-12T16:00:00"),
        views: 1892,
        replies: 34,
        likes: 89,
        tags: ["collaboration", "mutualisation", "hauts-de-france"],
        lastActivity: new Date("2026-01-15T19:30:00"),
        trending: true,
      },
      {
        id: "THREAD-005",
        title: "Guide complet: Préparer son matériel pour la saison des semis",
        author: {
          name: "Claire Dubois",
          avatar: "https://i.pravatar.cc/150?img=47",
          verified: true,
          reputation: 1876,
        },
        category: "Guides & Tutoriels",
        content: "Checklist complète et conseils pratiques pour vérifier et préparer vos semoirs avant la saison...",
        createdAt: new Date("2026-01-10T08:30:00"),
        views: 3456,
        replies: 56,
        likes: 234,
        tags: ["guide", "semis", "maintenance", "préparation"],
        lastActivity: new Date("2026-01-14T17:15:00"),
        trending: true,
      },
    ],
    []
  );

  const reviews: EquipmentReview[] = useMemo(
    () => [
      {
        id: "REV-001",
        equipmentId: "EQ-001",
        equipmentName: "Tracteur John Deere 6250R",
        equipmentCategory: "Tracteurs",
        reviewer: {
          name: "Thomas Bernard",
          avatar: "https://i.pravatar.cc/150?img=15",
          totalReviews: 12,
          verifiedRenter: true,
        },
        rating: 5,
        title: "Excellent tracteur pour grandes cultures",
        content: "Loué pour 10 jours pendant les moissons. Performances exceptionnelles, très confortable, consommation raisonnable. Le système GPS intégré est un vrai plus. Propriétaire très professionnel et réactif.",
        pros: [
          "Puissance et couple impressionnants",
          "Cabine spacieuse et climatisée",
          "GPS de précision intégré",
          "Consommation optimisée",
        ],
        cons: [
          "Prise en main nécessite une demi-journée",
          "Prix de location élevé mais justifié",
        ],
        createdAt: new Date("2026-01-12T14:30:00"),
        helpful: 42,
        verified: true,
      },
      {
        id: "REV-002",
        equipmentId: "EQ-002",
        equipmentName: "Moissonneuse Claas Lexion 8900",
        equipmentCategory: "Moissonneuses",
        reviewer: {
          name: "Marie Lefebvre",
          avatar: "https://i.pravatar.cc/150?img=28",
          totalReviews: 8,
          verifiedRenter: true,
        },
        rating: 5,
        title: "Machine d'exception pour la moisson",
        content: "Top niveau! Capacité de coupe impressionnante, séparation parfaite. J'ai traité 120 hectares en 3 jours. L'assistance du propriétaire a été parfaite.",
        pros: [
          "Rendement exceptionnel (8-10 ha/h)",
          "Qualité de battage irréprochable",
          "Trémie de grande capacité",
          "Maintenance impeccable",
        ],
        cons: [
          "Largeur importante (attention aux petits chemins)",
        ],
        createdAt: new Date("2026-01-10T16:45:00"),
        helpful: 38,
        verified: true,
      },
      {
        id: "REV-003",
        equipmentId: "EQ-003",
        equipmentName: "Pulvérisateur Kuhn Metris 4102",
        equipmentCategory: "Pulvérisateurs",
        reviewer: {
          name: "Antoine Moreau",
          avatar: "https://i.pravatar.cc/150?img=56",
          totalReviews: 15,
          verifiedRenter: true,
        },
        rating: 4,
        title: "Bon rapport qualité/prix",
        content: "Pulvérisateur très efficace pour le traitement de mes cultures. Quelques réglages délicats mais résultat professionnel. Bon service du propriétaire.",
        pros: [
          "Couverture uniforme",
          "Réglages précis",
          "Bon débit",
          "Prix compétitif",
        ],
        cons: [
          "Notice d'utilisation un peu complexe",
          "Nettoyage long après usage",
        ],
        createdAt: new Date("2026-01-08T11:20:00"),
        helpful: 24,
        verified: true,
      },
    ],
    []
  );

  const recommendations: UserRecommendation[] = useMemo(
    () => [
      {
        id: "TIP-001",
        author: {
          name: "Éric Fontaine",
          avatar: "https://i.pravatar.cc/150?img=68",
          expertise: "Spécialiste grandes cultures - 25 ans d'expérience",
        },
        title: "5 astuces pour réduire vos coûts de location de 30%",
        category: "tips",
        content: "Après 10 ans de location intensive, voici mes meilleures stratégies: 1) Planifier 3 mois à l'avance pour les périodes creuses (-20%), 2) Négocier des forfaits longue durée, 3) Partager avec voisins pour volumes...",
        equipmentMentioned: ["Tracteurs", "Moissonneuses", "Semoirs"],
        likes: 156,
        saves: 89,
        createdAt: new Date("2026-01-11T09:00:00"),
      },
      {
        id: "TIP-002",
        author: {
          name: "Isabelle Rousseau",
          avatar: "https://i.pravatar.cc/150?img=44",
          expertise: "Agricultrice bio - Formatrice en agroécologie",
        },
        title: "Guide complet: Choisir le bon matériel pour l'agriculture bio",
        category: "guide",
        content: "Les spécificités du matériel pour l'agriculture biologique: bineuses, herses étrilles, semoirs de précision adaptés... Mes recommandations détaillées par type de culture et surface.",
        equipmentMentioned: ["Bineuses", "Herses", "Semoirs"],
        likes: 203,
        saves: 124,
        createdAt: new Date("2026-01-09T13:30:00"),
      },
      {
        id: "TIP-003",
        author: {
          name: "Julien Mercier",
          avatar: "https://i.pravatar.cc/150?img=22",
          expertise: "Conseiller en gestion d'exploitation",
        },
        title: "Histoire de succès: De 50k€ de pertes à 120k€ de bénéfices avec la location",
        category: "success-story",
        content: "Mon témoignage sur la transformation de mon exploitation grâce à la location intelligente d'équipements. Analyse chiffrée sur 3 ans, les erreurs évitées, les bonnes décisions...",
        equipmentMentioned: ["Tracteurs", "Moissonneuses", "Pulvérisateurs"],
        likes: 412,
        saves: 267,
        createdAt: new Date("2026-01-07T15:45:00"),
      },
      {
        id: "TIP-004",
        author: {
          name: "Véronique Blanc",
          avatar: "https://i.pravatar.cc/150?img=38",
          expertise: "Experte maintenance préventive",
        },
        title: "⚠️ Alerte: Points de vigilance avant de louer du matériel d'occasion",
        category: "warning",
        content: "Checklist essentielle pour éviter les mauvaises surprises: vérifications mécaniques, état des pneumatiques, calibrage des instruments, historique maintenance... Ne signez jamais sans ces vérifications!",
        equipmentMentioned: ["Tous équipements"],
        likes: 89,
        saves: 156,
        createdAt: new Date("2026-01-13T10:15:00"),
      },
    ],
    []
  );

  const events: NetworkingEvent[] = useMemo(
    () => [
      {
        id: "EVENT-001",
        title: "Journée Démo: Nouvelles Technologies Agricoles 2026",
        type: "demo",
        organizer: "Chambre d'Agriculture",
        date: new Date("2026-02-15T09:00:00"),
        location: "Beauvais, Oise (60)",
        attendees: 67,
        maxAttendees: 100,
        description: "Démonstrations de matériel dernière génération, robotique agricole, agriculture de précision. Essais gratuits sur le terrain.",
      },
      {
        id: "EVENT-002",
        title: "Atelier: Optimiser sa Stratégie de Location",
        type: "workshop",
        organizer: "AgroLogistic Academy",
        date: new Date("2026-01-25T14:00:00"),
        location: "En ligne (Webinaire)",
        attendees: 142,
        maxAttendees: 200,
        description: "Formation pratique de 3h avec experts. Analyse financière, négociation, planification saisonnière. Certificat délivré.",
      },
      {
        id: "EVENT-003",
        title: "Rencontre Agriculteurs: Mutualisation du Matériel",
        type: "meetup",
        organizer: "Collectif AgriPartage",
        date: new Date("2026-02-02T18:30:00"),
        location: "Amiens, Somme (80)",
        attendees: 34,
        maxAttendees: 50,
        description: "Échanges entre agriculteurs intéressés par la mutualisation. Retours d'expérience, montage juridique, organisation pratique.",
      },
    ],
    []
  );

  const getCategoryColor = (category: UserRecommendation["category"]) => {
    switch (category) {
      case "tips":
        return "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400";
      case "guide":
        return "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400";
      case "warning":
        return "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400";
      case "success-story":
        return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400";
    }
  };

  const getCategoryIcon = (category: UserRecommendation["category"]) => {
    switch (category) {
      case "tips":
        return Lightbulb;
      case "guide":
        return BookOpen;
      case "warning":
        return Flag;
      case "success-story":
        return Award;
    }
  };

  const getEventTypeColor = (type: NetworkingEvent["type"]) => {
    switch (type) {
      case "demo":
        return "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400";
      case "workshop":
        return "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400";
      case "meetup":
        return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400";
      case "webinar":
        return "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Communauté AgroLogistic</h2>
          <p className="text-muted-foreground mt-1">
            Partagez, apprenez et développez votre réseau
          </p>
        </div>
        <button className="px-4 py-2 bg-[#2563eb] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nouvelle Publication
        </button>
      </div>

      {/* Community Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <span className="text-sm text-muted-foreground">Membres</span>
          </div>
          <div className="text-2xl font-bold">12,847</div>
          <div className="text-xs text-green-600 dark:text-green-400 mt-1">+234 ce mois</div>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="h-5 w-5 text-green-600 dark:text-green-400" />
            <span className="text-sm text-muted-foreground">Discussions</span>
          </div>
          <div className="text-2xl font-bold">3,452</div>
          <div className="text-xs text-green-600 dark:text-green-400 mt-1">+89 cette semaine</div>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Star className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            <span className="text-sm text-muted-foreground">Avis</span>
          </div>
          <div className="text-2xl font-bold">8,234</div>
          <div className="text-xs text-green-600 dark:text-green-400 mt-1">+45 aujourd'hui</div>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            <span className="text-sm text-muted-foreground">Événements</span>
          </div>
          <div className="text-2xl font-bold">{events.length}</div>
          <div className="text-xs text-muted-foreground mt-1">À venir</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b">
        <nav className="flex gap-6 overflow-x-auto">
          {[
            { id: "forums" as const, label: "Forums", icon: MessageSquare, count: forumThreads.length },
            { id: "reviews" as const, label: "Avis", icon: Star, count: reviews.length },
            { id: "tips" as const, label: "Conseils & Guides", icon: Lightbulb, count: recommendations.length },
            { id: "events" as const, label: "Événements", icon: Calendar, count: events.length },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-[#2563eb] text-[#2563eb] font-semibold"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-5 w-5" />
                {tab.label}
                <span className="px-2 py-0.5 bg-muted text-xs rounded-full">
                  {tab.count}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Forums Tab */}
      {activeTab === "forums" && (
        <div className="space-y-4">
          {/* Search & Filter */}
          <div className="bg-card border rounded-lg p-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Rechercher dans les discussions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background"
                />
              </div>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background"
              >
                <option value="all">Toutes catégories</option>
                <option value="equipment">Conseils Équipement</option>
                <option value="economy">Économie & Gestion</option>
                <option value="technical">Support Technique</option>
                <option value="collaboration">Collaboration</option>
              </select>
            </div>
          </div>

          {/* Threads List */}
          <div className="space-y-3">
            {forumThreads.map((thread) => (
              <div
                key={thread.id}
                className="bg-card border rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex gap-4">
                  {/* Avatar */}
                  <img
                    src={thread.author.avatar}
                    alt={thread.author.name}
                    className="h-12 w-12 rounded-full"
                  />

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-lg hover:text-[#2563eb] transition-colors">
                            {thread.title}
                          </h3>
                          {thread.trending && (
                            <span className="px-2 py-0.5 bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400 text-xs rounded-full flex items-center gap-1">
                              <TrendingUp className="h-3 w-3" />
                              Tendance
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {thread.content}
                        </p>
                      </div>
                    </div>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <span className="font-medium text-foreground">{thread.author.name}</span>
                          {thread.author.verified && (
                            <Award className="h-4 w-4 text-blue-600" />
                          )}
                        </div>
                        <span className="px-2 py-1 bg-muted rounded text-xs">
                          {thread.category}
                        </span>
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {thread.views}
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="h-4 w-4" />
                          {thread.replies}
                        </div>
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="h-4 w-4" />
                          {thread.likes}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Dernière activité: {thread.lastActivity.toLocaleDateString("fr-FR")}
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex gap-2 mt-3">
                      {thread.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400 text-xs rounded"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reviews Tab */}
      {activeTab === "reviews" && (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-card border rounded-lg p-6">
              <div className="flex gap-4">
                <img
                  src={review.reviewer.avatar}
                  alt={review.reviewer.name}
                  className="h-12 w-12 rounded-full"
                />
                <div className="flex-1">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{review.title}</h4>
                        {review.verified && (
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400 text-xs rounded-full flex items-center gap-1">
                            <Award className="h-3 w-3" />
                            Vérifié
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">{review.reviewer.name}</span>
                        <span>•</span>
                        <span>{review.reviewer.totalReviews} avis</span>
                        <span>•</span>
                        <span>{review.createdAt.toLocaleDateString("fr-FR")}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Equipment */}
                  <div className="mb-3 p-3 bg-muted/50 rounded-lg">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Équipement: </span>
                      <span className="font-medium">{review.equipmentName}</span>
                      <span className="text-muted-foreground"> • {review.equipmentCategory}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <p className="text-sm mb-4">{review.content}</p>

                  {/* Pros & Cons */}
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-sm font-medium text-green-600 dark:text-green-400 mb-2">
                        Points positifs
                      </div>
                      <ul className="space-y-1">
                        {review.pros.map((pro, i) => (
                          <li key={i} className="text-sm flex items-start gap-2">
                            <ThumbsUp className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5" />
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-orange-600 dark:text-orange-400 mb-2">
                        Points à améliorer
                      </div>
                      <ul className="space-y-1">
                        {review.cons.map((con, i) => (
                          <li key={i} className="text-sm flex items-start gap-2">
                            <Flag className="h-4 w-4 text-orange-600 dark:text-orange-400 mt-0.5" />
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-4 pt-3 border-t">
                    <button className="flex items-center gap-2 text-sm hover:text-[#2563eb] transition-colors">
                      <ThumbsUp className="h-4 w-4" />
                      Utile ({review.helpful})
                    </button>
                    <button className="flex items-center gap-2 text-sm hover:text-[#2563eb] transition-colors">
                      <MessageCircle className="h-4 w-4" />
                      Répondre
                    </button>
                    <button className="flex items-center gap-2 text-sm hover:text-[#2563eb] transition-colors">
                      <Share2 className="h-4 w-4" />
                      Partager
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tips & Guides Tab */}
      {activeTab === "tips" && (
        <div className="space-y-4">
          {recommendations.map((rec) => {
            const CategoryIcon = getCategoryIcon(rec.category);
            return (
              <div key={rec.id} className="bg-card border rounded-lg p-6">
                <div className="flex gap-4">
                  <img
                    src={rec.author.avatar}
                    alt={rec.author.name}
                    className="h-12 w-12 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getCategoryColor(rec.category)}`}>
                            <CategoryIcon className="h-3 w-3" />
                            {rec.category === "tips" && "Astuce"}
                            {rec.category === "guide" && "Guide"}
                            {rec.category === "warning" && "Attention"}
                            {rec.category === "success-story" && "Success Story"}
                          </span>
                        </div>
                        <h3 className="font-semibold text-lg mb-2">{rec.title}</h3>
                        <div className="text-sm text-muted-foreground mb-2">
                          <span className="font-medium text-foreground">{rec.author.name}</span> • {rec.author.expertise}
                        </div>
                      </div>
                    </div>

                    <p className="text-sm mb-4">{rec.content}</p>

                    {rec.equipmentMentioned && rec.equipmentMentioned.length > 0 && (
                      <div className="flex gap-2 mb-4">
                        {rec.equipmentMentioned.map((eq) => (
                          <span
                            key={eq}
                            className="px-2 py-1 bg-purple-50 text-purple-700 dark:bg-purple-950/20 dark:text-purple-400 text-xs rounded"
                          >
                            {eq}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-4 pt-3 border-t">
                      <button className="flex items-center gap-2 text-sm hover:text-[#2563eb] transition-colors">
                        <Heart className="h-4 w-4" />
                        J'aime ({rec.likes})
                      </button>
                      <button className="flex items-center gap-2 text-sm hover:text-[#2563eb] transition-colors">
                        <Target className="h-4 w-4" />
                        Enregistrer ({rec.saves})
                      </button>
                      <button className="flex items-center gap-2 text-sm hover:text-[#2563eb] transition-colors">
                        <Share2 className="h-4 w-4" />
                        Partager
                      </button>
                      <span className="text-xs text-muted-foreground ml-auto">
                        {rec.createdAt.toLocaleDateString("fr-FR")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Events Tab */}
      {activeTab === "events" && (
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className="bg-card border rounded-lg p-6">
              <div className="flex gap-6">
                {/* Date Badge */}
                <div className="flex flex-col items-center justify-center bg-[#2563eb] text-white rounded-lg p-4 min-w-[80px]">
                  <div className="text-2xl font-bold">
                    {event.date.getDate()}
                  </div>
                  <div className="text-sm">
                    {event.date.toLocaleDateString("fr-FR", { month: "short" })}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{event.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEventTypeColor(event.type)}`}>
                          {event.type === "demo" && "Démo"}
                          {event.type === "workshop" && "Atelier"}
                          {event.type === "meetup" && "Rencontre"}
                          {event.type === "webinar" && "Webinaire"}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {event.date.toLocaleDateString("fr-FR", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {event.location}
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm mb-4">{event.description}</p>

                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {event.attendees}/{event.maxAttendees} participants
                      </div>
                      <div>
                        Organisé par <span className="font-medium text-foreground">{event.organizer}</span>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-[#2563eb] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors text-sm flex items-center gap-2">
                      <UserPlus className="h-4 w-4" />
                      S'inscrire
                    </button>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-3">
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#2563eb] transition-all duration-500"
                        style={{ width: `${(event.attendees / event.maxAttendees) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
