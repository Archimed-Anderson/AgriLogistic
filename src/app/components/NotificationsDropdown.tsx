import { useState } from "react";
import {
  Heart,
  MessageCircle,
  Settings,
  Bell,
  X,
  Eye,
  Reply,
  ThumbsUp,
  CheckCircle,
} from "lucide-react";

interface Notification {
  id: string;
  type: "message" | "like" | "system";
  title: string;
  message: string;
  time: string;
  read: boolean;
  avatar?: string;
}

export function NotificationsDropdown({ onClose }: { onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<"all" | "unread" | "mentions">("all");
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "message",
      title: "Nouveau message",
      message: "Marie Martin vous a envoyé un message concernant votre commande",
      time: "Il y a 5 min",
      read: false,
      avatar: "👩",
    },
    {
      id: "2",
      type: "like",
      title: "Nouvelle réaction",
      message: "Jean Dupont a aimé votre publication sur les tomates bio",
      time: "Il y a 1 h",
      read: false,
      avatar: "👨",
    },
    {
      id: "3",
      type: "system",
      title: "Mise à jour système",
      message: "Votre commande #1234 a été expédiée",
      time: "Il y a 2 h",
      read: true,
    },
    {
      id: "4",
      type: "message",
      title: "Nouveau message",
      message: "Pierre Lefebvre a répondu à votre commentaire",
      time: "Il y a 3 h",
      read: true,
      avatar: "🧑",
    },
  ]);

  const getFilteredNotifications = () => {
    switch (activeTab) {
      case "unread":
        return notifications.filter((n) => !n.read);
      case "mentions":
        return notifications.filter((n) => n.message.includes("@"));
      default:
        return notifications;
    }
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "message":
        return <MessageCircle className="h-5 w-5 text-blue-600" />;
      case "like":
        return <Heart className="h-5 w-5 text-red-600" />;
      case "system":
        return <Settings className="h-5 w-5 text-gray-600" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const filteredNotifications = getFilteredNotifications();

  return (
    <div className="absolute right-0 top-full mt-2 w-96 bg-card border rounded-lg shadow-2xl z-50">
      {/* Header */}
      <div className="px-4 py-3 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 bg-[#0B7A4B] text-white text-xs rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-xs text-[#0B7A4B] hover:underline"
            >
              Tout marquer comme lu
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        {[
          { value: "all", label: "Toutes" },
          { value: "unread", label: "Non lues" },
          { value: "mentions", label: "Mentions" },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value as any)}
            className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.value
                ? "text-[#0B7A4B] border-b-2 border-[#0B7A4B]"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="max-h-[400px] overflow-y-auto">
        {filteredNotifications.length === 0 ? (
          <div className="p-12 text-center">
            <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-semibold mb-2">Aucune notification</h3>
            <p className="text-sm text-muted-foreground">
              Vous n'avez pas de notification pour le moment
            </p>
          </div>
        ) : (
          <div>
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border-b last:border-b-0 hover:bg-muted/50 transition-colors ${
                  !notification.read ? "bg-blue-50 dark:bg-blue-900/10" : ""
                }`}
              >
                <div className="flex gap-3">
                  {/* Avatar or Icon */}
                  <div className="flex-shrink-0">
                    {notification.avatar ? (
                      <div className="h-10 w-10 bg-gradient-to-br from-[#0B7A4B] to-blue-400 rounded-full flex items-center justify-center text-xl">
                        {notification.avatar}
                      </div>
                    ) : (
                      <div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center">
                        {getIcon(notification.type)}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="font-medium text-sm">{notification.title}</h4>
                      {!notification.read && (
                        <div className="h-2 w-2 bg-[#0B7A4B] rounded-full flex-shrink-0 mt-1"></div>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {notification.message}
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-muted-foreground">
                        {notification.time}
                      </span>
                      
                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        {notification.type === "message" && (
                          <>
                            <button className="text-xs text-[#0B7A4B] hover:underline flex items-center gap-1">
                              <Reply className="h-3 w-3" />
                              Répondre
                            </button>
                            {!notification.read && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="text-xs text-[#0B7A4B] hover:underline flex items-center gap-1"
                              >
                                <Eye className="h-3 w-3" />
                                Lu
                              </button>
                            )}
                          </>
                        )}
                        {notification.type === "like" && (
                          <>
                            <button className="text-xs text-[#0B7A4B] hover:underline flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              Voir
                            </button>
                            <button className="text-xs text-[#0B7A4B] hover:underline flex items-center gap-1">
                              <ThumbsUp className="h-3 w-3" />
                              Aimer
                            </button>
                          </>
                        )}
                        {notification.type === "system" && (
                          <>
                            <button className="text-xs text-[#0B7A4B] hover:underline flex items-center gap-1">
                              <CheckCircle className="h-3 w-3" />
                              Résoudre
                            </button>
                            <button
                              onClick={() => deleteNotification(notification.id)}
                              className="text-xs text-red-600 hover:underline flex items-center gap-1"
                            >
                              <X className="h-3 w-3" />
                              Ignorer
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {filteredNotifications.length > 0 && (
        <div className="px-4 py-3 border-t text-center">
          <button className="text-sm text-[#0B7A4B] hover:underline font-medium">
            Voir toutes les notifications
          </button>
        </div>
      )}
    </div>
  );
}
