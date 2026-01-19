import { useState, useRef } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Upload,
  X,
  Check,
  Save,
  Download,
  Sun,
  Moon,
  Monitor,
  Globe,
  Eye,
  EyeOff,
  BarChart3,
  TrendingUp,
  Users,
  Heart,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";

export function ProfilePage() {
  const [avatar, setAvatar] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form data
  const [formData, setFormData] = useState({
    firstName: "Admin",
    lastName: "User",
    username: "admin_AgroLogistic",
    email: "admin@AgroLogistic.fr",
    phone: "+33 6 12 34 56 78",
    address: "123 Rue de l'Agriculture, 69000 Lyon",
    bio: "Passionné d'agriculture depuis 10 ans. Spécialisé dans la gestion de la chaîne d'approvisionnement.",
  });

  // Preferences
  const [theme, setTheme] = useState<"light" | "dark" | "auto">("auto");
  const [language, setLanguage] = useState("fr");
  const [visibility, setVisibility] = useState({
    email: "private",
    phone: "private",
    address: "private",
  });

  // Stats (mock data)
  const stats = {
    followers: 128,
    posts: 34,
    engagement: 42,
    activityData: [12, 19, 15, 25, 22, 18, 28], // Last 7 days
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      simulateUpload(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      simulateUpload(file);
    }
  };

  const simulateUpload = (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      
      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        
        if (progress >= 100) {
          clearInterval(interval);
          setAvatar(result);
          setIsUploading(false);
          setHasChanges(true);
          toast.success("Photo de profil mise à jour");
        }
      }, 100);
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteAvatar = () => {
    setAvatar(null);
    setHasChanges(true);
    toast.success("Photo de profil supprimée");
  };

  const handleFieldChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    setHasChanges(true);
  };

  const handleSave = () => {
    toast.success("Profil enregistré avec succès");
    setHasChanges(false);
  };

  const handleCancel = () => {
    if (hasChanges) {
      setShowCancelModal(true);
    }
  };

  const confirmCancel = () => {
    // Reset form
    setShowCancelModal(false);
    setHasChanges(false);
    toast.info("Modifications annulées");
  };

  const handleExportData = () => {
    toast.success("Export de vos données en cours...");
  };

  const maxBioLength = 500;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mon Profil</h1>
        <p className="text-muted-foreground mt-2">
          Gérez vos informations personnelles et vos préférences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Avatar Upload Section */}
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6">Photo de profil</h2>
            
            <div className="flex items-start gap-6">
              {/* Avatar Preview */}
              <div className="relative">
                <div className="h-32 w-32 bg-gradient-to-br from-[#2563eb] to-blue-400 rounded-full flex items-center justify-center text-white text-4xl font-bold overflow-hidden">
                  {avatar ? (
                    <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    formData.firstName.charAt(0) + formData.lastName.charAt(0)
                  )}
                </div>
                {avatar && (
                  <button
                    onClick={handleDeleteAvatar}
                    className="absolute -top-2 -right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Upload Area */}
              <div className="flex-1">
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  className="border-2 border-dashed rounded-lg p-6 text-center hover:border-[#2563eb] transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-sm font-medium mb-1">
                    Glissez-déposez une image ou cliquez pour parcourir
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG jusqu'à 5MB
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>

                {/* Upload Progress */}
                {isUploading && (
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Upload en cours...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#2563eb] transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Identity Section */}
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <User className="h-5 w-5 text-[#2563eb]" />
              Identité
            </h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Prénom *</label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleFieldChange("firstName", e.target.value)}
                    className="w-full px-4 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background"
                  />
                  {formData.firstName && (
                    <Check className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Nom *</label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleFieldChange("lastName", e.target.value)}
                    className="w-full px-4 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background"
                  />
                  {formData.lastName && (
                    <Check className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
                  )}
                </div>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium mb-2">Nom d'utilisateur</label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => handleFieldChange("username", e.target.value)}
                    className="w-full px-4 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background"
                  />
                  {formData.username && (
                    <Check className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Mail className="h-5 w-5 text-[#2563eb]" />
              Contact
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Email *</label>
                <div className="relative">
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleFieldChange("email", e.target.value)}
                    className="w-full px-4 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background"
                  />
                  {formData.email.includes("@") && (
                    <Check className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Téléphone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleFieldChange("phone", e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Adresse</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleFieldChange("address", e.target.value)}
                  placeholder="Commence à taper pour l'autocomplétion..."
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background"
                />
              </div>
            </div>
          </div>

          {/* Bio Section */}
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6">Biographie</h2>
            
            <div>
              <textarea
                value={formData.bio}
                onChange={(e) => handleFieldChange("bio", e.target.value)}
                maxLength={maxBioLength}
                rows={5}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background resize-none"
                placeholder="Parlez-nous de vous..."
              />
              <div className="flex justify-between items-center mt-2 text-sm">
                <span className="text-muted-foreground">
                  Décrivez votre expertise et votre activité
                </span>
                <span className={`${formData.bio.length > maxBioLength * 0.9 ? "text-orange-600" : "text-muted-foreground"}`}>
                  {formData.bio.length}/{maxBioLength}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Preferences Widget */}
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-6">Préférences</h2>
            
            <div className="space-y-6">
              {/* Theme */}
              <div>
                <label className="block text-sm font-medium mb-3">Thème d'affichage</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: "light", icon: Sun, label: "Clair" },
                    { value: "dark", icon: Moon, label: "Sombre" },
                    { value: "auto", icon: Monitor, label: "Auto" },
                  ].map((option) => {
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.value}
                        onClick={() => {
                          setTheme(option.value as any);
                          setHasChanges(true);
                        }}
                        className={`p-3 border rounded-lg transition-all ${
                          theme === option.value
                            ? "border-[#2563eb] bg-[#2563eb]/10"
                            : "hover:bg-muted"
                        }`}
                      >
                        <Icon className="h-5 w-5 mx-auto mb-1" />
                        <div className="text-xs">{option.label}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Language */}
              <div>
                <label className="block text-sm font-medium mb-3">Langue</label>
                <select
                  value={language}
                  onChange={(e) => {
                    setLanguage(e.target.value);
                    setHasChanges(true);
                  }}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background"
                >
                  <option value="fr">🇫🇷 Français</option>
                  <option value="en">🇺🇸 English</option>
                  <option value="es">🇪🇸 Español</option>
                  <option value="de">🇩🇪 Deutsch</option>
                </select>
              </div>

              {/* Visibility */}
              <div>
                <label className="block text-sm font-medium mb-3">Visibilité</label>
                <div className="space-y-2">
                  {[
                    { key: "email", label: "Email", icon: Mail },
                    { key: "phone", label: "Téléphone", icon: Phone },
                    { key: "address", label: "Adresse", icon: MapPin },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.key} className="flex items-center justify-between p-2 hover:bg-muted rounded">
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{item.label}</span>
                        </div>
                        <select
                          value={visibility[item.key as keyof typeof visibility]}
                          onChange={(e) => {
                            setVisibility({ ...visibility, [item.key]: e.target.value });
                            setHasChanges(true);
                          }}
                          className="text-sm border rounded px-2 py-1 bg-background"
                        >
                          <option value="public">Public</option>
                          <option value="private">Privé</option>
                        </select>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Statistics Widget */}
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-6">Statistiques</h2>
            
            {/* Metrics */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#2563eb]">{stats.followers}</div>
                <div className="text-xs text-muted-foreground">Abonnés</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#2563eb]">{stats.posts}</div>
                <div className="text-xs text-muted-foreground">Publications</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#2563eb]">{stats.engagement}%</div>
                <div className="text-xs text-muted-foreground">Engagement</div>
              </div>
            </div>

            {/* Activity Chart */}
            <div>
              <div className="text-sm font-medium mb-3">Activité (7 derniers jours)</div>
              <div className="flex items-end gap-1 h-24">
                {stats.activityData.map((value, index) => (
                  <div
                    key={index}
                    className="flex-1 bg-[#2563eb] rounded-t hover:bg-[#1d4ed8] transition-colors"
                    style={{ height: `${(value / Math.max(...stats.activityData)) * 100}%` }}
                    title={`Jour ${index + 1}: ${value} actions`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between border-t pt-6">
        <button
          onClick={handleExportData}
          className="px-4 py-2 border rounded-lg hover:bg-muted transition-colors flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Exporter mes données
        </button>

        <div className="flex gap-3">
          <button
            onClick={handleCancel}
            disabled={!hasChanges}
            className="px-6 py-2 border rounded-lg hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className="px-6 py-2 bg-[#2563eb] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Enregistrer
          </button>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card border rounded-lg shadow-xl w-full max-w-md">
            <div className="px-6 py-4 border-b flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 text-orange-600" />
              <h2 className="text-xl font-bold">Modifications non sauvegardées</h2>
            </div>

            <div className="p-6">
              <p className="text-muted-foreground">
                Vous avez des modifications non enregistrées. Êtes-vous sûr de vouloir les abandonner ?
              </p>
            </div>

            <div className="px-6 py-4 border-t flex gap-3 justify-end">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 border rounded-lg hover:bg-muted transition-colors"
              >
                Continuer l'édition
              </button>
              <button
                onClick={confirmCancel}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Abandonner
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
