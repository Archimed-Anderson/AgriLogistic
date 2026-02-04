import { useState } from 'react';
import {
  Search,
  BookOpen,
  Sprout,
  Wheat,
  Apple,
  Coffee,
  Leaf,
  MapPin,
  TrendingUp,
  Users,
  Award,
  Clock,
  Globe,
  Filter,
  ChevronRight,
  Play,
  FileText,
  Video,
  Calculator,
  CheckCircle,
  Star,
  Target,
  Zap,
  Shield,
  Droplet,
  Sun,
  Calendar,
} from 'lucide-react';
import { toast } from 'sonner';

export function AcademyPortal({ onNavigate }: { onNavigate: (route: string) => void }) {
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Stats
  const stats = {
    cultures: 50,
    learners: 12450,
    lessons: 487,
    experts: 234,
  };

  // Regions
  const regions = [
    { id: 'all', name: 'Toutes les régions', icon: Globe, count: 50 },
    { id: 'africa', name: 'Afrique Sub-Saharienne', icon: MapPin, count: 28, featured: true },
    { id: 'asia', name: 'Asie du Sud-Est', icon: MapPin, count: 12 },
    { id: 'latin-america', name: 'Amérique Latine', icon: MapPin, count: 8 },
    { id: 'europe', name: 'Europe', icon: MapPin, count: 2 },
  ];

  // Culture categories
  const categories = [
    {
      id: 'roots',
      name: 'Racines & Tubercules',
      icon: Sprout,
      color: 'brown',
      count: 8,
      cultures: ['Manioc', 'Patate douce', 'Igname', 'Taro'],
      description: 'Cultures de base alimentaire tropicale',
    },
    {
      id: 'cereals',
      name: 'Céréales',
      icon: Wheat,
      color: 'yellow',
      count: 12,
      cultures: ['Maïs', 'Riz', 'Blé', 'Sorgho', 'Mil'],
      description: 'Cultures vivrières et commerciales',
    },
    {
      id: 'legumes',
      name: 'Légumineuses',
      icon: Leaf,
      color: 'green',
      count: 8,
      cultures: ['Haricot', 'Pois', 'Arachide', 'Soja'],
      description: 'Protéines végétales et azote',
    },
    {
      id: 'vegetables',
      name: 'Légumes',
      icon: Sprout,
      color: 'emerald',
      count: 10,
      cultures: ['Concombre', 'Tomate', 'Oignon', 'Chou'],
      description: 'Maraîchage et nutrition',
    },
    {
      id: 'fruits',
      name: 'Fruits',
      icon: Apple,
      color: 'red',
      count: 8,
      cultures: ['Banane', 'Manguier', 'Agrumes', 'Avocat'],
      description: 'Arboriculture fruitière',
    },
    {
      id: 'cash-crops',
      name: 'Cultures de Rente',
      icon: Coffee,
      color: 'orange',
      count: 4,
      cultures: ['Café', 'Cacao', 'Coton', 'Palmier à huile'],
      description: "Cultures d'exportation et transformation",
    },
  ];

  // Featured cultures
  const featuredCultures = [
    {
      id: 'maize',
      name: 'Maïs',
      scientificName: 'Zea mays',
      icon: '🌽',
      category: 'Céréales',
      region: 'Afrique Sub-Saharienne',
      popularity: 98,
      yield: '5-12 t/ha',
      cycle: '90-120 jours',
      learners: 3240,
      lessons: 45,
      difficulty: 'Intermédiaire',
      climate: 'Tropical à tempéré',
    },
    {
      id: 'cassava',
      name: 'Manioc',
      scientificName: 'Manihot esculenta',
      icon: '🥔',
      category: 'Racines',
      region: 'Afrique Centrale',
      popularity: 95,
      yield: '15-40 t/ha',
      cycle: '8-24 mois',
      learners: 2890,
      lessons: 38,
      difficulty: 'Débutant',
      climate: 'Tropical humide',
    },
    {
      id: 'cocoa',
      name: 'Cacao',
      scientificName: 'Theobroma cacao',
      icon: '🍫',
      category: 'Cultures de rente',
      region: "Afrique de l'Ouest",
      popularity: 92,
      yield: '0.8-2.5 t/ha',
      cycle: '3-5 ans',
      learners: 2650,
      lessons: 52,
      difficulty: 'Avancé',
      climate: 'Équatorial',
    },
  ];

  // Popular courses
  const popularCourses = [
    {
      id: '1',
      title: "Maîtriser l'irrigation du maïs",
      culture: 'Maïs',
      duration: '2h 30min',
      lessons: 12,
      level: 'Intermédiaire',
      enrolled: 1240,
      rating: 4.8,
      type: 'video',
    },
    {
      id: '2',
      title: 'Protection intégrée du manioc',
      culture: 'Manioc',
      duration: '1h 45min',
      lessons: 8,
      level: 'Débutant',
      enrolled: 890,
      rating: 4.9,
      type: 'interactive',
    },
    {
      id: '3',
      title: 'Agroforesterie avec cacao',
      culture: 'Cacao',
      duration: '3h 15min',
      lessons: 15,
      level: 'Avancé',
      enrolled: 670,
      rating: 4.7,
      type: 'practical',
    },
  ];

  // Success stories
  const successStories = [
    {
      id: '1',
      name: 'Jean-Baptiste K.',
      country: 'Burkina Faso',
      culture: 'Maïs',
      achievement: '+45% rendement en 1 saison',
      image: '👨‍🌾',
    },
    {
      id: '2',
      name: 'Amina M.',
      country: "Côte d'Ivoire",
      culture: 'Cacao',
      achievement: 'Certification bio obtenue',
      image: '👩‍🌾',
    },
    {
      id: '3',
      name: 'Pierre L.',
      country: 'RDC',
      culture: 'Manioc',
      achievement: 'Stockage: 0% pertes',
      image: '👨‍🌾',
    },
  ];

  const getCategoryColor = (color: string) => {
    const colors: { [key: string]: string } = {
      brown: 'from-amber-700 to-amber-900',
      yellow: 'from-yellow-500 to-orange-600',
      green: 'from-green-600 to-emerald-700',
      emerald: 'from-emerald-500 to-teal-600',
      red: 'from-red-500 to-pink-600',
      orange: 'from-orange-500 to-red-600',
    };
    return colors[color] || colors.green;
  };

  const handleStartLearning = (cultureId: string) => {
    onNavigate(`/academy/culture/${cultureId}`);
  };

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-[#1A5D1A] to-[#2D7A2D] rounded-2xl p-12 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10">
          <BookOpen className="h-64 w-64" />
        </div>
        <div className="relative z-10 max-w-4xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg">
              <BookOpen className="h-8 w-8" />
            </div>
            <h1 className="text-5xl font-bold">Académie AgroLogistic</h1>
          </div>
          <p className="text-xl opacity-90 mb-8">
            Votre université agricole digitale - Apprenez les meilleures pratiques pour chaque
            culture, adaptées à votre région
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl font-bold mb-1">{stats.cultures}+</div>
              <div className="text-sm opacity-90">Cultures enseignées</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl font-bold mb-1">{stats.learners.toLocaleString()}</div>
              <div className="text-sm opacity-90">Agriculteurs formés</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl font-bold mb-1">{stats.lessons}+</div>
              <div className="text-sm opacity-90">Leçons disponibles</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl font-bold mb-1">{stats.experts}+</div>
              <div className="text-sm opacity-90">Experts contributeurs</div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Recherchez une culture, une technique, une région..."
              className="w-full pl-12 pr-4 py-4 rounded-lg bg-white/95 backdrop-blur-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
            />
          </div>
        </div>
      </div>

      {/* Region Selector */}
      <div className="bg-card border rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Globe className="h-5 w-5 text-[#1A5D1A]" />
          Choisir votre région
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {regions.map((region) => {
            const Icon = region.icon;
            return (
              <button
                key={region.id}
                onClick={() => setSelectedRegion(region.id)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedRegion === region.id
                    ? 'border-[#1A5D1A] bg-green-50 dark:bg-green-900/20'
                    : 'border-transparent hover:border-gray-300'
                } ${region.featured ? 'ring-2 ring-orange-400' : ''}`}
              >
                {region.featured && (
                  <div className="text-xs text-orange-600 font-semibold mb-2">⭐ PRIORITAIRE</div>
                )}
                <Icon className="h-6 w-6 mx-auto mb-2 text-[#1A5D1A]" />
                <div className="font-medium text-sm text-center">{region.name}</div>
                <div className="text-xs text-muted-foreground text-center mt-1">
                  {region.count} cultures
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Categories */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Explorer par catégorie</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <div
                key={category.id}
                className="bg-card border rounded-xl overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
              >
                <div
                  className={`h-32 bg-gradient-to-br ${getCategoryColor(
                    category.color
                  )} p-6 flex items-center justify-between text-white`}
                >
                  <div>
                    <h3 className="text-2xl font-bold mb-1">{category.name}</h3>
                    <p className="text-sm opacity-90">{category.count} cultures</p>
                  </div>
                  <Icon className="h-16 w-16 opacity-80" />
                </div>

                <div className="p-6">
                  <p className="text-sm text-muted-foreground mb-4">{category.description}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {category.cultures.map((culture) => (
                      <span
                        key={culture}
                        className="px-2 py-1 bg-muted rounded text-xs font-medium"
                      >
                        {culture}
                      </span>
                    ))}
                  </div>

                  <button className="w-full px-4 py-2 bg-[#1A5D1A] text-white rounded-lg hover:bg-[#155015] transition-colors flex items-center justify-center gap-2">
                    Explorer
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Featured Cultures */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Cultures phares</h2>
          <button className="text-[#1A5D1A] hover:underline text-sm flex items-center gap-1">
            Voir toutes les cultures
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {featuredCultures.map((culture) => (
            <div
              key={culture.id}
              className="bg-card border rounded-xl overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
            >
              <div className="relative h-48 bg-gradient-to-br from-green-100 to-emerald-200 dark:from-green-900/30 dark:to-emerald-900/40 flex items-center justify-center">
                <div className="text-8xl">{culture.icon}</div>
                <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold">
                  {culture.popularity}% popularité
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-bold group-hover:text-[#1A5D1A] transition-colors">
                      {culture.name}
                    </h3>
                    <p className="text-sm text-muted-foreground italic">{culture.scientificName}</p>
                  </div>
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-xs rounded">
                    {culture.difficulty}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <div className="text-muted-foreground text-xs mb-1">Rendement</div>
                    <div className="font-semibold">{culture.yield}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground text-xs mb-1">Cycle</div>
                    <div className="font-semibold">{culture.cycle}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground text-xs mb-1">Climat</div>
                    <div className="font-semibold">{culture.climate}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground text-xs mb-1">Région</div>
                    <div className="font-semibold text-xs">{culture.region}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span>{culture.learners.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-3 w-3" />
                    <span>{culture.lessons} leçons</span>
                  </div>
                </div>

                <button
                  onClick={() => handleStartLearning(culture.id)}
                  className="w-full px-4 py-3 bg-gradient-to-r from-[#1A5D1A] to-[#2D7A2D] text-white rounded-lg hover:from-[#155015] hover:to-[#257025] transition-colors flex items-center justify-center gap-2 font-semibold"
                >
                  <Play className="h-4 w-4" />
                  Commencer l'apprentissage
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Courses */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Courses List */}
        <div className="lg:col-span-2 bg-card border rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-[#1A5D1A]" />
            Formations populaires
          </h2>

          <div className="space-y-4">
            {popularCourses.map((course) => (
              <div
                key={course.id}
                className="flex gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-[#1A5D1A] to-[#2D7A2D] rounded-lg flex items-center justify-center text-white">
                  {course.type === 'video' && <Video className="h-8 w-8" />}
                  {course.type === 'interactive' && <Zap className="h-8 w-8" />}
                  {course.type === 'practical' && <Target className="h-8 w-8" />}
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold mb-1">{course.title}</h3>
                      <p className="text-sm text-muted-foreground">{course.culture}</p>
                    </div>
                    <div className="flex items-center gap-1 text-yellow-600">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="text-sm font-semibold">{course.rating}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-3 w-3" />
                      <span>{course.lessons} leçons</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>{course.enrolled.toLocaleString()} inscrits</span>
                    </div>
                  </div>

                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-xs rounded">
                    {course.level}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Success Stories */}
        <div className="bg-gradient-to-br from-orange-500 to-pink-600 rounded-xl p-6 text-white">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Award className="h-5 w-5" />
            Success Stories
          </h2>

          <div className="space-y-4">
            {successStories.map((story) => (
              <div key={story.id} className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="text-4xl">{story.image}</div>
                  <div className="flex-1">
                    <div className="font-semibold mb-1">{story.name}</div>
                    <div className="text-sm opacity-90 mb-2">
                      {story.country} • {story.culture}
                    </div>
                    <div className="text-sm font-semibold bg-white/20 rounded px-2 py-1 inline-block">
                      {story.achievement}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-6 px-4 py-3 bg-white text-orange-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Partagez votre histoire
          </button>
        </div>
      </div>

      {/* Learning Tools */}
      <div className="bg-card border rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-6">Outils d'apprentissage</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              icon: Calculator,
              title: 'Calculateurs',
              description: 'Rendement, irrigation, fertilisation',
              color: 'blue',
            },
            {
              icon: Droplet,
              title: 'Simulateurs',
              description: 'Climat, eau, économie',
              color: 'cyan',
            },
            {
              icon: Shield,
              title: 'Diagnostic IA',
              description: 'Maladies et ravageurs',
              color: 'red',
            },
            {
              icon: Calendar,
              title: 'Planificateurs',
              description: 'Saison, rotations, tâches',
              color: 'green',
            },
          ].map((tool, index) => {
            const Icon = tool.icon;
            return (
              <div
                key={index}
                className="p-4 border-2 border-dashed rounded-xl hover:border-[#1A5D1A] hover:bg-green-50 dark:hover:bg-green-900/10 transition-all cursor-pointer"
              >
                <Icon className={`h-8 w-8 mb-3 text-${tool.color}-600`} />
                <h3 className="font-semibold mb-1">{tool.title}</h3>
                <p className="text-sm text-muted-foreground">{tool.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-[#1A5D1A] to-[#2D7A2D] rounded-2xl p-12 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Prêt à transformer votre agriculture ?</h2>
        <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
          Rejoignez des milliers d'agriculteurs qui ont déjà amélioré leurs rendements grâce à
          l'Académie AgroLogistic
        </p>
        <div className="flex items-center justify-center gap-4">
          <button className="px-8 py-4 bg-white text-[#1A5D1A] rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Commencer gratuitement
          </button>
          <button
            onClick={() => onNavigate('/academy/vision')}
            className="px-8 py-4 border-2 border-white rounded-lg font-semibold hover:bg-white/10 transition-colors"
          >
            Découvrir notre vision
          </button>
        </div>
      </div>
    </div>
  );
}
