import { useState, useEffect } from "react";
import {
  ShoppingCart,
  BarChart3,
  Truck,
  Wrench,
  ChevronRight,
  Star,
  Check,
  Play,
  ArrowRight,
  Users,
  TrendingUp,
  Shield,
  Zap,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Mail,
  Phone,
  MapPin,
  ChevronLeft,
  Quote,
} from "lucide-react";

interface LandingPageProps {
  onNavigate: (route: string) => void;
}

export function LandingPageModern({ onNavigate }: LandingPageProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeTab, setActiveTab] = useState("marketplace");
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [email, setEmail] = useState("");

  const heroSlides = [
    {
      image: "🌾",
      title: "La plateforme qui révolutionne",
      subtitle: "la chaîne d'approvisionnement agricole",
    },
    {
      image: "🚜",
      title: "Gérez votre exploitation",
      subtitle: "avec intelligence et simplicité",
    },
    {
      image: "📊",
      title: "Optimisez vos performances",
      subtitle: "grâce aux données en temps réel",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setEmailSubmitted(true);
      setTimeout(() => {
        setEmailSubmitted(false);
        setEmail("");
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#2563eb]">
                <span className="text-xl font-bold text-white">A</span>
              </div>
              <span className="text-2xl font-bold">AgroDeep</span>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-8">
              <button className="text-sm font-medium hover:text-[#2563eb] transition-colors">
                Accueil
              </button>
              <button
                onClick={() => onNavigate("/market")}
                className="text-sm font-medium hover:text-[#2563eb] transition-colors"
              >
                Marketplace
              </button>
              <button className="text-sm font-medium hover:text-[#2563eb] transition-colors">
                Comment ça marche
              </button>
              <button className="text-sm font-medium hover:text-[#2563eb] transition-colors">
                Tarifs
              </button>
              <button className="text-sm font-medium hover:text-[#2563eb] transition-colors">
                Contact
              </button>
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigate("/login")}
                className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-lg transition-colors"
              >
                Se Connecter
              </button>
              <button
                onClick={() => onNavigate("/register")}
                className="px-5 py-2 bg-[#2563eb] text-white text-sm font-medium rounded-lg hover:bg-[#1d4ed8] transition-colors"
              >
                Démarrer Gratuitement
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background Slideshow */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#2563eb] via-blue-600 to-blue-800">
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="absolute inset-0 flex items-center justify-center text-[20rem] opacity-10">
            {heroSlides[currentSlide].image}
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white">
          <div className="space-y-6">
            <h1 className="text-6xl md:text-7xl font-bold leading-tight">
              {heroSlides[currentSlide].title}
              <br />
              {heroSlides[currentSlide].subtitle}
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Connectez-vous à un marché intelligent, gérez votre stock en temps réel, et
              optimisez votre logistique. Tout-en-un.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <button
                onClick={() => onNavigate("/market")}
                className="px-8 py-4 bg-white text-[#2563eb] rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all flex items-center gap-2 shadow-xl"
              >
                Explorer le Marketplace
                <ArrowRight className="h-5 w-5" />
              </button>
              <button className="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold text-lg hover:bg-white/10 transition-all flex items-center gap-2">
                <Play className="h-5 w-5" />
                Voir la Démo
              </button>
            </div>

            {/* Trust Indicator */}
            <div className="pt-12 flex items-center justify-center gap-2 text-blue-100">
              <Users className="h-5 w-5" />
              <span className="text-sm">
                Rejoint par plus de <strong className="text-white">5 000</strong> professionnels
                agricoles
              </span>
            </div>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-3 z-10">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentSlide ? "w-12 bg-white" : "w-2 bg-white/50"
              }`}
            />
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={() =>
            setCurrentSlide((currentSlide - 1 + heroSlides.length) % heroSlides.length)
          }
          className="absolute left-6 top-1/2 -translate-y-1/2 p-3 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-sm transition-colors z-10"
        >
          <ChevronLeft className="h-6 w-6 text-white" />
        </button>
        <button
          onClick={() => setCurrentSlide((currentSlide + 1) % heroSlides.length)}
          className="absolute right-6 top-1/2 -translate-y-1/2 p-3 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-sm transition-colors z-10"
        >
          <ChevronRight className="h-6 w-6 text-white" />
        </button>
      </section>

      {/* Value Proposition Section */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              AgroDeep, bien plus qu'un simple marché
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Une plateforme complète qui accompagne chaque étape de votre activité agricole
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: ShoppingCart,
                title: "Marketplace Intelligent",
                description:
                  "Accédez à des milliers de produits et d'équipements. Transactions sécurisées, notations transparentes.",
                color: "bg-blue-500",
              },
              {
                icon: BarChart3,
                title: "Gestion d'Exploitation",
                description:
                  "Pilotez votre stock, vos finances et votre productivité depuis un tableau de bord centralisé.",
                color: "bg-green-500",
              },
              {
                icon: Truck,
                title: "Logistique Traçable",
                description:
                  "Suivez vos livraisons en temps réel sur une carte interactive et gérez vos flottes.",
                color: "bg-orange-500",
              },
              {
                icon: Wrench,
                title: "Location d'Équipements",
                description:
                  "Monétisez vos machines ou louez l'équipement dont vous avez besoin, en peer-to-peer.",
                color: "bg-purple-500",
              },
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-card border rounded-xl p-8 hover:shadow-xl transition-all group"
                >
                  <div className={`${feature.color} w-14 h-14 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground mb-4">{feature.description}</p>
                  <button className="text-[#2563eb] font-medium flex items-center gap-2 hover:gap-3 transition-all">
                    En savoir plus
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Showcase Section */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Découvrez la puissance de notre plateforme
            </h2>
            <p className="text-xl text-muted-foreground">
              Des fonctionnalités avancées conçues pour vous faire gagner du temps et de l'argent
            </p>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {[
              { id: "marketplace", label: "Marketplace Avancé" },
              { id: "dashboard", label: "Tableau de Bord Analytics" },
              { id: "logistics", label: "Suivi Logistique Live" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  activeTab === tab.id
                    ? "bg-[#2563eb] text-white shadow-lg"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Screenshot/Mockup */}
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-xl p-8 aspect-video flex items-center justify-center shadow-2xl border">
              {activeTab === "marketplace" && (
                <div className="text-center">
                  <div className="text-8xl mb-4">🛒</div>
                  <p className="text-2xl font-bold">Marketplace Moderne</p>
                  <p className="text-muted-foreground">Filtres intelligents & transactions sécurisées</p>
                </div>
              )}
              {activeTab === "dashboard" && (
                <div className="text-center">
                  <div className="text-8xl mb-4">📊</div>
                  <p className="text-2xl font-bold">Analytics Avancés</p>
                  <p className="text-muted-foreground">KPIs en temps réel & rapports détaillés</p>
                </div>
              )}
              {activeTab === "logistics" && (
                <div className="text-center">
                  <div className="text-8xl mb-4">🗺️</div>
                  <p className="text-2xl font-bold">Suivi en Direct</p>
                  <p className="text-muted-foreground">Carte interactive & alertes</p>
                </div>
              )}
            </div>

            {/* Features List */}
            <div className="space-y-6">
              {activeTab === "marketplace" && (
                <>
                  <h3 className="text-3xl font-bold mb-6">
                    Un marketplace qui s'adapte à vos besoins
                  </h3>
                  {[
                    "Filtres intelligents par catégorie, prix et localisation",
                    "Système de notation et avis vérifiés",
                    "Transactions sécurisées avec suivi",
                    "Mode comparaison de produits",
                    "Alertes de disponibilité en temps réel",
                  ].map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="bg-green-500 rounded-full p-1 mt-1">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-lg">{feature}</span>
                    </div>
                  ))}
                </>
              )}
              {activeTab === "dashboard" && (
                <>
                  <h3 className="text-3xl font-bold mb-6">
                    Pilotez votre activité avec précision
                  </h3>
                  {[
                    "Tableaux de bord personnalisables",
                    "Indicateurs clés de performance (KPIs)",
                    "Graphiques interactifs et rapports exportables",
                    "Alertes automatiques sur seuils critiques",
                    "Historique complet et prévisions",
                  ].map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="bg-green-500 rounded-full p-1 mt-1">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-lg">{feature}</span>
                    </div>
                  ))}
                </>
              )}
              {activeTab === "logistics" && (
                <>
                  <h3 className="text-3xl font-bold mb-6">
                    Optimisez votre logistique en temps réel
                  </h3>
                  {[
                    "Carte interactive avec suivi GPS",
                    "Calcul d'itinéraires optimisés",
                    "Gestion de flotte multi-véhicules",
                    "Notifications de livraison automatiques",
                    "Historique complet des trajets",
                  ].map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="bg-green-500 rounded-full p-1 mt-1">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-lg">{feature}</span>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Target Audience Section */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Conçue pour chaque acteur de la chaîne
            </h2>
            <p className="text-xl text-muted-foreground">
              Des solutions adaptées à votre métier et vos défis quotidiens
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                emoji: "👨‍🌾",
                title: "L'Agriculteur/Producteur",
                description:
                  "Vendez vos récoltes directement et gérez votre exploitation avec simplicité.",
                features: [
                  "Vente directe sans intermédiaire",
                  "Gestion du stock et des cultures",
                  "Prévisions météo intégrées",
                ],
              },
              {
                emoji: "🏢",
                title: "Le Distributeur/Négociant",
                description:
                  "Approvisionnez-vous efficacement et gérez votre logistique de A à Z.",
                features: [
                  "Commandes groupées",
                  "Suivi des livraisons en temps réel",
                  "Gestion de la relation fournisseurs",
                ],
              },
              {
                emoji: "🚛",
                title: "Le Prestataire de Services",
                description:
                  "Proposez vos services à une communauté active de professionnels.",
                features: [
                  "Calendrier de disponibilité",
                  "Tarification dynamique",
                  "Paiements sécurisés",
                ],
              },
            ].map((profile, index) => (
              <div
                key={index}
                className="bg-card border rounded-xl p-8 hover:shadow-xl transition-all"
              >
                <div className="text-6xl mb-6">{profile.emoji}</div>
                <h3 className="text-2xl font-bold mb-3">{profile.title}</h3>
                <p className="text-muted-foreground mb-6">{profile.description}</p>
                <ul className="space-y-2 mb-6">
                  {profile.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className="w-full px-4 py-3 bg-[#2563eb] text-white rounded-lg font-medium hover:bg-[#1d4ed8] transition-colors">
                  Voir la solution
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {[
              { value: "10 000+", label: "Transactions", icon: TrendingUp },
              { value: "95%", label: "Satisfaction Client", icon: Star },
              { value: "100%", label: "Couverture Nationale", icon: MapPin },
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <Icon className="h-12 w-12 text-[#2563eb] mx-auto mb-4" />
                  <div className="text-5xl font-bold text-[#2563eb] mb-2">{stat.value}</div>
                  <div className="text-lg text-muted-foreground">{stat.label}</div>
                </div>
              );
            })}
          </div>

          {/* Testimonials */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Ce qu'ils disent d'AgroDeep</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Jean Dupont",
                role: "Agriculteur - Ferme Bio du Soleil",
                avatar: "👨",
                rating: 5,
                comment:
                  "AgroDeep a transformé ma façon de vendre mes produits. Plus de transparence, moins d'intermédiaires, plus de profits.",
              },
              {
                name: "Marie Martin",
                role: "Distributrice - AgriDistrib Lyon",
                avatar: "👩",
                rating: 5,
                comment:
                  "La gestion logistique est devenue un jeu d'enfant. Je peux suivre toutes mes livraisons en temps réel.",
              },
              {
                name: "Pierre Lefebvre",
                role: "Loueur d'Équipements",
                avatar: "🧑",
                rating: 5,
                comment:
                  "Je loue mes tracteurs pendant les périodes creuses. Un complément de revenu bienvenu !",
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-card border rounded-xl p-8 relative hover:shadow-xl transition-all"
              >
                <Quote className="h-8 w-8 text-[#2563eb]/20 absolute top-6 right-6" />
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-4xl">{testimonial.avatar}</div>
                  <div>
                    <div className="font-bold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground italic">"{testimonial.comment}"</p>
              </div>
            ))}
          </div>

          {/* Partner Logos */}
          <div className="mt-20 text-center">
            <p className="text-sm text-muted-foreground mb-8">Ils nous font confiance</p>
            <div className="flex flex-wrap items-center justify-center gap-12 opacity-50">
              {["🏛️", "📰", "🏆", "🌱", "🔒"].map((emoji, i) => (
                <div key={i} className="text-6xl grayscale">
                  {emoji}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-gradient-to-br from-[#2563eb] to-blue-700 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Prêt à transformer votre business ?
          </h2>
          <p className="text-xl text-blue-100 mb-12">
            Rejoignez l'avenir de l'agriculture connectée dès aujourd'hui
          </p>

          {/* Email Form */}
          {!emailSubmitted ? (
            <form onSubmit={handleEmailSubmit} className="max-w-xl mx-auto mb-8">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Votre email professionnel"
                  className="flex-1 px-6 py-4 rounded-lg text-gray-900 focus:outline-none focus:ring-4 focus:ring-white/50"
                  required
                />
                <button
                  type="submit"
                  className="px-8 py-4 bg-white text-[#2563eb] rounded-lg font-bold hover:bg-gray-100 transition-colors whitespace-nowrap"
                >
                  Démarrer mon essai gratuit
                </button>
              </div>
            </form>
          ) : (
            <div className="bg-white/20 backdrop-blur-sm border-2 border-white/50 rounded-lg p-6 max-w-xl mx-auto mb-8">
              <div className="flex items-center justify-center gap-3 text-white">
                <div className="bg-green-500 rounded-full p-2">
                  <Check className="h-6 w-6" />
                </div>
                <span className="text-lg font-semibold">
                  Merci ! Vérifiez votre boîte mail 📧
                </span>
              </div>
            </div>
          )}

          {/* Guarantees */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-blue-100">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <span>Aucune carte bancaire requise</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              <span>Essai de 14 jours</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <span>Support dédié</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Column 1 - Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#2563eb]">
                  <span className="text-xl font-bold text-white">A</span>
                </div>
                <span className="text-xl font-bold text-white">AgroDeep</span>
              </div>
              <p className="text-sm mb-6">
                La plateforme tout-en-un pour révolutionner votre chaîne d'approvisionnement
                agricole.
              </p>
              <div className="flex gap-4">
                {[Facebook, Twitter, Linkedin, Instagram].map((Icon, i) => (
                  <button
                    key={i}
                    className="p-2 bg-gray-800 rounded-lg hover:bg-[#2563eb] transition-colors"
                  >
                    <Icon className="h-5 w-5" />
                  </button>
                ))}
              </div>
            </div>

            {/* Column 2 - Platform */}
            <div>
              <h3 className="text-white font-bold mb-4">Plateforme</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <button
                    onClick={() => onNavigate("/market")}
                    className="hover:text-white transition-colors"
                  >
                    Marketplace
                  </button>
                </li>
                <li>
                  <button className="hover:text-white transition-colors">
                    Gestion de Stock
                  </button>
                </li>
                <li>
                  <button className="hover:text-white transition-colors">Logistique</button>
                </li>
                <li>
                  <button className="hover:text-white transition-colors">
                    Location d'Équipements
                  </button>
                </li>
                <li>
                  <button className="hover:text-white transition-colors">Analytics</button>
                </li>
              </ul>
            </div>

            {/* Column 3 - Company */}
            <div>
              <h3 className="text-white font-bold mb-4">Société</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <button className="hover:text-white transition-colors">À propos</button>
                </li>
                <li>
                  <button className="hover:text-white transition-colors">Blog</button>
                </li>
                <li>
                  <button className="hover:text-white transition-colors">Carrières</button>
                </li>
                <li>
                  <button className="hover:text-white transition-colors">Presse</button>
                </li>
                <li>
                  <button className="hover:text-white transition-colors">Partenaires</button>
                </li>
              </ul>
            </div>

            {/* Column 4 - Support */}
            <div>
              <h3 className="text-white font-bold mb-4">Support</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <button className="hover:text-white transition-colors">Centre d'aide</button>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>contact@agrodeep.fr</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>+33 1 23 45 67 89</span>
                </li>
                <li>
                  <button className="hover:text-white transition-colors">RGPD</button>
                </li>
                <li>
                  <button className="hover:text-white transition-colors">
                    Conditions d'utilisation
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
            <p>© 2026 AgroDeep. Tous droits réservés.</p>
            <div className="flex gap-6">
              <button className="hover:text-white transition-colors">Mentions légales</button>
              <button className="hover:text-white transition-colors">
                Politique de confidentialité
              </button>
              <button className="hover:text-white transition-colors">Cookies</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
