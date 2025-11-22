"use client";

import { AnimatedList } from "@/components/ui/animated-list";
import { Particles } from "@/components/ui/particles";
import { bricolage_grotesque } from "@/lib/font";

export default function AllRooms() {
  interface Item {
    name: string;
    description: string;
    icon: string;
    color: string;
    time: string;
  }

  const notifications: Item[] = [
    {
      name: "Payment received",
      description: "Magic UI",
      time: "15m ago",
      icon: "💸",
      color: "#00C9A7",
    },
    {
      name: "User signed up",
      description: "Magic UI",
      time: "10m ago",
      icon: "👤",
      color: "#FFB800",
    },
    {
      name: "New message",
      description: "Magic UI",
      time: "5m ago",
      icon: "💬",
      color: "#FF3D71",
    },
    {
      name: "New event",
      description: "Magic UI",
      time: "2m ago",
      icon: "🗞️",
      color: "#1E86FF",
    },
    {
      name: "Payment received",
      description: "Magic UI",
      time: "15m ago",
      icon: "💸",
      color: "#00C9A7",
    },
    {
      name: "User signed up",
      description: "Magic UI",
      time: "10m ago",
      icon: "👤",
      color: "#FFB800",
    },
    {
      name: "New message",
      description: "Magic UI",
      time: "5m ago",
      icon: "💬",
      color: "#FF3D71",
    },
    {
      name: "New event",
      description: "Magic UI",
      time: "2m ago",
      icon: "🗞️",
      color: "#1E86FF",
    },
    {
      name: "Payment received",
      description: "Magic UI",
      time: "15m ago",
      icon: "💸",
      color: "#00C9A7",
    },
    {
      name: "User signed up",
      description: "Magic UI",
      time: "10m ago",
      icon: "👤",
      color: "#FFB800",
    },
    {
      name: "New message",
      description: "Magic UI",
      time: "5m ago",
      icon: "💬",
      color: "#FF3D71",
    },
    {
      name: "New event",
      description: "Magic UI",
      time: "2m ago",
      icon: "🗞️",
      color: "#1E86FF",
    },
    {
      name: "Payment received",
      description: "Magic UI",
      time: "15m ago",
      icon: "💸",
      color: "#00C9A7",
    },
    {
      name: "User signed up",
      description: "Magic UI",
      time: "10m ago",
      icon: "👤",
      color: "#FFB800",
    },
    {
      name: "New message",
      description: "Magic UI",
      time: "5m ago",
      icon: "💬",
      color: "#FF3D71",
    },
    {
      name: "New event",
      description: "Magic UI",
      time: "2m ago",
      icon: "🗞️",
      color: "#1E86FF",
    },
    // Add more items if needed
  ];

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      {/* Particle Background */}
      <Particles className="absolute inset-0 z-0" />

      {/* Foreground Content */}
      <div className="pb-40 sm:pb-20 relative z-10 flex flex-col items-center justify-center  h-full text-center px-4">
        <h1 className={`${bricolage_grotesque} md:text-4xl text-3xl font-bold text-white my-10`}>
          Available Rooms
        </h1>

        {/* Scrollable animated list container */}
        <div className="">
        <div className="h-[400px] overflow-y-auto scrollbar-hidden space-y-4 px-2 md:w-[500px]  ">
          <AnimatedList delay={800}>
            {notifications.map((item, index) => (
              <div
                key={index}
                className="md:w-full  sm:w-[400px] w-[280px] rounded-xl p-4 bg-white/10 backdrop-blur-md border border-white/10 shadow-lg text-left text-white"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="flex items-center justify-center w-10 h-10 rounded-full text-xl"
                    style={{ backgroundColor: item.color }}
                  >
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">{item.name}</span>
                      <span className="text-xs text-gray-400">{item.time}</span>
                    </div>
                    <p className="text-sm text-gray-300">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </AnimatedList>
        </div>
        </div>

        {/* Optional fade-out gradient at bottom for polish */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-20" />
      </div>
    </div>
  );
}
