import { useState, useEffect } from "react";
import { useWhiteboard } from "../context/WhiteboardContext";

interface CollaborationPanelProps {
  isVisible: boolean;
  onClose: () => void;
}

interface User {
  id: string;
  name: string;
  color: string;
  position: { x: number; y: number };
}

interface CollaborationMessage {
  type: "user_join" | "user_leave" | "cursor_move" | "item_add" | "item_update" | "item_delete";
  userId?: string;
  userName?: string;
  userColor?: string;
  cursorPosition?: { x: number; y: number };
  item?: any;
  itemId?: string;
}

export function CollaborationPanel({ isVisible, onClose }: CollaborationPanelProps) {
  const { addItem, updateItemPosition, deleteItem } = useWhiteboard();
  const [isConnected, setIsConnected] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [userName, setUserName] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<string[]>([]);
  const [ws, setWs] = useState<WebSocket | null>(null);

  const generateRoomId = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const generateUserColor = () => {
    const colors = ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#feca57", "#ff9ff3"];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const connectToRoom = () => {
    if (!roomId || !userName) return;

    const wsUrl = `wss://echo.websocket.org`; // Utiliser un service d'écho pour la démo
    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      setIsConnected(true);
      addMessage(`Connecté à la salle ${roomId}`);

      // Simuler l'envoi d'un message de connexion
      const joinMessage: CollaborationMessage = {
        type: "user_join",
        userId: Date.now().toString(),
        userName: userName,
        userColor: generateUserColor(),
      };
      socket.send(JSON.stringify(joinMessage));
    };

    socket.onmessage = (event) => {
      try {
        const message: CollaborationMessage = JSON.parse(event.data);
        handleCollaborationMessage(message);
      } catch (error) {
        console.error("Erreur lors du parsing du message:", error);
      }
    };

    socket.onclose = () => {
      setIsConnected(false);
      addMessage("Déconnecté de la salle");
    };

    socket.onerror = (error) => {
      console.error("Erreur WebSocket:", error);
      addMessage("Erreur de connexion");
    };

    setWs(socket);
  };

  const disconnectFromRoom = () => {
    if (ws) {
      ws.close();
      setWs(null);
    }
    setUsers([]);
    setMessages([]);
  };

  const handleCollaborationMessage = (message: CollaborationMessage) => {
    switch (message.type) {
      case "user_join":
        if (message.userId && message.userName && message.userColor) {
          const newUser: User = {
            id: message.userId,
            name: message.userName,
            color: message.userColor,
            position: { x: 0, y: 0 },
          };
          setUsers((prev) => [...prev, newUser]);
          addMessage(`${message.userName} a rejoint la salle`);
        }
        break;
      case "user_leave":
        if (message.userId) {
          setUsers((prev) => prev.filter((user) => user.id !== message.userId));
          addMessage(`Un utilisateur a quitté la salle`);
        }
        break;
      case "cursor_move":
        if (message.userId && message.cursorPosition) {
          setUsers((prev) => prev.map((user) => (user.id === message.userId ? { ...user, position: message.cursorPosition! } : user)));
        }
        break;
      case "item_add":
        if (message.item) {
          addItem(message.item.type, message.item.position, message.item.size);
          addMessage(`Nouvel élément ajouté par ${message.userName}`);
        }
        break;
      case "item_update":
        if (message.itemId && message.item) {
          updateItemPosition(message.itemId, message.item.position);
          addMessage(`Élément mis à jour par ${message.userName}`);
        }
        break;
      case "item_delete":
        if (message.itemId) {
          deleteItem(message.itemId);
          addMessage(`Élément supprimé par ${message.userName}`);
        }
        break;
    }
  };

  const addMessage = (message: string) => {
    setMessages((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  useEffect(() => {
    if (!roomId) {
      setRoomId(generateRoomId());
    }
  }, [roomId]);

  useEffect(() => {
    // Simuler les mouvements de curseur des autres utilisateurs
    if (isConnected && users.length > 0) {
      const interval = setInterval(() => {
        setUsers((prev) =>
          prev.map((user) => ({
            ...user,
            position: {
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            },
          }))
        );
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isConnected, users]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 w-[600px] max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Collaboration</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {/* Configuration de la salle */}
          {!isConnected ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">ID de la salle :</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                    placeholder="ID de la salle"
                  />
                  <button
                    onClick={() => setRoomId(generateRoomId())}
                    className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300 rounded-lg"
                  >
                    Générer
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Votre nom :</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                  placeholder="Votre nom"
                />
              </div>

              <button
                onClick={connectToRoom}
                disabled={!roomId || !userName}
                className="w-full px-4 py-2 text-sm bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-lg"
              >
                Rejoindre la salle
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Statut de connexion */}
              <div className="p-3 bg-green-50 dark:bg-green-900 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-700 dark:text-green-300">Connecté à la salle {roomId}</span>
                </div>
              </div>

              {/* Utilisateurs connectés */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Utilisateurs connectés ({users.length}) :</h3>
                <div className="space-y-1">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center space-x-2 text-sm">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: user.color }}></div>
                      <span className="text-gray-600 dark:text-gray-400">{user.name}</span>
                      {user.id === Date.now().toString() && <span className="text-xs text-blue-600 dark:text-blue-400">(Vous)</span>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Messages de collaboration */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Activité récente :</h3>
                <div className="h-32 overflow-y-auto bg-gray-50 dark:bg-gray-900 rounded-lg p-2">
                  {messages.map((message, index) => (
                    <div key={index} className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      {message}
                    </div>
                  ))}
                </div>
              </div>

              {/* Bouton de déconnexion */}
              <button onClick={disconnectFromRoom} className="w-full px-4 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg">
                Quitter la salle
              </button>
            </div>
          )}

          {/* Informations */}
          <div className="p-3 bg-blue-50 dark:bg-blue-900 rounded-lg">
            <h4 className="text-sm font-semibold text-blue-700 dark:text-blue-300 mb-1">Fonctionnalités de collaboration :</h4>
            <div className="text-xs text-blue-600 dark:text-blue-400 space-y-1">
              <p>• Partage en temps réel des éléments</p>
              <p>• Curseurs des autres utilisateurs</p>
              <p>• Messages de collaboration</p>
              <p>• Synchronisation automatique</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
