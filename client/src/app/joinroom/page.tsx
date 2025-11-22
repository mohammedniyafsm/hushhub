"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Particles } from "@/components/ui/particles";
import { ShinyButton } from "@/components/ui/shiny-button";
import { bricolage_grotesque, inter } from "@/lib/font";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function JoinRoom() {

  const [username,setUsername] = useState("");
  const [roomId,setRoomId] = useState("");
  const [password,setPassword] = useState("");

  const socket = useRef<WebSocket | null>(null);

  useEffect(()=>{
    try {
      socket.current = new WebSocket("ws://localhost:8080");
      console.log("Joined Room");
    } catch (error) {
      console.log("Error while join web server",error)
    }
  },[])

  const JoinRoom =()=>{
    try {
       socket?.current?.send(JSON.stringify({
      type : "join",
      payload : {
        username : username.trim(),
        roomId : roomId.trim(),
        password : password.trim()
      }
    }));
     console.log("jpoiedr om")
    } catch (error) {
     console.log("cant join error",error)
    }
  }
  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Particle Background */}
      <Particles className="absolute inset-0 z-0" />

      {/* Foreground Text */}
      <div className="pb-40 sm:pb-10 relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        <h1 className={`${bricolage_grotesque} md:text-5xl sm:text-4xl text-2xl font-bold text-white`}>
          Welcome to HushHub
        </h1>
        <p className={`${inter} text-xs md:text-md mt-4 text-gray-200 max-w-xl`}>
          Enter your private space and connect securely with others.
        </p>
        <div className="flex flex-col mt-6 gap-4">
          <Input onChange={(e)=>setRoomId(e.target.value)} className="md:w-80 w-60" placeholder="Room code"  />
          <Input onChange={(e)=>setPassword(e.target.value)} className="md:w-80 w-60" placeholder=" Password"  />
          <Input onChange={(e)=>setUsername(e.target.value)} className="md:w-80 w-60" placeholder="Username" />
        </div>
        <div className="mt-6 flex gap-4">
          <Button onClick={JoinRoom} className="md:w-80 w-60" variant="default">Join Room</Button>
        </div>
        <div className="mt-4">
          <Link href={"/createroom"}>
          <ShinyButton className="md:w-80 w-60 ">Create Room</ShinyButton>
          </Link>
        </div>
        <Link href={"/allroom"}>
        <h1 className={`${inter} text-xs  mt-4 `}>See Available Rooms</h1>
        </Link>
      </div>
    </div>
  );
}
