'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import {
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  ShoppingCart,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  Truck,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();

  // Simplified tax and shipping for demo
  const shipping = totalItems > 0 ? 2500 : 0;
  const tax = Math.round(totalPrice * 0.05);
  const finalTotal = totalPrice + shipping + tax;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#F8F9FA]">
        <Navbar />
        <main className="container mx-auto px-6 pt-40 pb-20">
          <div className="max-w-xl mx-auto text-center bg-white p-12 rounded-[3rem] shadow-sm border border-slate-100">
            <div className="w-24 h-24 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-8">
              <ShoppingCart className="h-10 w-10 text-slate-200" />
            </div>
            <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">
              Votre panier est vide
            </h1>
            <p className="text-slate-500 font-medium mb-10 leading-relaxed">
              Il semble que vous n'ayez pas encore ajouté de produits. Explorez notre marketplace
              pour découvrir des pépites !
            </p>
            <Link href="/marketplace">
              <Button className="h-16 px-10 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-widest transition-all shadow-xl shadow-emerald-100 group">
                <ArrowLeft className="mr-3 h-5 w-5 transition-transform group-hover:-translate-x-1" />
                Retour à la boutique
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <Navbar />

      <main className="container mx-auto px-6 pt-40 pb-20">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Cart Items List */}
          <div className="flex-1 space-y-8">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">Mon Panier</h1>
              <span className="px-4 py-1.5 rounded-full bg-slate-100 text-slate-600 text-xs font-black uppercase tracking-widest">
                {totalItems} articles
              </span>
            </div>

            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  data-testid="cart-item"
                  className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center gap-8 group hover:shadow-md transition-all duration-300"
                >
                  <div className="w-32 h-32 rounded-2xl overflow-hidden bg-slate-50 flex-shrink-0 border border-slate-50">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  <div className="flex-1 text-center sm:text-left">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="font-black text-slate-900 text-xl mb-1">{item.name}</h3>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                          {item.category}
                        </p>
                      </div>
                      <div className="text-xl font-black text-slate-900">
                        {(item.price * item.quantity).toLocaleString()} {item.currency}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex items-center bg-slate-50 rounded-xl p-1 h-12 w-32 border border-slate-100">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="flex-1 flex items-center justify-center h-full text-slate-600 hover:bg-white rounded-lg transition-all"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-10 text-center font-black text-slate-900">
                        {item.quantity}
                      </span>
                      <button
                        data-testid="cart-plus"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="flex-1 flex items-center justify-center h-full text-slate-600 hover:bg-white rounded-lg transition-all"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-3 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all duration-300"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/marketplace"
              className="inline-flex items-center text-slate-400 hover:text-emerald-600 font-bold transition-colors group"
            >
              <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Continuer mes achats
            </Link>
          </div>

          {/* Order Summary Sidebar */}
          <aside className="lg:w-[400px] space-y-6">
            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm sticky top-32">
              <h2 className="text-2xl font-black text-slate-900 mb-8 tracking-tight">
                Récapitulatif
              </h2>

              <div className="space-y-6 mb-10">
                <div className="flex justify-between text-slate-500 font-bold">
                  <span>Sous-total</span>
                  <span className="text-slate-900">{totalPrice.toLocaleString()} FCFA</span>
                </div>
                <div className="flex justify-between text-slate-500 font-bold">
                  <span>Livraison</span>
                  <span className="text-slate-900">{shipping.toLocaleString()} FCFA</span>
                </div>
                <div className="flex justify-between text-slate-500 font-bold">
                  <span>Taxes (5%)</span>
                  <span className="text-slate-900">{tax.toLocaleString()} FCFA</span>
                </div>
                <div className="h-[1px] bg-slate-100 w-full" />
                <div className="flex justify-between items-center">
                  <span className="text-xl font-black text-slate-900">Total</span>
                  <span className="text-2xl font-black text-emerald-600">
                    {finalTotal.toLocaleString()} FCFA
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <Link href="/checkout-mockup">
                  <Button className="w-full h-16 bg-slate-900 hover:bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest transition-all group shadow-xl">
                    Passer la commande
                    <ArrowRight className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>

              <div className="mt-8 pt-8 border-t border-slate-50 space-y-4">
                <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  Paiement 100% sécurisé
                </div>
                <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <Truck className="h-4 w-4 text-emerald-500" />
                  Livraison Express
                </div>
              </div>
            </div>

            {/* Promo Section */}
            <div className="bg-emerald-600 p-8 rounded-[2.5rem] text-white relative overflow-hidden group">
              <div className="relative z-10">
                <h4 className="font-black text-lg mb-2">Un code promo ?</h4>
                <p className="text-emerald-100 text-sm font-medium mb-6">
                  Ajoutez-le à l'étape suivante pour profiter de -10%.
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="CODE10"
                    className="flex-1 bg-white/20 border-none rounded-xl px-4 py-3 placeholder:text-emerald-100 text-white font-bold"
                  />
                  <button className="px-6 bg-white text-emerald-600 rounded-xl font-black text-xs uppercase">
                    Appliquer
                  </button>
                </div>
              </div>
              <Sparkles className="absolute -bottom-4 -right-4 h-24 w-24 text-white/10 rotate-12" />
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
