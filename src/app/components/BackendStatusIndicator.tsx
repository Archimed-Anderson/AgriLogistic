import { useState, useEffect } from 'react';
import { apiClient } from '@/infrastructure/api/rest/api-client-enhanced';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { AlertCircle, CheckCircle2, Clock, RefreshCw } from 'lucide-react';

interface BackendStatusIndicatorProps {
  /**
   * Check interval in milliseconds (default: 30000 = 30 seconds)
   */
  checkInterval?: number;
  /**
   * Show detailed information
   */
  showDetails?: boolean;
  /**
   * Compact mode (minimal UI)
   */
  compact?: boolean;
}

type ConnectionStatus = 'connected' | 'disconnected' | 'checking' | 'slow';

interface DiagnosticInfo {
  status: ConnectionStatus;
  endpoint: string;
  lastCheck?: Date;
  error?: string;
  suggestion?: string;
  responseTime?: number;
}

export function BackendStatusIndicator({
  checkInterval = 30000,
  showDetails = false,
  compact = false,
}: BackendStatusIndicatorProps) {
  const [diagnostic, setDiagnostic] = useState<DiagnosticInfo>({
    status: 'checking',
    endpoint: '',
  });
  const [isManualCheck, setIsManualCheck] = useState(false);

  const checkConnection = async (manual = false) => {
    if (manual) {
      setIsManualCheck(true);
    }

    setDiagnostic((prev) => ({ ...prev, status: 'checking' }));

    const startTime = Date.now();

    try {
      const result = await apiClient.diagnoseConnection();
      const responseTime = Date.now() - startTime;

      setDiagnostic({
        status: result.isReachable ? (responseTime > 2000 ? 'slow' : 'connected') : 'disconnected',
        endpoint: result.endpoint,
        lastCheck: new Date(),
        error: result.error,
        suggestion: result.suggestion,
        responseTime,
      });
    } catch (error) {
      setDiagnostic({
        status: 'disconnected',
        endpoint: 'Unknown',
        lastCheck: new Date(),
        error: 'Diagnostic failed',
        suggestion: 'Unable to check backend status',
      });
    } finally {
      if (manual) {
        setTimeout(() => setIsManualCheck(false), 1000);
      }
    }
  };

  useEffect(() => {
    // Initial check
    checkConnection();

    // Set up periodic checks
    const intervalId = setInterval(() => {
      checkConnection();
    }, checkInterval);

    return () => clearInterval(intervalId);
  }, [checkInterval]);

  const getStatusIcon = () => {
    switch (diagnostic.status) {
      case 'connected':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'slow':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'disconnected':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'checking':
        return <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />;
    }
  };

  const getStatusBadge = () => {
    const variants: Record<ConnectionStatus, any> = {
      connected: 'default',
      slow: 'secondary',
      disconnected: 'destructive',
      checking: 'outline',
    };

    const labels: Record<ConnectionStatus, string> = {
      connected: 'Connecté',
      slow: 'Lent',
      disconnected: 'Déconnecté',
      checking: 'Vérification...',
    };

    return (
      <Badge variant={variants[diagnostic.status]} className="gap-1.5">
        {getStatusIcon()}
        {labels[diagnostic.status]}
      </Badge>
    );
  };

  const getTooltipContent = () => {
    const parts = [`Endpoint: ${diagnostic.endpoint}`];

    if (diagnostic.lastCheck) {
      parts.push(`Dernière vérification: ${diagnostic.lastCheck.toLocaleTimeString()}`);
    }

    if (diagnostic.responseTime !== undefined) {
      parts.push(`Temps de réponse: ${diagnostic.responseTime}ms`);
    }

    if (diagnostic.error) {
      parts.push(`Erreur: ${diagnostic.error}`);
    }

    return parts.join('\n');
  };

  if (compact) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => checkConnection(true)}
              className="inline-flex items-center gap-1.5 hover:opacity-80 transition-opacity"
              aria-label="Backend status"
            >
              {getStatusIcon()}
            </button>
          </TooltipTrigger>
          <TooltipContent className="whitespace-pre-line max-w-xs">
            <p className="font-medium mb-1">État du backend</p>
            <p className="text-xs">{getTooltipContent()}</p>
            {diagnostic.suggestion && (
              <p className="text-xs mt-2 text-muted-foreground">{diagnostic.suggestion}</p>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <div className="flex items-center gap-3 p-3 border rounded-lg bg-card">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium">Backend Status</span>
          {getStatusBadge()}
        </div>

        {showDetails && (
          <div className="text-xs text-muted-foreground space-y-1">
            <p>
              Endpoint:{' '}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">{diagnostic.endpoint}</code>
            </p>
            {diagnostic.responseTime !== undefined && (
              <p>Temps de réponse: {diagnostic.responseTime}ms</p>
            )}
            {diagnostic.lastCheck && (
              <p>Dernière vérification: {diagnostic.lastCheck.toLocaleTimeString()}</p>
            )}
            {diagnostic.error && <p className="text-destructive">Erreur: {diagnostic.error}</p>}
            {diagnostic.suggestion && (
              <p className="text-yellow-600 mt-2 whitespace-pre-line text-xs">
                {diagnostic.suggestion}
              </p>
            )}
          </div>
        )}
      </div>

      <Button
        size="sm"
        variant="outline"
        onClick={() => checkConnection(true)}
        disabled={diagnostic.status === 'checking'}
      >
        <RefreshCw className={`h-3 w-3 ${isManualCheck ? 'animate-spin' : ''}`} />
      </Button>
    </div>
  );
}
