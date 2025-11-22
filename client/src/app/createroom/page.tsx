"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Particles } from "@/components/ui/particles";
import { ShinyButton } from "@/components/ui/shiny-button";
import { bricolage_grotesque, inter } from "@/lib/font";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function CreateRoom() {

  const [roomName,setRoomName] = useState("");
  const [description,setdescription] = useState("");
  const [Password,setPassword] = useState("");
  const [username,setUsername] = useState("");
  
  const socket = useRef<WebSocket | null>(null);

  useEffect(()=>{
     socket.current = new WebSocket("ws://localhost:8080");

    socket.current.onopen=()=>{ console.log("connected WebSocket")};
  },[])

  function createroom (){
    try {
      const response = socket.current?.send(JSON.stringify({
        type : "create",
        payload : {
          username :username.trim(),
          password  : Password.trim(),
          room_name : roomName.trim(),
          description : description.trim()
        }
      }))   
      console.log("Room cretaed",response) 
    } catch (error) {
      console.log("room created error",error);
    }
  }


  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      {/* Particle Background */}
      <Particles className="absolute inset-0 z-0" />

      {/* Foreground Content */}
      <div className="sm:pb-20 pb-40 relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        <h1
          className={`${bricolage_grotesque} text-4xl sm:text-5xl md:text-6xl font-bold text-white drop-shadow-md`}
        >
          Create Room
        </h1>

        <div className="flex flex-col  mt-8 gap-4  md:w-80 w-60">
          <Input onChange={(e)=>{ setRoomName(e.target.value)}} placeholder="Room Name" />
          <Input onChange={(e)=>{ setdescription(e.target.value)}} placeholder="Description" />
          <Input onChange={(e)=>{ setPassword(e.target.value)}} placeholder="Password" />
          <Input onChange={(e)=>{ setUsername(e.target.value)}} placeholder="Username" />
        </div>

        <div className="mt-6  md:w-80 w-60">
          <Button onClick={createroom} className="w-full" variant="default">
            Create Room
          </Button>
        </div>

        <div className="mt-4 w-80">
          <Link href="/joinroom">
            <ShinyButton className="md:w-full w-60">Join Room</ShinyButton>
          </Link>
        </div>
        <Link href={"/allroom"}>
        <p className={`${inter} text-xs mt-6 text-gray-300`}> See Available Rooms</p>
        </Link>
      </div>
    </div>
  );
}
