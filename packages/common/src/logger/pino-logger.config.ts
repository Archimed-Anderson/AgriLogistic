import { LoggerModule } from 'nestjs-pino';
import { RequestMethod } from '@nestjs/common';

/**
 * 👁️ Config du Logger Pino Standardisé pour tous les microservices.
 *
 * Utilise pino-http pour logger automatiquement les requetes.
 * Utilise pino-pretty en mode DEV pour lisibilité.
 * Utilise JSON formatter en PROD pour ingestion Loki/ELK.
 */
export const StandardLoggerModule = LoggerModule.forRoot({
  pinoHttp: {
    level: process.env.LOG_LEVEL || 'info',
    // En développement, on veut du pretty print. En prod, du JSON pur.
    transport: process.env.NODE_ENV !== 'production'
      ? {
          target: 'pino-pretty',
          options: {
            singleLine: true,
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname',
          },
        }
      : undefined,
    
    // Obfuscation et sélection des données utiles
    serializers: {
      req: (req: any) => ({
        id: req.id,
        method: req.method,
        url: req.url,
        // On ne loggue pas tous les headers pour sécurité/taille
        userAgent: req.headers['user-agent'],
        ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      }),
      res: (res: any) => ({
        statusCode: res.statusCode,
      }),
    },
    
    // Exclure les logs de health check pour ne pas spammer Loki
    autoLogging: {
      ignore: (req) => {
        return !!(req.url?.includes('/health') || req.url?.includes('/metrics'));
      },
    },

    customProps: (req, res) => ({
      service: process.env.SERVICE_NAME || 'unknown-service',
      context: 'HTTP',
    }),
  },
  // Exclure les routes de health check du logger global NestJS aussi
  exclude: [{ method: RequestMethod.ALL, path: 'health' }],
});
