/**
 * AGRILOGISTIC LINK - COMMAND CENTER (PAGE PUBLIQUE)
 * Interface futuriste avec carte 3D et sidebars flottantes
 */

import React, { useState, useMemo, useEffect } from 'react';
import { toast } from 'sonner';
import './link-hub.css';

// Components
import CommandMap from './components/CommandMap';
import LoadsSidebar from './components/LoadsSidebar';
import TrucksSidebar from './components/TrucksSidebar';
import StatsHeader from './components/StatsHeader';
import EcoRoutePanel from './components/EcoRoutePanel';

// Hooks
import { useSmartMatch } from './hooks/useSmartMatch';
import { useEcoRoute } from './hooks/useEcoRoute';
import { useLiveSimulation } from './hooks/useLiveSimulation';

// Data & Helpers
import {
  mockLoads,
  mockTrucks,
  mockAnalytics,
  calculateAIMatchScore,
  calculateDistance,
  type Load,
  type Truck,
} from '../data/logistics-operations';

const LinkHubPage: React.FC = () => {
  // State
  const [selectedLoad, setSelectedLoad] = useState<Load | null>(null);
  const [selectedTruck, setSelectedTruck] = useState<Truck | null>(null);
  const [showEcoPanel, setShowEcoPanel] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Simulation de chargement
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const { loads, trucks } = useLiveSimulation(mockLoads, mockTrucks);
  const { matchingResult, findBestMatchForTruck } = useSmartMatch(loads, trucks);

  // Notification pour les nouvelles données
  useEffect(() => {
    const lastLoad = loads[0];
    if (lastLoad?.isNew) {
      toast.success(`Nouveau chargement de ${lastLoad.productType} disponible !`, {
        description: `${lastLoad.originCity ?? '-'} → ${lastLoad.destinationCity ?? '-'}`,
        icon: '🌱',
      });
    }
  }, [loads]);

  useEffect(() => {
    const lastTruck = trucks[0];
    if (lastTruck?.isNew) {
      toast.info(`Nouveau transporteur disponible : ${lastTruck.driverName}`, {
        description: `${lastTruck.truckType} à ${lastTruck.currentLocationCity ?? '-'}`,
        icon: '🚛',
      });
    }
  }, [trucks]);

  // Distance entre les deux points sélectionnés
  const currentDistance = useMemo(() => {
    if (selectedLoad && selectedTruck) {
      return calculateDistance(selectedTruck.currentPosition, selectedLoad.origin);
    }
    return 0;
  }, [selectedLoad, selectedTruck]);

  const ecoData = useEcoRoute(selectedLoad, selectedTruck, currentDistance);

  // Handlers
  const handleSelectLoad = (load: Load) => {
    setSelectedLoad(load);
    // Si un camion était sélectionné, recalculer le score ou réinitialiser
    if (selectedTruck) {
      calculateAIMatchScore(load, selectedTruck);
      // Optionnel: feedback visuel du score
    }
  };

  const handleSelectTruck = (truck: Truck) => {
    setSelectedTruck(truck);
  };

  const handleMarkerClick = (type: 'load' | 'truck', data: Load | Truck) => {
    if (type === 'load') setSelectedLoad(data as Load);
    else setSelectedTruck(data as Truck);
  };

  const handleSmartMatch = (truck: Truck) => {
    setSelectedTruck(truck);

    // Utiliser le hook pour trouver le meilleur match
    const bestLoad = findBestMatchForTruck(truck);

    if (bestLoad) {
      setSelectedLoad(bestLoad);
      setShowEcoPanel(true);

      // Animation d'annonce
      console.log(`Match AI trouvé avec score: ${matchingResult?.score}%`);
    }
  };

  const handleProposeCourse = (load: Load) => {
    setSelectedLoad(load);
    // Logique d'envoi de proposition
    alert(`Proposition envoyée pour ${load.productType} (${load.quantity}t)`);
  };

  if (isLoading) {
    return (
      <div className="command-loading">
        <div className="scanner"></div>
        <div className="loading-text">INITIALISATION DU CENTRE DE COMMANDE...</div>
      </div>
    );
  }

  return (
    <div className="command-center">
      {/* Header avec Stats */}
      <StatsHeader analytics={mockAnalytics} />

      {/* Sidebar Gauche: Chargements */}
      <LoadsSidebar
        loads={loads}
        selectedLoad={selectedLoad}
        onSelectLoad={handleSelectLoad}
        onProposeCourse={handleProposeCourse}
      />

      {/* Main Map Content */}
      <main className="map-container">
        <CommandMap
          loads={loads}
          trucks={trucks}
          selectedLoad={selectedLoad}
          selectedTruck={selectedTruck}
          onMarkerClick={handleMarkerClick}
          showEcoRoute={showEcoPanel}
        />

        {/* Panel Eco-Route (Flottant sur la carte) */}
        {showEcoPanel && selectedLoad && selectedTruck && (
          <EcoRoutePanel ecoData={ecoData} onClose={() => setShowEcoPanel(false)} />
        )}
      </main>

      {/* Sidebar Droite: Transporteurs */}
      <TrucksSidebar
        trucks={trucks}
        selectedTruck={selectedTruck}
        onSelectTruck={handleSelectTruck}
        onSmartMatch={handleSmartMatch}
      />
    </div>
  );
};

export default LinkHubPage;
