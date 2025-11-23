"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Particles } from "@/components/ui/particles";
import { ShinyButton } from "@/components/ui/shiny-button";
import { bricolage_grotesque, inter } from "@/lib/font";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useWs } from "../context/WebSocketContext";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";


export default function CreateRoom() {

  const [roomName, setRoomName] = useState("");
  const [description, setdescription] = useState("");
  const [Password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const { send } = useWs();
  const router = useRouter(); 


function createroom() {
  try {
    send({
      type: "create",
      payload: {
        username: username.trim(),
        password: Password.trim(),
        room_name: roomName.trim(),
        description: description.trim(),
      },
    });
  } catch (error) {
    console.log("Error while creating room:", error);
    toast.error("Something went wrong while creating the room!");
  }
}

  const { roomId } = useWs();

  useEffect(() => {
    if (roomId) {
      router.push(`/chat`); 
    }
  }, [roomId, router]);


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
          <Input onChange={(e) => { setRoomName(e.target.value) }} placeholder="Room Name" />
          <Input onChange={(e) => { setdescription(e.target.value) }} placeholder="Description" />
          <Input onChange={(e) => { setPassword(e.target.value) }} placeholder="Password" />
          <Input onChange={(e) => { setUsername(e.target.value) }} placeholder="Username" />
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
