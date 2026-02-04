/**
 * TRUCKS SIDEBAR COMPONENT
 * Liste flottante des transporteurs disponibles
 */

import React from 'react';
import { List } from 'react-window';
import TruckBadge from './TruckBadge';
import { type Truck } from '../../data/logistics-operations';

interface TrucksSidebarProps {
  trucks: Truck[];
  selectedTruck: Truck | null;
  onSelectTruck: (truck: Truck) => void;
  onSmartMatch: (truck: Truck) => void;
}

const TrucksSidebar: React.FC<TrucksSidebarProps> = ({
  trucks,
  selectedTruck,
  onSelectTruck,
  onSmartMatch,
}) => {
  const Row = ({
    index,
    style,
    ariaAttributes,
    trucks: listTrucks,
    selectedTruck: sel,
    onSelectTruck: onSel,
    onSmartMatch: onMatch,
  }: {
    index: number;
    style: React.CSSProperties;
    ariaAttributes: { role: 'listitem'; 'aria-posinset': number; 'aria-setsize': number };
    trucks: Truck[];
    selectedTruck: Truck | null;
    onSelectTruck: (t: Truck) => void;
    onSmartMatch: (t: Truck) => void;
  }) => {
    const truck = listTrucks[index];
    const isSelected = sel?.id === truck.id;
    return (
      <div style={style} {...ariaAttributes}>
        <TruckBadge
          truck={truck}
          isSelected={isSelected}
          onClick={() => onSel(truck)}
          onMatch={() => onMatch(truck)}
        />
      </div>
    );
  };

  return (
    <aside className="command-sidebar right-sidebar">
      <div className="sidebar-header">
        <h2>🚛 Transporteurs</h2>
        <span className="count-badge">{trucks.length}</span>
      </div>
      <div className="sidebar-search">
        <input type="text" placeholder="Rechercher un chauffeur..." />
      </div>
      <div className="sidebar-content" style={{ height: 600 }}>
        <List
          rowCount={trucks.length}
          rowHeight={240}
          rowComponent={Row}
          rowProps={{ trucks, selectedTruck, onSelectTruck, onSmartMatch } as never}
          style={{ height: 600, width: '100%' }}
          className="virtual-list"
        />
      </div>
    </aside>
  );
};

export default TrucksSidebar;
