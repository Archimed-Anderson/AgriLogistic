/**
 * Buyer AI Assistant Page
 * AI-powered sourcing assistant with chat interface
 */
'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  TrendingDown,
  Package,
  Truck,
  FileText,
  RefreshCw,
  ChevronRight,
  User,
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

const initialMessages: Message[] = [
  {
    id: 'm-1',
    role: 'assistant',
    content:
      "Bonjour ! Je suis votre assistant IA pour le sourcing. Comment puis-je vous aider aujourd'hui ?",
    timestamp: new Date(),
    suggestions: [
      'Trouve-moi des tomates bio à moins de 2000 FCFA/kg',
      'Quels fournisseurs ont les meilleures notes ?',
      'Analyse mes dépenses du mois dernier',
      'Suggère des alternatives moins chères pour mes achats',
    ],
  },
];

const quickActions = [
  {
    icon: TrendingDown,
    label: 'Alertes prix',
    action: 'Quelles sont les meilleures offres actuelles ?',
  },
  { icon: Package, label: 'Stocks critiques', action: 'Quels produits dois-je réapprovisionner ?' },
  { icon: Truck, label: 'Livraisons', action: 'Où en sont mes livraisons du jour ?' },
  { icon: FileText, label: 'Factures', action: 'Ai-je des factures en attente de paiement ?' },
];

