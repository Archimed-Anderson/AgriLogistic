/**
 * STATS HEADER COMPONENT
 * Dashboard minimaliste au sommet du centre de commande
 */

import React from 'react';
import { type LogisticsAnalytics } from '../../data/logistics-operations';

interface StatsHeaderProps {
  analytics: LogisticsAnalytics;
}

const StatsHeader: React.FC<StatsHeaderProps> = ({ analytics }) => {
  return (
    <header className="command-header">
      <div className="header-brand">
        <div className="pulse-indicator"></div>
        <h1>
          AGRILOGISTIC LINK <span>COMMAND CENTER</span>
        </h1>
      </div>

      <div className="header-stats">
        <div className="stat-card">
          <span className="stat-label">CHARGEMENTS</span>
          <span className="stat-value">{analytics.activeLoads}</span>
          <span className="stat-trend positive">↑ 12%</span>
        </div>

        <div className="stat-card">
          <span className="stat-label">CAMIONS</span>
          <span className="stat-value">{analytics.availableTrucks}</span>
          <span className="stat-trend neutral">→ 0%</span>
        </div>

        <div className="stat-card">
          <span className="stat-label">TAUX DE MATCH</span>
          <span className="stat-value">{(analytics.matchRate * 100).toFixed(1)}%</span>
          <span className="stat-trend positive">↑ 5%</span>
        </div>

        <div className="stat-card">
          <span className="stat-label">TEMPS MOYEN</span>
          <span className="stat-value">{analytics.averageMatchTime} min</span>
        </div>
      </div>

      <div className="header-actions">
        <button className="icon-button">🔔</button>
        <button className="icon-button">⚙️</button>
        <div className="user-profile">
          <img
            src="https://ui-avatars.com/api/?name=Admin+Logistique&background=667eea&color=fff"
            alt="Profile"
          />
        </div>
      </div>
    </header>
  );
};

export default StatsHeader;
