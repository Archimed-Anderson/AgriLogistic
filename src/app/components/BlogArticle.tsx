import { useState } from "react";
import {
  ArrowLeft,
  Clock,
  Eye,
  MessageSquare,
  Heart,
  Bookmark,
  Share2,
  ChevronUp,
  Send,
  ThumbsUp,
  Flag,
  User,
  Award,
  Facebook,
  Twitter,
  Linkedin,
  Link2,
  Printer,
  Download,
  Sun,
  Moon,
  BookOpen,
  AlertCircle,
  Lightbulb,
  CheckCircle,
  TrendingUp,
  FileText,
} from "lucide-react";
import { toast } from "sonner";

export function BlogArticle({ onNavigate }: { onNavigate: (route: string) => void }) {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [readingMode, setReadingMode] = useState<"light" | "dark" | "sepia">("light");

  // Article data
  const article = {
    id: "1",
    title: "Comment réduire sa consommation d'eau de 30% avec l'IA",
    excerpt:
      "Découvrez comment les technologies d'intelligence artificielle révolutionnent la gestion de l'eau dans l'agriculture moderne et permettent des économies significatives.",
    author: {
      name: "Marie Dubois",
      avatar: "MD",
      role: "Experte en Agriculture de Précision",
      bio: "Ingénieure agronome spécialisée en agriculture de précision avec 15 ans d'expérience. Fondatrice du blog AgroTech Innovations.",
      articles: 42,
      followers: 3240,
    },
    category: "Technologies Agricoles",
    categoryColor: "blue",
    date: "15 Janvier 2026",
    readTime: 8,
    views: 3240,
    comments: 47,
    likes: 189,
    image: "featured",
  };

  // Table of contents
  const tableOfContents = [
    { id: "intro", title: "Introduction", level: 1 },
    { id: "challenges", title: "Les défis de la gestion de l'eau", level: 1 },
    { id: "ai-solution", title: "L'IA comme solution", level: 1 },
    { id: "sensors", title: "Capteurs et données", level: 2 },
    { id: "algorithms", title: "Algorithmes prédictifs", level: 2 },
    { id: "results", title: "Résultats concrets", level: 1 },
    { id: "implementation", title: "Mise en œuvre pratique", level: 1 },
    { id: "conclusion", title: "Conclusion", level: 1 },
  ];

  // Comments
  const comments = [
    {
      id: "1",
      author: { name: "Jean Dupont", avatar: "JD", badge: "Expert" },
      text: "Excellent article ! Nous avons implémenté un système similaire et économisé 28% sur notre consommation d'eau. Les résultats sont impressionnants.",
      date: "Il y a 2 heures",
      likes: 24,
      replies: 3,
    },
    {
      id: "2",
      author: { name: "Sophie Martin", avatar: "SM", badge: "Pro" },
      text: "Très intéressant. Auriez-vous des recommandations spécifiques pour les cultures maraîchères ?",
      date: "Il y a 5 heures",
      likes: 12,
      replies: 1,
    },
    {
      id: "3",
      author: { name: "Pierre Laurent", avatar: "PL", badge: null },
      text: "Merci pour cet article détaillé. Je vais tester ces recommandations sur ma parcelle test.",
      date: "Il y a 1 jour",
      likes: 8,
      replies: 0,
    },
  ];

  // Related articles
  const relatedArticles = [
    {
      id: "2",
      title: "Optimiser l'irrigation avec les capteurs IoT",
      category: "Technologies",
      readTime: 6,
      image: "🌊",
    },
    {
      id: "3",
      title: "ROI des systèmes d'irrigation intelligents",
      category: "Business",
      readTime: 10,
      image: "💰",
    },
    {
      id: "4",
      title: "Guide : Choisir ses capteurs d'humidité",
      category: "Guides",
      readTime: 12,
      image: "📘",
    },
  ];

  const handleLike = () => {
    setIsLiked(!isLiked);
    toast.success(isLiked ? "Like retiré" : "Article liké");
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast.success(isBookmarked ? "Signet retiré" : "Article enregistré");
  };

  const handleShare = (platform: string) => {
    toast.success(`Partage sur ${platform}`);
    setShowShareMenu(false);
  };

  const handleComment = () => {
    if (commentText.trim()) {
      toast.success("Commentaire publié");
      setCommentText("");
    }
  };

  const getReadingModeStyles = () => {
    switch (readingMode) {
      case "dark":
        return "bg-gray-900 text-gray-100";
      case "sepia":
        return "bg-[#f4ecd8] text-[#5b4636]";
      default:
        return "bg-white text-gray-900";
    }
  };

  return (
    <div className={`min-h-screen ${getReadingModeStyles()} transition-colors`}>
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-muted z-50">
        <div
          className="h-full bg-[#2ECC71] transition-all"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Floating Action Bar */}
      <div className="fixed right-8 top-1/2 -translate-y-1/2 bg-card border rounded-xl shadow-lg p-3 space-y-3 z-40">
        <button
          onClick={handleLike}
          className={`p-3 rounded-lg transition-all ${
            isLiked ? "bg-red-100 text-red-600" : "hover:bg-muted"
          }`}
          title="Like"
        >
          <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
        </button>
        <button
          onClick={handleBookmark}
          className={`p-3 rounded-lg transition-all ${
            isBookmarked ? "bg-blue-100 text-blue-600" : "hover:bg-muted"
          }`}
          title="Bookmark"
        >
          <Bookmark className={`h-5 w-5 ${isBookmarked ? "fill-current" : ""}`} />
        </button>
        <div className="relative">
          <button
            onClick={() => setShowShareMenu(!showShareMenu)}
            className="p-3 rounded-lg hover:bg-muted transition-all"
            title="Partager"
          >
            <Share2 className="h-5 w-5" />
          </button>
          {showShareMenu && (
            <div className="absolute right-full mr-3 top-0 bg-card border rounded-lg shadow-lg p-2 space-y-1 w-48">
              <button
                onClick={() => handleShare("Facebook")}
                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-muted rounded-lg text-sm"
              >
                <Facebook className="h-4 w-4 text-blue-600" />
                Facebook
              </button>
              <button
                onClick={() => handleShare("Twitter")}
                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-muted rounded-lg text-sm"
              >
                <Twitter className="h-4 w-4 text-blue-400" />
                Twitter
              </button>
              <button
                onClick={() => handleShare("LinkedIn")}
                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-muted rounded-lg text-sm"
              >
                <Linkedin className="h-4 w-4 text-blue-700" />
                LinkedIn
              </button>
              <button
                onClick={() => handleShare("Lien")}
                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-muted rounded-lg text-sm"
              >
                <Link2 className="h-4 w-4" />
                Copier le lien
              </button>
            </div>
          )}
        </div>
        <button
          onClick={() => window.print()}
          className="p-3 rounded-lg hover:bg-muted transition-all"
          title="Imprimer"
        >
          <Printer className="h-5 w-5" />
        </button>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="p-3 rounded-lg hover:bg-muted transition-all"
          title="Haut de page"
        >
          <ChevronUp className="h-5 w-5" />
        </button>

        <div className="border-t pt-3">
          <div className="flex flex-col gap-2">
            <button
              onClick={() => setReadingMode("light")}
              className={`p-2 rounded ${
                readingMode === "light" ? "bg-yellow-100" : "hover:bg-muted"
              }`}
              title="Mode clair"
            >
              <Sun className="h-4 w-4" />
            </button>
            <button
              onClick={() => setReadingMode("dark")}
              className={`p-2 rounded ${
                readingMode === "dark" ? "bg-gray-700 text-white" : "hover:bg-muted"
              }`}
              title="Mode sombre"
            >
              <Moon className="h-4 w-4" />
            </button>
            <button
              onClick={() => setReadingMode("sepia")}
              className={`p-2 rounded ${
                readingMode === "sepia" ? "bg-[#f4ecd8]" : "hover:bg-muted"
              }`}
              title="Mode sepia"
            >
              <BookOpen className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="max-w-4xl mx-auto px-6 pt-8">
        <button
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          onClick={() => onNavigate("/blog")}
        >
          <ArrowLeft className="h-4 w-4" />
          Retour au blog
        </button>
      </div>

      {/* Article Header */}
      <article className="max-w-4xl mx-auto px-6 pb-12">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-full text-sm font-medium">
              {article.category}
            </span>
            <span className="text-muted-foreground">{article.date}</span>
          </div>

          <h1 className="text-5xl font-bold mb-6">{article.title}</h1>

          <p className="text-xl text-muted-foreground mb-6">{article.excerpt}</p>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 bg-gradient-to-br from-[#2ECC71] to-[#27AE60] rounded-full flex items-center justify-center text-white font-semibold">
                {article.author.avatar}
              </div>
              <div>
                <div className="font-medium text-foreground">{article.author.name}</div>
                <div className="text-xs">{article.author.role}</div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{article.readTime} min de lecture</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>{article.views.toLocaleString()} vues</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              <span>{article.comments} commentaires</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="h-4 w-4" />
              <span>{article.likes} likes</span>
            </div>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative h-96 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-12 overflow-hidden group cursor-pointer">
          <div className="absolute inset-0 flex items-center justify-center text-white">
            <div className="text-center">
              <div className="text-8xl mb-4">💧</div>
              <div className="text-lg opacity-75">Image principale de l'article</div>
            </div>
          </div>
          <div className="absolute bottom-4 left-4 text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity">
            Crédit photo: AgroLogistic Research • Cliquez pour agrandir
          </div>
        </div>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none mb-12">
          {/* Introduction Highlighted */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600 p-6 rounded-r-lg mb-8">
            <p className="text-lg leading-relaxed">
              <strong>Introduction:</strong> L'agriculture fait face à un défi majeur : produire
              plus avec moins d'eau. Dans un contexte de changement climatique et de raréfaction
              des ressources en eau, l'intelligence artificielle émerge comme une solution
              prometteuse pour optimiser la gestion de l'irrigation.
            </p>
          </div>

          {/* Main Content */}
          <h2 id="challenges" className="text-3xl font-bold mt-12 mb-4">
            Les défis de la gestion de l'eau
          </h2>
          <p className="mb-6">
            L'irrigation représente en moyenne 70% de la consommation d'eau mondiale. Dans
            l'agriculture traditionnelle, les décisions d'irrigation sont souvent basées sur
            l'intuition ou des calendriers fixes, ce qui entraîne :
          </p>
          <ul className="mb-6 space-y-2">
            <li>Un gaspillage important d'eau (jusqu'à 40% de sur-irrigation)</li>
            <li>Des coûts énergétiques élevés pour le pompage</li>
            <li>Un lessivage des nutriments du sol</li>
            <li>Des rendements sous-optimaux par stress hydrique ou excès d'eau</li>
          </ul>

          {/* Conseil AgroLogistic Block */}
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6 my-8">
            <div className="flex items-start gap-3">
              <Lightbulb className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-2">
                  💡 Conseil AgroLogistic
                </h3>
                <p className="text-green-800 dark:text-green-200">
                  Commencez par installer des capteurs d'humidité sur une parcelle test avant de
                  déployer la solution sur toute votre exploitation. Cela vous permettra de
                  calibrer le système et de mesurer les gains réels sur vos cultures spécifiques.
                </p>
              </div>
            </div>
          </div>

          <h2 id="ai-solution" className="text-3xl font-bold mt-12 mb-4">
            L'IA comme solution
          </h2>
          <p className="mb-6">
            Les systèmes d'irrigation pilotés par IA analysent en temps réel des dizaines de
            paramètres pour déterminer le moment optimal et la quantité exacte d'eau nécessaire :
          </p>

          <h3 id="sensors" className="text-2xl font-bold mt-8 mb-4">
            Capteurs et données
          </h3>
          <p className="mb-6">
            Le système collecte des données provenant de multiples sources :
          </p>
          <ul className="mb-6 space-y-2">
            <li>
              <strong>Capteurs sol :</strong> Humidité à différentes profondeurs, température,
              conductivité électrique
            </li>
            <li>
              <strong>Imagerie satellite :</strong> Indice NDVI pour évaluer la santé végétale
            </li>
            <li>
              <strong>Stations météo :</strong> Précipitations, température air, évapotranspiration
            </li>
            <li>
              <strong>Prévisions météo :</strong> Anticipation des pluies à 7-14 jours
            </li>
          </ul>

          {/* Attention Block */}
          <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-6 my-8">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-6 w-6 text-orange-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-orange-900 dark:text-orange-100 mb-2">
                  ⚠️ Attention
                </h3>
                <p className="text-orange-800 dark:text-orange-200">
                  La qualité des prédictions dépend directement de la qualité et de la densité des
                  capteurs installés. Un minimum de 3-4 capteurs par parcelle est recommandé pour
                  obtenir des résultats fiables.
                </p>
              </div>
            </div>
          </div>

          <h3 id="algorithms" className="text-2xl font-bold mt-8 mb-4">
            Algorithmes prédictifs
          </h3>
          <p className="mb-6">
            L'IA utilise des algorithmes d'apprentissage automatique (Machine Learning) pour :
          </p>
          <ol className="mb-6 space-y-2">
            <li>Prédire les besoins en eau des cultures selon leur stade phénologique</li>
            <li>Anticiper les périodes de stress hydrique avant qu'elles ne surviennent</li>
            <li>Optimiser le calendrier d'irrigation en fonction de la météo prévue</li>
            <li>Adapter les recommandations selon les caractéristiques spécifiques de chaque sol</li>
          </ol>

          <h2 id="results" className="text-3xl font-bold mt-12 mb-4">
            Résultats concrets
          </h2>
          <p className="mb-6">Les exploitations ayant adopté ces systèmes rapportent :</p>

          {/* Results Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
              <div className="text-4xl font-bold mb-2">-30%</div>
              <div className="text-sm opacity-90">Consommation d'eau</div>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white">
              <div className="text-4xl font-bold mb-2">+15%</div>
              <div className="text-sm opacity-90">Rendement moyen</div>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-pink-600 rounded-xl p-6 text-white">
              <div className="text-4xl font-bold mb-2">18 mois</div>
              <div className="text-sm opacity-90">Retour sur investissement</div>
            </div>
          </div>

          {/* Success Story */}
          <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-6 my-8">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-purple-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-2">
                  ✅ Success Story
                </h3>
                <p className="text-purple-800 dark:text-purple-200 mb-3">
                  <strong>La Ferme des Trois Vallées</strong> (142 ha de maïs) a réduit sa
                  consommation d'eau de 32% tout en augmentant son rendement de 12% la première
                  année d'utilisation. Économie totale : 28,000€/an.
                </p>
                <button className="text-sm text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1">
                  Lire le témoignage complet
                  <ChevronUp className="h-3 w-3 rotate-90" />
                </button>
              </div>
            </div>
          </div>

          <h2 id="implementation" className="text-3xl font-bold mt-12 mb-4">
            Mise en œuvre pratique
          </h2>
          <p className="mb-6">Pour implémenter avec succès un système d'irrigation par IA :</p>

          <h3 className="text-xl font-bold mt-6 mb-3">Étape 1 : Audit initial</h3>
          <ul className="mb-6 space-y-2">
            <li>Cartographie précise des parcelles et types de sol</li>
            <li>Analyse des systèmes d'irrigation existants</li>
            <li>Évaluation des besoins en capteurs</li>
          </ul>

          <h3 className="text-xl font-bold mt-6 mb-3">Étape 2 : Installation</h3>
          <ul className="mb-6 space-y-2">
            <li>Déploiement des capteurs (3-5 par parcelle selon taille)</li>
            <li>Installation station météo locale</li>
            <li>Configuration de la plateforme logicielle</li>
          </ul>

          <h3 className="text-xl font-bold mt-6 mb-3">Étape 3 : Calibration</h3>
          <ul className="mb-6 space-y-2">
            <li>Période d'apprentissage de 2-4 semaines</li>
            <li>Ajustements selon retours terrain</li>
            <li>Formation de l'équipe</li>
          </ul>

          <h2 id="conclusion" className="text-3xl font-bold mt-12 mb-4">
            Conclusion
          </h2>
          <p className="mb-6">
            L'irrigation pilotée par IA n'est plus une technologie futuriste mais une réalité
            accessible qui transforme déjà des milliers d'exploitations. Avec des économies d'eau
            pouvant atteindre 40%, des gains de rendement de 15% et un ROI sous 2 ans, c'est un
            investissement qui s'impose comme incontournable pour l'agriculture de demain.
          </p>
          <p className="mb-6">
            La clé du succès réside dans une approche progressive : commencer par une parcelle test,
            mesurer les résultats, ajuster le système, puis déployer à plus grande échelle. Les
            agriculteurs qui franchiront le pas aujourd'hui seront les mieux positionnés pour faire
            face aux défis climatiques et économiques de demain.
          </p>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-[#2ECC71] to-[#27AE60] rounded-2xl p-8 text-white mb-12">
          <h3 className="text-2xl font-bold mb-3">Prêt à optimiser votre irrigation ?</h3>
          <p className="mb-6 opacity-90">
            Nos experts vous accompagnent dans le déploiement d'une solution d'irrigation
            intelligente adaptée à votre exploitation.
          </p>
          <div className="flex gap-3">
            <button className="px-6 py-3 bg-white text-[#2ECC71] rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Demander une démo
            </button>
            <button className="px-6 py-3 border-2 border-white rounded-lg font-semibold hover:bg-white/10 transition-colors">
              Télécharger le guide complet
            </button>
          </div>
        </div>

        {/* Author Bio Extended */}
        <div className="bg-card border rounded-xl p-8 mb-12">
          <h3 className="text-xl font-semibold mb-6">À propos de l'auteur</h3>
          <div className="flex gap-6">
            <div className="h-24 w-24 bg-gradient-to-br from-[#2ECC71] to-[#27AE60] rounded-full flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
              {article.author.avatar}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h4 className="text-2xl font-bold">{article.author.name}</h4>
                <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 text-sm rounded-full">
                  Expert
                </span>
              </div>
              <p className="text-muted-foreground mb-4">{article.author.role}</p>
              <p className="mb-4">{article.author.bio}</p>
              <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  <span>{article.author.articles} articles</span>
                </div>
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>{article.author.followers.toLocaleString()} abonnés</span>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="px-4 py-2 bg-[#2ECC71] text-white rounded-lg hover:bg-[#27AE60] transition-colors">
                  Suivre
                </button>
                <button className="px-4 py-2 border rounded-lg hover:bg-muted transition-colors">
                  Voir tous les articles
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Related Articles */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold mb-6">À lire ensuite</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedArticles.map((related) => (
              <div
                key={related.id}
                className="bg-card border rounded-xl overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
              >
                <div className="h-32 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center text-4xl">
                  {related.image}
                </div>
                <div className="p-4">
                  <span className="text-xs text-muted-foreground">{related.category}</span>
                  <h4 className="font-semibold mt-1 mb-2 group-hover:text-[#2ECC71] transition-colors">
                    {related.title}
                  </h4>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{related.readTime} min</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Comments Section */}
        <div id="comments" className="border-t pt-12">
          <h3 className="text-2xl font-bold mb-2">
            Commentaires ({comments.length})
          </h3>
          <p className="text-muted-foreground mb-6">
            Partagez votre expérience et posez vos questions à la communauté
          </p>

          {/* Comment Form */}
          <div className="bg-card border rounded-xl p-6 mb-8">
            <div className="flex gap-4">
              <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                U
              </div>
              <div className="flex-1">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Ajouter un commentaire..."
                  className="w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#2ECC71] bg-background"
                  rows={4}
                />
                <div className="flex items-center justify-between mt-3">
                  <div className="text-sm text-muted-foreground">
                    Format Markdown supporté
                  </div>
                  <button
                    onClick={handleComment}
                    disabled={!commentText.trim()}
                    className="px-6 py-2 bg-[#2ECC71] text-white rounded-lg hover:bg-[#27AE60] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Send className="h-4 w-4" />
                    Publier
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-4">
                <div className="h-10 w-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                  {comment.author.avatar}
                </div>
                <div className="flex-1">
                  <div className="bg-muted rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold">{comment.author.name}</span>
                      {comment.author.badge && (
                        <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-xs rounded">
                          {comment.author.badge}
                        </span>
                      )}
                      <span className="text-sm text-muted-foreground">{comment.date}</span>
                    </div>
                    <p className="text-sm">{comment.text}</p>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-sm">
                    <button className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
                      <ThumbsUp className="h-4 w-4" />
                      <span>{comment.likes}</span>
                    </button>
                    <button className="text-muted-foreground hover:text-foreground transition-colors">
                      Répondre
                    </button>
                    {comment.replies > 0 && (
                      <button className="text-[#2ECC71] hover:underline">
                        Voir {comment.replies} réponse{comment.replies > 1 ? "s" : ""}
                      </button>
                    )}
                    <button className="ml-auto text-muted-foreground hover:text-foreground transition-colors">
                      <Flag className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-8 px-6 py-3 border-2 border-dashed rounded-lg hover:bg-muted transition-colors font-medium">
            Charger plus de commentaires
          </button>
        </div>

        {/* Newsletter CTA */}
        <div className="mt-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-3">Cet article vous a plu ?</h3>
          <p className="mb-6 opacity-90">
            Recevez nos prochains articles directement dans votre boîte mail
          </p>
          <div className="flex gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Votre email"
              className="flex-1 px-4 py-3 rounded-lg bg-white/20 backdrop-blur-sm placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="px-6 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              S'abonner
            </button>
          </div>
          <p className="text-xs opacity-75 mt-3">
            Pas de spam, uniquement du contenu utile • Désabonnement en 1 clic
          </p>
        </div>
      </article>

      {/* Table of Contents - Sticky Sidebar (hidden on mobile) */}
      <aside className="hidden xl:block fixed left-8 top-32 w-64">
        <div className="bg-card border rounded-xl p-6">
          <h4 className="font-semibold mb-4 flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-[#2ECC71]" />
            Sommaire
          </h4>
          <nav className="space-y-2">
            {tableOfContents.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`block text-sm hover:text-[#2ECC71] transition-colors ${
                  item.level === 2 ? "ml-4" : ""
                } ${item.level === 1 ? "font-medium" : ""}`}
              >
                {item.title}
              </a>
            ))}
          </nav>
        </div>
      </aside>
    </div>
  );
}
