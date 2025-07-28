import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Particles } from "@/components/ui/particles";
import { ShinyButton } from "@/components/ui/shiny-button";
import { bricolage_grotesque, inter } from "@/lib/font";
import Link from "next/link";

export default function CreateRoom() {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      {/* Particle Background */}
      <Particles className="absolute inset-0 z-0" />

      {/* Foreground Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        <h1
          className={`${bricolage_grotesque} text-6xl font-bold text-white drop-shadow-md`}
        >
          Create Room
        </h1>

        <div className="flex flex-col mt-8 gap-4 w-80">
          <Input placeholder="Username" />
          <Input placeholder="Room Name" />
          <Input placeholder="Description" />
        </div>

        <div className="mt-6 w-80">
          <Button className="w-full" variant="default">
            Create Room
          </Button>
        </div>

        <div className="mt-4 w-80">
          <Link href="/joinroom">
            <ShinyButton className="w-full">Join Room</ShinyButton>
          </Link>
        </div>
        <Link href={"/allroom"}>
        <p className={`${inter} text-xs mt-6 text-gray-300`}> See Available Rooms</p>
        </Link>
      </div>
    </div>
  );
}
