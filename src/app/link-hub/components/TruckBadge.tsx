/**
 * TRUCK BADGE COMPONENT
 * Badge compact pour les transporteurs
 */

import React from 'react';
import { motion } from 'framer-motion';
import { type Truck } from '../../data/logistics-operations';

interface TruckBadgeProps {
  truck: Truck;
  isSelected?: boolean;
  onClick: () => void;
  onMatch?: () => void;
}

const TruckBadge: React.FC<TruckBadgeProps> = ({ truck, isSelected, onClick, onMatch }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      className={`truck-badge-premium p-4 rounded-xl cursor-pointer transition-all border ${
        isSelected ? 'border-logistics-neon bg-logistics-neon/5 ring-1 ring-logistics-neon/30' : 'border-white/5 hover:border-white/20'
      } ${truck.isNew ? 'pulse-logistics' : ''}`}
      onClick={onClick}
    >
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
           <div className={`w-2 h-2 rounded-full ${truck.status === 'Available' ? 'bg-agri-neon animate-pulse' : 'bg-gray-600'}`}></div>
           <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{truck.licensePlate}</span>
        </div>
        <div className="text-[10px] font-bold text-gray-500">⭐ {truck.driverRating}</div>
      </div>

      <div className="mb-3">
        <h4 className="text-white font-black text-sm uppercase tracking-tight">{truck.driverName}</h4>
        <p className="text-[11px] text-gray-500">{truck.truckType} • {truck.capacity}t max</p>
      </div>

      <div className="flex justify-between items-center bg-white/5 p-2 rounded-lg">
        <div className="flex items-center gap-2">
           <span className="text-logistics-neon text-[10px]">📍</span>
           <span className="text-[10px] text-white/80 font-bold">{truck.currentPosition.city}</span>
        </div>
        
        {onMatch && (
          <button 
            onClick={(e) => { e.stopPropagation(); onMatch(); }}
            className="bg-logistics-neon/20 hover:bg-logistics-neon text-logistics-neon hover:text-black px-2 py-1 rounded text-[9px] font-black uppercase transition-all"
          >
            Match AI
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default TruckBadge;
