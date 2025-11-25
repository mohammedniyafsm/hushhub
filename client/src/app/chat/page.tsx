"use client";

import React, { useEffect, useRef, useState } from "react";
import { CiMail } from "react-icons/ci";
import { FiCopy } from "react-icons/fi";
import { RiSendPlaneFill } from "react-icons/ri";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useWs } from "../context/WebSocketContext";
import { ChatMessagePayload } from "../types/type";
import toast from "react-hot-toast";

function Page() {
  const {
    admin,
    roomId,
    room_name,
    password,
    username,
    description,
    userId,
    messages,
    send,
    members,
    typing,
    setTyping,
  } = useWs();

  const [newMessage, setNewMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showUsersModal, setShowUsersModal] = useState(false);

  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  // Auto Scroll
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const typingUsers = typing.filter((t) => t.userId !== userId);

  const submitMessage = () => {
    console.log("handle Submit")
    if (!newMessage.trim()) return;

    if (!userId || !roomId) {
      toast.error("Not connected to room");
      return;
    }

    send({
      type: "chat",
      payload: {
        username: username!,
        userId: userId!,
        roomId: roomId!,
        message: newMessage,
      },
    });

    setNewMessage("");

    send({
      type: "typing-done",
      payload: { userId: userId!, roomId: roomId! },
    });

    setTyping((prev) => prev.filter((t) => t.userId !== userId));
  };

  const inputhandle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewMessage(value);

    if (!value) {
      send({
        type: "typing-done",
        payload: { userId: userId!, roomId: roomId! },
      });
      return;
    }

    send({
      type: "typing",
      payload: {
        userId: userId!,
        roomId: roomId!,
      },
    });
  };

  const handleKick = (targetUserId: string, targetUsername: string) => {
    if (admin !== username) {
      toast.error("Only admin can kick users");
      return;
    }

    if (!confirm(`Kick ${targetUsername}?`)) return;

    send({
      type: "kick",
      payload: {
        userId: userId!, // admin id
        roomId: roomId!,
        targetId: targetUserId, // correct key
      },
    });
  };

  return (
    <div className="flex justify-center items-center pt-8 px-2">
      <div className="flex flex-col h-[85vh] w-full max-w-[800px] border rounded-2xl bg-card">

        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-3 border-b">
          <div className="flex items-center gap-3">
            <CiMail />
            <div>
              <p>{room_name}</p>
              <div className="flex items-center text-xs gap-1 text-gray-400">
                #{roomId}
                <FiCopy
                  className="cursor-pointer"
                  onClick={() => navigator.clipboard.writeText(roomId!)}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 border px-2 h-6 rounded-md text-xs">
              <span className="h-2 w-2 bg-green-500 rounded-full" />
              Online: {members.length}
            </div>

            <div
              className="px-3 py-1 border cursor-pointer text-xs rounded-md"
              onClick={() => setShowUsersModal(true)}
            >
              View Users
            </div>

            <div className="px-3 py-1 border rounded-md text-xs">
              You: {username}
            </div>
          </div>
        </div>

        {/* ROOM INFO */}
        <div className="px-6 py-2 border-b text-xs space-y-1">
          <div className="flex items-center gap-2">
            Password:
            <span>{showPassword ? password : "••••••"}</span>

            <button
              className="text-blue-400 text-[10px]"
              onClick={() => setShowPassword((p) => !p)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>

            <FiCopy
              className="cursor-pointer"
              onClick={() => navigator.clipboard.writeText(password!)}
            />
          </div>

          <div>
            Admin: <span>{admin}</span>
          </div>

          <div className="flex gap-2">
            Description: <p>{description}</p>
          </div>
        </div>

        {/* CHAT AREA */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 hide-scrollbar">
          {messages.map((m: ChatMessagePayload, i) => {
            const isMe = m.userId === userId;

            return (
              <div
                key={i}
                className={`flex flex-col max-w-[70%] ${
                  isMe ? "ml-auto items-end" : "items-start"
                }`}
              >
                <span className="text-[10px] text-gray-400">
                  {isMe ? "You" : m.username}
                </span>

                <Button
                  className={`px-4 py-2 rounded-xl ${
                    isMe ? "bg-green-600 text-white" : "bg-gray-200 text-black"
                  }`}
                >
                  {m.message}
                </Button>
              </div>
            );
          })}

          {typingUsers.length > 0 && (
            <div className="text-xs text-gray-400">
              {typingUsers.map((t) => t.username).join(", ")} typing...
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* INPUT */}
        <div className="px-4 py-4 border-t">
          <div className="flex gap-4 items-center">
            <Input
              className="h-9"
              value={newMessage}
              onChange={inputhandle}
              placeholder="Type a message..."
              onKeyDown={(e) => e.key === "Enter" && submitMessage()}
            />
            <Button onClick={submitMessage} className="h-9 w-10 flex items-center justify-center">
              <RiSendPlaneFill  />
            </Button>
          </div>
        </div>
      </div>

      {/* USERS MODAL */}
      {showUsersModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowUsersModal(false)}
          />
          <div className="relative bg-card p-4 w-[90%] max-w-md rounded-xl border">
            <div className="flex justify-between mb-4">
              <h3 className="text-sm font-semibold">
                Online Members ({members.length})
              </h3>
              <button
                className="text-xs"
                onClick={() => setShowUsersModal(false)}
              >
                Close
              </button>
            </div>

            <div className="space-y-2 max-h-[50vh] overflow-y-auto">
              {members.map((m) => {
                const isMe = m.userId === userId;
                const isAdm = m.username === admin;
                const canKick = admin === username && !isMe;

                return (
                  <div
                    key={m.userId}
                    className="flex items-center justify-between border p-2 rounded-md"
                  >
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 bg-green-500 rounded-full" />
                      <div>
                        <p className="text-sm">
                          {m.username}
                          {isMe && " (You)"} {isAdm && " 👑"}
                        </p>
                        <p className="text-[10px] text-gray-400">
                          id: {m.userId}
                        </p>
                      </div>
                    </div>

                    {canKick && (
                      <button
                        className="text-xs bg-red-600 text-white px-2 py-1 rounded-md"
                        onClick={() => handleKick(m.userId, m.username)}
                      >
                        Kick
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            <p className="text-[10px] mt-3 text-gray-400">
              Only users currently inside this room are shown.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Page;
