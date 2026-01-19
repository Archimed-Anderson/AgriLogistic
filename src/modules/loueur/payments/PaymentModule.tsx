/**
 * =======================================================
 * PAYMENT MODULE - Comprehensive Payment System
 * =======================================================
 * Features:
 * 1. Fractional Payment System (usage-based billing)
 * 2. Digital Deposit System (secure deposit management)
 * 3. Crypto Payment Option (BTC, ETH, stablecoins)
 * 4. Payment Scheduling (recurring & automated)
 * 5. Invoice Generation (PDF with full breakdown)
 */

import { useState } from "react";
import {
  CreditCard,
  DollarSign,
  Bitcoin,
  Shield,
  Calendar,
  FileText,
  Download,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  Wallet,
  Receipt,
  Lock,
  RefreshCw,
  Coins,
  Euro,
} from "lucide-react";

// Payment Method Types
export type PaymentMethod = "card" | "bank" | "crypto" | "fractional";
export type CryptoType = "BTC" | "ETH" | "USDT" | "USDC";
export type PaymentStatus = "pending" | "processing" | "completed" | "failed" | "refunded";

// Interfaces
export interface FractionalPayment {
  bookingId: string;
  equipmentId: string;
  startTime: Date;
  endTime?: Date;
  hourlyRate: number;
  dailyRate: number;
  actualUsageHours: number;
  actualUsageDays: number;
  partialDayCharge: number;
  totalAmount: number;
  lastUpdated: Date;
}

export interface DigitalDeposit {
  depositId: string;
  bookingId: string;
  amount: number;
  status: "held" | "released" | "partially-refunded" | "forfeited";
  collectedAt: Date;
  releaseScheduled?: Date;
  damageAssessment?: {
    inspectionDate: Date;
    damageFound: boolean;
    damageDescription?: string;
    repairCost?: number;
    adjustedRefund: number;
  };
  authorizationForm: {
    signed: boolean;
    signedAt?: Date;
    ipAddress: string;
  };
}

export interface CryptoPayment {
  paymentId: string;
  cryptocurrency: CryptoType;
  amountCrypto: number;
  amountEUR: number;
  exchangeRate: number;
  walletAddress: string;
  transactionHash?: string;
  confirmations: number;
  requiredConfirmations: number;
  status: PaymentStatus;
  createdAt: Date;
  confirmedAt?: Date;
}

export interface PaymentSchedule {
  scheduleId: string;
  bookingId: string;
  frequency: "daily" | "weekly" | "monthly";
  amount: number;
  startDate: Date;
  endDate: Date;
  nextPaymentDate: Date;
  paymentsCompleted: number;
  paymentsTotal: number;
  autoRenew: boolean;
  reminders: {
    daysBefore: number;
    sent: boolean;
  }[];
  gracePeriod: number; // days
  lateFee: number;
}

export interface Invoice {
  invoiceNumber: string;
  bookingId: string;
  date: Date;
  dueDate: Date;
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  depositHeld: number;
  total: number;
  amountPaid: number;
  amountDue: number;
  currency: "EUR" | "USD";
  customerInfo: {
    name: string;
    email: string;
    address: string;
    taxId?: string;
  };
  paymentTerms: string;
  notes?: string;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  taxable: boolean;
}

interface PaymentModuleProps {
  bookingId: string;
  equipmentName: string;
  totalAmount: number;
  onPaymentComplete: (paymentId: string) => void;
}

