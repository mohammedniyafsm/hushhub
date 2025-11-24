"use client";

import React, { useEffect, useRef, useState } from "react";
import { CiMail } from "react-icons/ci";
import { FiCopy } from "react-icons/fi";
import { CgEnter } from "react-icons/cg";
import { RiSendPlaneFill } from "react-icons/ri";
import { inter } from "@/lib/font";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useWs } from "../context/WebSocketContext";
import { MessageI } from "../types/type";
import { useRouter } from "next/navigation";


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
    totalMembers,
    members
  } = useWs();

  const router = useRouter();

  useEffect(() => {
    if (!roomId || !room_name || !password || !username || !description) {
      return router.push('/joinroom');
    }
  }, [roomId, room_name, password, username, description, router])

  const [newMessage, setNewMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);


  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  const submitMessage = () => {
    if (!newMessage.trim()) return;

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
  };

  // Auto scroll to bottom when messages change
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function inputhandle(e :React.ChangeEvent<HTMLInputElement>) {
    setNewMessage(e.target.value);
    send({
      type: "type",
      payload: {
        userId : userId!,
        username : username!,
        roomId : roomId!
      }
    })
  }

  return (
    <div className="flex justify-center items-center pt-8  md:pt-0 px-2 hide-scrollbar">
      <div className="flex flex-col h-[500px] md:h-[85vh] w-full max-w-[380px] sm:max-w-[550px] md:max-w-[700px] lg:max-w-[1000px] border bg-card rounded-2xl">

        {/* HEADER */}
        <div className="flex justify-between items-center px-8 py-2 h-24 border-b">

          <div className="flex items-center gap-4">
            <div className="flex justify-center items-center bg-gray-50/[.10] rounded-lg md:h-9 md:w-9 h-6 w-6">
              <CiMail />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className={`${inter} text-sm`}>{room_name}</div>

              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span># {roomId}</span>

                {/* COPY ROOM ID */}
                <FiCopy
                  className="cursor-pointer hover:text-white"
                  onClick={() => navigator.clipboard.writeText(roomId!)}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 items-center">
            <div className="border h-6 min-w-20 flex justify-center items-center rounded-lg px-2">
              <h1 className={`text-xs ${inter}`}>
                <span>You: </span> {username}
              </h1>
            </div>

            <div className="flex items-center gap-1 px-3 py-2 h-8 bg-card border hover:bg-gray-50/[.10] rounded-lg cursor-pointer">
              <CgEnter />
              <h1 className="text-xs font-medium">Leave</h1>
            </div>
          </div>
        </div>

        {/* ROOM INFO */}
        <div className="px-8 py-3 border-b text-xs flex flex-col gap-1.5">

          {/* PASSWORD ROW FIXED */}
          <div className="flex items-center gap-3">
            <span className="text-gray-400">Password:</span>

            {/* SHOW / HIDE PASSWORD */}
            <span>{showPassword ? password : "••••••"}</span>

            <button
              onClick={() => setShowPassword((p) => !p)}
              className="text-blue-400 text-[10px] underline"
            >
              {showPassword ? "Hide" : "Show"}
            </button>

            {/* COPY PASSWORD */}
            <FiCopy
              className="cursor-pointer hover:text-white"
              onClick={() => navigator.clipboard.writeText(password!)}
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-gray-400">Admin:</span>
            <span>{admin}</span>
          </div>

          <div className="flex gap-2">
            <span className="text-gray-400">Description:</span>
            <p className="text-gray-300">{description}</p>
          </div>
          <span>total{totalMembers}</span>
          <>
          {members.map((s : {username : string})=>{
            <span>{s.username}</span>
          })}
          </>
        </div>

        {/* CHAT AREA */}
        {/* CHAT AREA */}
        <div className="flex-1 flex flex-col border-b py-4 px-2 overflow-y-auto gap-4 hide-scrollbar">
          {messages.map((s: MessageI, i) => {
            const isMe = s.userId === userId;

            return (
              <div
                key={i}
                className={`flex flex-col max-w-[70%] ${isMe ? "ml-auto items-end" : "items-start"}`}
              >
                {/* USERNAME */}
                <span className="text-[10px] text-gray-400 px-1">
                  {isMe ? "You" : s.username}
                </span>

                {/* MESSAGE BUBBLE */}
                <Button
                  className={`w-fit rounded-xl px-4 py-2 text-left ${isMe
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-black"
                    }`}
                >
                  {s.message}
                </Button>
              </div>
            );
          })}

          {/* Auto scroll target */}
          <div ref={chatBottomRef}></div>
        </div>

        {/* INPUT */}
        <div className="px-4 py-8">
          <div className="flex justify-between items-center gap-4">
            <Input
              onChange={inputhandle}
              value={newMessage}
              className="h-8"
              placeholder="Type your message..."
              onKeyDown={(e) => e.key === "Enter" && submitMessage()}
            />
            <div className="flex items-center justify-center bg-gray-50/[.10] h-10 w-10 rounded-lg cursor-pointer">
              <RiSendPlaneFill onClick={submitMessage} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Page;
