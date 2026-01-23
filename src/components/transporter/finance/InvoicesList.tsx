/**
 * Invoices List Component
 * Displays list of invoices with status and download actions
 */
import React from 'react';
import { FileText, Download, Send, CheckCircle, AlertTriangle, Eye } from 'lucide-react';
import type { Invoice } from '@/types/transporter';

interface InvoicesListProps {
  invoices: Invoice[];
  onDownload: (invoice: Invoice) => void;
  onSend: (invoice: Invoice) => void;
  onView: (invoice: Invoice) => void;
}

export function InvoicesList({ invoices, onDownload, onSend, onView }: InvoicesListProps) {
  const getStatusBadge = (status: Invoice['status']) => {
    switch (status) {
      case 'paid':
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
            <CheckCircle className="w-3 h-3" /> Payée
          </span>
        );
      case 'sent':
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
            <Send className="w-3 h-3" /> Envoyée
          </span>
        );
      case 'overdue':
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
            <AlertTriangle className="w-3 h-3" /> En retard
          </span>
        );
      case 'draft':
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
            <FileText className="w-3 h-3" /> Brouillon
          </span>
        );
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-left">
              <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Facture</th>
              <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Client</th>
              <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
              <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Montant</th>
              <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Statut</th>
              <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{invoice.invoiceNumber}</p>
                      <p className="text-xs text-gray-500">ID: {invoice.id}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <p className="font-medium text-gray-900">{invoice.clientName}</p>
                  <p className="text-xs text-gray-500">{invoice.clientId}</p>
                </td>
                <td className="py-4 px-6">
                  <p className="text-sm text-gray-900">
                    {new Date(invoice.issueDate).toLocaleDateString('fr-FR')}
                  </p>
                  <p className="text-xs text-gray-500">
                    Échéance: {new Date(invoice.dueDate).toLocaleDateString('fr-FR')}
                  </p>
                </td>
                <td className="py-4 px-6">
                  <p className="font-semibold text-gray-900">
                    {formatCurrency(invoice.total, invoice.currency)}
                  </p>
                </td>
                <td className="py-4 px-6">
                  {getStatusBadge(invoice.status)}
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onView(invoice)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Voir"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDownload(invoice)}
                      className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Télécharger"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    {invoice.status !== 'paid' && invoice.status !== 'cancelled' && (
                      <button
                        onClick={() => onSend(invoice)}
                        className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        title="Envoyer"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {invoices.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>Aucune facture trouvée</p>
        </div>
      )}
    </div>
  );
}
