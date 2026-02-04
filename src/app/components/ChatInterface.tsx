import { useState } from 'react';
import {
  Send,
  Search,
  MoreVertical,
  Bot,
  User,
  Sparkles,
  Lightbulb,
  BookOpen,
  Wrench,
  AlertCircle,
} from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { chatConversations, messages as initialMessages } from '../data/mockData';

interface AIMessage {
  id: number;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  intent?: string;
  confidence?: number;
  suggestedActions?: Array<{
    label: string;
    action: string;
  }>;
  contextual?: boolean;
}

interface ConversationContext {
  topic: string;
  entities: string[];
  history: string[];
  userPreferences: Record<string, any>;
}

export function ChatInterface() {
  const [selectedChat, setSelectedChat] = useState(1);
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState(initialMessages);
  const [aiMessages, setAiMessages] = useState<AIMessage[]>([
    {
      id: 1,
      sender: 'ai',
      text: "Bonjour! Je suis votre assistant IA AgroLogistic. Je peux vous aider avec vos cultures, la gestion de votre exploitation, les prévisions météo, et bien plus encore. Comment puis-je vous assister aujourd'hui?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      intent: 'greeting',
      confidence: 100,
      suggestedActions: [
        { label: 'État de mes cultures', action: "Afficher l'état actuel de toutes mes cultures" },
        {
          label: 'Recommandations IA',
          action: 'Quelles sont vos recommandations IA pour cette semaine?',
        },
        {
          label: 'Météo prévisions',
          action: 'Quelle est la météo prévue pour les 7 prochains jours?',
        },
      ],
    },
  ]);
  const [isAiMode, setIsAiMode] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [conversationContext, setConversationContext] = useState<ConversationContext>({
    topic: 'general',
    entities: [],
    history: [],
    userPreferences: {},
  });

  // AI Natural Language Processing
  const processAIMessage = async (userMessage: string): Promise<AIMessage> => {
    const lowercaseMsg = userMessage.toLowerCase();

    // Intent detection
    let intent = 'general';
    let confidence = 75;
    let response = '';
    let suggestedActions: Array<{ label: string; action: string }> = [];

    // Crop status queries
    if (
      lowercaseMsg.includes('culture') ||
      lowercaseMsg.includes('récolte') ||
      lowercaseMsg.includes('plante')
    ) {
      intent = 'crop_status';
      confidence = 92;
      response =
        "Selon mes analyses, vos cultures de maïs (Parcelle Nord) montrent une excellente santé avec un NDVI de 0.82. Les tomates (Serre B) ont besoin d'irrigation dans les 48h. Blé (Champ Est) est à 85% de maturité, récolte prévue dans 12-15 jours. Voulez-vous des détails sur une culture spécifique?";
      suggestedActions = [
        { label: 'Détails maïs', action: 'Donne-moi plus de détails sur le maïs' },
        { label: 'Plan irrigation', action: "Créer un plan d'irrigation pour les tomates" },
        { label: 'Planifier récolte', action: 'Planifier la récolte du blé' },
      ];
    }
    // Weather queries
    else if (
      lowercaseMsg.includes('météo') ||
      lowercaseMsg.includes('pluie') ||
      lowercaseMsg.includes('température')
    ) {
      intent = 'weather';
      confidence = 95;
      response =
        "Prévisions 7 jours: Aujourd'hui 22°C ensoleillé, demain 24°C nuageux, pluie modérée jeudi (15mm) - idéal pour reporter traitement phytosanitaire. Températures montant à 27°C en fin de semaine. Vent faible toute la semaine. Risque gel: 0%. Je recommande d'irriguer avant jeudi.";
      suggestedActions = [
        { label: 'Détails horaires', action: 'Prévisions heure par heure pour demain' },
        { label: 'Impact cultures', action: 'Comment cette météo va affecter mes cultures?' },
        { label: 'Alerte météo', action: 'Créer une alerte météo personnalisée' },
      ];
    }
    // Disease detection
    else if (
      lowercaseMsg.includes('maladie') ||
      lowercaseMsg.includes('parasite') ||
      lowercaseMsg.includes('traitement')
    ) {
      intent = 'disease_help';
      confidence = 88;
      response =
        "Aucune maladie critique détectée actuellement. Cependant, j'ai identifié des signes précoces de mildiou sur 3% de la Parcelle Nord (confiance 87%). Traitement préventif recommandé: fongicide cuivre à 0.5kg/ha sous 72h. Coût estimé: 45€. Voulez-vous que je crée une tâche d'intervention?";
      suggestedActions = [
        { label: 'Créer intervention', action: "Créer une tâche d'intervention pour le mildiou" },
        { label: 'Voir symptômes', action: 'Montre-moi les photos des symptômes détectés' },
        { label: 'Alternatives bio', action: 'Quels sont les traitements bio disponibles?' },
      ];
    }
    // Recommendations
    else if (
      lowercaseMsg.includes('recommand') ||
      lowercaseMsg.includes('conseil') ||
      lowercaseMsg.includes('suggesti')
    ) {
      intent = 'recommendations';
      confidence = 90;
      response =
        '3 recommandations prioritaires IA cette semaine:\n\n1️⃣ Augmenter densité maïs de 5% (ROI: +3.2x, confiance 91%)\n2️⃣ Vendre blé dans 3-4 jours - pic prix prévu à 245€/t (confiance 88%)\n3️⃣ Réduire fertilisation azote de 12% - sol sursaturé (économie: 380€)\n\nVoulez-vous appliquer une de ces recommandations?';
      suggestedActions = [
        { label: 'Appliquer #1', action: 'Appliquer la recommandation densité maïs' },
        { label: 'Détails #2', action: 'Plus de détails sur la recommandation vente blé' },
        { label: 'Toutes les recommandations', action: 'Afficher toutes les recommandations IA' },
      ];
    }
    // Automation
    else if (
      lowercaseMsg.includes('automatisation') ||
      lowercaseMsg.includes('règle') ||
      lowercaseMsg.includes('workflow')
    ) {
      intent = 'automation';
      confidence = 86;
      response =
        "Vous avez 5 règles d'automatisation actives (taux succès 98%). La plus utilisée: 'Irrigation Intelligente' (24 exécutions cette semaine). Je peux créer une nouvelle règle - par exemple: déclencher alerte si humidité < 25% ET température > 28°C. Quel type d'automatisation souhaitez-vous?";
      suggestedActions = [
        { label: 'Nouvelle règle', action: "Créer une nouvelle règle d'automatisation" },
        { label: 'Voir règles actives', action: "Afficher toutes mes règles d'automatisation" },
        { label: 'Optimiser règles', action: 'Suggère des optimisations pour mes règles' },
      ];
    }
    // Market/Finance
    else if (
      lowercaseMsg.includes('prix') ||
      lowercaseMsg.includes('vente') ||
      lowercaseMsg.includes('marché')
    ) {
      intent = 'market';
      confidence = 89;
      response =
        "Analyse marché aujourd'hui:\n\n🌾 Blé: 238€/t (+2% cette semaine) - VENDRE dans 3-5 jours\n🌽 Maïs: 195€/t (stable) - ATTENDRE 2 semaines\n🍅 Tomates: 1.85€/kg (+8% demande) - VENDRE maintenant\n\nVos stocks: 45t blé, 22t maïs, 580kg tomates. Revenus potentiels: 18,850€. Voulez-vous créer une annonce?";
      suggestedActions = [
        { label: 'Vendre blé', action: 'Créer une annonce de vente pour mon blé' },
        { label: 'Tendances prix', action: 'Afficher les tendances de prix sur 30 jours' },
        { label: 'Alertes prix', action: 'Configurer des alertes de prix personnalisées' },
      ];
    }
    // Learning/Help
    else if (
      lowercaseMsg.includes('comment') ||
      lowercaseMsg.includes('aide') ||
      lowercaseMsg.includes('expliqu')
    ) {
      intent = 'help';
      confidence = 82;
      response =
        "Je peux vous aider! Je suis spécialisé dans:\n\n📊 Analyse de données agricoles en temps réel\n🤖 Recommandations IA personnalisées\n🌱 Surveillance cultures et détection maladies\n⚙️ Automatisation des tâches répétitives\n💰 Optimisation revenus et timing marché\n\nPosez-moi des questions en langage naturel, par exemple: 'Quand dois-je récolter?' ou 'Mes tomates ont-elles besoin d'eau?'";
      suggestedActions = [
        { label: 'Tutoriel IA', action: 'Montre-moi comment utiliser les fonctionnalités IA' },
        { label: 'FAQ', action: 'Afficher les questions fréquentes' },
        { label: 'Ressources', action: "Accéder aux ressources d'apprentissage" },
      ];
    }
    // Default
    else {
      response = `J'ai bien reçu votre message: "${userMessage}". Je peux vous aider avec la gestion de cultures, prévisions météo, recommandations IA, automatisation, analyses marché, et bien plus. Pouvez-vous préciser votre besoin?`;
      suggestedActions = [
        { label: 'État cultures', action: "Quel est l'état de mes cultures?" },
        { label: 'Recommandations', action: 'Quelles sont tes recommandations?' },
        { label: 'Aide', action: "Comment peux-tu m'aider?" },
      ];
    }

    return {
      id: Date.now(),
      sender: 'ai',
      text: response,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      intent,
      confidence,
      suggestedActions,
      contextual: true,
    };
  };

  const handleSendMessage = async () => {
    if (messageInput.trim()) {
      if (isAiMode) {
        // AI Mode
        const userMessage: AIMessage = {
          id: Date.now(),
          sender: 'user',
          text: messageInput,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setAiMessages((prev) => [...prev, userMessage]);
        setMessageInput('');
        setIsProcessing(true);

        // Update context
        setConversationContext((prev) => ({
          ...prev,
          history: [...prev.history, messageInput],
        }));

        // Simulate AI processing (1.5 seconds)
        setTimeout(async () => {
          const aiResponse = await processAIMessage(messageInput);
          setAiMessages((prev) => [...prev, aiResponse]);
          setIsProcessing(false);
        }, 1500);
      } else {
        // Standard chat mode
        setMessages([
          ...messages,
          {
            id: messages.length + 1,
            sender: 'admin',
            text: messageInput,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
        setMessageInput('');
      }
    }
  };

  const handleSuggestedAction = (action: string) => {
    setMessageInput(action);
  };

  const selectedConversation = chatConversations.find((c) => c.id === selectedChat);

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-4">
      {/* Conversations List */}
      <Card className="w-80 flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold">Messages</h2>
            <button
              onClick={() => setIsAiMode(!isAiMode)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                isAiMode
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {isAiMode ? 'Mode IA' : 'Mode Chat'}
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search conversations..." className="pl-10" />
          </div>
        </div>

        {isAiMode ? (
          <div className="flex-1 p-4">
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950 rounded-lg p-4 border-2 border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-2 mb-3">
                <Bot className="h-5 w-5 text-purple-600" />
                <h3 className="font-bold text-purple-900 dark:text-purple-100">
                  Assistant IA AgroLogistic
                </h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Intelligence artificielle avancée pour vous aider avec toutes vos questions
                agricoles.
              </p>

              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <Lightbulb className="h-4 w-4 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium">Contexte Intelligent</p>
                    <p className="text-xs text-muted-foreground">
                      Comprend le contexte de vos conversations
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Sparkles className="h-4 w-4 text-purple-600 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium">Traitement NLP</p>
                    <p className="text-xs text-muted-foreground">Comprend le langage naturel</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <BookOpen className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium">Apprentissage Continu</p>
                    <p className="text-xs text-muted-foreground">
                      S'améliore avec chaque interaction
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-purple-200 dark:border-purple-800">
                <p className="text-xs font-medium mb-2">Contexte actuel:</p>
                <div className="flex flex-wrap gap-1">
                  <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 text-xs rounded">
                    {conversationContext.topic}
                  </span>
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs rounded">
                    {conversationContext.history.length} messages
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            {chatConversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => setSelectedChat(conversation.id)}
                className={`w-full p-4 flex items-start gap-3 transition-colors border-b hover:bg-muted/50 ${
                  selectedChat === conversation.id ? 'bg-muted' : ''
                }`}
              >
                <Avatar>
                  <AvatarFallback className="bg-[#2563eb] text-white">
                    {conversation.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium">{conversation.name}</span>
                    <span className="text-xs text-muted-foreground">{conversation.timestamp}</span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {conversation.lastMessage}
                  </p>
                </div>
                {conversation.unread > 0 && (
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#2563eb] text-xs text-white">
                    {conversation.unread}
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </Card>

      {/* Chat Window */}
      <Card className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b flex items-center justify-between">
          {isAiMode ? (
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">Assistant IA AgroLogistic</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  {isProcessing ? (
                    <>
                      <Sparkles className="h-3 w-3 animate-pulse" />
                      <span>Traitement en cours...</span>
                    </>
                  ) : (
                    <>
                      <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                      <span>En ligne - Prêt à aider</span>
                    </>
                  )}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback className="bg-[#2563eb] text-white">
                  {selectedConversation?.avatar}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{selectedConversation?.name}</h3>
                <p className="text-sm text-muted-foreground">Active now</p>
              </div>
            </div>
          )}
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {isAiMode ? (
            <>
              {aiMessages.map((message) => (
                <div key={message.id}>
                  <div
                    className={`flex items-start gap-3 ${
                      message.sender === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.sender === 'ai' && (
                      <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                        <Bot className="h-5 w-5 text-white" />
                      </div>
                    )}
                    <div
                      className={`max-w-[70%] rounded-lg px-4 py-3 ${
                        message.sender === 'user'
                          ? 'bg-[#2563eb] text-white'
                          : 'bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950 border border-purple-200 dark:border-purple-800'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-line">{message.text}</p>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-current/10">
                        <span
                          className={`text-xs ${
                            message.sender === 'user' ? 'text-blue-100' : 'text-muted-foreground'
                          }`}
                        >
                          {message.timestamp}
                        </span>
                        {message.confidence && (
                          <span className="text-xs px-2 py-0.5 rounded bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
                            {message.confidence}% confiance
                          </span>
                        )}
                      </div>
                    </div>
                    {message.sender === 'user' && (
                      <div className="h-8 w-8 rounded-full bg-[#2563eb] flex items-center justify-center flex-shrink-0">
                        <User className="h-5 w-5 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Suggested Actions */}
                  {message.suggestedActions && message.suggestedActions.length > 0 && (
                    <div className="ml-11 mt-2 flex flex-wrap gap-2">
                      {message.suggestedActions.map((action, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSuggestedAction(action.action)}
                          className="px-3 py-1.5 text-xs bg-white dark:bg-gray-900 border border-purple-200 dark:border-purple-800 rounded-full hover:bg-purple-50 dark:hover:bg-purple-950 transition-colors flex items-center gap-1"
                        >
                          <Wrench className="h-3 w-3" />
                          {action.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {isProcessing && (
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950 border border-purple-200 dark:border-purple-800 rounded-lg px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <span
                          className="h-2 w-2 bg-purple-500 rounded-full animate-bounce"
                          style={{ animationDelay: '0ms' }}
                        ></span>
                        <span
                          className="h-2 w-2 bg-purple-500 rounded-full animate-bounce"
                          style={{ animationDelay: '150ms' }}
                        ></span>
                        <span
                          className="h-2 w-2 bg-purple-500 rounded-full animate-bounce"
                          style={{ animationDelay: '300ms' }}
                        ></span>
                      </div>
                      <span className="text-xs text-muted-foreground">Analyse en cours...</span>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg px-4 py-2 ${
                    message.sender === 'admin' ? 'bg-[#2563eb] text-white' : 'bg-muted'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <span
                    className={`text-xs mt-1 block ${
                      message.sender === 'admin' ? 'text-blue-100' : 'text-muted-foreground'
                    }`}
                  >
                    {message.timestamp}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Message Input */}
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              placeholder="Type your message..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSendMessage();
                }
              }}
            />
            <Button onClick={handleSendMessage} className="bg-[#2563eb] hover:bg-[#1d4ed8]">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
