/**
 * =======================================================
 * BOOKING WIZARD - Multi-step Reservation System
 * =======================================================
 * Complete booking assistant with:
 * - Step 1: Dates & Duration
 * - Step 2: Options (Insurance, Delivery, Operator, Installation)
 * - Step 3: Review & Payment
 * - Real-time cost simulation
 * - Smart validation
 */

import { useState, useMemo } from "react";
import {
  Calendar,
  Clock,
  Shield,
  Truck,
  User,
  Wrench,
  ChevronRight,
  ChevronLeft,
  Check,
  AlertCircle,
  Info,
  CreditCard,
  FileText,
  MapPin,
  Euro,
  TrendingUp,
  Zap,
} from "lucide-react";
import type { Equipment, ReservationExtra } from "../types";

interface BookingWizardProps {
  equipment: Equipment;
  onComplete: (booking: BookingData) => void;
  onCancel: () => void;
}

export interface BookingData {
  equipmentId: string;
  startDate: Date;
  endDate: Date;
  days: number;
  basePrice: number;
  extras: ReservationExtra[];
  totalPrice: number;
  deposit: number;
  deliveryAddress?: string;
  notes?: string;
}

type WizardStep = 1 | 2 | 3;

export function BookingWizard({ equipment, onComplete, onCancel }: BookingWizardProps) {
  const [currentStep, setCurrentStep] = useState<WizardStep>(1);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [notes, setNotes] = useState("");

  // Available extras
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);

  const availableExtras: ReservationExtra[] = [
    {
      id: "insurance_premium",
      type: "insurance",
      name: "Assurance Premium Tous Risques",
      price: 45,
      selected: false,
    },
    {
      id: "insurance_basic",
      type: "insurance",
      name: "Assurance Basique",
      price: 25,
      selected: false,
    },
    {
      id: "delivery_express",
      type: "delivery",
      name: "Livraison Express (< 24h)",
      price: 120,
      selected: false,
    },
    {
      id: "delivery_standard",
      type: "delivery",
      name: "Livraison Standard",
      price: 60,
      selected: false,
    },
    {
      id: "operator",
      type: "operator",
      name: "Chauffeur / Opérateur Professionnel",
      price: 200,
      selected: false,
    },
    {
      id: "installation",
      type: "installation",
      name: "Installation et Formation sur Site",
      price: 80,
      selected: false,
    },
    {
      id: "maintenance",
      type: "maintenance",
      name: "Maintenance Préventive Incluse",
      price: 35,
      selected: false,
    },
  ];

  // Calculate rental days
  const days = useMemo(() => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  }, [startDate, endDate]);

  // Calculate base price with dynamic pricing
  const basePrice = useMemo(() => {
    if (days === 0) return 0;

    let pricePerDay = equipment.pricePerDay;

    // Apply dynamic pricing based on season (simplified)
    const start = new Date(startDate);
    const month = start.getMonth();
    // Peak season: March-May, September-November
    if ((month >= 2 && month <= 4) || (month >= 8 && month <= 10)) {
      pricePerDay = equipment.dynamicPricing.peak;
    } else {
      pricePerDay = equipment.dynamicPricing.offPeak;
    }

    // Weekly discount
    if (days >= 7) {
      return equipment.pricePerWeek || pricePerDay * days * 0.9;
    }

    // Monthly discount
    if (days >= 30) {
      return equipment.pricePerMonth || pricePerDay * days * 0.75;
    }

    return pricePerDay * days;
  }, [days, startDate, equipment]);

  // Calculate extras total
  const extrasTotal = useMemo(() => {
    return availableExtras
      .filter((extra) => selectedExtras.includes(extra.id))
      .reduce((sum, extra) => sum + extra.price * days, 0);
  }, [selectedExtras, days, availableExtras]);

  // Calculate total price
  const totalPrice = basePrice + extrasTotal;

  // Calculate deposit (20% of total)
  const deposit = Math.round(totalPrice * 0.2);

  // Validation
  const isStep1Valid = startDate && endDate && days > 0 && new Date(startDate) <= new Date(endDate);
  const isStep2Valid = true; // Optional extras
  const isStep3Valid = true; // Review step

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return isStep1Valid;
      case 2:
        return isStep2Valid;
      case 3:
        return isStep3Valid;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (canProceed() && currentStep < 3) {
      setCurrentStep((prev) => (prev + 1) as WizardStep);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as WizardStep);
    }
  };

  const handleComplete = () => {
    if (!canProceed()) return;

    const bookingData: BookingData = {
      equipmentId: equipment.id,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      days,
      basePrice,
      extras: availableExtras
        .filter((extra) => selectedExtras.includes(extra.id))
        .map((extra) => ({ ...extra, selected: true })),
      totalPrice,
      deposit,
      deliveryAddress: deliveryAddress || undefined,
      notes: notes || undefined,
    };

    onComplete(bookingData);
  };

  const toggleExtra = (extraId: string) => {
    setSelectedExtras((prev) =>
      prev.includes(extraId) ? prev.filter((id) => id !== extraId) : [...prev, extraId]
    );
  };

  const getExtraIcon = (type: ReservationExtra["type"]) => {
    const icons = {
      insurance: Shield,
      delivery: Truck,
      operator: User,
      installation: Wrench,
      maintenance: Wrench,
      training: FileText,
    };
    return icons[type] || Info;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b bg-gradient-to-r from-[#2563eb] to-blue-600">
          <h2 className="text-2xl font-bold text-white mb-2">Réservation - {equipment.name}</h2>
          <p className="text-white/90 text-sm">{equipment.model}</p>
        </div>

        {/* Progress Indicator */}
        <div className="px-6 py-4 bg-muted/30">
          <div className="flex items-center justify-between max-w-md mx-auto">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-all ${
                    currentStep >= step
                      ? "bg-[#2563eb] text-white"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {currentStep > step ? <Check className="h-5 w-5" /> : step}
                </div>
                {step < 3 && (
                  <div
                    className={`w-16 h-1 mx-2 ${
                      currentStep > step ? "bg-[#2563eb]" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between max-w-md mx-auto mt-2">
            <span className="text-xs font-medium">Dates</span>
            <span className="text-xs font-medium">Options</span>
            <span className="text-xs font-medium">Confirmation</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Step 1: Dates & Duration */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-lg bg-[#2563eb]/10 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-[#2563eb]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Sélectionnez vos dates</h3>
                  <p className="text-sm text-muted-foreground">
                    Choisissez la période de location
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Date de début</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Date de fin</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      min={startDate || new Date().toISOString().split("T")[0]}
                      className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background"
                    />
                  </div>
                </div>
              </div>

              {days > 0 && (
                <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-3 mb-2">
                    <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span className="font-semibold text-blue-900 dark:text-blue-100">
                      Durée de location : {days} jour{days > 1 ? "s" : ""}
                    </span>
                  </div>
                  <p className="text-sm text-blue-700 dark:text-blue-300 ml-8">
                    {days >= 7 && "🎉 Réduction hebdomadaire appliquée (-10%)"}
                    {days >= 30 && "🎉 Réduction mensuelle appliquée (-25%)"}
                  </p>
                </div>
              )}

              {/* Pricing Preview */}
              {basePrice > 0 && (
                <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-xl border border-green-200 dark:border-green-800">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-semibold text-green-900 dark:text-green-100">
                      Prix de base
                    </span>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                        {basePrice.toFixed(2)} €
                      </div>
                      <div className="text-sm text-green-700 dark:text-green-300">
                        {(basePrice / days).toFixed(2)} € / jour
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-300">
                    <TrendingUp className="h-4 w-4" />
                    <span>Tarif {days >= 30 ? "mensuel" : days >= 7 ? "hebdomadaire" : "standard"}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Options */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-lg bg-[#2563eb]/10 flex items-center justify-center">
                  <Zap className="h-6 w-6 text-[#2563eb]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Options et services additionnels</h3>
                  <p className="text-sm text-muted-foreground">
                    Personnalisez votre réservation (optionnel)
                  </p>
                </div>
              </div>

              <div className="grid gap-4">
                {availableExtras.map((extra) => {
                  const Icon = getExtraIcon(extra.type);
                  const isSelected = selectedExtras.includes(extra.id);

                  return (
                    <button
                      key={extra.id}
                      onClick={() => toggleExtra(extra.id)}
                      className={`p-4 border-2 rounded-xl text-left transition-all hover:shadow-md ${
                        isSelected
                          ? "border-[#2563eb] bg-blue-50 dark:bg-blue-950/30"
                          : "border-muted hover:border-[#2563eb]/50"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`h-12 w-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            isSelected
                              ? "bg-[#2563eb] text-white"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          <Icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h4 className="font-semibold mb-1">{extra.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {extra.type === "insurance" &&
                                  "Protection complète pour votre tranquillité"}
                                {extra.type === "delivery" &&
                                  "Livraison directe sur votre exploitation"}
                                {extra.type === "operator" &&
                                  "Opérateur qualifié pour utiliser l'équipement"}
                                {extra.type === "installation" &&
                                  "Installation et formation à l'utilisation"}
                                {extra.type === "maintenance" &&
                                  "Maintenance incluse pendant la location"}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-lg text-[#2563eb]">
                                +{extra.price} €
                              </div>
                              <div className="text-xs text-muted-foreground">par jour</div>
                              {days > 0 && (
                                <div className="text-sm font-semibold mt-1">
                                  {(extra.price * days).toFixed(2)} € total
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div
                          className={`h-6 w-6 rounded-full border-2 flex items-center justify-center ${
                            isSelected
                              ? "border-[#2563eb] bg-[#2563eb]"
                              : "border-muted-foreground"
                          }`}
                        >
                          {isSelected && <Check className="h-4 w-4 text-white" />}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Delivery Address (if delivery selected) */}
              {selectedExtras.some((id) => id.includes("delivery")) && (
                <div className="p-4 bg-muted/30 rounded-lg">
                  <label className="block text-sm font-medium mb-2">Adresse de livraison</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input
                      type="text"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="Adresse complète de l'exploitation"
                      className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Review & Confirm */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 rounded-lg bg-[#2563eb]/10 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-[#2563eb]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Récapitulatif de votre réservation</h3>
                  <p className="text-sm text-muted-foreground">
                    Vérifiez les détails avant de confirmer
                  </p>
                </div>
              </div>

              {/* Equipment Summary */}
              <div className="p-4 bg-muted/30 rounded-lg">
                <h4 className="font-semibold mb-3">Équipement</h4>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
                    <span className="text-2xl">🚜</span>
                  </div>
                  <div>
                    <p className="font-semibold">{equipment.name}</p>
                    <p className="text-sm text-muted-foreground">{equipment.model}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {equipment.location.city} • {equipment.owner.name}
                    </p>
                  </div>
                </div>
              </div>

              {/* Dates Summary */}
              <div className="p-4 bg-muted/30 rounded-lg">
                <h4 className="font-semibold mb-3">Période</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Début</p>
                    <p className="font-medium">
                      {new Date(startDate).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Fin</p>
                    <p className="font-medium">{new Date(endDate).toLocaleDateString("fr-FR")}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Durée</p>
                    <p className="font-medium">{days} jour{days > 1 ? "s" : ""}</p>
                  </div>
                </div>
              </div>

              {/* Options Summary */}
              {selectedExtras.length > 0 && (
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-semibold mb-3">Options sélectionnées</h4>
                  <div className="space-y-2">
                    {availableExtras
                      .filter((extra) => selectedExtras.includes(extra.id))
                      .map((extra) => (
                        <div
                          key={extra.id}
                          className="flex items-center justify-between text-sm"
                        >
                          <span>{extra.name}</span>
                          <span className="font-medium">
                            {(extra.price * days).toFixed(2)} €
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-xl border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold mb-4 text-blue-900 dark:text-blue-100">
                  Détail des coûts
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Location de base ({days} jours)</span>
                    <span className="font-medium">{basePrice.toFixed(2)} €</span>
                  </div>
                  {extrasTotal > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Options et services</span>
                      <span className="font-medium">{extrasTotal.toFixed(2)} €</span>
                    </div>
                  )}
                  <div className="border-t pt-3 flex items-center justify-between text-lg font-bold text-blue-600 dark:text-blue-400">
                    <span>Total</span>
                    <span>{totalPrice.toFixed(2)} €</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Caution (20%)</span>
                    <span className="font-medium">{deposit.toFixed(2)} €</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Notes supplémentaires (optionnel)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Précisions sur votre utilisation, besoins spécifiques..."
                  rows={3}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb] bg-background"
                />
              </div>

              {/* Important Info */}
              <div className="p-4 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-semibold text-yellow-900 dark:text-yellow-100 mb-1">
                      Conditions importantes
                    </p>
                    <ul className="text-yellow-700 dark:text-yellow-300 space-y-1 list-disc list-inside">
                      <li>La caution sera restituée sous 7 jours après retour</li>
                      <li>Annulation gratuite jusqu'à 48h avant le début</li>
                      <li>Assurance responsabilité civile incluse</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t bg-muted/30">
          <div className="flex items-center justify-between">
            <button
              onClick={currentStep === 1 ? onCancel : handleBack}
              className="px-6 py-3 border rounded-lg hover:bg-muted transition-colors flex items-center gap-2"
            >
              <ChevronLeft className="h-5 w-5" />
              {currentStep === 1 ? "Annuler" : "Retour"}
            </button>

            <div className="flex items-center gap-4">
              {days > 0 && (
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Total</div>
                  <div className="text-2xl font-bold text-[#2563eb]">
                    {totalPrice.toFixed(2)} €
                  </div>
                </div>
              )}

              {currentStep < 3 ? (
                <button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="px-6 py-3 bg-[#2563eb] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continuer
                  <ChevronRight className="h-5 w-5" />
                </button>
              ) : (
                <button
                  onClick={handleComplete}
                  disabled={!canProceed()}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CreditCard className="h-5 w-5" />
                  Confirmer la réservation
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
