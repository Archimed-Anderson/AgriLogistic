/**
 * TRANSACTION TABLE COMPONENT
 * Console d'opérations pour le monitoring des transactions
 */

import React from 'react';
import { type Load } from '../../../data/logistics-operations';

interface TransactionTableProps {
  loads: Load[];
}

const TransactionTable: React.FC<TransactionTableProps> = ({ loads }) => {
  return (
    <div className="transaction-console bg-black/40 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden">
      <div className="p-6 border-b border-white/5 flex justify-between items-center">
        <h3 className="text-lg font-bold text-white tracking-wider uppercase">Console de Transactions</h3>
        <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-bold text-gray-300 transition-colors">
          EXPORTER (CSV)
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-white/5 text-gray-400 font-bold uppercase text-[10px] tracking-widest">
              <th className="px-6 py-4">ID / Produit</th>
              <th className="px-6 py-4">Itinéraire</th>
              <th className="px-6 py-4">Offre (FCFA)</th>
              <th className="px-6 py-4">Final (FCFA)</th>
              <th className="px-6 py-4">Marge (10%)</th>
              <th className="px-6 py-4">Statut</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loads.slice(0, 10).map((load) => {
              const finalPrice = load.priceOffer * 0.95; // Simulé: négo de 5%
              const margin = finalPrice * 0.10; // Commission plateforme

              return (
                <tr key={load.id} className="hover:bg-white/2 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-white font-bold">#{load.id.slice(0, 8)}</span>
                      <span className="text-gray-500 text-xs">{load.productType}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-300">
                    <div className="flex items-center gap-2">
                       {load.origin.city} <span className="text-cyan-400">→</span> {load.destination.city}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-400">
                    {load.priceOffer.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-white font-bold">
                    {finalPrice.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-green-400 font-black">
                    +{margin.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                      load.status === 'Pending' ? 'bg-cyan-900/40 text-cyan-400' :
                      load.status === 'Matched' ? 'bg-green-900/40 text-green-400' :
                      'bg-gray-800 text-gray-400'
                    }`}>
                      {load.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="opacity-0 group-hover:opacity-100 px-3 py-1 bg-cyan-500 text-black text-[10px] font-black rounded uppercase transition-all hover:bg-cyan-400">
                      Détails
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionTable;