export function PaymentModule({
  bookingId,
  equipmentName,
  totalAmount,
  onPaymentComplete,
}: PaymentModuleProps) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "fractional" | "deposit" | "crypto" | "schedule" | "invoices"
  >("overview");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");

  // Mock data for demonstration
  const fractionalPayment: FractionalPayment = {
    bookingId,
    equipmentId: "TRC-001",
    startTime: new Date("2026-01-10T08:00:00"),
    endTime: new Date("2026-01-15T14:30:00"),
    hourlyRate: 18.75, // €450/day ÷ 24h
    dailyRate: 450,
    actualUsageHours: 126.5,
    actualUsageDays: 5.27,
    partialDayCharge: 121.88,
    totalAmount: 2371.88,
    lastUpdated: new Date(),
  };

  const digitalDeposit: DigitalDeposit = {
    depositId: `DEP-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    bookingId,
    amount: 900, // 20% of rental value
    status: "held",
    collectedAt: new Date("2026-01-09"),
    releaseScheduled: new Date("2026-01-16"),
    authorizationForm: {
      signed: true,
      signedAt: new Date("2026-01-09T10:30:00"),
      ipAddress: "192.168.1.100",
    },
  };

  const cryptoPayment: CryptoPayment = {
    paymentId: `CRYPTO-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    cryptocurrency: "ETH",
    amountCrypto: 0.945,
    amountEUR: totalAmount,
    exchangeRate: 2646.56, // EUR per ETH
    walletAddress: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    transactionHash: "0x123...abc",
    confirmations: 12,
    requiredConfirmations: 12,
    status: "completed",
    createdAt: new Date("2026-01-10T08:15:00"),
    confirmedAt: new Date("2026-01-10T08:25:00"),
  };

  const paymentSchedule: PaymentSchedule = {
    scheduleId: `SCHED-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    bookingId,
    frequency: "weekly",
    amount: 540,
    startDate: new Date("2026-01-10"),
    endDate: new Date("2026-03-10"),
    nextPaymentDate: new Date("2026-01-17"),
    paymentsCompleted: 1,
    paymentsTotal: 9,
    autoRenew: false,
    reminders: [
      { daysBefore: 3, sent: true },
      { daysBefore: 1, sent: false },
    ],
    gracePeriod: 3,
    lateFee: 25,
  };

  const invoice: Invoice = {
    invoiceNumber: `INV-2026-${Math.floor(Math.random() * 10000).toString().padStart(4, "0")}`,
    bookingId,
    date: new Date("2026-01-10"),
    dueDate: new Date("2026-01-17"),
    status: "sent",
    items: [
      {
        description: `Location ${equipmentName}`,
        quantity: 5.27,
        unitPrice: 450,
        total: 2371.5,
        taxable: true,
      },
      {
        description: "Assurance Premium Tous Risques",
        quantity: 5,
        unitPrice: 45,
        total: 225,
        taxable: true,
      },
      {
        description: "Livraison Express",
        quantity: 1,
        unitPrice: 120,
        total: 120,
        taxable: true,
      },
    ],
    subtotal: 2716.5,
    taxRate: 0.2, // 20% VAT
    taxAmount: 543.3,
    depositHeld: 900,
    total: 3259.8,
    amountPaid: 900,
    amountDue: 2359.8,
    currency: "EUR",
    customerInfo: {
      name: "Jean Dupont",
      email: "jean.dupont@example.com",
      address: "123 Rue de la Ferme, 75001 Paris, France",
      taxId: "FR12345678901",
    },
    paymentTerms: "Paiement dû dans 7 jours",
    notes: "Merci pour votre confiance",
  };

  const tabs = [
    { id: "overview" as const, label: "Vue d'ensemble", icon: DollarSign },
    { id: "fractional" as const, label: "Paiement Usage", icon: Clock },
    { id: "deposit" as const, label: "Caution", icon: Shield },
    { id: "crypto" as const, label: "Crypto", icon: Bitcoin },
    { id: "schedule" as const, label: "Échéancier", icon: Calendar },
    { id: "invoices" as const, label: "Factures", icon: FileText },
  ];

  const handleGeneratePDF = () => {
    alert("Génération du PDF... (Feature complète disponible avec jsPDF)");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <CreditCard className="h-8 w-8 text-[#2563eb]" />
            Module de Paiement
          </h2>
          <p className="text-muted-foreground mt-1">
            Réservation: {bookingId} • {equipmentName}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg font-semibold">
            Total: €{totalAmount.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b">
        <nav className="flex gap-4 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-[#2563eb] text-[#2563eb] font-semibold"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-5 w-5" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  label: "Montant Total",
                  value: `€${totalAmount.toLocaleString()}`,
                  icon: Euro,
                  color: "blue",
                },
                {
                  label: "Caution Bloquée",
                  value: `€${digitalDeposit.amount.toLocaleString()}`,
                  icon: Shield,
                  color: "green",
                },
                {
                  label: "Solde à Payer",
                  value: `€${invoice.amountDue.toLocaleString()}`,
                  icon: DollarSign,
                  color: "orange",
                },
              ].map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={idx}
                    className="p-6 bg-white dark:bg-gray-900 border rounded-xl"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className={`h-10 w-10 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900/20 flex items-center justify-center`}
                      >
                        <Icon className={`h-5 w-5 text-${stat.color}-600`} />
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {stat.label}
                      </span>
                    </div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                );
              })}
            </div>

            {/* Payment Methods */}
            <div className="p-6 bg-white dark:bg-gray-900 border rounded-xl">
              <h3 className="text-lg font-bold mb-4">Méthodes de Paiement</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { id: "card" as const, label: "Carte Bancaire", icon: CreditCard },
                  { id: "bank" as const, label: "Virement", icon: DollarSign },
                  { id: "crypto" as const, label: "Cryptomonnaie", icon: Bitcoin },
                  { id: "fractional" as const, label: "Paiement Usage", icon: Clock },
                ].map((method) => {
                  const Icon = method.icon;
                  return (
                    <button
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)}
                      className={`p-4 border-2 rounded-lg transition-all ${
                        paymentMethod === method.id
                          ? "border-[#2563eb] bg-blue-50 dark:bg-blue-900/20"
                          : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="h-6 w-6" />
                        <span className="font-medium">{method.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Fractional Payment Tab */}
        {activeTab === "fractional" && (
          <div className="space-y-6">
            <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-800 rounded-xl">
              <div className="flex items-start gap-4">
                <Clock className="h-8 w-8 text-blue-600 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">
                    Paiement basé sur l'Usage Réel
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Payez uniquement pour le temps d'utilisation effectif de
                    l'équipement
                  </p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 bg-white dark:bg-gray-900 border rounded-xl">
                <h4 className="font-semibold mb-4">Détails d'Utilisation</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Début location</span>
                    <span className="font-medium">
                      {fractionalPayment.startTime.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fin location</span>
                    <span className="font-medium">
                      {fractionalPayment.endTime?.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Heures totales</span>
                    <span className="font-medium">
                      {fractionalPayment.actualUsageHours}h
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Jours équivalents</span>
                    <span className="font-medium">
                      {fractionalPayment.actualUsageDays} jours
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white dark:bg-gray-900 border rounded-xl">
                <h4 className="font-semibold mb-4">Calcul des Coûts</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tarif horaire</span>
                    <span className="font-medium">
                      €{fractionalPayment.hourlyRate}/h
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tarif journalier</span>
                    <span className="font-medium">
                      €{fractionalPayment.dailyRate}/jour
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fraction de jour</span>
                    <span className="font-medium">
                      €{fractionalPayment.partialDayCharge.toFixed(2)}
                    </span>
                  </div>
                  <div className="pt-3 border-t">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total Usage</span>
                      <span className="text-green-600">
                        €{fractionalPayment.totalAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-start gap-3">
                <TrendingUp className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-900 dark:text-blue-100">
                  <strong>Suivi en temps réel:</strong> Le montant est mis à jour
                  automatiquement toutes les heures pendant la période de location.
                  Dernière mise à jour:{" "}
                  {fractionalPayment.lastUpdated.toLocaleTimeString()}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Digital Deposit Tab - I'll continue with more tabs */}
        {activeTab === "deposit" && (
          <div className="space-y-6">
            <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-200 dark:border-green-800 rounded-xl">
              <div className="flex items-start gap-4">
                <Shield className="h-8 w-8 text-green-600 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">Caution Digitale Sécurisée</h3>
                  <p className="text-sm text-muted-foreground">
                    Gestion automatisée des cautions avec libération conditionnelle
                  </p>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    digitalDeposit.status === "held"
                      ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                      : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  }`}
                >
                  {digitalDeposit.status === "held" ? "Bloquée" : "Libérée"}
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 bg-white dark:bg-gray-900 border rounded-xl">
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Informations Caution
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Montant</span>
                    <span className="font-bold text-lg">
                      €{digitalDeposit.amount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Collectée le</span>
                    <span>{digitalDeposit.collectedAt.toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Libération prévue</span>
                    <span>
                      {digitalDeposit.releaseScheduled?.toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Statut</span>
                    <span className="font-semibold capitalize">
                      {digitalDeposit.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white dark:bg-gray-900 border rounded-xl">
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Formulaire d'Autorisation
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    {digitalDeposit.authorizationForm.signed ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-orange-600" />
                    )}
                    <span>
                      {digitalDeposit.authorizationForm.signed
                        ? "Formulaire signé"
                        : "En attente de signature"}
                    </span>
                  </div>
                  {digitalDeposit.authorizationForm.signedAt && (
                    <div className="text-sm text-muted-foreground">
                      Signé le:{" "}
                      {digitalDeposit.authorizationForm.signedAt.toLocaleString()}
                    </div>
                  )}
                  <div className="text-sm text-muted-foreground">
                    IP: {digitalDeposit.authorizationForm.ipAddress}
                  </div>
                </div>
              </div>
            </div>

            {digitalDeposit.damageAssessment && (
              <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                <h4 className="font-semibold mb-4 text-red-900 dark:text-red-100">
                  Évaluation des Dommages
                </h4>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Date d'inspection:</strong>{" "}
                    {digitalDeposit.damageAssessment.inspectionDate.toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Dommages trouvés:</strong>{" "}
                    {digitalDeposit.damageAssessment.damageFound ? "Oui" : "Non"}
                  </p>
                  {digitalDeposit.damageAssessment.damageDescription && (
                    <p>
                      <strong>Description:</strong>{" "}
                      {digitalDeposit.damageAssessment.damageDescription}
                    </p>
                  )}
                  {digitalDeposit.damageAssessment.repairCost && (
                    <p>
                      <strong>Coût réparation:</strong> €
                      {digitalDeposit.damageAssessment.repairCost}
                    </p>
                  )}
                  <p className="font-bold">
                    Remboursement ajusté: €
                    {digitalDeposit.damageAssessment.adjustedRefund}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Crypto Payment Tab */}
        {activeTab === "crypto" && (
          <div className="space-y-6">
            <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border border-purple-200 dark:border-purple-800 rounded-xl">
              <div className="flex items-start gap-4">
                <Bitcoin className="h-8 w-8 text-purple-600 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">Paiement Cryptomonnaie</h3>
                  <p className="text-sm text-muted-foreground">
                    Bitcoin, Ethereum et stablecoins acceptés
                  </p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { crypto: "BTC", name: "Bitcoin", rate: 42156.32, icon: Bitcoin },
                { crypto: "ETH", name: "Ethereum", rate: 2646.56, icon: Coins },
                { crypto: "USDT", name: "Tether", rate: 0.92, icon: DollarSign },
              ].map((currency) => {
                const Icon = currency.icon;
                const amountCrypto = (totalAmount / currency.rate).toFixed(6);
                return (
                  <div
                    key={currency.crypto}
                    className="p-6 bg-white dark:bg-gray-900 border rounded-xl hover:shadow-lg transition-shadow cursor-pointer"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                        <Icon className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{currency.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {currency.crypto}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">
                        Taux: €{currency.rate.toLocaleString()}
                      </div>
                      <div className="text-xl font-bold">
                        {amountCrypto} {currency.crypto}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {cryptoPayment.status === "completed" && (
              <div className="p-6 bg-white dark:bg-gray-900 border rounded-xl">
                <h4 className="font-semibold mb-4">Transaction Confirmée</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cryptomonnaie</span>
                    <span className="font-medium">{cryptoPayment.cryptocurrency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Montant</span>
                    <span className="font-medium">
                      {cryptoPayment.amountCrypto} {cryptoPayment.cryptocurrency}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Équivalent EUR</span>
                    <span className="font-medium">
                      €{cryptoPayment.amountEUR.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Transaction Hash</span>
                    <span className="font-mono text-xs">{cryptoPayment.transactionHash}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Confirmations</span>
                    <span className="font-medium text-green-600">
                      {cryptoPayment.confirmations}/{cryptoPayment.requiredConfirmations} ✓
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Payment Schedule Tab */}
        {activeTab === "schedule" && (
          <div className="space-y-6">
            <div className="p-6 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 border border-orange-200 dark:border-orange-800 rounded-xl">
              <div className="flex items-start gap-4">
                <Calendar className="h-8 w-8 text-orange-600 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">Échéancier de Paiement</h3>
                  <p className="text-sm text-muted-foreground">
                    Paiements automatisés et récurrents
                  </p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 bg-white dark:bg-gray-900 border rounded-xl">
                <h4 className="font-semibold mb-4">Détails de l'Échéancier</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fréquence</span>
                    <span className="font-medium capitalize">
                      {paymentSchedule.frequency}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Montant par paiement</span>
                    <span className="font-medium">
                      €{paymentSchedule.amount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Prochain paiement</span>
                    <span className="font-medium">
                      {paymentSchedule.nextPaymentDate.toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Progression</span>
                    <span className="font-medium">
                      {paymentSchedule.paymentsCompleted}/
                      {paymentSchedule.paymentsTotal}
                    </span>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full transition-all"
                      style={{
                        width: `${
                          (paymentSchedule.paymentsCompleted /
                            paymentSchedule.paymentsTotal) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white dark:bg-gray-900 border rounded-xl">
                <h4 className="font-semibold mb-4">Rappels et Pénalités</h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Rappels configurés:</p>
                    {paymentSchedule.reminders.map((reminder, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        {reminder.sent ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <Clock className="h-4 w-4 text-orange-600" />
                        )}
                        <span>
                          {reminder.daysBefore} jour(s) avant -{" "}
                          {reminder.sent ? "Envoyé" : "Programmé"}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between pt-3 border-t">
                    <span className="text-muted-foreground">Délai de grâce</span>
                    <span className="font-medium">{paymentSchedule.gracePeriod} jours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Frais de retard</span>
                    <span className="font-medium text-red-600">
                      €{paymentSchedule.lateFee}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Invoices Tab */}
        {activeTab === "invoices" && (
          <div className="space-y-6">
            <div className="p-6 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/30 dark:to-cyan-950/30 border border-teal-200 dark:border-teal-800 rounded-xl">
              <div className="flex items-start gap-4">
                <FileText className="h-8 w-8 text-teal-600 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">Factures et Reçus</h3>
                  <p className="text-sm text-muted-foreground">
                    Génération automatique de factures professionnelles
                  </p>
                </div>
                <button
                  onClick={handleGeneratePDF}
                  className="px-4 py-2 bg-[#2563eb] text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Télécharger PDF
                </button>
              </div>
            </div>

            {/* Invoice Preview */}
            <div className="p-8 bg-white dark:bg-gray-900 border rounded-xl">
              {/* Invoice Header */}
              <div className="flex justify-between mb-8 pb-6 border-b">
                <div>
                  <h2 className="text-3xl font-bold mb-2">FACTURE</h2>
                  <p className="text-sm text-muted-foreground">
                    {invoice.invoiceNumber}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Date: {invoice.date.toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <h3 className="font-bold text-xl mb-2">AgroLogistic Platform</h3>
                  <p className="text-sm text-muted-foreground">
                    123 Rue de l'Agriculture
                  </p>
                  <p className="text-sm text-muted-foreground">75001 Paris, France</p>
                  <p className="text-sm text-muted-foreground">
                    TVA: FR98765432109
                  </p>
                </div>
              </div>

              {/* Customer Info */}
              <div className="mb-8">
                <h4 className="font-semibold mb-2">Facturé à:</h4>
                <p className="font-medium">{invoice.customerInfo.name}</p>
                <p className="text-sm text-muted-foreground">
                  {invoice.customerInfo.address}
                </p>
                <p className="text-sm text-muted-foreground">
                  {invoice.customerInfo.email}
                </p>
                {invoice.customerInfo.taxId && (
                  <p className="text-sm text-muted-foreground">
                    TVA: {invoice.customerInfo.taxId}
                  </p>
                )}
              </div>

              {/* Invoice Items */}
              <table className="w-full mb-6">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Description</th>
                    <th className="text-right py-2">Qté</th>
                    <th className="text-right py-2">Prix Unit.</th>
                    <th className="text-right py-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="py-3">{item.description}</td>
                      <td className="text-right">{item.quantity}</td>
                      <td className="text-right">€{item.unitPrice}</td>
                      <td className="text-right font-medium">
                        €{item.total.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals */}
              <div className="flex justify-end">
                <div className="w-80 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sous-total</span>
                    <span>€{invoice.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      TVA ({(invoice.taxRate * 100).toFixed(0)}%)
                    </span>
                    <span>€{invoice.taxAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Caution bloquée</span>
                    <span className="text-orange-600">
                      -€{invoice.depositHeld.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t-2 text-lg font-bold">
                    <span>Total</span>
                    <span>€{invoice.total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Déjà payé</span>
                    <span>€{invoice.amountPaid.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold text-orange-600">
                    <span>Solde dû</span>
                    <span>€{invoice.amountDue.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Payment Terms */}
              <div className="mt-8 pt-6 border-t">
                <p className="text-sm text-muted-foreground">
                  <strong>Conditions de paiement:</strong> {invoice.paymentTerms}
                </p>
                {invoice.notes && (
                  <p className="text-sm text-muted-foreground mt-2">
                    <strong>Notes:</strong> {invoice.notes}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
