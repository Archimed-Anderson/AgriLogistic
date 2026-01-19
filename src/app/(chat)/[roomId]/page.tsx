// Chat Room Page - Conversation spécifique
interface ChatRoomPageProps {
  params: {
    roomId: string;
  };
}

export default function ChatRoomPage({ params }: ChatRoomPageProps) {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Conversation #{params.roomId}</h1>
      <p className="text-muted-foreground">Interface de chat en temps réel</p>
    </div>
  );
}
