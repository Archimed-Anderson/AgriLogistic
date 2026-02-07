import { Controller, Sse, MessageEvent, Param } from '@nestjs/common';
import { Observable, interval, map, fromEvent } from 'rxjs';

@Controller('agri-direct')
export class AgriDirectController {
  
  /**
   * Endpoint de Flux Temps Réel (B2C)
   * Notifie le consommateur de l'état de son panier (Assemblage, Prêt, Livraison).
   */
  @Sse('order-status/:orderId')
  streamOrderStatus(@Param('orderId') orderId: string): Observable<MessageEvent> {
    this.logger.log(`📱 Stream ouvert pour la commande: ${orderId}`);

    // Simulation d'étapes de commande via un intervalle (pour démonstration)
    // En production, cela serait lié à un Event Emitter interne déclenché par Kafka
    const statuses = ['ASSEMBLAGE', 'CONTROLE_QUALITE', 'EMBALLAGE', 'PRET_POUR_EXPEDITION'];
    
    return interval(5000).pipe(
      map((step) => {
        const currentStatus = statuses[step % statuses.length];
        return {
          data: {
            orderId,
            status: currentStatus,
            timestamp: new Date().toISOString(),
            message: `Votre commande est actuellement en phase de ${currentStatus.toLowerCase().replace('_', ' ')}.`
          }
        };
      })
    );
  }

  private logger = { log: (msg: string) => console.log(`[AgriDirect] ${msg}`) };
}
