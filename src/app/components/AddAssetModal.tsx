import { useState } from 'react';
import {
  X,
  ChevronRight,
  ChevronLeft,
  Check,
  Upload,
  Image as ImageIcon,
  FileText,
  Euro,
  MapPinned,
  Shield,
  Eye,
  Calendar,
} from 'lucide-react';
import { toast } from 'sonner';

interface AddAssetModalProps {
  onClose: () => void;
  onSave: (asset: any) => void;
}

export function AddAssetModal({ onClose, onSave }: AddAssetModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    brand: '',
    model: '',
    description: '',
    photos: [] as string[],
    pricePerDay: '',
    pricePerWeek: '',
    deposit: '',
    address: '',
    deliveryAvailable: false,
    deliveryFee: '',
    rules: '',
    checklist: '',
  });

  const steps = [
    { number: 1, title: 'Description', icon: FileText },
    { number: 2, title: 'Tarification', icon: Euro },
    { number: 3, title: 'Localisation', icon: MapPinned },
    { number: 4, title: 'Conditions', icon: Shield },
    { number: 5, title: 'Aperçu', icon: Eye },
  ];

  const categories = [
    { value: 'Tracteur', label: 'Tracteur', icon: '🚜' },
    { value: 'Couveuse', label: 'Couveuse', icon: '🥚' },
    { value: 'Remorque', label: 'Remorque', icon: '🚛' },
    { value: 'Scie', label: 'Scie / Tronçonneuse', icon: '🪚' },
    { value: 'Pulvérisateur', label: 'Pulvérisateur', icon: '💧' },
    { value: 'Outil', label: 'Autre outil', icon: '🔧' },
  ];

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = (isDraft: boolean) => {
    const asset = {
      ...formData,
      status: isDraft ? 'draft' : 'published',
      id: `EQ-${Math.floor(Math.random() * 10000)}`,
    };
    onSave(asset);
    toast.success(isDraft ? 'Brouillon enregistré' : 'Actif publié avec succès !');
    onClose();
  };

  const handlePhotoUpload = () => {
    // Simulation d'upload
    if (formData.photos.length < 3) {
      setFormData({
        ...formData,
        photos: [...formData.photos, `photo-${formData.photos.length + 1}`],
      });
      toast.success('Photo ajoutée');
    } else {
      toast.error('Maximum 3 photos');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-card border rounded-lg shadow-xl w-full max-w-4xl my-8">
        {/* Header */}
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h2 className="text-xl font-bold">Ajouter un actif</h2>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Stepper */}
        <div className="px-6 py-4 border-b bg-muted/30">
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = currentStep > step.number;
              const isCurrent = currentStep === step.number;

              return (
                <div key={step.number} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`h-10 w-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                        isCompleted
                          ? 'bg-green-600 border-green-600 text-white'
                          : isCurrent
                          ? 'bg-[#2563eb] border-[#2563eb] text-white'
                          : 'bg-background border-gray-300 text-muted-foreground'
                      }`}
                    >
                      {isCompleted ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                    </div>
                    <span
                      className={`text-xs mt-2 font-medium ${
                        isCurrent ? 'text-[#2563eb]' : 'text-muted-foreground'
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`h-0.5 flex-1 mx-2 -mt-8 ${
                        isCompleted ? 'bg-green-600' : 'bg-gray-300'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 min-h-[400px]">
          {/* Step 1: Description */}
          {currentStep === 1 && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div>
                <label className="block text-sm font-medium mb-2">Titre de l'annonce *</label>
                <input
                  type="text"
                  placeholder="Ex: Tracteur John Deere 6250R"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Catégorie *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background"
                  >
                    <option value="">Sélectionner...</option>
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.icon} {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Marque</label>
                  <input
                    type="text"
                    placeholder="Ex: John Deere"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Modèle</label>
                <input
                  type="text"
                  placeholder="Ex: 6250R - 250 CV"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description *</label>
                <textarea
                  placeholder="Décrivez votre équipement en détail..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={5}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Photos (max 3) *</label>
                <div className="grid grid-cols-3 gap-4">
                  {formData.photos.map((photo, index) => (
                    <div
                      key={index}
                      className="aspect-square border-2 border-dashed rounded-lg flex items-center justify-center bg-green-50 dark:bg-green-900/20 border-green-300"
                    >
                      <div className="text-center">
                        <ImageIcon className="h-8 w-8 mx-auto text-green-600 mb-2" />
                        <p className="text-xs text-green-700 dark:text-green-400">
                          Photo {index + 1}
                        </p>
                      </div>
                    </div>
                  ))}
                  {formData.photos.length < 3 && (
                    <button
                      onClick={handlePhotoUpload}
                      className="aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center hover:border-[#2563eb] hover:bg-[#2563eb]/5 transition-colors"
                    >
                      <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-xs text-muted-foreground">Ajouter une photo</p>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Tarification */}
          {currentStep === 2 && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Prix par jour (€) *</label>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="450"
                      value={formData.pricePerDay}
                      onChange={(e) => setFormData({ ...formData, pricePerDay: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      €
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Prix par semaine (€)
                    <span className="text-xs text-muted-foreground ml-1">(optionnel)</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="2800"
                      value={formData.pricePerWeek}
                      onChange={(e) => setFormData({ ...formData, pricePerWeek: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      €
                    </span>
                  </div>
                  {formData.pricePerDay && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Suggestion: {(parseFloat(formData.pricePerDay) * 6.2).toFixed(0)}€ (remise
                      11%)
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Dépôt de garantie (€) *</label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="2000"
                    value={formData.deposit}
                    onChange={(e) => setFormData({ ...formData, deposit: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    €
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Montant remboursé après inspection du matériel
                </p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-[#2563eb]" />
                  Calendrier de blocage
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Indiquez les périodes où votre équipement ne sera pas disponible
                </p>
                <button className="px-4 py-2 bg-[#2563eb] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors text-sm">
                  Configurer les indisponibilités
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Localisation */}
          {currentStep === 3 && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div>
                <label className="block text-sm font-medium mb-2">Adresse de retrait *</label>
                <input
                  type="text"
                  placeholder="123 Rue de la Ferme, Lyon"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  L'adresse exacte ne sera visible qu'après réservation
                </p>
              </div>

              <div className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Livraison possible</h4>
                    <p className="text-sm text-muted-foreground">
                      Proposez de livrer l'équipement chez le locataire
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.deliveryAvailable}
                      onChange={(e) =>
                        setFormData({ ...formData, deliveryAvailable: e.target.checked })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#2563eb]"></div>
                  </label>
                </div>

                {formData.deliveryAvailable && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Frais de livraison (€)</label>
                    <div className="relative">
                      <input
                        type="number"
                        placeholder="50"
                        value={formData.deliveryFee}
                        onChange={(e) => setFormData({ ...formData, deliveryFee: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        €
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Conditions */}
          {currentStep === 4 && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div>
                <label className="block text-sm font-medium mb-2">Règles de location</label>
                <textarea
                  placeholder="Ex:&#10;- Permis de conduire valide requis&#10;- Carburant à la charge du locataire&#10;- Retour propre exigé"
                  value={formData.rules}
                  onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Checklist de remise</label>
                <textarea
                  placeholder="Ex:&#10;- Vérifier le niveau d'huile&#10;- Inspecter les pneus&#10;- Tester tous les équipements"
                  value={formData.checklist}
                  onChange={(e) => setFormData({ ...formData, checklist: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background resize-none"
                />
              </div>
            </div>
          )}

          {/* Step 5: Aperçu */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="bg-muted/50 border-2 border-dashed rounded-lg p-8">
                <h3 className="text-lg font-semibold mb-4 text-center">Aperçu de votre annonce</h3>

                <div className="bg-card border rounded-lg overflow-hidden max-w-2xl mx-auto">
                  {/* Preview Header */}
                  <div className="relative h-48 bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 flex items-center justify-center">
                    <div className="text-8xl">
                      {categories.find((c) => c.value === formData.category)?.icon || '📦'}
                    </div>
                  </div>

                  {/* Preview Content */}
                  <div className="p-6 space-y-4">
                    <div>
                      <h2 className="text-2xl font-bold">
                        {formData.title || "Titre de l'annonce"}
                      </h2>
                      <p className="text-muted-foreground">
                        {formData.model || formData.brand || 'Modèle'}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div>
                        <div className="text-3xl font-bold text-[#2563eb]">
                          {formData.pricePerDay || '0'}€
                        </div>
                        <div className="text-sm text-muted-foreground">par jour</div>
                      </div>
                      {formData.pricePerWeek && (
                        <div className="text-right">
                          <div className="text-xl font-semibold">{formData.pricePerWeek}€</div>
                          <div className="text-xs text-muted-foreground">par semaine</div>
                        </div>
                      )}
                    </div>

                    {formData.description && (
                      <div className="pt-4 border-t">
                        <p className="text-sm text-muted-foreground">{formData.description}</p>
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-sm text-center text-muted-foreground mt-4">
                  Voici comment les locataires verront votre annonce
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t flex items-center justify-between bg-muted/30">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className="px-4 py-2 border rounded-lg hover:bg-background transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Précédent
          </button>

          <div className="flex gap-3">
            {currentStep === 5 && (
              <button
                onClick={() => handleSave(true)}
                className="px-6 py-2 border rounded-lg hover:bg-background transition-colors"
              >
                Sauvegarder brouillon
              </button>
            )}

            {currentStep < 5 ? (
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-[#2563eb] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors flex items-center gap-2"
              >
                Suivant
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={() => handleSave(false)}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 font-medium"
              >
                <Check className="h-4 w-4" />
                Publier l'annonce
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
