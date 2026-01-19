import { useState } from "react";
import {
  Search,
  TrendingUp,
  Clock,
  Eye,
  MessageSquare,
  Heart,
  Bookmark,
  Share2,
  Calendar,
  User,
  ChevronRight,
  Filter,
  Award,
  Zap,
  BookOpen,
  Video,
  FileText,
  Download,
  Star,
  Users,
} from "lucide-react";
import { toast } from "sonner";

export function BlogHome({ onNavigate }: { onNavigate: (route: string) => void }) {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");

  // Featured article
  const featuredArticle = {
    id: "1",
    title: "Comment réduire sa consommation d'eau de 30% avec l'IA",
    excerpt: "Découvrez comment les technologies d'intelligence artificielle révolutionnent la gestion de l'eau dans l'agriculture moderne et permettent des économies significatives.",
    author: {
      name: "Marie Dubois",
      avatar: "MD",
      role: "Experte en Agriculture de Précision",
    },
    category: "Technologies Agricoles",
    categoryColor: "blue",
    image: "featured",
    date: "15 Janvier 2026",
    readTime: 8,
    views: 3240,
    comments: 47,
    likes: 189,
    badge: "À ne pas manquer",
  };

  // Secondary featured articles
  const secondaryFeatured = [
    {
      id: "2",
      title: "Témoignage : La transformation numérique de la Ferme des 3 Vallées",
      excerpt: "Comment une exploitation familiale a multiplié son rendement par 1.5 grâce aux outils connectés.",
      author: { name: "Jean Dupont", avatar: "JD" },
      category: "Témoignages",
      categoryColor: "green",
      date: "12 Janvier 2026",
      readTime: 6,
      views: 2180,
      comments: 32,
    },
    {
      id: "3",
      title: "Guide complet : Choisir ses capteurs IoT en 2026",
      excerpt: "Tous les critères pour faire le bon choix et optimiser votre investissement dans les capteurs connectés.",
      author: { name: "Sophie Martin", avatar: "SM" },
      category: "Guides Pratiques",
      categoryColor: "purple",
      date: "10 Janvier 2026",
      readTime: 12,
      views: 1890,
      comments: 28,
    },
    {
      id: "4",
      title: "Impact du changement climatique sur les cultures céréalières",
      excerpt: "Une analyse approfondie des défis et opportunités pour les agriculteurs face aux évolutions climatiques.",
      author: { name: "Dr. Pierre Laurent", avatar: "PL" },
      category: "Recherche",
      categoryColor: "orange",
      date: "8 Janvier 2026",
      readTime: 15,
      views: 1650,
      comments: 41,
    },
  ];

  // All articles
  const allArticles = [
    {
      id: "5",
      title: "Tutoriel : Installer son système d'irrigation intelligent",
      excerpt: "Un guide pas-à-pas complet avec vidéo pour installer et configurer votre premier système d'irrigation connecté.",
      author: { name: "Marc Legrand", avatar: "ML" },
      category: "Tutoriels",
      categoryColor: "cyan",
      type: "video",
      date: "5 Janvier 2026",
      readTime: 10,
      views: 2340,
      comments: 56,
      likes: 134,
    },
    {
      id: "6",
      title: "Les 5 erreurs à éviter en agriculture de précision",
      excerpt: "Apprenez des erreurs des autres pour optimiser votre transition vers l'agriculture connectée.",
      author: { name: "Claire Rousseau", avatar: "CR" },
      category: "Conseils",
      categoryColor: "red",
      date: "3 Janvier 2026",
      readTime: 7,
      views: 1980,
      comments: 34,
      likes: 98,
    },
    {
      id: "7",
      title: "Optimiser sa fertilisation avec les données satellitaires",
      excerpt: "Comment utiliser l'imagerie satellite pour adapter vos apports en nutriments au plus près des besoins.",
      author: { name: "Thomas Blanc", avatar: "TB" },
      category: "Technologies",
      categoryColor: "blue",
      date: "1 Janvier 2026",
      readTime: 9,
      views: 1560,
      comments: 23,
      likes: 87,
    },
    {
      id: "8",
      title: "ROI de l'agriculture connectée : Étude de cas 2025",
      excerpt: "Analyse complète du retour sur investissement de 50 exploitations ayant adopté les technologies AgroLogistic.",
      author: { name: "Sarah Moreau", avatar: "SM" },
      category: "Business",
      categoryColor: "green",
      type: "pdf",
      date: "28 Décembre 2025",
      readTime: 14,
      views: 2890,
      comments: 67,
      likes: 201,
    },
    {
      id: "9",
      title: "Drones agricoles : Guide d'achat 2026",
      excerpt: "Comparatif complet des meilleurs drones pour l'agriculture avec analyse coût/bénéfice détaillée.",
      author: { name: "Antoine Bernard", avatar: "AB" },
      category: "Guides",
      categoryColor: "purple",
      date: "25 Décembre 2025",
      readTime: 11,
      views: 3120,
      comments: 45,
      likes: 156,
    },
  ];

  // Categories
  const categories = [
    { id: "all", name: "Tous", count: 245, icon: BookOpen, color: "gray" },
    { id: "tutorials", name: "Tutoriels", count: 67, icon: Video, color: "blue" },
    { id: "news", name: "Actualités", count: 89, icon: Zap, color: "orange" },
    { id: "stories", name: "Témoignages", count: 34, icon: Users, color: "green" },
    { id: "guides", name: "Guides", count: 55, icon: BookOpen, color: "purple" },
  ];

  // Contributors
  const topContributors = [
    { name: "Marie Dubois", articles: 42, avatar: "MD", badge: "Expert" },
    { name: "Jean Dupont", articles: 38, avatar: "JD", badge: "Pro" },
    { name: "Sophie Martin", articles: 31, avatar: "SM", badge: "Expert" },
  ];

  const handleLike = (id: string) => {
    toast.success("Article ajouté à vos favoris");
  };

  const handleBookmark = (id: string) => {
    toast.success("Article enregistré");
  };

  const handleShare = (id: string) => {
    toast.success("Lien copié dans le presse-papier");
  };

  const getCategoryColor = (color: string) => {
    const colors: { [key: string]: string } = {
      blue: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
      green: "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
      purple: "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400",
      orange: "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400",
      red: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400",
      cyan: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/20 dark:text-cyan-400",
      gray: "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400",
    };
    return colors[color] || colors.gray;
  };

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-[#2ECC71] to-[#27AE60] rounded-2xl p-12 text-white">
        <div className="max-w-4xl">
          <h1 className="text-5xl font-bold mb-4">Le Blog AgroLogistic</h1>
          <p className="text-xl opacity-90 mb-8">
            Découvrez les dernières innovations, conseils pratiques et success stories
            de l'agriculture connectée
          </p>

          {/* Stats */}
          <div className="flex items-center gap-8 mb-8">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              <span className="font-semibold">245 articles</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <span className="font-semibold">12K agriculteurs abonnés</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              <span className="font-semibold">Top 3 blogs agricoles</span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher des articles, sujets, auteurs..."
              className="w-full pl-12 pr-4 py-4 rounded-lg bg-white/95 backdrop-blur-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
            />
          </div>

          {/* CTA Newsletter */}
          <div className="mt-6 flex items-center gap-4">
            <input
              type="email"
              placeholder="Votre email"
              className="flex-1 max-w-md px-4 py-3 rounded-lg bg-white/90 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="px-6 py-3 bg-white text-[#2ECC71] rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              S'abonner à la newsletter
            </button>
          </div>
        </div>
      </div>

      {/* Featured Article - Full Width */}
      <div className="bg-card border rounded-xl overflow-hidden hover:shadow-lg transition-all cursor-pointer group">
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="relative h-64 lg:h-auto bg-gradient-to-br from-blue-500 to-blue-600">
            <div className="absolute inset-0 flex items-center justify-center text-white">
              <div className="text-center">
                <div className="text-6xl mb-4">📊</div>
                <div className="text-sm opacity-75">Image Featured</div>
              </div>
            </div>
            {featuredArticle.badge && (
              <div className="absolute top-4 left-4 px-3 py-1.5 bg-orange-500 text-white text-sm font-semibold rounded-lg flex items-center gap-1">
                <Award className="h-4 w-4" />
                {featuredArticle.badge}
              </div>
            )}
          </div>

          <div className="p-8 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-4">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(
                  featuredArticle.categoryColor
                )}`}
              >
                {featuredArticle.category}
              </span>
              <span className="text-sm text-muted-foreground">{featuredArticle.date}</span>
            </div>

            <h2 className="text-3xl font-bold mb-4 group-hover:text-[#2ECC71] transition-colors">
              {featuredArticle.title}
            </h2>

            <p className="text-muted-foreground mb-6 text-lg">{featuredArticle.excerpt}</p>

            {/* Author */}
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 bg-gradient-to-br from-[#2ECC71] to-[#27AE60] rounded-full flex items-center justify-center text-white font-semibold">
                {featuredArticle.author.avatar}
              </div>
              <div>
                <div className="font-medium">{featuredArticle.author.name}</div>
                <div className="text-sm text-muted-foreground">{featuredArticle.author.role}</div>
              </div>
            </div>

            {/* Metrics */}
            <div className="flex items-center gap-6 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{featuredArticle.readTime} min</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{featuredArticle.views.toLocaleString()} vues</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                <span>{featuredArticle.comments} commentaires</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="h-4 w-4" />
                <span>{featuredArticle.likes} likes</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button className="flex-1 px-6 py-3 bg-[#2ECC71] text-white rounded-lg font-semibold hover:bg-[#27AE60] transition-colors flex items-center justify-center gap-2">
                Lire l'article
                <ChevronRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleBookmark(featuredArticle.id)}
                className="p-3 border rounded-lg hover:bg-muted transition-colors"
              >
                <Bookmark className="h-5 w-5" />
              </button>
              <button
                onClick={() => handleShare(featuredArticle.id)}
                className="p-3 border rounded-lg hover:bg-muted transition-colors"
              >
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Featured - 3 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {secondaryFeatured.map((article) => (
          <div
            key={article.id}
            className="bg-card border rounded-xl overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
          >
            <div className="relative h-48 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800">
              <div className="absolute inset-0 flex items-center justify-center text-4xl">🌾</div>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(
                    article.categoryColor
                  )}`}
                >
                  {article.category}
                </span>
                <span className="text-xs text-muted-foreground">{article.date}</span>
              </div>

              <h3 className="text-xl font-bold mb-3 group-hover:text-[#2ECC71] transition-colors line-clamp-2">
                {article.title}
              </h3>

              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{article.excerpt}</p>

              {/* Author */}
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                  {article.author.avatar}
                </div>
                <span className="text-sm font-medium">{article.author.name}</span>
              </div>

              {/* Metrics */}
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{article.readTime} min</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  <span>{article.views}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" />
                  <span>{article.comments}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters & Sort */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedFilter(cat.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  selectedFilter === cat.id
                    ? "bg-[#2ECC71] text-white"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                <Icon className="h-4 w-4" />
                {cat.name}
                <span className="text-xs opacity-75">({cat.count})</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Trier par:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-[#2ECC71]"
          >
            <option value="recent">Plus récents</option>
            <option value="popular">Plus populaires</option>
            <option value="commented">Plus commentés</option>
            <option value="liked">Plus aimés</option>
          </select>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Articles Grid - 2 columns */}
        <div className="lg:col-span-2">
          <div className="space-y-6">
            {allArticles.map((article) => (
              <div
                key={article.id}
                className="bg-card border rounded-xl overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
              >
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="relative h-48 md:h-auto bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800">
                    <div className="absolute inset-0 flex items-center justify-center text-4xl">
                      {article.type === "video" ? "🎥" : article.type === "pdf" ? "📄" : "📝"}
                    </div>
                    {article.type && (
                      <div className="absolute top-2 right-2 px-2 py-1 bg-black/70 text-white text-xs rounded flex items-center gap-1">
                        {article.type === "video" ? (
                          <Video className="h-3 w-3" />
                        ) : article.type === "pdf" ? (
                          <Download className="h-3 w-3" />
                        ) : (
                          <FileText className="h-3 w-3" />
                        )}
                        {article.type.toUpperCase()}
                      </div>
                    )}
                  </div>

                  <div className="md:col-span-2 p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(
                          article.categoryColor
                        )}`}
                      >
                        {article.category}
                      </span>
                      <span className="text-xs text-muted-foreground">{article.date}</span>
                    </div>

                    <h3 className="text-2xl font-bold mb-3 group-hover:text-[#2ECC71] transition-colors">
                      {article.title}
                    </h3>

                    <p className="text-muted-foreground mb-4">{article.excerpt}</p>

                    {/* Author & Metrics */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                          {article.author.avatar}
                        </div>
                        <span className="text-sm font-medium">{article.author.name}</span>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{article.readTime} min</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          <span>{article.views}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          <span>{article.comments}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                      <button
                        onClick={() => handleLike(article.id)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-muted transition-colors text-sm"
                      >
                        <Heart className="h-4 w-4" />
                        <span>{article.likes}</span>
                      </button>
                      <button
                        onClick={() => handleBookmark(article.id)}
                        className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                      >
                        <Bookmark className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleShare(article.id)}
                        className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                      >
                        <Share2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          <button className="w-full mt-8 px-6 py-4 border-2 border-dashed rounded-lg hover:bg-muted transition-colors font-medium">
            Charger plus d'articles
          </button>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Top Contributors */}
          <div className="bg-card border rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Award className="h-5 w-5 text-[#2ECC71]" />
              Contributeurs du mois
            </h3>

            <div className="space-y-4">
              {topContributors.map((contributor, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="h-12 w-12 bg-gradient-to-br from-orange-500 to-pink-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {contributor.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{contributor.name}</span>
                      <span className="px-2 py-0.5 bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 text-xs rounded">
                        {contributor.badge}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {contributor.articles} articles
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Newsletter Widget */}
          <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-6 text-white">
            <h3 className="text-lg font-semibold mb-3">📬 Newsletter Hebdo</h3>
            <p className="text-sm opacity-90 mb-4">
              Recevez chaque semaine les meilleurs articles et actualités agricoles
            </p>
            <input
              type="email"
              placeholder="Votre email"
              className="w-full px-4 py-2 rounded-lg bg-white/20 backdrop-blur-sm placeholder:text-white/70 mb-3 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="w-full px-4 py-2 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              S'abonner gratuitement
            </button>
            <p className="text-xs opacity-75 mt-2 text-center">
              Pas de spam, désabonnement en 1 clic
            </p>
          </div>

          {/* Popular Tags */}
          <div className="bg-card border rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">🏷️ Tags Populaires</h3>

            <div className="flex flex-wrap gap-2">
              {[
                "IoT",
                "IA",
                "Irrigation",
                "Rendement",
                "Capteurs",
                "Drone",
                "Satellite",
                "ROI",
                "Durable",
                "Innovation",
                "Climat",
                "Fertilisation",
              ].map((tag) => (
                <button
                  key={tag}
                  className="px-3 py-1.5 bg-muted hover:bg-[#2ECC71] hover:text-white rounded-lg text-sm transition-colors"
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-card border rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-[#2ECC71]" />
              À venir
            </h3>

            <div className="space-y-4">
              {[
                {
                  title: "Webinar : IA en Agriculture",
                  date: "20 Jan 2026",
                  time: "14h00",
                },
                {
                  title: "Article : Nouveaux capteurs 2026",
                  date: "22 Jan 2026",
                  time: "10h00",
                },
                {
                  title: "Interview : Expert climat",
                  date: "25 Jan 2026",
                  time: "16h00",
                },
              ].map((event, index) => (
                <div key={index} className="flex gap-3">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex flex-col items-center justify-center">
                    <div className="text-xs text-blue-600 dark:text-blue-400 font-semibold">
                      {event.date.split(" ")[0]}
                    </div>
                    <div className="text-xs text-blue-600 dark:text-blue-400">
                      {event.date.split(" ")[1]}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{event.title}</div>
                    <div className="text-xs text-muted-foreground">{event.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Poll */}
          <div className="bg-card border rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">📊 Sondage de la semaine</h3>
            <p className="text-sm mb-4">
              Quelle technologie vous intéresse le plus en 2026 ?
            </p>

            <div className="space-y-2">
              {[
                { option: "Intelligence Artificielle", votes: 45 },
                { option: "Drones agricoles", votes: 32 },
                { option: "Capteurs IoT", votes: 18 },
                { option: "Imagerie satellite", votes: 5 },
              ].map((item, index) => (
                <button
                  key={index}
                  className="w-full text-left p-3 border rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="flex justify-between text-sm mb-1">
                    <span>{item.option}</span>
                    <span className="font-medium">{item.votes}%</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#2ECC71]"
                      style={{ width: `${item.votes}%` }}
                    />
                  </div>
                </button>
              ))}
            </div>

            <p className="text-xs text-muted-foreground mt-3 text-center">
              243 votes • Clôture dans 3 jours
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
