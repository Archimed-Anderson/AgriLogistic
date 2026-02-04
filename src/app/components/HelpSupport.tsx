import {
  Search,
  Book,
  MessageCircle,
  Phone,
  FileText,
  ChevronRight,
  HelpCircle,
} from 'lucide-react';

const faqCategories = [
  { icon: Book, title: 'Guide de démarrage', count: 12 },
  { icon: FileText, title: 'Gestion des cultures', count: 8 },
  { icon: Phone, title: 'Support technique', count: 5 },
  { icon: MessageCircle, title: 'Communauté', count: 124 },
];

const popularArticles = [
  { title: 'Comment configurer mes capteurs IoT ?', views: '2.5k' },
  { title: 'Comprendre les prévisions de rendement IA', views: '1.8k' },
  { title: "Guide d'irrigation optimisée", views: '1.2k' },
  { title: 'Exporter mes données comptables', views: '950' },
];

export function HelpSupport() {
  return (
    <div className="space-y-6">
      {/* Header with Search */}
      <div className="bg-[#0B7A4B] rounded-2xl p-8 text-center text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="relative z-10 max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">Comment pouvons-nous vous aider ?</h1>
          <p className="text-blue-100 mb-8">
            Recherchez dans notre documentation ou contactez le support
          </p>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un article, un guide, une question..."
              className="w-full pl-12 pr-4 py-4 text-gray-900 bg-white rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-white/20"
            />
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {faqCategories.map((cat, index) => {
          const Icon = cat.icon;
          return (
            <button
              key={index}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all text-left group"
            >
              <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center mb-4 group-hover:bg-[#0B7A4B] transition-colors">
                <Icon className="w-6 h-6 text-[#0B7A4B] group-hover:text-white transition-colors" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{cat.title}</h3>
              <p className="text-sm text-gray-500">{cat.count} articles</p>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Popular Articles */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Articles Populaires</h2>
          <div className="space-y-2">
            {popularArticles.map((article, index) => (
              <button
                key={index}
                className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm">
                    {index + 1}
                  </div>
                  <span className="font-medium text-gray-700">{article.title}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>{article.views} vues</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Contact Support */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Besoin de plus d'aide ?</h2>
            <div className="space-y-4">
              <button className="w-full bg-[#0B7A4B] text-white py-3 rounded-lg font-medium hover:bg-[#096340] transition-colors flex items-center justify-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Chat en direct
              </button>
              <button className="w-full bg-white border border-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                <Phone className="w-5 h-5" />
                Planifier un appel
              </button>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-100 text-center">
              <p className="text-sm text-gray-500 mb-2">Support disponible</p>
              <p className="font-semibold text-gray-900">Lun - Ven, 8h - 18h</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
