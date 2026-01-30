/**
 * ECO-ROUTE PANEL COMPONENT
 * Comparaison entre route standard et route écologique (CO2)
 */

import React from 'react';

interface EcoRoutePanelProps {
  ecoData: {
    standardCO2: number;
    ecoCO2: number;
    savings: number;
    treesEquivalent: number;
    recommendation: 'standard' | 'eco';
  } | null;
  onClose: () => void;
}

const EcoRoutePanel: React.FC<EcoRoutePanelProps> = ({ ecoData, onClose }) => {
  if (!ecoData) return null;

  const { standardCO2, ecoCO2, savings, treesEquivalent } = ecoData;

  return (
    <div className="eco-route-panel floating-panel animate-slide-up">
      <div className="panel-header">
        <h3>🌱 Option "Route Verte"</h3>
        <button className="close-button" onClick={onClose}>×</button>
      </div>

      <div className="panel-content">
        <div className="comparison-grid">
          <div className="route-option standard">
            <div className="option-title">Route Standard</div>
            <div className="stat">
              <span className="value">{standardCO2.toFixed(1)}</span>
              <span className="unit">kg CO2</span>
            </div>
            <div className="progress-bar">
              <div className="fill" style={{ width: '100%' }}></div>
            </div>
          </div>

          <div className="route-option eco">
            <div className="option-title">Eco-Route</div>
            <div className="stat">
              <span className="value">{ecoCO2.toFixed(1)}</span>
              <span className="unit">kg CO2</span>
            </div>
            <div className="progress-bar">
              <div className="fill" style={{ width: `${(ecoCO2/standardCO2*100)}%` }}></div>
            </div>
            <div className="badge">- {savings.toFixed(0)}% CO2</div>
          </div>
        </div>

        <div className="eco-impact">
          <div className="impact-text">
            Cette route économise <strong>{treesEquivalent.toFixed(2)}</strong> équivalents arbres par an.
          </div>
          <div className="impact-icons">
            {Array.from({ length: Math.min(5, Math.ceil(treesEquivalent)) }).map((_, i) => (
              <span key={i} className="tree-icon">🌳</span>
            ))}
          </div>
        </div>

        <button className="confirm-eco-button">
          Sélectionner Eco-Route
        </button>
      </div>
    </div>
  );
};

export default EcoRoutePanel;
