import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';
import { healthCheckService } from '@infrastructure/api/health-check';

interface BackendStatusProps {
  onClose: () => void;
}

export function BackendStatus({ onClose }: BackendStatusProps) {
  const [checking, setChecking] = useState(true);
  const [healthStatus, setHealthStatus] = useState<{
    healthy: boolean;
    gateway: { available: boolean; message: string; endpoint?: string };
    authService: { available: boolean; message: string };
    recommendations: string[];
  } | null>(null);

  const checkHealth = async () => {
    setChecking(true);
    try {
      const status = await healthCheckService.performHealthCheck();
      setHealthStatus(status);
    } catch (error) {
      console.error('Health check error:', error);
      setHealthStatus({
        healthy: false,
        gateway: { available: false, message: 'Erreur lors de la vérification' },
        authService: { available: false, message: 'Erreur lors de la vérification' },
        recommendations: ['Impossible de vérifier l\'état du backend.'],
      });
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  if (!healthStatus) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="mx-4 max-w-2xl rounded-xl bg-white p-6 shadow-2xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {healthStatus.healthy ? (
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            ) : (
              <AlertCircle className="h-8 w-8 text-orange-600" />
            )}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                État des services backend
              </h2>
              <p className="text-sm text-gray-600">
                {healthStatus.healthy ? 'Tous les services sont opérationnels' : 'Certains services ne sont pas accessibles'}
              </p>
            </div>
          </div>
          <button
            onClick={checkHealth}
            disabled={checking}
            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
            title="Rafraîchir"
          >
            <RefreshCw className={`h-5 w-5 ${checking ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Services Status */}
        <div className="mb-6 space-y-3">
          <div className={`flex items-center justify-between rounded-lg border p-4 ${healthStatus.gateway.available ? 'border-green-200 bg-green-50' : 'border-orange-200 bg-orange-50'}`}>
            <div className="flex items-center gap-3">
              {healthStatus.gateway.available ? (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              ) : (
                <AlertCircle className="h-5 w-5 text-orange-600" />
              )}
              <div>
                <div className="font-semibold text-gray-900">Kong API Gateway</div>
                <div className="text-sm text-gray-600">{healthStatus.gateway.message}</div>
                {healthStatus.gateway.endpoint && (
                  <div className="text-xs text-gray-500 font-mono">{healthStatus.gateway.endpoint}</div>
                )}
              </div>
            </div>
          </div>

          <div className={`flex items-center justify-between rounded-lg border p-4 ${healthStatus.authService.available ? 'border-green-200 bg-green-50' : 'border-orange-200 bg-orange-50'}`}>
            <div className="flex items-center gap-3">
              {healthStatus.authService.available ? (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              ) : (
                <AlertCircle className="h-5 w-5 text-orange-600" />
              )}
              <div>
                <div className="font-semibold text-gray-900">Service d'authentification</div>
                <div className="text-sm text-gray-600">{healthStatus.authService.message}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        {healthStatus.recommendations.length > 0 && (
          <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
            <div className="mb-2 font-semibold text-blue-900">
              Recommandations:
            </div>
            <ul className="space-y-2 text-sm text-blue-800">
              {healthStatus.recommendations.map((rec, index) => (
                <li key={index} className={rec.startsWith('  •') || rec.startsWith('  ') ? 'ml-4 font-mono text-xs' : ''}>
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg bg-gray-100 px-4 py-2 font-medium text-gray-700 hover:bg-gray-200"
          >
            {healthStatus.healthy ? 'Continuer' : 'Fermer'}
          </button>
          {!healthStatus.healthy && (
            <button
              onClick={checkHealth}
              disabled={checking}
              className="rounded-lg bg-primary px-4 py-2 font-medium text-white hover:bg-primary/90 disabled:opacity-50"
            >
              {checking ? 'Vérification...' : 'Réessayer'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
