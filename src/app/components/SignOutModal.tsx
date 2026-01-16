import { useState, useEffect } from "react";
import { LogOut, AlertTriangle, CheckCircle, Download, Smartphone, Shield, Clock } from "lucide-react";

interface SignOutModalProps {
  onClose: () => void;
  onConfirm: () => void;
  userRole?: string;
}

export function SignOutModal({ onClose, onConfirm, userRole = "user" }: SignOutModalProps) {
  const [signOutAll, setSignOutAll] = useState(false);
  const [clearData, setClearData] = useState(false);
  const [redirectTo, setRedirectTo] = useState("home");
  const [autoSignOut, setAutoSignOut] = useState(false);
  const [countdown, setCountdown] = useState(30);

  // Check for pending actions
  const pendingDownloads = 3;
  const isAdmin = userRole === "admin";
  const otherAdminsOnline = 0;

  const getContextualMessage = () => {
    if (pendingDownloads > 0) {
      return {
        icon: <AlertTriangle className="h-6 w-6 text-orange-600" />,
        type: "warning",
        message: `⚠️ Vous avez ${pendingDownloads} téléchargement${pendingDownloads > 1 ? "s" : ""} en cours`,
        color: "orange",
      };
    }

    if (isAdmin && otherAdminsOnline === 0) {
      return {
        icon: <AlertTriangle className="h-6 w-6 text-red-600" />,
        type: "warning",
        message: "⚠️ Aucun autre admin n'est connecté",
        color: "red",
      };
    }

    return {
      icon: <CheckCircle className="h-6 w-6 text-green-600" />,
      type: "success",
      message: "✅ Prêt à vous déconnecter",
      color: "green",
    };
  };

  const contextMessage = getContextualMessage();

  // Auto sign out countdown
  useEffect(() => {
    if (!autoSignOut) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleConfirm();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [autoSignOut]);

  const handleConfirm = () => {
    // Perform sign out with selected options
    onConfirm();
  };

  const handleCancelAutoSignOut = () => {
    setAutoSignOut(false);
    setCountdown(30);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-card border rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="px-6 py-4 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#2563eb]/10 rounded-lg">
              <LogOut className="h-6 w-6 text-[#2563eb]" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Déconnexion</h2>
              <p className="text-sm text-muted-foreground">
                Êtes-vous sûr de vouloir vous déconnecter ?
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Contextual Message */}
          <div
            className={`flex items-start gap-3 p-4 rounded-lg ${
              contextMessage.type === "warning"
                ? contextMessage.color === "orange"
                  ? "bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800"
                  : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                : "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
            }`}
          >
            {contextMessage.icon}
            <div className="flex-1">
              <p
                className={`text-sm ${
                  contextMessage.type === "warning"
                    ? contextMessage.color === "orange"
                      ? "text-orange-800 dark:text-orange-200"
                      : "text-red-800 dark:text-red-200"
                    : "text-green-800 dark:text-green-200"
                }`}
              >
                {contextMessage.message}
              </p>
              {pendingDownloads > 0 && (
                <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                  Vos téléchargements seront annulés si vous vous déconnectez maintenant.
                </p>
              )}
            </div>
          </div>

          {/* Options */}
          <div className="space-y-4">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={signOutAll}
                onChange={(e) => setSignOutAll(e.target.checked)}
                className="mt-1 h-5 w-5 rounded border-gray-300 text-[#2563eb] focus:ring-[#2563eb]"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Se déconnecter de tous les appareils</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Terminer toutes les sessions actives sur vos autres appareils
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={clearData}
                onChange={(e) => setClearData(e.target.checked)}
                className="mt-1 h-5 w-5 rounded border-gray-300 text-[#2563eb] focus:ring-[#2563eb]"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Effacer les données locales du navigateur</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Supprimer le cache et les données stockées localement
                </p>
              </div>
            </label>

            <div className="space-y-2">
              <label className="text-sm font-medium">Rediriger vers :</label>
              <select
                value={redirectTo}
                onChange={(e) => setRedirectTo(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background"
              >
                <option value="home">Page d'accueil</option>
                <option value="login">Page de connexion</option>
                <option value="public">Site public</option>
              </select>
            </div>

            {/* Auto Sign Out */}
            <div className="border-t pt-4">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={autoSignOut}
                  onChange={(e) => setAutoSignOut(e.target.checked)}
                  className="mt-1 h-5 w-5 rounded border-gray-300 text-[#2563eb] focus:ring-[#2563eb]"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Déconnexion automatique</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Se déconnecter automatiquement dans 30 secondes
                  </p>
                </div>
              </label>

              {autoSignOut && (
                <div className="mt-3 p-3 bg-muted rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">
                      Déconnexion dans : <span className="text-[#2563eb]">{countdown}s</span>
                    </span>
                    <button
                      onClick={handleCancelAutoSignOut}
                      className="text-xs text-[#2563eb] hover:underline"
                    >
                      Annuler
                    </button>
                  </div>
                  <div className="h-2 bg-background rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#2563eb] transition-all duration-1000"
                      style={{ width: `${((30 - countdown) / 30) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Admin Warning */}
          {isAdmin && otherAdminsOnline === 0 && (
            <div className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <p className="text-xs text-yellow-800 dark:text-yellow-200">
                <strong>Attention :</strong> Vous êtes le seul administrateur connecté. Assurez-vous qu'un autre admin peut prendre le relais.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg hover:bg-muted transition-colors"
            disabled={autoSignOut}
          >
            Annuler
          </button>
          <button
            onClick={handleConfirm}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Se déconnecter
          </button>
        </div>
      </div>
    </div>
  );
}