export default function BuyerAssistantPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const simulateResponse = (userMessage: string): string => {
    const lowerMsg = userMessage.toLowerCase();

    if (lowerMsg.includes('tomate')) {
      return `J'ai trouvé **3 offres** intéressantes pour les tomates bio :\n\n1. **Ferme Bio Casamance** - 1 850 FCFA/kg ⭐ 4.8\n   - Disponibilité: 250 kg\n   - Livraison: 2 jours\n\n2. **Coopérative Niayes** - 1 920 FCFA/kg ⭐ 4.5\n   - Disponibilité: 180 kg\n   - Livraison: 1 jour\n\n3. **Verger du Fleuve** - 2 100 FCFA/kg ⭐ 4.9\n   - Bio certifié Ecocert\n   - Livraison express disponible\n\nVoulez-vous que je compare les prix avec vos achats précédents ?`;
    }

    if (lowerMsg.includes('fournisseur') || lowerMsg.includes('note')) {
      return `Voici vos **top fournisseurs** par note :\n\n🥇 **Ferme Bio Casamance** - ⭐ 4.8/5\n   - 234 commandes, 95% fiabilité\n   - Spécialité: Légumes bio\n\n🥈 **Coopérative Niayes** - ⭐ 4.5/5\n   - 189 commandes, 92% fiabilité\n   - Prix compétitifs\n\n🥉 **Verger du Fleuve** - ⭐ 4.4/5\n   - 78 commandes, 88% fiabilité\n   - Fruits de saison\n\nSouhaitez-vous voir les détails d'un fournisseur ?`;
    }

    if (lowerMsg.includes('dépense') || lowerMsg.includes('analyse')) {
      return `📊 **Analyse de vos dépenses** (Janvier 2026) :\n\n**Total**: 4 500 000 FCFA\n\n**Par catégorie** :\n- Légumes: 42% (1 890 000 FCFA)\n- Fruits: 30% (1 350 000 FCFA)\n- Autres: 28% (1 260 000 FCFA)\n\n📈 **Tendances** :\n- +12% vs décembre 2025\n- Pic d'achats: Semaine 3\n\n💡 **Recommandation** : Vous avez économisé 15% en achetant directement aux coopératives. Je suggère d'augmenter ces achats.`;
    }

    if (lowerMsg.includes('stock') || lowerMsg.includes('réapprovision')) {
      return `⚠️ **Produits à réapprovisionner** :\n\n🔴 **Critique** :\n- Mangues Kent: 15 kg (min: 50 kg)\n\n🟡 **Stock bas** :\n- Oignons Violets: 45 kg (min: 80 kg)\n\n**Action recommandée** :\nJ'ai identifié une offre chez Ferme Kolda pour les oignons à -10% avec livraison gratuite.\n\nVoulez-vous que je prépare une commande ?`;
    }

    if (lowerMsg.includes('livraison')) {
      return `🚚 **Livraisons du jour** :\n\n**En cours** (2) :\n1. AGR-2026-0001 - Ferme Bio Casamance\n   - ETA: 14h30\n   - Position: Kaolack → Dakar\n\n2. AGR-2026-0002 - Coopérative Niayes\n   - ETA: 09h15 (arrivée imminente!)\n   - Position: Périphérie Dakar\n\n⚠️ **Retardée** (1) :\n- AGR-2026-0005: +24h (météo)\n\nVoulez-vous contacter un transporteur ?`;
    }

    if (lowerMsg.includes('facture')) {
      return `📋 **Factures en attente** :\n\n1. **FACT-2026-0047** - 160 000 FCFA\n   - Verger du Fleuve\n   - Échéance: 22 fév. 2026\n   - Statut: En attente\n\n2. **FACT-2026-0048** - 305 000 FCFA\n   - Ferme Kolda\n   - Échéance: 20 jan. 2026\n   - ⚠️ **En retard**\n\nVoulez-vous payer une facture maintenant ?`;
    }

    return `Je comprends votre demande concernant "${userMessage}".\n\nJe peux vous aider avec :\n- 🔍 Recherche de produits et fournisseurs\n- 📊 Analyse de vos dépenses\n- 📦 Gestion des stocks\n- 🚚 Suivi des livraisons\n- 💰 Optimisation des coûts\n\nQue souhaitez-vous explorer ?`;
  };

  const handleSend = async (message?: string) => {
    const userMessage = message || input;
    if (!userMessage.trim()) return;

    const newUserMessage: Message = {
      id: `m-${Date.now()}`,
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const response = simulateResponse(userMessage);
    const newAssistantMessage: Message = {
      id: `m-${Date.now() + 1}`,
      role: 'assistant',
      content: response,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newAssistantMessage]);
    setIsTyping(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Assistant IA</h1>
            <p className="text-slate-600 flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Sourcing intelligent
            </p>
          </div>
        </div>
        <button
          onClick={() => setMessages(initialMessages)}
          className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl text-sm font-medium flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Nouvelle conversation
        </button>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={index}
              onClick={() => handleSend(action.action)}
              className="flex items-center gap-2 p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-left"
            >
              <Icon className="w-5 h-5 text-amber-500 shrink-0" />
              <span className="text-sm font-medium text-slate-700">{action.label}</span>
            </button>
          );
        })}
      </div>

      {/* Messages */}
      <div className="flex-1 bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-4 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  message.role === 'assistant'
                    ? 'bg-gradient-to-br from-amber-500 to-amber-600'
                    : 'bg-slate-200'
                }`}
              >
                {message.role === 'assistant' ? (
                  <Bot className="w-5 h-5 text-white" />
                ) : (
                  <User className="w-5 h-5 text-slate-600" />
                )}
              </div>
              <div className={`max-w-[70%] ${message.role === 'user' ? 'text-right' : ''}`}>
                <div
                  className={`inline-block p-4 rounded-2xl ${
                    message.role === 'user'
                      ? 'bg-amber-500 text-white'
                      : 'bg-slate-100 text-slate-900'
                  }`}
                >
                  <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                </div>
                {message.suggestions && (
                  <div className="mt-3 space-y-2">
                    {message.suggestions.map((suggestion, i) => (
                      <button
                        key={i}
                        onClick={() => handleSend(suggestion)}
                        className="flex items-center gap-2 w-full p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-left text-sm text-slate-700"
                      >
                        <ChevronRight className="w-4 h-4 text-amber-500 shrink-0" />
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-slate-100 rounded-2xl p-4">
                <div className="flex gap-1">
                  <div
                    className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                    style={{ animationDelay: '0ms' }}
                  />
                  <div
                    className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                    style={{ animationDelay: '150ms' }}
                  />
                  <div
                    className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                    style={{ animationDelay: '300ms' }}
                  />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-slate-200">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Posez votre question..."
              className="flex-1 px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim()}
              className="px-4 py-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
