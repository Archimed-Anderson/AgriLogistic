import { useState } from "react";
import {
  ArrowLeft,
  Rocket,
  Calendar,
  Lightbulb,
  Brain,
  Globe,
  Users,
  TrendingUp,
  Target,
  Award,
  CheckCircle,
  Star,
  Building,
  University,
  Heart,
  Download,
  Play,
  ChevronRight,
  Zap,
  Shield,
  Droplet,
  ArrowRight,
  Eye,
  Package,
  Code,
  Glasses,
  Mic,
  Link2,
  Boxes,
  DollarSign,
  BookOpen,
  MessageSquare,
  FileText,
  Mail,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";

export function VisionStrategy({ onNavigate }: { onNavigate: (route: string) => void }) {
  const [selectedPhase, setSelectedPhase] = useState<number | null>(null);
  const [selectedInnovation, setSelectedInnovation] = useState<string | null>(null);
  const [userType, setUserType] = useState("");
  const [email, setEmail] = useState("");
  const [innovationVote, setInnovationVote] = useState<string | null>(null);

  // Phases roadmap
  const phases = [
    {
      id: 1,
      badge: "🚀 EN COURS",
      badgeColor: "bg-green-500",
      title: "Lancement",
      subtitle: "10 Cultures Majeures Complètes",
      year: "Année 1",
      progress: 85,
      targets: {
        farmers: "100,000 agriculteurs formés",
        cultures:
          "Maïs, Riz, Blé, Manioc, Haricot, Pomme de terre, Tomate, Banane, Café, Coton",
        features: "Cours de base, outils simples",
        partners: "10 institutions académiques",
      },
      icon: Rocket,
      color: "green",
    },
    {
      id: 2,
      badge: "📅 PLANIFIÉ",
      badgeColor: "bg-blue-500",
      title: "Expansion",
      subtitle: "Extension à 50 Cultures",
      year: "Année 2-3",
      progress: 0,
      targets: {
        farmers: "500,000 agriculteurs",
        new: "Cultures régionales spécifiques",
        features: "Outils avancés, certification",
        languages: "+5 langues africaines",
      },
      icon: Globe,
      color: "blue",
    },
    {
      id: 3,
      badge: "💡 À VENIR",
      badgeColor: "bg-purple-500",
      title: "Communauté",
      subtitle: "Savoirs Locaux Crowdsourcés",
      year: "Année 4-5",
      progress: 0,
      targets: {
        platform: "Plateforme collaborative ouverte",
        validation: "Système de validation par les pairs",
        library: "Bibliothèque de savoirs traditionnels",
        network: "Réseau d'experts locaux",
      },
      icon: Users,
      color: "purple",
    },
    {
      id: 4,
      badge: "🚀 FUTUR",
      badgeColor: "bg-orange-500",
      title: "Intelligence Collective",
      subtitle: "Intelligence Collective Augmentée",
      year: "Année 6+",
      progress: 0,
      targets: {
        ai: "IA agricole collaborative",
        predictive: "Système prédictif global",
        research: "Plateforme de recherche participative",
        economy: "Économie de la connaissance agricole",
      },
      icon: Brain,
      color: "orange",
    },
  ];

  // Economic models
  const economicModels = [
    {
      id: "free",
      icon: "🌟",
      title: "GRATUIT",
      subtitle: "Base de Connaissances",
      included: [
        "Cours fondamentaux",
        "Outils de base",
        "Communauté",
        "Contenu en open access",
      ],
      public: "Agriculteurs individuels, étudiants",
      price: "Gratuit",
      cta: "Commencer gratuitement",
      color: "from-green-500 to-emerald-600",
    },
    {
      id: "premium",
      icon: "⭐",
      title: "PREMIUM",
      subtitle: "Outils Avancés + Mentorat",
      included: [
        "Simulateurs avancés",
        "Diagnostic IA",
        "Mentorat personnalisé",
        "Certifications",
      ],
      public: "Agriculteurs professionnels, coopératives",
      price: "À partir de 10€/mois",
      cta: "Passer à Premium",
      color: "from-blue-500 to-purple-600",
    },
    {
      id: "institutional",
      icon: "🏛️",
      title: "INSTITUTIONNEL",
      subtitle: "API + Données Agrégées",
      included: [
        "API complète",
        "Données anonymisées",
        "Solutions sur mesure",
        "Formation organisationnelle",
      ],
      public: "ONG, gouvernements, institutions",
      price: "Contactez-nous",
      cta: "Devenir partenaire",
      color: "from-orange-500 to-red-600",
    },
    {
      id: "partnerships",
      icon: "🤝",
      title: "PARTENARIATS",
      subtitle: "Recherche & Innovation",
      included: [
        "Co-développement",
        "Recherche appliquée",
        "Études de cas",
        "Visibilité mutuelle",
      ],
      public: "Universités, centres de recherche",
      price: "Échange de valeur",
      cta: "Proposer un partenariat",
      color: "from-pink-500 to-rose-600",
    },
  ];

  // Impact KPIs
  const impactKPIs = [
    {
      icon: Users,
      label: "Agriculteurs Certifiés",
      value: 12847,
      target: 100000,
      unit: "",
      trend: "+15% ce mois",
      trendPositive: true,
    },
    {
      icon: TrendingUp,
      label: "Augmentation des Rendements",
      value: 22,
      target: 30,
      unit: "%",
      trend: "Moyenne",
      trendPositive: true,
    },
    {
      icon: Droplet,
      label: "Adoption Pratiques Durables",
      value: 67,
      target: 80,
      unit: "%",
      trend: "des utilisateurs",
      trendPositive: true,
    },
    {
      icon: MessageSquare,
      label: "Communauté Active",
      value: 8942,
      target: 50000,
      unit: "",
      trend: "contributeurs",
      trendPositive: true,
    },
  ];

  // Innovations
  const innovations = [
    {
      id: "ar",
      icon: Glasses,
      title: "Réalité Augmentée Agricole",
      description: "Superposition de conseils en temps réel sur le champ",
      status: "En développement",
      impact: "Réduction erreurs de 40%",
      timeline: "2025",
      color: "from-cyan-500 to-blue-600",
      votes: 342,
    },
    {
      id: "voice",
      icon: Mic,
      title: "Assistant Vocal Agricole",
      description: "Commandes vocales en langues locales",
      status: "Prototype",
      impact: "Accessibilité augmentée",
      timeline: "2026",
      color: "from-purple-500 to-pink-600",
      votes: 287,
    },
    {
      id: "blockchain",
      icon: Link2,
      title: "Blockchain de Certification",
      description: "Compétences vérifiées et infalsifiables",
      status: "Recherche",
      impact: "Reconnaissance internationale",
      timeline: "2027",
      color: "from-orange-500 to-red-600",
      votes: 198,
    },
    {
      id: "twins",
      icon: Boxes,
      title: "Jumeaux Numériques de Fermes",
      description: "Simulation précise avant implémentation",
      status: "Concept",
      impact: "Optimisation complète",
      timeline: "2028",
      color: "from-green-500 to-emerald-600",
      votes: 256,
    },
    {
      id: "marketplace",
      icon: DollarSign,
      title: "Marché des Connaissances",
      description: "Micro-paiements pour expertise partagée",
      status: "Idéation",
      impact: "Économie circulaire du savoir",
      timeline: "2029",
      color: "from-yellow-500 to-orange-600",
      votes: 176,
    },
  ];

  // Revenue allocation
  const revenueAllocation = [
    { category: "Développement contenu", percentage: 60, color: "bg-blue-500" },
    { category: "Infrastructure tech", percentage: 25, color: "bg-green-500" },
    { category: "Équipe & opérations", percentage: 10, color: "bg-orange-500" },
    { category: "Bourses agriculteurs", percentage: 5, color: "bg-purple-500" },
  ];

  const handleVoteInnovation = (innovationId: string) => {
    setInnovationVote(innovationId);
    toast.success("Merci pour votre vote !");
  };

  const handleSubscribe = () => {
    if (email && userType) {
      toast.success("Inscription confirmée ! Vous recevrez notre newsletter stratégique.");
      setEmail("");
      setUserType("");
    } else {
      toast.error("Veuillez remplir tous les champs");
    }
  };

  return (
    <div className="space-y-16">
      {/* Back Button */}
      <button
        onClick={() => onNavigate("/academy")}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour à l'académie
      </button>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-[#2980B9] via-[#3498DB] to-[#5DADE2] rounded-3xl p-16 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-8xl">🌍</div>
          <div className="absolute bottom-10 right-10 text-8xl">🌱</div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-9xl">
            🚀
          </div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1 className="text-6xl font-bold mb-4">
            Notre Vision pour l'Agriculture Mondiale
          </h1>
          <p className="text-2xl opacity-90 mb-12">
            De la connaissance à l'action, de l'action à l'impact
          </p>

          {/* Animated Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-5xl font-bold mb-2">150+</div>
              <div className="text-lg opacity-90">🌍 Pays ciblés</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-5xl font-bold mb-2">1M+</div>
              <div className="text-lg opacity-90">🌱 Agriculteurs à former d'ici 2030</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-5xl font-bold mb-2">+30%</div>
              <div className="text-lg opacity-90">📈 Rendements durables</div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 1: Roadmap */}
      <div className="space-y-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold mb-4">Notre Feuille de Route</h2>
          <p className="text-xl text-muted-foreground">
            Une évolution progressive et inclusive vers l'agriculture de demain
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Horizontal Line */}
          <div className="hidden lg:block absolute top-32 left-0 right-0 h-1 bg-gradient-to-r from-green-500 via-blue-500 via-purple-500 to-orange-500 rounded-full" />

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {phases.map((phase, index) => {
              const Icon = phase.icon;
              return (
                <div
                  key={phase.id}
                  className="relative"
                  onMouseEnter={() => setSelectedPhase(phase.id)}
                  onMouseLeave={() => setSelectedPhase(null)}
                >
                  {/* Timeline Node */}
                  <div className="hidden lg:flex justify-center mb-4">
                    <div
                      className={`w-16 h-16 rounded-full bg-gradient-to-br ${
                        phase.color === "green"
                          ? "from-green-500 to-emerald-600"
                          : phase.color === "blue"
                          ? "from-blue-500 to-cyan-600"
                          : phase.color === "purple"
                          ? "from-purple-500 to-pink-600"
                          : "from-orange-500 to-red-600"
                      } flex items-center justify-center text-white shadow-lg relative z-10 transition-transform ${
                        selectedPhase === phase.id ? "scale-125" : ""
                      }`}
                    >
                      <Icon className="h-8 w-8" />
                    </div>
                  </div>

                  {/* Card */}
                  <div
                    className={`bg-card border-2 rounded-xl p-6 transition-all cursor-pointer ${
                      selectedPhase === phase.id
                        ? "border-[#2980B9] shadow-lg scale-105"
                        : "border-transparent hover:border-gray-300"
                    }`}
                  >
                    <div className={`${phase.badgeColor} text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-3`}>
                      {phase.badge}
                    </div>

                    <h3 className="text-2xl font-bold mb-1">{phase.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{phase.year}</p>
                    <p className="font-medium mb-4">{phase.subtitle}</p>

                    {/* Progress */}
                    {phase.progress > 0 && (
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progression</span>
                          <span className="font-bold">{phase.progress}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-green-500 to-emerald-600 transition-all"
                            style={{ width: `${phase.progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Targets */}
                    <div className="space-y-2 text-sm">
                      {Object.entries(phase.targets).map(([key, value]) => (
                        <div key={key} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="text-center">
          <button className="px-8 py-4 bg-[#2980B9] text-white rounded-lg hover:bg-[#2471A3] transition-colors font-semibold inline-flex items-center gap-2">
            Contribuer à notre feuille de route
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Section 2: Economic Model */}
      <div className="space-y-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold mb-4">Un Modèle Économique pour un Impact Durable</h2>
          <p className="text-xl text-muted-foreground">
            Gratuit pour les agriculteurs, soutenu par des partenaires engagés
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {economicModels.map((model) => (
            <div
              key={model.id}
              className="bg-card border rounded-xl overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
            >
              <div className={`h-32 bg-gradient-to-br ${model.color} p-6 flex items-center justify-between text-white`}>
                <div>
                  <div className="text-4xl mb-2">{model.icon}</div>
                  <h3 className="text-xl font-bold">{model.title}</h3>
                </div>
              </div>

              <div className="p-6">
                <p className="font-semibold mb-4">{model.subtitle}</p>

                <div className="space-y-2 mb-6">
                  {model.included.map((item, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 mb-4">
                  <div className="text-sm text-muted-foreground mb-2">Public cible:</div>
                  <div className="text-sm font-medium">{model.public}</div>
                </div>

                <div className="text-2xl font-bold mb-4 text-[#2980B9]">{model.price}</div>

                <button className="w-full px-4 py-3 bg-[#2980B9] text-white rounded-lg hover:bg-[#2471A3] transition-colors font-semibold">
                  {model.cta}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Revenue Allocation */}
        <div className="bg-card border rounded-xl p-8">
          <h3 className="text-2xl font-bold mb-6 text-center">
            Comment nous réinvestissons les revenus
          </h3>

          <div className="max-w-4xl mx-auto space-y-4">
            {revenueAllocation.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">{item.category}</span>
                  <span className="font-bold text-lg">{item.percentage}%</span>
                </div>
                <div className="h-8 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} flex items-center justify-center text-white text-sm font-semibold transition-all`}
                    style={{ width: `${item.percentage}%` }}
                  >
                    {item.percentage}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section 3: Impact Metrics */}
      <div className="space-y-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold mb-4">Des Résultats Concrets, Mesurés et Partagés</h2>
          <p className="text-xl text-muted-foreground">
            Notre engagement : la transparence totale sur notre impact
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {impactKPIs.map((kpi, index) => {
            const Icon = kpi.icon;
            const percentage = (kpi.value / kpi.target) * 100;

            return (
              <div key={index} className="bg-card border rounded-xl p-6 hover:shadow-lg transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  {kpi.trendPositive && (
                    <div className="flex items-center gap-1 text-green-600 text-sm font-semibold">
                      <TrendingUp className="h-4 w-4" />
                      {kpi.trend}
                    </div>
                  )}
                </div>

                <h3 className="font-semibold mb-3">{kpi.label}</h3>

                <div className="mb-4">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-4xl font-bold">
                      {kpi.value.toLocaleString()}
                      {kpi.unit}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      / {kpi.target.toLocaleString()}
                      {kpi.unit}
                    </span>
                  </div>

                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-600 transition-all"
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Success Stories */}
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-6 text-center">Témoignages d'Impact</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Jean-Baptiste K.",
                country: "Burkina Faso",
                achievement: "+45% rendement en 1 saison",
                avatar: "👨‍🌾",
                crop: "Maïs",
              },
              {
                name: "Amina M.",
                country: "Côte d'Ivoire",
                achievement: "Certification bio obtenue",
                avatar: "👩‍🌾",
                crop: "Cacao",
              },
              {
                name: "Pierre L.",
                country: "RDC",
                achievement: "Stockage: 0% pertes",
                avatar: "👨‍🌾",
                crop: "Manioc",
              },
            ].map((story, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="text-5xl mb-4">{story.avatar}</div>
                <h4 className="font-bold text-lg mb-1">{story.name}</h4>
                <p className="text-sm opacity-90 mb-2">
                  {story.country} • {story.crop}
                </p>
                <p className="font-semibold text-lg">{story.achievement}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <button className="px-6 py-3 bg-white text-green-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center gap-2">
              <Download className="h-5 w-5" />
              Voir notre rapport d'impact annuel
            </button>
          </div>
        </div>
      </div>

      {/* Section 4: Future Innovations */}
      <div className="space-y-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold mb-4">L'Agriculture de Demain, Aujourd'hui</h2>
          <p className="text-xl text-muted-foreground">
            Les innovations qui transformeront l'agriculture dans les 5 prochaines années
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {innovations.slice(0, 3).map((innovation) => {
            const Icon = innovation.icon;
            return (
              <div
                key={innovation.id}
                className={`relative bg-card border-2 rounded-xl overflow-hidden hover:shadow-xl transition-all cursor-pointer ${
                  selectedInnovation === innovation.id ? "border-[#2980B9] scale-105" : "border-transparent"
                }`}
                onMouseEnter={() => setSelectedInnovation(innovation.id)}
                onMouseLeave={() => setSelectedInnovation(null)}
              >
                <div className={`h-48 bg-gradient-to-br ${innovation.color} p-6 flex items-center justify-center text-white relative overflow-hidden`}>
                  <Icon className="h-24 w-24 opacity-20 absolute" />
                  <Icon className="h-16 w-16 relative z-10" />
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-xs font-semibold rounded-full">
                      {innovation.status}
                    </span>
                    <span className="text-sm font-semibold text-muted-foreground">
                      {innovation.timeline}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold mb-3">{innovation.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{innovation.description}</p>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Impact: </span>
                      <span className="font-semibold">{innovation.impact}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {innovations.slice(3).map((innovation) => {
            const Icon = innovation.icon;
            return (
              <div
                key={innovation.id}
                className="bg-card border rounded-xl overflow-hidden hover:shadow-lg transition-all"
              >
                <div className="flex">
                  <div className={`w-32 bg-gradient-to-br ${innovation.color} flex items-center justify-center text-white`}>
                    <Icon className="h-12 w-12" />
                  </div>
                  <div className="flex-1 p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold">{innovation.title}</h3>
                      <span className="px-2 py-1 bg-muted text-xs font-semibold rounded">
                        {innovation.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{innovation.description}</p>
                    <div className="flex items-center gap-4 text-xs">
                      <span className="text-muted-foreground">{innovation.impact}</span>
                      <span className="font-semibold">{innovation.timeline}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Innovation Poll */}
        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-4 text-center">Sonde d'Innovation</h3>
          <p className="text-center mb-6 opacity-90">
            Quelle innovation vous intéresse le plus ?
          </p>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {innovations.map((innovation) => (
              <button
                key={innovation.id}
                onClick={() => handleVoteInnovation(innovation.id)}
                className={`p-4 rounded-lg transition-all ${
                  innovationVote === innovation.id
                    ? "bg-white text-purple-600 scale-105"
                    : "bg-white/10 backdrop-blur-sm hover:bg-white/20"
                }`}
              >
                <div className="font-bold mb-2">{innovation.title.split(" ")[0]}</div>
                <div className="text-2xl font-bold">{innovation.votes}</div>
                <div className="text-xs opacity-75">votes</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Section 5: Call to Action */}
      <div className="space-y-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold mb-4">Rejoignez Notre Mission Collective</h2>
          <p className="text-xl text-muted-foreground">
            Ensemble, transformons l'agriculture mondiale
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Agriculteurs",
              subtitle: "Devenez un Ambassadeur",
              benefits: "Accès premium, formation avancée, réseau",
              cta: "Postuler",
              icon: Users,
              color: "from-green-500 to-emerald-600",
            },
            {
              title: "Experts",
              subtitle: "Contribuez à l'Académie",
              benefits: "Rédaction, mentorat, validation",
              cta: "Devenir contributeur",
              icon: Award,
              color: "from-blue-500 to-cyan-600",
            },
            {
              title: "Organisations",
              subtitle: "Partenariats Stratégiques",
              benefits: "Contenu, technologie, déploiement",
              cta: "Nous contacter",
              icon: Building,
              color: "from-orange-500 to-red-600",
            },
            {
              title: "Citoyens",
              subtitle: "Soutenez l'Agriculture Durable",
              benefits: "Don, bénévolat, plaidoyer",
              cta: "Faire un don",
              icon: Heart,
              color: "from-pink-500 to-rose-600",
            },
          ].map((target, index) => {
            const Icon = target.icon;
            return (
              <div key={index} className="bg-card border rounded-xl overflow-hidden hover:shadow-lg transition-all">
                <div className={`h-32 bg-gradient-to-br ${target.color} p-6 flex items-center justify-center text-white`}>
                  <Icon className="h-16 w-16" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1">{target.title}</h3>
                  <p className="font-semibold text-sm mb-3">{target.subtitle}</p>
                  <p className="text-sm text-muted-foreground mb-4">{target.benefits}</p>
                  <button className="w-full px-4 py-2 bg-[#2980B9] text-white rounded-lg hover:bg-[#2471A3] transition-colors font-semibold">
                    {target.cta}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Newsletter Subscription */}
        <div className="bg-card border rounded-xl p-8 max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold mb-4 text-center">Newsletter Stratégique</h3>
          <p className="text-center text-muted-foreground mb-6">
            Recevez nos actualités, success stories et opportunités
          </p>

          <div className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Votre email"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2980B9] bg-background"
            />

            <select
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2980B9] bg-background"
            >
              <option value="">Je suis...</option>
              <option value="farmer">Agriculteur</option>
              <option value="expert">Expert</option>
              <option value="organization">Organisation</option>
              <option value="citizen">Citoyen</option>
            </select>

            <button
              onClick={handleSubscribe}
              className="w-full px-6 py-3 bg-[#2980B9] text-white rounded-lg hover:bg-[#2471A3] transition-colors font-semibold"
            >
              M'inscrire à la newsletter
            </button>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="bg-muted rounded-xl p-8">
        <h3 className="text-xl font-bold mb-6 text-center">Ressources Supplémentaires</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: "Livre blanc stratégique",
              icon: FileText,
              action: "Télécharger",
            },
            {
              label: "Vidéo de présentation",
              icon: Play,
              action: "Regarder",
            },
            {
              label: "Conseil consultatif",
              icon: Users,
              action: "Découvrir",
            },
            {
              label: "Transparence financière",
              icon: Eye,
              action: "Voir les rapports",
            },
          ].map((resource, index) => {
            const Icon = resource.icon;
            return (
              <button
                key={index}
                className="flex items-center gap-3 p-4 bg-card border rounded-lg hover:bg-muted transition-colors text-left"
              >
                <Icon className="h-6 w-6 text-[#2980B9]" />
                <div className="flex-1">
                  <div className="font-medium text-sm">{resource.label}</div>
                  <div className="text-xs text-muted-foreground">{resource.action}</div>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
              </button>
            );
          })}
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground mb-3">Suivez-nous sur les réseaux sociaux</p>
          <p className="font-semibold text-[#2980B9]">#AgroDeepVision</p>
        </div>
      </div>
    </div>
  );
}
