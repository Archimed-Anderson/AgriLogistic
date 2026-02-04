import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class RoutingService {
  private readonly osrmBaseUrl: string;

  constructor(private configService: ConfigService) {
    this.osrmBaseUrl = this.configService.get('OSRM_URL', 'http://router.project-osrm.org');
  }

  /**
   * Calcule le trajet le plus rapide entre deux points via OSRM
   */
  async getRouteInfo(start: [number, number], end: [number, number]) {
    try {
      const url = `${this.osrmBaseUrl}/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`;
      const response = await axios.get(url);
      
      if (response.data.code !== 'Ok') {
        throw new Error('OSRM Route not found');
      }

      const route = response.data.routes[0];
      return {
        distance: route.distance, // mètres
        duration: route.duration, // secondes
        geometry: route.geometry,
        summary: route.legs[0].summary
      };
    } catch (error) {
      console.error('OSRM Error:', error.message);
      // Fallback: Estimation à vol d'oiseau si OSRM est down
      return null;
    }
  }

  /**
   * Estime l'ETA basée sur la durée OSRM
   */
  async estimateEta(start: [number, number], end: [number, number]): Promise<Date> {
    const info = await this.getRouteInfo(start, end);
    const now = new Date();
    if (info) {
      now.setSeconds(now.getSeconds() + info.duration);
    } else {
      // Fallback manually if OSRM fails (assume 50km/h avg)
      now.setHours(now.getHours() + 2); 
    }
    return now;
  }
}
