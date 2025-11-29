"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import toast from "react-hot-toast";

import {
  DataI,
  ChatMessagePayload,
  JoinedRoomPayload,
  RoomCreatedPayload,
  JoinNotificationPayload,
  LeaveNotificationPayload,
  TypingPayload,
  KickNotificationPayload,
  KickedPayload,
  ClientEvent,
} from "../types/type";

interface WebSocketContextType {
  connected: boolean;
  send: (data: ClientEvent) => void;

  username: string | null;
  setUser: (user: string | null) => void;

  roomId: string | null;
  setRoomId: (id: string | null) => void;

  room_name: string | null;
  description: string | null;
  password: string | null;
  userId: string | null;
  admin: string | null;

  messages: ChatMessagePayload[];
  members: { userId: string; username: string }[];
  totalMembers: number;

  typing: TypingPayload[];
  setTyping: React.Dispatch<React.SetStateAction<TypingPayload[]>>;

  isReady: boolean;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const WebSocketProvider = ({ children }: { children: ReactNode }) => {
  const socket = useRef<WebSocket | null>(null);

  const [connected, setConnected] = useState(false);

  const [username, setUser] = useState<string | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [room_name, setRoomName] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [admin, setAdmin] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessagePayload[]>([]);
  const [members, setMembers] = useState<{ userId: string; username: string }[]>(
    []
  );
  const [totalMembers, setTotalMembers] = useState(0);

  const [typing, setTyping] = useState<TypingPayload[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const wsUrl =
      process.env.NODE_ENV === "development"
        ? "ws://localhost:8080"
        : `${process.env.NEXT_PUBLIC_WS_URL}`;

    socket.current = new WebSocket(wsUrl);
    const ws = socket.current;

    ws.onopen = () => {
      setConnected(true);
      console.log("WS connected");
    };

    ws.onerror = () => {
      setConnected(false);
      console.log("WS error");
    };

    ws.onclose = () => {
      setConnected(false);
      console.log("WS closed");
    };

    ws.onmessage = (event) => {
      const data: DataI = JSON.parse(event.data);

      switch (data.type) {
        case "chat-message": {
          const payload = data.payload as ChatMessagePayload;
          setMessages((prev) => [...prev, payload]);
          break;
        }

        case "room-created-success": {
          const payload = data.payload as RoomCreatedPayload;

          setUser(payload.username);
          setRoomId(payload.roomId);
          setRoomName(payload.room_name);
          setDescription(payload.description);
          setPassword(payload.password);
          setUserId(payload.userId);
          setAdmin(payload.admin);
          setIsReady(true);

          toast.success("Room created successfully!");
          break;
        }

        case "joined-room": {
          const payload = data.payload as JoinedRoomPayload;

          setUser(payload.username);
          setRoomId(payload.roomId);
          setRoomName(payload.room_name);
          setDescription(payload.description);
          setPassword(payload.password);
          setUserId(payload.userId);
          setAdmin(payload.admin);

          setMembers(payload.members);
          setTotalMembers(payload.total);

          setIsReady(true);
          toast.success("Joined room 🎉");
          break;
        }

        case "join-notification": {
          const payload = data.payload as JoinNotificationPayload;
          setMembers(payload.members);
          setTotalMembers(payload.total);

          toast(`${payload.joinUser} joined 👏`);
          break;
        }

        case "leave-notification": {
          const payload = data.payload as LeaveNotificationPayload;

          setMembers(payload.members);
          setTotalMembers(payload.total);

          toast(`${payload.username} left 👋`);
          break;
        }

        case "typing": {
          const p = data.payload as TypingPayload;

          setTyping((prev) => [
            ...prev.filter((t) => t.userId !== p.userId),
            p,
          ]);
          break;
        }

        case "typing-done": {
          const p = data.payload as TypingPayload;
          setTyping((prev) => prev.filter((t) => t.userId !== p.userId));
          break;
        }

        case "kick-notification": {
          const payload = data.payload as KickNotificationPayload;
          toast(`User kicked: ${payload.username}`, { icon: "🚪" });
          break;
        }

        case "unblock-notification": {
          toast("User unblocked");
          break;
        }

        case "kicked": {
          const { message } = data as KickedPayload;
          toast.error(message);
          break;
        }

        case "error":
          toast.error(data.message || "Server error");
          break;

        default:
          console.log("Unknown event", data);
      }
    };

    return () => ws.close();
  }, []);

  const send = (data: ClientEvent) => {
    socket.current?.send(JSON.stringify(data));
  };

  return (
    <WebSocketContext.Provider
      value={{
        connected,
        send,

        username,
        setUser,

        roomId,
        setRoomId,

        room_name,
        description,
        password,

        userId,
        admin,

        messages,
        members,
        totalMembers,

        typing,
        setTyping,

        isReady,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export function useWs() {
  const ctx = useContext(WebSocketContext);
  if (!ctx) throw new Error("useWs must be used inside WebSocketProvider");
  return ctx;
}
