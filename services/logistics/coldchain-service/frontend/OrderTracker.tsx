import React, { useState, useEffect } from 'react';

/**
 * Agri-Direct Live Order Tracker
 * Réactif aux événements SSE pour une expérience B2C Premium.
 */
const OrderTracker = ({ orderId = "ORD-2026-X" }) => {
  const [status, setStatus] = useState("EN_ATTENTE");
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // Connexion au flux SSE
    const eventSource = new EventSource(`/api/agri-direct/order-status/${orderId}`);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setStatus(data.status);
      setHistory(prev => [data, ...prev].slice(0, 5));
    };

    eventSource.onerror = (err) => {
      console.error("SSE Connection failed", err);
      eventSource.close();
    };

    return () => eventSource.close();
  }, [orderId]);

  return (
    <div className="max-w-md mx-auto bg-[#121216] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
      <div className="bg-gradient-to-r from-green-600 to-emerald-500 p-6">
        <h2 className="text-white text-xl font-bold">Suivi de Commande Directe</h2>
        <p className="text-green-100 text-sm opacity-80">ID: {orderId}</p>
      </div>

      <div className="p-8">
        {/* Statut Visuel */}
        <div className="relative flex flex-col items-center mb-10">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center text-3xl animate-pulse">
            📦
          </div>
          <div className="mt-4 text-center">
            <h3 className="text-white text-2xl font-black uppercase tracking-tight">{status.replace('_', ' ')}</h3>
            <p className="text-gray-500 text-sm">Mise à jour en temps réel via Agri-Bus</p>
          </div>
        </div>

        {/* Historique des Événements */}
        <div className="space-y-4">
          <h4 className="text-gray-400 text-xs font-bold uppercase tracking-widest">Journal des Événements</h4>
          {history.map((evt, idx) => (
            <div key={idx} className="flex gap-4 items-start border-l-2 border-green-500/30 pl-4 py-1">
              <div className="min-w-[50px] text-[10px] text-gray-500 font-mono italic">
                {new Date(evt.timestamp).toLocaleTimeString()}
              </div>
              <div className="text-sm text-gray-300">
                <span className="text-white font-medium">{evt.status}</span>: {evt.message}
              </div>
            </div>
          ))}
        </div>

        <button className="w-full mt-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 transition-all">
          Contacter le Producteur
        </button>
      </div>
    </div>
  );
};

export default OrderTracker;
