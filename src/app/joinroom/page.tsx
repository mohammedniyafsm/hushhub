import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Particles } from "@/components/ui/particles";
import { ShinyButton } from "@/components/ui/shiny-button";
import { bricolage_grotesque, inter } from "@/lib/font";
import Link from "next/link";

export default function JoinRoom() {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Particle Background */}
      <Particles className="absolute inset-0 z-0" />

      {/* Foreground Text */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        <h1 className={`${bricolage_grotesque} text-5xl font-bold text-white`}>
          Welcome to HushHub
        </h1>
        <p className={`${inter} text-lg mt-4 text-gray-200 max-w-xl`}>
          Enter your private space and connect securely with others.
        </p>
        <div className="flex flex-col mt-6 gap-4">
          <Input className="w-80" placeholder="Room code"  />
          <Input className="w-80" placeholder="Username" />
        </div>
        <div className="mt-6 flex gap-4">
          <Button className="w-80" variant="default">Join Room</Button>
        </div>
        <div className="mt-4">
          <Link href={"/createroom"}>
          <ShinyButton className="w-80 ">Create Room</ShinyButton>
          </Link>
        </div>
        <Link href={"/allroom"}>
        <h1 className={`${inter} text-xs mt-4 `}>See Available Rooms</h1>
        </Link>
      </div>
    </div>
  );
}
