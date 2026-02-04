/**
 * ADMIN GLOBAL MONITOR PAGE
 * "God Mode" dashboard pour superviser l'ensemble de la plateforme.
 */

import React, { useState, useEffect } from 'react';
import './link-monitor.css';

// Components
import GlobalFlowMap from './components/GlobalFlowMap';
import StrategicKPIs from './components/StrategicKPIs';
import TransactionTable from './components/TransactionTable';

// Data
import { mockLoads } from '../../data/logistics-operations';

const GlobalMonitorPage: React.FC = () => {
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsInitializing(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isInitializing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#050505] text-cyan-500 font-mono">
        <div className="w-16 h-16 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mb-4"></div>
        <div className="animate-pulse tracking-widest text-xs font-black uppercase">
          Chargement du Global Monitor...
        </div>
      </div>
    );
  }

  return (
    <div className="admin-monitor-container">
      {/* Header */}
      <header className="monitor-header-premium">
        <div className="header-title-group">
          <h1>
            GLOBAL MONITOR <span>v3.0</span>
          </h1>
          <div className="badge-live">
            <span className="live-dot"></span>
            SYSTÈME OPÉRATIONNEL - TEMPS RÉEL
          </div>
        </div>

        <div className="flex gap-4">
          <button className="px-4 py-2 border border-white/5 rounded-lg bg-white/5 text-xs font-bold hover:bg-white/10 transition-all">
            MODES DE VUE
          </button>
          <button className="px-4 py-2 bg-cyan-500 text-black text-xs font-black rounded-lg hover:bg-cyan-400 transition-all">
            INTERVENTION D'URGENCE
          </button>
        </div>
      </header>

      {/* KPIs Stratégiques */}
      <StrategicKPIs />

      {/* Carte des Flux Mondiaux (God Mode) */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-black text-gray-500 uppercase tracking-widest">
            Flux Logistiques Actifs
          </h2>
          <span className="text-[10px] text-cyan-400 font-mono">MAP_MODE: BEZIER_ARCS</span>
        </div>
        <GlobalFlowMap loads={mockLoads} />
      </div>

      {/* Console de Transactions */}
      <TransactionTable loads={mockLoads} />

      {/* Footer / Status Bar */}
      <footer className="mt-8 pt-4 border-t border-white/5 flex justify-between items-center text-[10px] text-gray-600 font-mono">
        <div>COORDINATES_CHECK: SUCCESS | ENCRYPTION: AES-256</div>
        <div>AGRILOGISTIC LINK © 2026 - CONFIDENTIAL ADMIN ACCESS</div>
      </footer>
    </div>
  );
};

export default GlobalMonitorPage;
