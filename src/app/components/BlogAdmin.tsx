import { useState } from 'react';
import { toast } from 'sonner';
import {
  FileText,
  CheckCircle,
  Clock,
  Eye,
  TrendingUp,
  MessageSquare,
  AlertCircle,
  Heart,
  BarChart3,
  Users,
  TrendingDown,
  X,
  Search,
  Filter,
  Plus,
  Edit3,
  Copy,
  Trash2,
  Save,
  Bold,
  Italic,
  Heading,
  List,
  Quote,
  ImageIcon,
  Video,
  Link2,
  Code,
  Monitor,
  Tablet,
  Smartphone,
  Upload,
} from 'lucide-react';

export function BlogAdmin({ onNavigate }: { onNavigate: (route: string) => void }) {
  const [view, setView] = useState<'dashboard' | 'articles' | 'editor' | 'comments' | 'analytics'>(
    'dashboard'
  );
  const [selectedArticles, setSelectedArticles] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editorContent, setEditorContent] = useState('');
  const [editorPreview, setEditorPreview] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [showMetaPanel, setShowMetaPanel] = useState(true);

  // Dashboard stats
  const stats = {
    totalArticles: 245,
    published: 198,
    drafts: 32,
    scheduled: 15,
    totalViews: 124580,
    totalComments: 1847,
    totalLikes: 5643,
    avgEngagement: 4.2,
  };

  // Recent articles
  const articles = [
    {
      id: '1',
      title: "Comment réduire sa consommation d'eau de 30% avec l'IA",
      status: 'published',
      author: 'Marie Dubois',
      category: 'Technologies',
      date: '2026-01-15',
      views: 3240,
      comments: 47,
      likes: 189,
      thumbnail: '💧',
    },
    {
      id: '2',
      title: 'Témoignage : La transformation numérique de la Ferme des 3 Vallées',
      status: 'published',
      author: 'Jean Dupont',
      category: 'Témoignages',
      date: '2026-01-12',
      views: 2180,
      comments: 32,
      likes: 124,
      thumbnail: '🌾',
    },
    {
      id: '3',
      title: 'Guide complet : Choisir ses capteurs IoT en 2026',
      status: 'draft',
      author: 'Sophie Martin',
      category: 'Guides',
      date: '2026-01-10',
      views: 0,
      comments: 0,
      likes: 0,
      thumbnail: '📡',
    },
    {
      id: '4',
      title: 'Impact du changement climatique sur les cultures céréalières',
      status: 'scheduled',
      author: 'Dr. Pierre Laurent',
      category: 'Recherche',
      date: '2026-01-20',
      views: 0,
      comments: 0,
      likes: 0,
      thumbnail: '🌡️',
    },
    {
      id: '5',
      title: "Tutoriel : Installer son système d'irrigation intelligent",
      status: 'review',
      author: 'Marc Legrand',
      category: 'Tutoriels',
      date: '2026-01-08',
      views: 0,
      comments: 3,
      likes: 8,
      thumbnail: '🎥',
    },
  ];

  // Comments pending moderation
  const pendingComments = [
    {
      id: '1',
      author: 'Jean Martin',
      article: "Comment réduire sa consommation d'eau...",
      text: "Excellent article ! J'ai une question sur les capteurs recommandés...",
      date: 'Il y a 2h',
      status: 'pending',
    },
    {
      id: '2',
      author: 'Sophie Durand',
      article: 'Témoignage : La transformation numérique...',
      text: 'Très inspirant ! Nous envisageons de faire de même sur notre exploitation.',
      date: 'Il y a 5h',
      status: 'pending',
    },
  ];

  // Top performing articles
  const topArticles = [
    { title: 'IA en Agriculture', views: 12450, trend: 23 },
    { title: 'Drones Agricoles 2026', views: 9830, trend: -5 },
    { title: 'ROI Agriculture Connectée', views: 8640, trend: 12 },
  ];

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      published: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400',
      draft: 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400',
      scheduled: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
      review: 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400',
    };
    return colors[status] || colors.draft;
  };

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      published: 'Publié',
      draft: 'Brouillon',
      scheduled: 'Planifié',
      review: 'En révision',
    };
    return labels[status] || status;
  };

  const handleBulkAction = (action: string) => {
    toast.success(`Action "${action}" appliquée à ${selectedArticles.length} article(s)`);
    setSelectedArticles([]);
  };

  const handleDeleteArticle = (id: string) => {
    toast.success('Article supprimé');
  };

  const handleApproveComment = (id: string) => {
    toast.success('Commentaire approuvé');
  };

  const handleRejectComment = (id: string) => {
    toast.success('Commentaire supprimé');
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{stats.totalArticles}</div>
              <div className="text-sm text-muted-foreground">Total articles</div>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1 text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span>{stats.published} publiés</span>
            </div>
            <div className="flex items-center gap-1 text-gray-600">
              <Clock className="h-4 w-4" />
              <span>{stats.drafts} brouillons</span>
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <Eye className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{stats.totalViews.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Vues totales</div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm text-green-600">
            <TrendingUp className="h-4 w-4" />
            <span>+12.5% vs mois dernier</span>
          </div>
        </div>

        <div className="bg-card border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <MessageSquare className="h-6 w-6 text-purple-600" />
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{stats.totalComments.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Commentaires</div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm text-orange-600">
            <AlertCircle className="h-4 w-4" />
            <span>{pendingComments.length} en attente</span>
          </div>
        </div>

        <div className="bg-card border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-pink-100 dark:bg-pink-900/20 rounded-lg">
              <Heart className="h-6 w-6 text-pink-600" />
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{stats.totalLikes.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Likes totaux</div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <BarChart3 className="h-4 w-4" />
            <span>Engagement: {stats.avgEngagement}%</span>
          </div>
        </div>
      </div>

      {/* Activity & Top Articles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-card border rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-[#2ECC71]" />
            Activité Récente
          </h3>
          <div className="space-y-4">
            {[
              {
                type: 'comment',
                text: "Nouveau commentaire sur 'IA en Agriculture'",
                time: 'Il y a 5 min',
                icon: MessageSquare,
                color: 'text-blue-600',
              },
              {
                type: 'article',
                text: "Article publié : 'Drones 2026'",
                time: 'Il y a 1h',
                icon: FileText,
                color: 'text-green-600',
              },
              {
                type: 'like',
                text: '12 nouveaux likes sur vos articles',
                time: 'Il y a 2h',
                icon: Heart,
                color: 'text-pink-600',
              },
              {
                type: 'user',
                text: '3 nouveaux abonnés newsletter',
                time: 'Il y a 3h',
                icon: Users,
                color: 'text-purple-600',
              },
            ].map((activity, index) => {
              const Icon = activity.icon;
              return (
                <div key={index} className="flex items-start gap-3">
                  <div className={`p-2 bg-muted rounded-lg ${activity.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.text}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Performing Articles */}
        <div className="bg-card border rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-[#2ECC71]" />
            Articles les plus performants
          </h3>
          <div className="space-y-4">
            {topArticles.map((article, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-[#2ECC71] to-[#27AE60] rounded-lg flex items-center justify-center text-white font-bold">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{article.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {article.views.toLocaleString()} vues
                  </p>
                </div>
                <div
                  className={`flex items-center gap-1 text-sm ${
                    article.trend > 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {article.trend > 0 ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  <span>{Math.abs(article.trend)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pending Comments */}
      <div className="bg-card border rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-[#2ECC71]" />
            Commentaires en attente de modération
          </h3>
          <button
            onClick={() => setView('comments')}
            className="text-sm text-[#2ECC71] hover:underline"
          >
            Voir tous
          </button>
        </div>
        <div className="space-y-4">
          {pendingComments.map((comment) => (
            <div key={comment.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <span className="font-medium">{comment.author}</span>
                  <span className="text-sm text-muted-foreground ml-2">{comment.date}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleApproveComment(comment.id)}
                    className="p-1.5 bg-green-100 text-green-600 rounded hover:bg-green-200 transition-colors"
                    title="Approuver"
                  >
                    <CheckCircle className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleRejectComment(comment.id)}
                    className="p-1.5 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                    title="Rejeter"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-2">Sur: {comment.article}</p>
              <p className="text-sm">{comment.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderArticlesList = () => (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 w-full lg:w-auto">
          <div className="relative flex-1 lg:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher des articles..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-[#2ECC71]"
            />
          </div>
          <button className="p-2 border rounded-lg hover:bg-muted transition-colors">
            <Filter className="h-5 w-5" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-[#2ECC71]"
          >
            <option value="all">Tous les statuts</option>
            <option value="published">Publiés</option>
            <option value="draft">Brouillons</option>
            <option value="scheduled">Planifiés</option>
            <option value="review">En révision</option>
          </select>
          <button
            onClick={() => setView('editor')}
            className="px-6 py-2 bg-[#2ECC71] text-white rounded-lg hover:bg-[#27AE60] transition-colors flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Nouvel Article
          </button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedArticles.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              {selectedArticles.length} article(s) sélectionné(s)
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleBulkAction('publish')}
                className="px-3 py-1.5 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                Publier
              </button>
              <button
                onClick={() => handleBulkAction('draft')}
                className="px-3 py-1.5 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
              >
                Brouillon
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="px-3 py-1.5 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Supprimer
              </button>
              <button
                onClick={() => setSelectedArticles([])}
                className="px-3 py-1.5 text-sm border rounded hover:bg-muted transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Articles Table */}
      <div className="bg-card border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedArticles.length === articles.length}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedArticles(articles.map((a) => a.id));
                      } else {
                        setSelectedArticles([]);
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">Aperçu</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Titre</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Statut</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Auteur</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Catégorie</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Performances</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => (
                <tr key={article.id} className="border-t hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedArticles.includes(article.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedArticles([...selectedArticles, article.id]);
                        } else {
                          setSelectedArticles(selectedArticles.filter((id) => id !== article.id));
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-12 w-12 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded flex items-center justify-center text-2xl">
                      {article.thumbnail}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium max-w-md">{article.title}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                        article.status
                      )}`}
                    >
                      {getStatusLabel(article.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">{article.author}</td>
                  <td className="px-4 py-3 text-sm">{article.category}</td>
                  <td className="px-4 py-3 text-sm">
                    {new Date(article.date).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        <span>{article.views}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        <span>{article.comments}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        <span>{article.likes}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setView('editor')}
                        className="p-1.5 hover:bg-muted rounded transition-colors"
                        title="Éditer"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        className="p-1.5 hover:bg-muted rounded transition-colors"
                        title="Statistiques"
                      >
                        <BarChart3 className="h-4 w-4" />
                      </button>
                      <button
                        className="p-1.5 hover:bg-muted rounded transition-colors"
                        title="Dupliquer"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteArticle(article.id)}
                        className="p-1.5 hover:bg-red-100 text-red-600 rounded transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderEditor = () => (
    <div className="space-y-6">
      {/* Editor Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setView('articles')}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          <h2 className="text-2xl font-bold">Nouvel Article</h2>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 border rounded-lg hover:bg-muted transition-colors flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Prévisualiser
          </button>
          <button className="px-4 py-2 border rounded-lg hover:bg-muted transition-colors">
            Enregistrer brouillon
          </button>
          <button className="px-6 py-2 bg-[#2ECC71] text-white rounded-lg hover:bg-[#27AE60] transition-colors flex items-center gap-2">
            <Save className="h-4 w-4" />
            Publier
          </button>
        </div>
      </div>

      {/* Editor Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Editor */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title */}
          <div>
            <input
              type="text"
              placeholder="Titre de l'article..."
              className="w-full text-4xl font-bold border-0 focus:outline-none focus:ring-0 bg-transparent placeholder:text-muted-foreground"
            />
          </div>

          {/* Excerpt */}
          <div>
            <textarea
              placeholder="Extrait (résumé de l'article)..."
              className="w-full p-4 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#2ECC71] bg-background"
              rows={3}
            />
          </div>

          {/* Toolbar */}
          <div className="bg-card border rounded-lg p-3 flex flex-wrap items-center gap-2">
            <button className="p-2 hover:bg-muted rounded transition-colors" title="Gras">
              <Bold className="h-4 w-4" />
            </button>
            <button className="p-2 hover:bg-muted rounded transition-colors" title="Italique">
              <Italic className="h-4 w-4" />
            </button>
            <div className="w-px h-6 bg-border" />
            <button className="p-2 hover:bg-muted rounded transition-colors" title="Titre">
              <Heading className="h-4 w-4" />
            </button>
            <button className="p-2 hover:bg-muted rounded transition-colors" title="Liste">
              <List className="h-4 w-4" />
            </button>
            <button className="p-2 hover:bg-muted rounded transition-colors" title="Citation">
              <Quote className="h-4 w-4" />
            </button>
            <div className="w-px h-6 bg-border" />
            <button className="p-2 hover:bg-muted rounded transition-colors" title="Image">
              <ImageIcon className="h-4 w-4" />
            </button>
            <button className="p-2 hover:bg-muted rounded transition-colors" title="Vidéo">
              <Video className="h-4 w-4" />
            </button>
            <button className="p-2 hover:bg-muted rounded transition-colors" title="Lien">
              <Link2 className="h-4 w-4" />
            </button>
            <button className="p-2 hover:bg-muted rounded transition-colors" title="Code">
              <Code className="h-4 w-4" />
            </button>
            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={() => setEditorPreview('desktop')}
                className={`p-2 rounded transition-colors ${
                  editorPreview === 'desktop' ? 'bg-muted' : 'hover:bg-muted'
                }`}
                title="Desktop"
              >
                <Monitor className="h-4 w-4" />
              </button>
              <button
                onClick={() => setEditorPreview('tablet')}
                className={`p-2 rounded transition-colors ${
                  editorPreview === 'tablet' ? 'bg-muted' : 'hover:bg-muted'
                }`}
                title="Tablet"
              >
                <Tablet className="h-4 w-4" />
              </button>
              <button
                onClick={() => setEditorPreview('mobile')}
                className={`p-2 rounded transition-colors ${
                  editorPreview === 'mobile' ? 'bg-muted' : 'hover:bg-muted'
                }`}
                title="Mobile"
              >
                <Smartphone className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Content Editor */}
          <div className="bg-card border rounded-lg">
            <textarea
              value={editorContent}
              onChange={(e) => setEditorContent(e.target.value)}
              placeholder="Commencez à écrire votre article... (Markdown supporté)"
              className="w-full p-6 min-h-[600px] resize-none focus:outline-none bg-transparent"
            />
          </div>

          {/* SEO Score */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="font-medium">Score SEO</span>
              <span className="text-2xl font-bold text-blue-600">72/100</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden mb-3">
              <div className="h-full bg-blue-600" style={{ width: '72%' }} />
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Titre optimisé (52 caractères)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Meta description présente</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-orange-600" />
                <span>Ajouter des images avec attribut alt</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Meta Panel */}
        <div className="space-y-6">
          {/* Publication */}
          <div className="bg-card border rounded-xl p-6">
            <h3 className="font-semibold mb-4">Publication</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Statut</label>
                <select className="w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-[#2ECC71]">
                  <option>Brouillon</option>
                  <option>En révision</option>
                  <option>Planifié</option>
                  <option>Publié</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Date de publication</label>
                <input
                  type="datetime-local"
                  className="w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-[#2ECC71]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">URL (Slug)</label>
                <input
                  type="text"
                  placeholder="comment-reduire-consommation-eau"
                  className="w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-[#2ECC71]"
                />
              </div>
            </div>
          </div>

          {/* Category & Tags */}
          <div className="bg-card border rounded-xl p-6">
            <h3 className="font-semibold mb-4">Catégories & Tags</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Catégorie principale</label>
                <select className="w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-[#2ECC71]">
                  <option>Technologies Agricoles</option>
                  <option>Témoignages</option>
                  <option>Guides Pratiques</option>
                  <option>Recherche</option>
                  <option>Business</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Tags</label>
                <input
                  type="text"
                  placeholder="IA, irrigation, capteurs..."
                  className="w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-[#2ECC71]"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Séparez les tags par des virgules
                </p>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="bg-card border rounded-xl p-6">
            <h3 className="font-semibold mb-4">Image mise en avant</h3>
            <div className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-muted/50 transition-colors cursor-pointer">
              <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-1">Cliquez ou glissez une image</p>
              <p className="text-xs text-muted-foreground">JPG, PNG jusqu'à 5MB</p>
            </div>
          </div>

          {/* SEO Settings */}
          <div className="bg-card border rounded-xl p-6">
            <h3 className="font-semibold mb-4">SEO & Réseaux Sociaux</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Meta Title
                  <span className="text-xs text-muted-foreground ml-2">(0/60)</span>
                </label>
                <input
                  type="text"
                  placeholder="Titre pour les moteurs de recherche"
                  className="w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-[#2ECC71]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Meta Description
                  <span className="text-xs text-muted-foreground ml-2">(0/160)</span>
                </label>
                <textarea
                  placeholder="Description pour les moteurs de recherche"
                  className="w-full px-3 py-2 border rounded-lg resize-none bg-background focus:outline-none focus:ring-2 focus:ring-[#2ECC71]"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Author */}
          <div className="bg-card border rounded-xl p-6">
            <h3 className="font-semibold mb-4">Auteur</h3>
            <select className="w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-[#2ECC71]">
              <option>Marie Dubois</option>
              <option>Jean Dupont</option>
              <option>Sophie Martin</option>
            </select>
          </div>

          {/* Advanced Options */}
          <div className="bg-card border rounded-xl p-6">
            <h3 className="font-semibold mb-4">Options Avancées</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" className="rounded border-gray-300" />
                Autoriser les commentaires
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" className="rounded border-gray-300" />
                Marquer comme article premium
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" className="rounded border-gray-300" />
                Épingler en tête de blog
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="border-b">
        <div className="flex gap-6">
          {[
            { id: 'dashboard', label: 'Tableau de Bord', icon: BarChart3 },
            { id: 'articles', label: 'Articles', icon: FileText },
            { id: 'comments', label: 'Commentaires', icon: MessageSquare },
            { id: 'analytics', label: 'Analytics', icon: TrendingUp },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setView(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                  view === tab.id
                    ? 'border-[#2ECC71] text-[#2ECC71]'
                    : 'border-transparent hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      {view === 'dashboard' && renderDashboard()}
      {view === 'articles' && renderArticlesList()}
      {view === 'editor' && renderEditor()}
      {view === 'comments' && (
        <div className="text-center py-12 text-muted-foreground">
          Gestion des commentaires - En développement
        </div>
      )}
      {view === 'analytics' && (
        <div className="text-center py-12 text-muted-foreground">
          Analytics détaillés - En développement
        </div>
      )}
    </div>
  );
}
