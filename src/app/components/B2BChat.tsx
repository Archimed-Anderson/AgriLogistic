import { useState, useRef, useEffect } from "react";
import {
  MessageCircle,
  Send,
  Paperclip,
  Image as ImageIcon,
  File,
  X,
  Search,
  MoreVertical,
  Phone,
  Video,
  Star,
  Circle,
  Check,
  CheckCheck,
  Clock,
  DollarSign,
  Package,
  AlertCircle,
  Smile,
} from "lucide-react";
import { toast } from "sonner";

interface B2BChatProps {
  contactId: string;
  contactName: string;
  contactCompany?: string;
  contactAvatar?: string;
  productContext?: {
    name: string;
    price: number;
    image?: string;
  };
  onClose?: () => void;
  className?: string;
  compact?: boolean;
}

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  type: "text" | "file" | "template" | "system";
  status: "sending" | "sent" | "delivered" | "read";
  attachments?: {
    name: string;
    type: string;
    url: string;
  }[];
}

interface Conversation {
  id: string;
  name: string;
  company: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  online: boolean;
  avatar?: string;
}

export function B2BChat({
  contactId,
  contactName,
  contactCompany,
  contactAvatar,
  productContext,
  onClose,
  className = "",
  compact = false,
}: B2BChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      senderId: contactId,
      content: "Bonjour ! Je suis intéressé par votre produit. Pouvez-vous me donner plus d'informations ?",
      timestamp: "10:30",
      type: "text",
      status: "read",
    },
    {
      id: "2",
      senderId: "me",
      content: "Bien sûr ! Ce produit est de très haute qualité. Quelle quantité recherchez-vous ?",
      timestamp: "10:32",
      type: "text",
      status: "read",
    },
    {
      id: "3",
      senderId: contactId,
      content: "J'aurais besoin d'environ 500kg. Quel serait votre meilleur prix pour cette quantité ?",
      timestamp: "10:35",
      type: "text",
      status: "read",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const templates = [
    {
      id: "1",
      title: "Demande de devis",
      content: "Bonjour, pourriez-vous m'envoyer un devis détaillé pour ce produit ? Merci.",
    },
    {
      id: "2",
      title: "Négociation prix",
      content: "Je suis très intéressé par votre produit. Seriez-vous ouvert à une négociation sur le prix ?",
    },
    {
      id: "3",
      title: "Question livraison",
      content: "Quels sont vos délais de livraison et les options disponibles ?",
    },
    {
      id: "4",
      title: "Commande en gros",
      content: "Je souhaite passer une commande importante. Proposez-vous des réductions sur les volumes ?",
    },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: "me",
      content: inputMessage,
      timestamp: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
      type: "text",
      status: "sending",
    };

    setMessages([...messages, newMessage]);
    setInputMessage("");

    // Simulation d'envoi
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === newMessage.id ? { ...msg, status: "sent" } : msg
        )
      );
    }, 500);

    // Simulation de réponse
    setTimeout(() => {
      setIsTyping(true);
    }, 1500);

    setTimeout(() => {
      setIsTyping(false);
      const response: Message = {
        id: `msg-${Date.now()}-response`,
        senderId: contactId,
        content: "Merci pour votre message ! Je reviens vers vous dans quelques instants.",
        timestamp: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
        type: "text",
        status: "sent",
      };
      setMessages((prev) => [...prev, response]);
      toast.success("Message reçu du vendeur");
    }, 3000);
  };

  const handleUseTemplate = (template: typeof templates[0]) => {
    setInputMessage(template.content);
    setShowTemplates(false);
    toast.success(`Template "${template.title}" chargé`);
  };

  const handleAttachment = (type: string) => {
    toast.success(`Fonction d'attachement ${type} disponible prochainement`);
    setShowAttachmentMenu(false);
  };

  const renderMessage = (message: Message) => {
    const isMine = message.senderId === "me";

    return (
      <div
        key={message.id}
        className={`flex ${isMine ? "justify-end" : "justify-start"} mb-4 group`}
      >
        <div className={`flex gap-2 max-w-[70%] ${isMine ? "flex-row-reverse" : "flex-row"}`}>
          {!isMine && (
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-semibold">
                {contactName.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          
          <div>
            <div
              className={`px-4 py-3 rounded-2xl ${
                isMine
                  ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
              }`}
            >
              <p className="text-sm break-words">{message.content}</p>
            </div>
            
            <div className={`flex items-center gap-1 mt-1 ${isMine ? "justify-end" : "justify-start"}`}>
              <span className="text-xs text-gray-500 dark:text-gray-400">{message.timestamp}</span>
              {isMine && (
                <>
                  {message.status === "sending" && <Clock className="h-3 w-3 text-gray-400" />}
                  {message.status === "sent" && <Check className="h-3 w-3 text-gray-400" />}
                  {message.status === "delivered" && <CheckCheck className="h-3 w-3 text-gray-400" />}
                  {message.status === "read" && <CheckCheck className="h-3 w-3 text-green-600" />}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (compact) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 ${className}`}>
        <button
          className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          onClick={() => toast.info("Ouverture du chat...")}
        >
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
            <MessageCircle className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1 text-left">
            <p className="font-semibold text-gray-900 dark:text-white">Contacter le vendeur</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Chat B2B instantané</p>
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 flex flex-col ${className}`}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-white text-lg font-semibold">
                  {contactName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">{contactName}</h3>
              {contactCompany && (
                <p className="text-sm text-gray-600 dark:text-gray-400">{contactCompany}</p>
              )}
              <p className="text-xs text-green-600 dark:text-green-400">En ligne</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Appel vocal"
            >
              <Phone className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
            <button
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Appel vidéo"
            >
              <Video className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <MoreVertical className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Product Context */}
      {productContext && (
        <div className="px-6 py-3 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-3">
            <Package className="h-5 w-5 text-blue-600" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{productContext.name}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Prix: {productContext.price}€
              </p>
            </div>
            <button className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700">
              Voir produit
            </button>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4" style={{ maxHeight: "500px" }}>
        {messages.map(renderMessage)}
        
        {isTyping && (
          <div className="flex gap-2 items-center">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-semibold">
                {contactName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 px-4 py-3 rounded-2xl">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Templates Popup */}
      {showTemplates && (
        <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-gray-900 dark:text-white">Templates de messages</h4>
            <button
              onClick={() => setShowTemplates(false)}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => handleUseTemplate(template)}
                className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-left hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
              >
                <p className="font-semibold text-sm text-gray-900 dark:text-white mb-1">{template.title}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">{template.content}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
        {/* Quick Actions */}
        <div className="flex gap-2 mb-3">
          <button
            onClick={() => setShowTemplates(!showTemplates)}
            className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg text-sm font-semibold flex items-center gap-1"
          >
            <Star className="h-3 w-3" />
            Templates
          </button>
          <button
            onClick={() => toast.info("Fonction de négociation")}
            className="px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 hover:bg-purple-200 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-400 rounded-lg text-sm font-semibold flex items-center gap-1"
          >
            <DollarSign className="h-3 w-3" />
            Négocier
          </button>
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <div className="relative">
            <button
              onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
              className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Paperclip className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
            
            {showAttachmentMenu && (
              <div className="absolute bottom-full left-0 mb-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-2 w-48">
                <button
                  onClick={() => handleAttachment("image")}
                  className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-left"
                >
                  <ImageIcon className="h-4 w-4 text-gray-600" />
                  <span className="text-sm text-gray-900 dark:text-white">Image</span>
                </button>
                <button
                  onClick={() => handleAttachment("file")}
                  className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-left"
                >
                  <File className="h-4 w-4 text-gray-600" />
                  <span className="text-sm text-gray-900 dark:text-white">Document</span>
                </button>
              </div>
            )}
          </div>

          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Écrivez votre message..."
            className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
          />

          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim()}
            className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-500/30"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
