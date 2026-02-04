/**
 * Finance Page
 * Financial hub for transporters including dashboard and invoicing
 */
import React, { useState } from 'react';
import { FinanceOverview } from '@/components/transporter/finance/FinanceOverview';
import { InvoicesList } from '@/components/transporter/finance/InvoicesList';
import { CreateInvoiceModal } from '@/components/transporter/finance/CreateInvoiceModal';
import { useFinanceData } from '@/hooks/transporter/useFinanceData';
import { Plus, Download, Filter } from 'lucide-react';
import type { Invoice } from '@/types/transporter';

export default function FinancePage() {
  const { metrics, invoices, isLoading } = useFinanceData();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const handleDownloadInvoice = (invoice: Invoice) => {
    console.log('Download invoice:', invoice.id);
    // Logic to generate PDF
  };

  const handleSendInvoice = (invoice: Invoice) => {
    console.log('Send invoice:', invoice.id);
    // Logic to email invoice
  };

  const handleViewInvoice = (invoice: Invoice) => {
    console.log('View invoice:', invoice.id);
    // Logic to preview invoice
  };

  const handleCreateInvoice = (data: any) => {
    console.log('Create invoice:', data);
    // Logic to create invoice
  };

  const filteredInvoices = invoices?.filter(
    (invoice) => filterStatus === 'all' || invoice.status === filterStatus
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">💰 Hub Financier</h1>
              <p className="text-sm text-gray-600">Vue d'ensemble et facturation</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                <Download className="w-4 h-4" />
                <span>Exporter Rapport</span>
              </button>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Nouvelle Facture</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Dashboard */}
          {metrics && <FinanceOverview metrics={metrics} />}

          {/* Invoices Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Factures Récentes</h2>

              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="paid">Payées</option>
                  <option value="pending">En attente</option>
                  <option value="overdue">En retard</option>
                  <option value="draft">Brouillons</option>
                </select>
              </div>
            </div>

            <InvoicesList
              invoices={filteredInvoices || []}
              onDownload={handleDownloadInvoice}
              onSend={handleSendInvoice}
              onView={handleViewInvoice}
            />
          </div>
        </div>
      </main>

      <CreateInvoiceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateInvoice}
      />
    </div>
  );
}
