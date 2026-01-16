import { useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  Sprout,
  Droplet,
  Shield,
  DollarSign,
  TrendingUp,
  Calendar,
  Calculator,
  MapPin,
  ThermometerSun,
  Sun,
  Cloud,
  Wind,
  Zap,
  Heart,
  Share2,
  Download,
  Play,
  CheckCircle,
  AlertTriangle,
  Info,
  Lightbulb,
  Target,
  Users,
  Award,
  Clock,
  Eye,
  MessageSquare,
  Star,
  ChevronRight,
  ChevronDown,
  Plus,
  Minus,
} from "lucide-react";
import { toast } from "sonner";

export function CulturePage({ onNavigate }: { onNavigate: (route: string) => void }) {
  const [activeSection, setActiveSection] = useState("basics");
  const [selectedVariety, setSelectedVariety] = useState("hybrid");
  const [surfaceArea, setSurfaceArea] = useState(1);
  const [soilType, setSoilType] = useState("clay");
  const [showCalculator, setShowCalculator] = useState(false);

  // Culture data - Maïs
  const culture = {
    name: "Maïs",
    scientificName: "Zea mays",
    icon: "🌽",
    origin: "Mésoamérique",
    zones: "Tropical à tempéré",
    stats: {
      yieldOptimal: "5-12 t/ha",
      cycle: "90-120 jours",
      waterNeeds: "450-650 mm",
      tempOptimal: "20-30°C",
    },
  };

  // Sections menu
  const sections = [
    { id: "basics", name: "Bases", icon: BookOpen },
    { id: "planting", name: "Plantation", icon: Sprout },
    { id: "irrigation", name: "Irrigation", icon: Droplet },
    { id: "protection", name: "Protection", icon: Shield },
    { id: "harvest", name: "Récolte", icon: Calendar },
    { id: "economics", name: "Économie", icon: DollarSign },
  ];

  // Varieties
  const varieties = [
    {
      id: "hybrid",
      name: "Hybrides",
      yield: "10-12 t/ha",
      cycle: "90-100 jours",
      resistance: "Élevée",
      cost: "€€€",
    },
    {
      id: "composite",
      name: "Composites",
      yield: "7-9 t/ha",
      cycle: "100-110 jours",
      resistance: "Moyenne",
      cost: "€€",
    },
    {
      id: "local",
      name: "Locales",
      yield: "5-7 t/ha",
      cycle: "110-120 jours",
      resistance: "Variable",
      cost: "€",
    },
  ];

  // Growth stages
  const growthStages = [
    { stage: "Semis", days: "0", icon: Sprout, color: "gray" },
    { stage: "Levée", days: "7-10", icon: Sprout, color: "green" },
    { stage: "4 feuilles", days: "20-25", icon: Sprout, color: "green" },
    { stage: "8 feuilles", days: "35-40", icon: Sprout, color: "emerald" },
    { stage: "Floraison", days: "60-70", icon: Sun, color: "yellow" },
    { stage: "Maturation", days: "90-100", icon: Star, color: "orange" },
    { stage: "Récolte", days: "100-120", icon: Calendar, color: "blue" },
  ];

  // Nutritional needs
  const nutritionalNeeds = [
    { stage: "Semis", N: 20, P: 10, K: 15, micro: "Zn, B" },
    { stage: "4 feuilles", N: 40, P: 20, K: 30, micro: "Zn, Mn" },
    { stage: "8 feuilles", N: 80, P: 30, K: 50, micro: "Fe, Cu" },
    { stage: "Floraison", N: 60, P: 30, K: 50, micro: "B, Mo" },
    { stage: "Maturation", N: 30, P: 20, K: 40, micro: "Mg" },
  ];

  // Diseases
  const diseases = [
    {
      id: "1",
      name: "Charbon du maïs",
      symptom: "Galles sur épis",
      severity: "Élevée",
      treatment: "Rotation, variétés résistantes",
      prevention: "Éviter blessures",
    },
    {
      id: "2",
      name: "Helminthosporiose",
      symptom: "Taches brunes feuilles",
      severity: "Moyenne",
      treatment: "Fongicide triazole",
      prevention: "Espacement correct",
    },
    {
      id: "3",
      name: "Pyrale",
      symptom: "Galeries dans tiges",
      severity: "Élevée",
      treatment: "Insecticide biologique",
      prevention: "Bt, trichogrammes",
    },
  ];

  // Experts
  const experts = [
    { name: "Dr. Amadou K.", specialty: "Agronome", country: "Mali", experience: "15 ans" },
    { name: "Pr. Sarah M.", specialty: "Phytopathologie", country: "Kenya", experience: "20 ans" },
    { name: "Ing. Pierre L.", specialty: "Irrigation", country: "Sénégal", experience: "12 ans" },
  ];

  const handleCalculate = () => {
    toast.success("Calcul effectué - Voir les résultats ci-dessous");
  };

  const renderBasicsSection = () => (
    <div className="space-y-8">
      {/* Plant Anatomy */}
      <div className="bg-card border rounded-xl p-6">
        <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Sprout className="h-6 w-6 text-[#1A5D1A]" />
          Comprendre la plante
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h4 className="font-semibold mb-4">Anatomie interactive</h4>
            <div className="relative h-96 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/30 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <div className="text-8xl mb-4">🌽</div>
                <p className="text-sm text-muted-foreground">
                  Cliquez sur chaque partie pour en savoir plus
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold mb-4">Exigences climatiques</h4>
            <div className="space-y-3">
              {[
                { label: "Température optimale", value: "20-30°C", icon: ThermometerSun },
                { label: "Pluviométrie", value: "450-650 mm", icon: Cloud },
                { label: "Ensoleillement", value: "6-8h/jour", icon: Sun },
                { label: "Vent max", value: "< 60 km/h", icon: Wind },
              ].map((req, index) => {
                const Icon = req.icon;
                return (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-[#1A5D1A]" />
                      <span className="font-medium">{req.label}</span>
                    </div>
                    <span className="text-lg font-bold">{req.value}</span>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                    Zone idéale
                  </h4>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    Le maïs prospère dans les zones tropicales et subtropicales entre 0-2000m
                    d'altitude. Les variétés adaptées existent pour chaque région d'Afrique.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Growth Cycle */}
      <div className="bg-card border rounded-xl p-6">
        <h3 className="text-2xl font-bold mb-6">Cycle de vie détaillé</h3>

        <div className="relative">
          <div className="absolute top-8 left-0 right-0 h-1 bg-gradient-to-r from-gray-300 via-green-500 to-orange-500 rounded"></div>

          <div className="relative grid grid-cols-7 gap-2">
            {growthStages.map((stage, index) => {
              const Icon = stage.icon;
              return (
                <div key={index} className="text-center">
                  <div
                    className={`mx-auto w-16 h-16 bg-gradient-to-br from-${stage.color}-500 to-${stage.color}-600 rounded-full flex items-center justify-center text-white mb-3 relative z-10 shadow-lg`}
                  >
                    <Icon className="h-8 w-8" />
                  </div>
                  <div className="font-semibold text-sm mb-1">{stage.stage}</div>
                  <div className="text-xs text-muted-foreground">{stage.days} jours</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Varieties Comparison */}
      <div className="bg-card border rounded-xl p-6">
        <h3 className="text-2xl font-bold mb-6">Variétés adaptées</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {varieties.map((variety) => (
            <button
              key={variety.id}
              onClick={() => setSelectedVariety(variety.id)}
              className={`p-6 rounded-xl border-2 transition-all text-left ${
                selectedVariety === variety.id
                  ? "border-[#1A5D1A] bg-green-50 dark:bg-green-900/20"
                  : "border-transparent hover:border-gray-300"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xl font-bold">{variety.name}</h4>
                {selectedVariety === variety.id && (
                  <CheckCircle className="h-5 w-5 text-[#1A5D1A]" />
                )}
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rendement:</span>
                  <span className="font-semibold">{variety.yield}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cycle:</span>
                  <span className="font-semibold">{variety.cycle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Résistance:</span>
                  <span className="font-semibold">{variety.resistance}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Coût:</span>
                  <span className="font-semibold">{variety.cost}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPlantingSection = () => (
    <div className="space-y-8">
      {/* Planting Calculator */}
      <div className="bg-gradient-to-br from-[#1A5D1A] to-[#2D7A2D] rounded-xl p-8 text-white">
        <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Calculator className="h-6 w-6" />
          Calculateur de densité de plantation
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">Surface (hectares)</label>
            <input
              type="number"
              value={surfaceArea}
              onChange={(e) => setSurfaceArea(parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-3 rounded-lg bg-white/20 backdrop-blur-sm placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-white"
              min="0"
              step="0.1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Type de sol</label>
            <select
              value={soilType}
              onChange={(e) => setSoilType(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/20 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white"
            >
              <option value="sandy">Sableux</option>
              <option value="clay">Argileux</option>
              <option value="loam">Limoneux</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Variété</label>
            <select
              value={selectedVariety}
              onChange={(e) => setSelectedVariety(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/20 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white"
            >
              <option value="hybrid">Hybride</option>
              <option value="composite">Composite</option>
              <option value="local">Locale</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleCalculate}
          className="w-full px-6 py-3 bg-white text-[#1A5D1A] rounded-lg font-semibold hover:bg-gray-100 transition-colors"
        >
          Calculer le nombre de plants
        </button>

        {showCalculator && (
          <div className="mt-6 p-6 bg-white/10 backdrop-blur-sm rounded-lg">
            <h4 className="font-semibold mb-4">Résultats:</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm opacity-90 mb-1">Plants nécessaires</div>
                <div className="text-3xl font-bold">{(surfaceArea * 62500).toLocaleString()}</div>
              </div>
              <div>
                <div className="text-sm opacity-90 mb-1">Espacement</div>
                <div className="text-3xl font-bold">80 x 20 cm</div>
              </div>
              <div>
                <div className="text-sm opacity-90 mb-1">Semences (kg)</div>
                <div className="text-3xl font-bold">{(surfaceArea * 25).toFixed(1)}</div>
              </div>
              <div>
                <div className="text-sm opacity-90 mb-1">Coût estimé</div>
                <div className="text-3xl font-bold">{(surfaceArea * 180).toFixed(0)}€</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Planting Methods */}
      <div className="bg-card border rounded-xl p-6">
        <h3 className="text-2xl font-bold mb-6">Méthodes de plantation comparées</h3>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">Méthode</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Avantages</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Inconvénients</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Coût</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Rendement</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  method: "Semis direct",
                  pros: "Rapide, économe en main d'œuvre",
                  cons: "Nécessite herbicides",
                  cost: "€",
                  yield: "Moyen",
                },
                {
                  method: "Semis en poquet",
                  pros: "Contrôle précis, économie semences",
                  cons: "Laborieux",
                  cost: "€€",
                  yield: "Élevé",
                },
                {
                  method: "Conservation",
                  pros: "Préserve sol, économie eau",
                  cons: "Apprentissage nécessaire",
                  cost: "€",
                  yield: "Élevé",
                },
              ].map((method, index) => (
                <tr key={index} className="border-t hover:bg-muted/50">
                  <td className="px-4 py-3 font-medium">{method.method}</td>
                  <td className="px-4 py-3 text-sm text-green-600">{method.pros}</td>
                  <td className="px-4 py-3 text-sm text-red-600">{method.cons}</td>
                  <td className="px-4 py-3 text-sm">{method.cost}</td>
                  <td className="px-4 py-3 text-sm font-semibold">{method.yield}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderIrrigationSection = () => (
    <div className="space-y-8">
      {/* Water Needs Chart */}
      <div className="bg-card border rounded-xl p-6">
        <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Droplet className="h-6 w-6 text-blue-600" />
          Besoins hydriques par stade
        </h3>

        <div className="h-64 flex items-end justify-around gap-2">
          {[
            { stage: "Semis", water: 20 },
            { stage: "Levée", water: 35 },
            { stage: "4F", water: 50 },
            { stage: "8F", water: 75 },
            { stage: "Fleur", water: 100 },
            { stage: "Grain", water: 85 },
            { stage: "Matur", water: 40 },
          ].map((data, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-gradient-to-t from-blue-500 to-blue-300 rounded-t-lg transition-all hover:from-blue-600 hover:to-blue-400 cursor-pointer"
                style={{ height: `${data.water}%` }}
                title={`${data.water}mm`}
              />
              <div className="text-xs font-medium mt-2">{data.stage}</div>
              <div className="text-xs text-muted-foreground">{data.water}mm</div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-start gap-3">
            <Lightbulb className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                💡 Conseil AgroDeep
              </h4>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                La période de floraison est critique : un stress hydrique de 3 jours peut réduire
                le rendement de 20-30%. Assurez un apport régulier durant cette phase.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Irrigation Methods */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            name: "Goutte-à-goutte",
            efficiency: 95,
            waterSaving: 30,
            cost: "€€€",
            description: "Précision maximale, économie d'eau",
          },
          {
            name: "Aspersion",
            efficiency: 75,
            waterSaving: 15,
            cost: "€€",
            description: "Bon compromis coût/efficacité",
          },
          {
            name: "Gravitaire",
            efficiency: 50,
            waterSaving: 0,
            cost: "€",
            description: "Simple mais gaspilleur",
          },
        ].map((method, index) => (
          <div key={index} className="bg-card border rounded-xl p-6">
            <h4 className="text-xl font-bold mb-3">{method.name}</h4>
            <p className="text-sm text-muted-foreground mb-4">{method.description}</p>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Efficacité</span>
                  <span className="font-bold">{method.efficiency}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-600"
                    style={{ width: `${method.efficiency}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Économie eau</span>
                  <span className="font-bold">{method.waterSaving}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600"
                    style={{ width: `${method.waterSaving}%` }}
                  />
                </div>
              </div>

              <div className="flex justify-between pt-2 border-t">
                <span className="text-sm">Coût</span>
                <span className="font-bold">{method.cost}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProtectionSection = () => (
    <div className="space-y-8">
      {/* Diseases Database */}
      <div className="bg-card border rounded-xl p-6">
        <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Shield className="h-6 w-6 text-red-600" />
          Base de données maladies & ravageurs
        </h3>

        <div className="space-y-4">
          {diseases.map((disease) => (
            <div key={disease.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-lg mb-1">{disease.name}</h4>
                  <p className="text-sm text-muted-foreground">{disease.symptom}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded text-sm font-semibold ${
                    disease.severity === "Élevée"
                      ? "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                      : "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400"
                  }`}
                >
                  {disease.severity}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Traitement: </span>
                  <span className="font-medium">{disease.treatment}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Prévention: </span>
                  <span className="font-medium">{disease.prevention}</span>
                </div>
              </div>

              <button className="mt-3 text-sm text-[#1A5D1A] hover:underline flex items-center gap-1">
                Voir les photos et détails
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* AI Diagnostic */}
      <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-8 text-white">
        <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Zap className="h-6 w-6" />
          Diagnostic IA par photo
        </h3>
        <p className="mb-6 opacity-90">
          Uploadez une photo de votre plant malade et recevez un diagnostic instantané avec
          recommandations de traitement
        </p>

        <div className="border-2 border-dashed border-white/50 rounded-xl p-12 text-center bg-white/10 backdrop-blur-sm">
          <Upload className="h-12 w-12 mx-auto mb-4" />
          <p className="mb-2">Cliquez ou glissez une photo</p>
          <p className="text-sm opacity-75">JPG, PNG jusqu'à 10MB</p>
        </div>

        <button className="w-full mt-6 px-6 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
          Analyser maintenant
        </button>
      </div>
    </div>
  );

  const renderNutritionSection = () => (
    <div className="bg-card border rounded-xl p-6">
      <h3 className="text-2xl font-bold mb-6">Tableau des besoins nutritifs</h3>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium">Stade</th>
              <th className="px-4 py-3 text-center text-sm font-medium">N (kg/ha)</th>
              <th className="px-4 py-3 text-center text-sm font-medium">P (kg/ha)</th>
              <th className="px-4 py-3 text-center text-sm font-medium">K (kg/ha)</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Micronutriments</th>
            </tr>
          </thead>
          <tbody>
            {nutritionalNeeds.map((need, index) => (
              <tr key={index} className="border-t hover:bg-muted/50">
                <td className="px-4 py-3 font-medium">{need.stage}</td>
                <td className="px-4 py-3 text-center">
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded font-semibold">
                    {need.N}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded font-semibold">
                    {need.P}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 rounded font-semibold">
                    {need.K}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm">{need.micro}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => onNavigate("/academy")}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour à l'académie
      </button>

      {/* Hero Header */}
      <div className="bg-gradient-to-br from-green-100 to-emerald-200 dark:from-green-900/30 dark:to-emerald-900/40 rounded-2xl p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 text-9xl opacity-20">
          {culture.icon}
        </div>

        <div className="relative z-10">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-5xl font-bold mb-2">{culture.name}</h1>
              <p className="text-xl text-muted-foreground italic">{culture.scientificName}</p>
            </div>

            <div className="flex gap-2">
              <button className="p-3 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <Heart className="h-5 w-5" />
              </button>
              <button className="p-3 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <Share2 className="h-5 w-5" />
              </button>
              <button className="p-3 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <Download className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Rendement optimal", value: culture.stats.yieldOptimal, icon: TrendingUp },
              { label: "Cycle cultural", value: culture.stats.cycle, icon: Clock },
              { label: "Besoins en eau", value: culture.stats.waterNeeds, icon: Droplet },
              { label: "Température", value: culture.stats.tempOptimal, icon: ThermometerSun },
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="h-4 w-4 text-[#1A5D1A]" />
                    <span className="text-sm text-muted-foreground">{stat.label}</span>
                  </div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-card border rounded-xl p-2 flex flex-wrap gap-2">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                activeSection === section.id
                  ? "bg-[#1A5D1A] text-white"
                  : "hover:bg-muted"
              }`}
            >
              <Icon className="h-4 w-4" />
              {section.name}
            </button>
          );
        })}
      </div>

      {/* Content Sections */}
      {activeSection === "basics" && renderBasicsSection()}
      {activeSection === "planting" && renderPlantingSection()}
      {activeSection === "irrigation" && renderIrrigationSection()}
      {activeSection === "protection" && renderProtectionSection()}

      {/* Experts Sidebar */}
      <div className="bg-card border rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <Users className="h-5 w-5 text-[#1A5D1A]" />
          Experts disponibles
        </h3>

        <div className="space-y-4">
          {experts.map((expert, index) => (
            <div key={index} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <div className="h-12 w-12 bg-gradient-to-br from-[#1A5D1A] to-[#2D7A2D] rounded-full flex items-center justify-center text-white font-bold text-xl">
                {expert.name.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="font-semibold">{expert.name}</div>
                <div className="text-sm text-muted-foreground">
                  {expert.specialty} • {expert.country}
                </div>
                <div className="text-xs text-muted-foreground">{expert.experience}</div>
              </div>
              <button className="px-4 py-2 bg-[#1A5D1A] text-white rounded-lg hover:bg-[#155015] transition-colors text-sm">
                Contacter
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-[#1A5D1A] to-[#2D7A2D] rounded-2xl p-12 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Prêt à maîtriser la culture du maïs ?</h2>
        <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
          Accédez à tous les modules, outils pratiques et support d'experts pour maximiser vos
          rendements
        </p>
        <button className="px-8 py-4 bg-white text-[#1A5D1A] rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center gap-2">
          <Play className="h-5 w-5" />
          Commencer le parcours complet
        </button>
      </div>
    </div>
  );
}

// Missing Upload icon definition
function Upload({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
    </svg>
  );
}
