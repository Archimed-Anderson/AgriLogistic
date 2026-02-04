import { Injectable } from '@nestjs/common';

@Injectable()
export class GeofencingService {
  // Rayon de détection par défaut (mètres)
  private readonly DEFAULT_RADIUS = 500;

  /**
   * Vérifie si une position GPS est dans une zone définie (Geo-fence)
   */
  isPointInZone(
    lat: number, 
    lng: number, 
    zoneLat: number, 
    zoneLng: number, 
    radius: number = this.DEFAULT_RADIUS
  ): boolean {
    const distance = this.calculateDistance(lat, lng, zoneLat, zoneLng);
    return distance <= radius;
  }

  /**
   * Formule de Haversine pour calculer la distance entre deux points GPS
   */
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // Rayon de la terre en mètres
    const f1 = lat1 * Math.PI / 180;
    const f2 = lat2 * Math.PI / 180;
    const df = (lat2 - lat1) * Math.PI / 180;
    const dl = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(df / 2) * Math.sin(df / 2) +
              Math.cos(f1) * Math.cos(f2) *
              Math.sin(dl / 2) * Math.sin(dl / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance en mètres
  }

  /**
   * Analyse automatique de changement de statut basé sur la position
   */
  checkAutoStatusChange(currentLat: number, currentLng: number, targetLat: number, targetLng: number): string | null {
    if (this.isPointInZone(currentLat, currentLng, targetLat, targetLng)) {
      return 'ARRIVED';
    }
    return null;
  }
}
