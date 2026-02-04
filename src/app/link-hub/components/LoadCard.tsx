/**
 * LOAD CARD COMPONENT
 * Unité d'affichage Cyber-Agri pour les chargements
 */

import React from 'react';
import { motion } from 'framer-motion';
import { type Load } from '../../data/logistics-operations';

interface LoadCardProps {
  load: Load;
  isSelected?: boolean;
  onClick: () => void;
  onAction?: () => void;
}

const LoadCard: React.FC<LoadCardProps> = ({ load, isSelected, onClick, onAction }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`load-card-premium p-4 rounded-xl cursor-pointer transition-all border ${
        isSelected
          ? 'border-agri-neon bg-agri-neon/5 ring-1 ring-agri-neon/30'
          : 'border-white/5 hover:border-white/20'
      } ${load.isNew ? 'pulse-agri' : ''}`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-2">
        <span className="text-[10px] font-black tracking-tighter text-gray-400 uppercase">
          #{load.id.slice(-6)}
        </span>
        {load.aiMatchScore && (
          <div className="flex items-center gap-1 bg-agri-neon/10 text-agri-neon px-2 py-0.5 rounded-full text-[10px] font-black">
            🤖 {load.aiMatchScore}%
          </div>
        )}
      </div>

      <h4 className="text-white font-black text-sm mb-1 uppercase tracking-tight">
        {load.productType}
      </h4>

      <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
        <span className="font-bold text-white/80">{load.originCity ?? '-'}</span>
        <span className="text-agri-neon/40">→</span>
        <span className="font-bold text-white/80">{load.destinationCity ?? '-'}</span>
      </div>

      <div className="flex justify-between items-center text-[11px]">
        <div className="flex gap-3">
          <div className="flex flex-col">
            <span className="text-gray-500 uppercase font-black text-[9px]">Poids</span>
            <span className="text-white">{load.quantity}t</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-500 uppercase font-black text-[9px]">Prix</span>
            <span className="text-white">{load.priceOffer.toLocaleString()} F</span>
          </div>
        </div>

        {onAction && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAction();
            }}
            className="bg-white/5 hover:bg-agri-neon hover:text-black py-1 px-3 rounded text-[10px] font-black uppercase transition-all"
          >
            Réserver
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default LoadCard;
