/**
 * TRUCKS SIDEBAR COMPONENT
 * Liste flottante des transporteurs disponibles
 */

import React from 'react';
import { FixedSizeList as List } from 'react-window';
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
  onSmartMatch 
}) => {
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const truck = trucks[index];
    const isSelected = selectedTruck?.id === truck.id;

    return (
      <div style={style}>
        <TruckBadge 
          truck={truck}
          isSelected={isSelected}
          onClick={() => onSelectTruck(truck)}
          onMatch={() => onSmartMatch(truck)}
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

      <div className="sidebar-content">
        <List
          height={600}
          itemCount={trucks.length}
          itemSize={240}
          width={'100%'}
          className="virtual-list"
        >
          {Row}
        </List>
      </div>
    </aside>
  );
};

export default TrucksSidebar;
