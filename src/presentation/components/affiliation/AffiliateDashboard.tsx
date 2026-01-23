/**
 * Affiliate Dashboard Component
 * Displays stats, links, commissions, and earnings
 */
'use client';

import React, { useState } from 'react';
import { 
  useAffiliateStats, 
  useAffiliateLinks, 
  useAffiliateCommissions,
  useCreateAffiliateLink,
  useRequestPayout
} from '@/application/hooks/useAffiliation';
import { formatCurrency } from '@/lib/utils';

export function AffiliateDashboard() {
  const { data: stats, isLoading: statsLoading } = useAffiliateStats();
  const { data: links } = useAffiliateLinks({ limit: 5 });
  const { data: commissions } = useAffiliateCommissions({ limit: 5 });
  const createLink = useCreateAffiliateLink();
  const [newLinkUrl, setNewLinkUrl] = useState('');

  if (statsLoading) {
    return <div className="animate-pulse bg-gray-200 h-96 rounded-xl" />;
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard 
          title="Gains totaux" 
          value={formatCurrency(stats?.total_earnings || 0, 'XOF')} 
          icon="💰"
          color="green"
        />
        <StatCard 
          title="En attente" 
          value={formatCurrency(stats?.pending_earnings || 0, 'XOF')} 
          icon="⏳"
          color="yellow"
        />
        <StatCard 
          title="Conversions" 
          value={stats?.conversions || 0} 
          icon="🎯"
          color="blue"
        />
        <StatCard 
          title="Taux conv." 
          value={`${stats?.conversion_rate || 0}%`} 
          icon="📈"
          color="purple"
        />
      </div>

      {/* Performance Chart Placeholder */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="font-semibold text-lg mb-4">Performance</h3>
        <div className="grid grid-cols-3 gap-6 text-center">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-3xl font-bold text-blue-600">{stats?.total_clicks || 0}</p>
            <p className="text-sm text-gray-600 mt-1">Clics totaux</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-3xl font-bold text-indigo-600">{stats?.unique_clicks || 0}</p>
            <p className="text-sm text-gray-600 mt-1">Visiteurs uniques</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-3xl font-bold text-green-600">{stats?.total_referrals || 0}</p>
            <p className="text-sm text-gray-600 mt-1">Parrainages</p>
          </div>
        </div>
      </div>

      {/* Create Link */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="font-semibold text-lg mb-4">Créer un lien</h3>
        <div className="flex gap-3">
          <input
            type="url"
            value={newLinkUrl}
            onChange={(e) => setNewLinkUrl(e.target.value)}
            placeholder="https://agrologistic.com/produit/..."
            className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <button
            onClick={() => {
              if (newLinkUrl) {
                createLink.mutate({ target_url: newLinkUrl });
                setNewLinkUrl('');
              }
            }}
            disabled={createLink.isPending}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {createLink.isPending ? 'Création...' : 'Créer'}
          </button>
        </div>
      </div>

      {/* Active Links */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="font-semibold text-lg mb-4">Liens actifs ({stats?.active_links || 0})</h3>
        {links?.items?.length > 0 ? (
          <div className="space-y-3">
            {links.items.map((link: any) => (
              <div key={link.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{link.affiliate_url}</p>
                  <p className="text-sm text-gray-500 truncate">{link.target_url}</p>
                </div>
                <div className="flex items-center gap-4 ml-4">
                  <div className="text-center">
                    <p className="font-semibold">{link.total_clicks}</p>
                    <p className="text-xs text-gray-500">Clics</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-green-600">{link.conversions}</p>
                    <p className="text-xs text-gray-500">Conv.</p>
                  </div>
                  <button 
                    onClick={() => navigator.clipboard.writeText(link.affiliate_url)}
                    className="p-2 hover:bg-gray-200 rounded"
                    title="Copier le lien"
                  >
                    📋
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-6">Aucun lien créé</p>
        )}
      </div>

      {/* Recent Commissions */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="font-semibold text-lg mb-4">Commissions récentes</h3>
        {commissions?.items?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-500 border-b">
                  <th className="pb-2">Date</th>
                  <th className="pb-2">Montant commande</th>
                  <th className="pb-2">Commission</th>
                  <th className="pb-2">Statut</th>
                </tr>
              </thead>
              <tbody>
                {commissions.items.map((c: any) => (
                  <tr key={c.id} className="border-b last:border-0">
                    <td className="py-3">{new Date(c.created_at).toLocaleDateString('fr-FR')}</td>
                    <td>{formatCurrency(c.order_amount, 'XOF')}</td>
                    <td className="font-semibold text-green-600">+{formatCurrency(c.commission_amount, 'XOF')}</td>
                    <td>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        c.status === 'paid' ? 'bg-green-100 text-green-700' :
                        c.status === 'approved' ? 'bg-blue-100 text-blue-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {c.status === 'pending' ? 'En attente' : c.status === 'approved' ? 'Approuvée' : 'Payée'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-6">Aucune commission</p>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }: { title: string; value: string | number; icon: string; color: string }) {
  const colorClasses = {
    green: 'bg-green-50 border-green-200',
    yellow: 'bg-yellow-50 border-yellow-200',
    blue: 'bg-blue-50 border-blue-200',
    purple: 'bg-purple-50 border-purple-200',
  };

  return (
    <div className={`p-4 rounded-xl border ${colorClasses[color as keyof typeof colorClasses]}`}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">{icon}</span>
        <span className="text-sm text-gray-600">{title}</span>
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

export default AffiliateDashboard;
