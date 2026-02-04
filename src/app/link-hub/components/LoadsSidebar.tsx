/**
 * LOADS SIDEBAR COMPONENT
 * Liste flottante des chargements en temps réel
 */

import React from 'react';
import { List } from 'react-window';
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
  onProposeCourse,
}) => {
  const Row = ({
    index,
    style,
    ariaAttributes,
    loads: listLoads,
    selectedLoad: sel,
    onSelectLoad: onSel,
    onProposeCourse: onProp,
  }: {
    index: number;
    style: React.CSSProperties;
    ariaAttributes: { role: 'listitem'; 'aria-posinset': number; 'aria-setsize': number };
    loads: Load[];
    selectedLoad: Load | null;
    onSelectLoad: (l: Load) => void;
    onProposeCourse: (l: Load) => void;
  }) => {
    const load = listLoads[index];
    const isSelected = sel?.id === load.id;
    return (
      <div style={style} className="px-4 py-2" {...ariaAttributes}>
        <LoadCard
          load={load}
          isSelected={isSelected}
          onClick={() => onSel(load)}
          onAction={() => onProp(load)}
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
      <div className="sidebar-list-container" style={{ height: 600 }}>
        <List
          rowCount={loads.length}
          rowHeight={160}
          rowComponent={Row}
          rowProps={{ loads, selectedLoad, onSelectLoad, onProposeCourse } as never}
          style={{ height: 600, width: '100%' }}
        />
      </div>
    </aside>
  );
};

export default LoadsSidebar;
