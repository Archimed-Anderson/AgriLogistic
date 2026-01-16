import { useState, useEffect, useRef } from "react";
import {
  Play,
  ArrowRight,
  Check,
  ChevronRight,
  X,
  Brain,
  Cpu,
  Sprout,
  FileText,
  Zap,
  Shield,
  DollarSign,
  Link as LinkIcon,
  Mail,
  Phone,
  MapPin,
  Star,
  TrendingUp,
  Users,
  BarChart3,
  Quote,
} from "lucide-react";
import { toast } from "sonner";

interface LandingPageInteractiveProps {
  onNavigate: (route: string) => void;
}

export function LandingPageInteractive({ onNavigate }: LandingPageInteractiveProps) {
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [selectedDemoModule, setSelectedDemoModule] = useState("crop");
  const [email, setEmail] = useState("");
  const [activeSection, setActiveSection] = useState("hero");

  // Smooth scroll to section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setActiveSection(sectionId);
    }
  };

  // Ecosystem modules
  const ecosystemModules = [
    {
      id: "crop",
      icon: Sprout,
      emoji: "🌾",
      title: "Crop Intelligence",
      description: "Surveillance avancée, analyse croissance, détection maladies",
      color: "green",
      route: "/admin/crop-intelligence",
    },
    {
      id: "iot",
      icon: Cpu,
      emoji: "📡",
      title: "IoT Device Hub",
      description: "Gestion centralisée de tous vos capteurs et équipements",
      color: "blue",
      route: "/admin/iot-hub",
    },
    {
      id: "ai",
      icon: Brain,
      emoji: "🤖",
      title: "AI Insights",
      description: "Prédictions, recommandations et optimisation par IA",
      color: "purple",
      route: "/admin/ai-insights",
    },
    {
      id: "reports",
      icon: FileText,
      emoji: "📄",
      title: "Report Engine",
      description: "Rapports automatisés, personnalisables et programmables",
      color: "indigo",
      route: "/admin/reports",
    },
    {
      id: "automation",
      icon: Zap,
      emoji: "⚙️",
      title: "Automation Workflows",
      description: "Workflows intelligents et tâches automatisées",
      color: "teal",
      route: "/admin/automation",
    },
    {
      id: "governance",
      icon: Shield,
      emoji: "🛡️",
      title: "Data Governance",
      description: "Qualité, sécurité et conformité de vos données",
      color: "violet",
      route: "/",
    },
    {
      id: "api",
      icon: LinkIcon,
      emoji: "🔌",
      title: "API Management",
      description: "Intégrez AgroDeep avec vos systèmes existants",
      color: "orange",
      route: "/",
    },
    {
      id: "financial",
      icon: DollarSign,
      emoji: "💰",
      title: "Financial Suite",
      description: "Gestion complète des finances et analyse de rentabilité",
      color: "red",
      route: "/admin/financial",
    },
  ];

  // How it works steps
  const howItWorksSteps = [
    {
      number: 1,
      title: "Connectez vos équipements",
      description: "Intégrez vos capteurs IoT, drones et équipements agricoles en quelques clics",
      emoji: "📡",
    },
    {
      number: 2,
      title: "Collectez et analysez",
      description: "Surveillez en temps réel et analysez vos données avec notre IA avancée",
      emoji: "📊",
    },
    {
      number: 3,
      title: "Recevez des insights actionnables",
      description: "Obtenez des recommandations précises pour optimiser votre exploitation",
      emoji: "💡",
    },
    {
      number: 4,
      title: "Automatisez et maximisez",
      description: "Automatisez vos processus et maximisez votre rentabilité",
      emoji: "🚀",
    },
  ];

  // Demo modules content
  const demoModules = {
    crop: {
      title: "Dashboard Crop Intelligence",
      description: "Surveillez la santé de vos cultures en temps réel",
      features: ["Carte interactive NDVI", "Détection précoce des maladies", "Prédictions de rendement", "Planification irrigation"],
    },
    iot: {
      title: "Gestion des Appareils IoT",
      description: "Contrôlez tous vos capteurs depuis un seul endroit",
      features: ["État réseau en temps réel", "Alertes batterie faible", "Performance tracking", "Configuration à distance"],
    },
    ai: {
      title: "Insights IA en Action",
      description: "L'intelligence artificielle au service de votre ferme",
      features: ["Prédictions météo hyper-locales", "Optimisation multi-objectifs", "Recommandations personnalisées", "ROI calculé automatiquement"],
    },
    reports: {
      title: "Création de Rapports",
      description: "Générez des rapports professionnels automatiquement",
      features: ["Templates prédéfinis", "Planification automatique", "Export multi-formats", "Partage sécurisé"],
    },
    automation: {
      title: "Configuration de Workflows",
      description: "Automatisez vos tâches répétitives",
      features: ["Builder drag & drop", "Déclencheurs intelligents", "Conditions avancées", "Logs détaillés"],
    },
  };

  // Stats
  const stats = [
    { value: "10,000+", label: "Agriculteurs" },
    { value: "500K+", label: "Hectares gérés" },
    { value: "+25%", label: "Rendement moyen" },
    { value: "99.9%", label: "Disponibilité" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <button
              onClick={() => scrollToSection("hero")}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#2563eb]">
                <span className="text-xl font-bold text-white">A</span>
              </div>
              <span className="text-2xl font-bold">AgroDeep</span>
            </button>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-8">
              <button
                onClick={() => scrollToSection("hero")}
                className={`text-sm font-medium hover:text-[#2563eb] transition-colors ${
                  activeSection === "hero" ? "text-[#2563eb]" : ""
                }`}
              >
                Accueil
              </button>
              <button
                onClick={() => scrollToSection("how-it-works")}
                className={`text-sm font-medium hover:text-[#2563eb] transition-colors ${
                  activeSection === "how-it-works" ? "text-[#2563eb]" : ""
                }`}
              >
                Comment ça marche
              </button>
              <button
                onClick={() => scrollToSection("pricing")}
                className={`text-sm font-medium hover:text-[#2563eb] transition-colors ${
                  activeSection === "pricing" ? "text-[#2563eb]" : ""
                }`}
              >
                Tarifs
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className={`text-sm font-medium hover:text-[#2563eb] transition-colors ${
                  activeSection === "contact" ? "text-[#2563eb]" : ""
                }`}
              >
                Contact
              </button>
              <button
                onClick={() => onNavigate("/market")}
                className="text-sm font-medium hover:text-[#2563eb] transition-colors"
              >
                Marketplace
              </button>
              <button
                onClick={() => setShowDemoModal(true)}
                className="px-4 py-2 bg-[#2563eb] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors font-semibold flex items-center gap-2"
              >
                <Play className="h-4 w-4" />
                Voir la démo
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-full text-sm font-semibold">
                <Sprout className="h-4 w-4" />
                Plateforme Agricole Intelligente
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                La révolution de
                <span className="block text-[#2563eb]">l'agriculture digitale</span>
              </h1>

              <p className="text-xl text-muted-foreground">
                Optimisez votre exploitation avec l'IA, l'IoT et l'automatisation.
                Une plateforme tout-en-un pour l'agriculture de précision.
              </p>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => onNavigate("/market")}
                  className="px-8 py-4 bg-[#2563eb] text-white rounded-lg hover:bg-[#1d4ed8] transition-all font-semibold text-lg flex items-center gap-2 shadow-lg hover:shadow-xl"
                >
                  Explorer le Marketplace
                  <ArrowRight className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setShowDemoModal(true)}
                  className="px-8 py-4 border-2 border-[#2563eb] text-[#2563eb] rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all font-semibold text-lg flex items-center gap-2"
                >
                  <Play className="h-5 w-5" />
                  Voir la démo
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t">
                {stats.map((stat, index) => (
                  <div key={index}>
                    <div className="text-3xl font-bold text-[#2563eb]">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 p-1">
                <div className="w-full h-full bg-white dark:bg-gray-900 rounded-2xl flex items-center justify-center">
                  <div className="text-9xl">🌾</div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-white dark:bg-gray-800 rounded-xl shadow-xl p-4 border">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <div>
                    <div className="text-xs text-muted-foreground">Rendement</div>
                    <div className="font-bold text-green-600">+25%</div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white dark:bg-gray-800 rounded-xl shadow-xl p-4 border">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="text-xs text-muted-foreground">Utilisateurs</div>
                    <div className="font-bold">10K+</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ecosystem Section */}
      <section id="ecosystem" className="py-20 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">L'écosystème AgroDeep complet</h2>
            <p className="text-xl text-muted-foreground">
              Découvrez tous nos modules intégrés pour une agriculture intelligente
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ecosystemModules.map((module) => {
              const Icon = module.icon;
              return (
                <div
                  key={module.id}
                  className="group bg-card border rounded-xl p-6 hover:shadow-xl transition-all cursor-pointer hover:-translate-y-1"
                  onClick={() => {
                    if (module.route && module.route !== "/") {
                      onNavigate(module.route);
                    } else {
                      toast.info("Module bientôt disponible");
                    }
                  }}
                >
                  <div className="mb-4">
                    <div className={`w-12 h-12 rounded-lg bg-${module.color}-100 dark:bg-${module.color}-900/20 flex items-center justify-center text-2xl`}>
                      {module.emoji}
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold mb-2">{module.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{module.description}</p>

                  <button className="flex items-center gap-2 text-[#2563eb] font-medium text-sm group-hover:gap-3 transition-all">
                    Découvrir
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Comment ça marche</h2>
            <p className="text-xl text-muted-foreground">
              4 étapes simples pour transformer votre exploitation
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorksSteps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-card border rounded-xl p-6 hover:shadow-lg transition-shadow">
                  <div className="mb-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-3xl">
                      {step.emoji}
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[#2563eb] text-white flex items-center justify-center font-bold">
                      {step.number}
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>

                {index < howItWorksSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600" />
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => setShowDemoModal(true)}
              className="px-8 py-4 bg-[#2563eb] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors font-semibold text-lg inline-flex items-center gap-2"
            >
              Voir la démo interactive
              <Play className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Tarifs transparents</h2>
            <p className="text-xl text-muted-foreground">
              Choisissez le plan adapté à vos besoins
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Starter",
                price: "49€",
                period: "/mois",
                description: "Pour les petites exploitations",
                features: ["5 capteurs IoT", "Dashboard basique", "Rapports mensuels", "Support email"],
              },
              {
                name: "Professional",
                price: "149€",
                period: "/mois",
                description: "Pour les exploitations moyennes",
                features: ["20 capteurs IoT", "IA & Automatisation", "Rapports illimités", "Support prioritaire", "API Access"],
                popular: true,
              },
              {
                name: "Enterprise",
                price: "Sur devis",
                period: "",
                description: "Pour les grandes exploitations",
                features: ["Capteurs illimités", "Tous les modules", "Support dédié 24/7", "Formation sur site", "Intégration personnalisée"],
              },
            ].map((plan, index) => (
              <div
                key={index}
                className={`bg-card border-2 rounded-xl p-8 ${
                  plan.popular ? "border-[#2563eb] shadow-xl scale-105" : ""
                } hover:shadow-lg transition-all`}
              >
                {plan.popular && (
                  <div className="inline-flex items-center gap-1 px-3 py-1 bg-[#2563eb] text-white rounded-full text-xs font-bold mb-4">
                    <Star className="h-3 w-3" />
                    Populaire
                  </div>
                )}

                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-muted-foreground mb-6">{plan.description}</p>

                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => onNavigate("/register")}
                  className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                    plan.popular
                      ? "bg-[#2563eb] text-white hover:bg-[#1d4ed8]"
                      : "border-2 border-[#2563eb] text-[#2563eb] hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  }`}
                >
                  Commencer
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-4xl font-bold mb-4">Contactez-nous</h2>
              <p className="text-xl text-muted-foreground mb-8">
                Notre équipe est là pour répondre à vos questions
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                    <Mail className="h-6 w-6 text-[#2563eb]" />
                  </div>
                  <div>
                    <div className="font-semibold mb-1">Email</div>
                    <a href="mailto:contact@agrodeep.com" className="text-muted-foreground hover:text-[#2563eb]">
                      contact@agrodeep.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                    <Phone className="h-6 w-6 text-[#2563eb]" />
                  </div>
                  <div>
                    <div className="font-semibold mb-1">Téléphone</div>
                    <a href="tel:+33123456789" className="text-muted-foreground hover:text-[#2563eb]">
                      +33 1 23 45 67 89
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                    <MapPin className="h-6 w-6 text-[#2563eb]" />
                  </div>
                  <div>
                    <div className="font-semibold mb-1">Adresse</div>
                    <p className="text-muted-foreground">
                      123 Rue de l'Agriculture<br />
                      75001 Paris, France
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card border rounded-xl p-8">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  toast.success("Message envoyé ! Nous vous recontacterons bientôt.");
                }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium mb-2">Nom complet</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                    placeholder="Jean Dupont"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    required
                    className="w-full px-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                    placeholder="jean@exemple.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Message</label>
                  <textarea
                    required
                    rows={4}
                    className="w-full px-4 py-3 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                    placeholder="Votre message..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-[#2563eb] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors font-semibold"
                >
                  Envoyer le message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Modal */}
      {showDemoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-card border rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-2xl font-bold">Démonstration Interactive AgroDeep</h2>
                <p className="text-muted-foreground">Explorez nos modules en action</p>
              </div>
              <button
                onClick={() => setShowDemoModal(false)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="flex-1 flex overflow-hidden">
              {/* Sidebar */}
              <div className="w-64 border-r p-4 overflow-y-auto">
                <div className="space-y-2">
                  {Object.entries(demoModules).map(([key, module]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedDemoModule(key)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                        selectedDemoModule === key
                          ? "bg-[#2563eb] text-white"
                          : "hover:bg-muted"
                      }`}
                    >
                      <div className="font-semibold text-sm">{module.title}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 p-8 overflow-y-auto">
                {(() => {
                  const module = demoModules[selectedDemoModule as keyof typeof demoModules];
                  return (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-2xl font-bold mb-2">{module.title}</h3>
                        <p className="text-muted-foreground">{module.description}</p>
                      </div>

                      <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-6xl">
                        🖥️
                      </div>

                      <div>
                        <h4 className="font-semibold mb-4">Fonctionnalités principales :</h4>
                        <ul className="space-y-3">
                          {module.features.map((feature, idx) => (
                            <li key={idx} className="flex items-center gap-3">
                              <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <button
                        onClick={() => {
                          setShowDemoModal(false);
                          onNavigate("/register");
                        }}
                        className="w-full px-6 py-3 bg-[#2563eb] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors font-semibold"
                      >
                        Commencer l'essai gratuit
                      </button>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-muted/30 border-t py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#2563eb]">
                  <span className="text-xl font-bold text-white">A</span>
                </div>
                <span className="text-xl font-bold">AgroDeep</span>
              </div>
              <p className="text-sm text-muted-foreground">
                La plateforme complète pour l'agriculture intelligente
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Produits</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><button onClick={() => onNavigate("/admin/crop-intelligence")} className="hover:text-[#2563eb]">Crop Intelligence</button></li>
                <li><button onClick={() => onNavigate("/admin/iot-hub")} className="hover:text-[#2563eb]">IoT Device Hub</button></li>
                <li><button onClick={() => onNavigate("/admin/ai-insights")} className="hover:text-[#2563eb]">AI Insights</button></li>
                <li><button onClick={() => onNavigate("/admin/automation")} className="hover:text-[#2563eb]">Automation</button></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Entreprise</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><button onClick={() => scrollToSection("how-it-works")} className="hover:text-[#2563eb]">Comment ça marche</button></li>
                <li><button onClick={() => scrollToSection("pricing")} className="hover:text-[#2563eb]">Tarifs</button></li>
                <li><button onClick={() => onNavigate("/blog")} className="hover:text-[#2563eb]">Blog</button></li>
                <li><button onClick={() => scrollToSection("contact")} className="hover:text-[#2563eb]">Contact</button></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Ressources</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><button onClick={() => onNavigate("/academy")} className="hover:text-[#2563eb]">Académie</button></li>
                <li><button className="hover:text-[#2563eb]">Documentation API</button></li>
                <li><button className="hover:text-[#2563eb]">Support</button></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>© 2025 AgroDeep. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
