/**
 * LOADS SIDEBAR COMPONENT
 * Liste flottante des chargements en temps réel
 */

import React from 'react';
import { FixedSizeList as List } from 'react-window';
import LoadCard from './LoadCard';
import { type Load } from '../../data/logistics-operations';

interface LoadsSidebarProps {
  loads: Load[];
  selectedLoad: Load | null;
  onSelectLoad: (load: Load) => void;
  onProposeCourse: (load: Load) => void;
}

const LoadsSidebar: React.FC<LoadsSidebarProps> = ({ 
  loads, 
  selectedLoad, 
  onSelectLoad, 
  onProposeCourse 
}) => {
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const load = loads[index];
    const isSelected = selectedLoad?.id === load.id;

    return (
      <div style={style} className="px-4 py-2">
        <LoadCard 
          load={load}
          isSelected={isSelected}
          onClick={() => onSelectLoad(load)}
          onAction={() => onProposeCourse(load)}
        />
      </div>
    );
  };

  return (
    <aside className="command-sidebar left-sidebar">
      <div className="sidebar-header">
        <h2>📦 Requêtes Actives</h2>
        <span className="count-badge">{loads.length}</span>
      </div>
      
      <div className="sidebar-search">
        <input type="text" placeholder="Filtrer par produit, ville..." />
      </div>

      <div className="sidebar-list-container">
        <List
          height={600}
          itemCount={loads.length}
          itemSize={160}
          width="100%"
        >
          {Row}
        </List>
      </div>
    </aside>
  );
};

export default LoadsSidebar;
