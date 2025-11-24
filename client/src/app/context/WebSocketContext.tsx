"use client";
import { createContext, ReactNode, useContext, useEffect, useRef, useState } from "react";
import { DataI, MessageI, ChatMessage, createdRoomI } from "../types/type";
import toast from "react-hot-toast";

interface WebSocketContextType {
  connected: boolean;
  send: (data: DataI) => void;

  username: string | null;
  setUser: (user: string | null) => void;

  roomId: string | null;
  setroomId: (id: string | null) => void;

  room_name: string | null;
  password: string | null;
  description: string | null;
  userId: string | null;
  admin: string | null;

  messages: MessageI[];
  totalMembers : string,
  members : {username : string }[]
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const WebSocketProvider = ({ children }: { children: ReactNode }) => {
  const socket = useRef<WebSocket | null>(null);

  const [connected, setConnected] = useState(false);
  const [username, setUser] = useState<string | null>(null);
  const [roomId, setroomId] = useState<string | null>(null);
  const [room_name, setRoom_name] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [description, setdescription] = useState<string | null>(null);
  const [userId, setuserId] = useState<string | null>(null);
  const [admin, setadmin] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageI[]>([]);
  const [totalMembers,setTotalMembers] = useState("");
  const [members,setMembers] = useState<{username : string}[]>([]);

  useEffect(() => {
    const wsUrl =
      process.env.NODE_ENV === "development"
        ? "ws://localhost:8080"
        : "wss://your-production-server.com";

    socket.current = new WebSocket(wsUrl);
    const ws = socket.current;

    ws.onopen = () => {
      setConnected(true);
      console.log("WebSocket connected");
    };

    ws.onerror = () => {
      setConnected(false);
      console.log("WebSocket error");
    };

    ws.onmessage = (event: MessageEvent) => {
      const data: DataI = JSON.parse(event.data);

      // chat messages
      if (data.type === "chat-message") {
        const { username, userId, roomId, message } = data.payload as ChatMessage;

        const formattedMessage: MessageI = {
          username,
          userId,
          roomId,
          message,
        };

        setMessages((prev) => [...prev, formattedMessage]);
      }

      // room events
      if (data.type === "room-created-success" || data.type === "joined-room") {
        const {username,roomId,room_name,password,description,userId,admin,total,members} = data.payload as createdRoomI;

        setUser(username);
        setroomId(roomId);
        setRoom_name(room_name);
        setPassword(password);
        setdescription(description);
        setuserId(userId);
        setadmin(admin);
        setTotalMembers(total.toString());
        setMembers(members);

        toast(
          data.type === "room-created-success"
            ? "Room Created Successfully"
            : "Joined Room Successfully",
          {
            icon: "🎉",
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          }
        );
      }

      if (data.type === "join-notification" && data.message) {
        const { total,members} = data.payload as MessageI;
        setTotalMembers(total!.toString());
        setMembers(members!);
        toast(data.message,
          {
            icon: "👏",
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          }
        );
        
      }
      if (data.type === "leave-notification" && data.message) {
        const { total,members} = data.payload as MessageI;
        setTotalMembers(total!.toString());
        setMembers(members!);
        toast(data.message,
          {
            icon: "🚪",
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          }
        );
        
      }

      if (data.type === "error" && data.message) {
        toast.error(data.message);
        console.log("Server Error:", data.message);
      }
    };

    ws.onclose = () => {
      setConnected(false);
      console.log("WebSocket disconnected");
    };

    return () => {
      ws.close();
    };
  }, []);

  const send = (data: DataI) => {
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
        setroomId,
        room_name,
        password,
        description,
        userId,
        admin,
        messages,
        totalMembers,
        members
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export function useWs() {
  const context = useContext(WebSocketContext);
  if (!context) throw new Error("useWs must be used within a WebSocketProvider");
  return context;
}
