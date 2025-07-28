"use client";

import { cn } from "@/lib/utils";
import { AnimatedList } from "./ui/animated-list";
import { bricolage_grotesque } from "@/lib/font";

interface Item {
  name: string;
  description: string;
  icon: string;
  color: string;
  time: string;
}

// Dummy room data
const rooms: Item[] = [
  {
    name: "👾 Tech Geeks Lounge",
    description: "Join passionate devs & designers building the future.",
    time: "Active now",
    icon: "💻",
    color: "#1E86FF",
  },
  {
    name: "🎮 Gamers Arena",
    description: "Talk eSports, strategy, or just chill with friends.",
    time: "2 min ago",
    icon: "🎮",
    color: "#FF3D71",
  },
  {
    name: "🎧 Lo-Fi Study Zone",
    description: "Silent study room with chill beats & focus vibes.",
    time: "5 min ago",
    icon: "📚",
    color: "#00C9A7",
  },
  {
    name: "🌍 Language Exchange Hub",
    description: "Practice speaking with natives from around the world.",
    time: "10 min ago",
    icon: "🗣️",
    color: "#FFB800",
  },
  {
    name: "🌟 Startup Pitch Room",
    description: "Pitch your idea, get feedback, or find a cofounder.",
    time: "15 min ago",
    icon: "🚀",
    color: "#8E44AD",
  },
  {
    name: "📸 Creative Creators",
    description: "Photography, art, reels, and creativity unleashed.",
    time: "20 min ago",
    icon: "🎨",
    color: "#E67E22",
  },
  {
    name: "💬 Deep Talks Café",
    description: "No small talk. Only meaningful conversations.",
    time: "30 min ago",
    icon: "☕",
    color: "#2ECC71",
  },
  {
    name: "🤖 AI & Future",
    description: "Talk GPTs, robotics, AGI & everything in between.",
    time: "1 hour ago",
    icon: "🤖",
    color: "#2C3E50",
  },
  {
    name: "⚽ Real Madrid Fans",
    description: "Hala Madrid! News, matches, and fan banter.",
    time: "1 hour ago",
    icon: "🤍",
    color: "#00529F",
  },
  {
    name: "🔵 Barcelona Lovers",
    description: "Visca Barça! Join Culés from around the world.",
    time: "2 hours ago",
    icon: "🔵",
    color: "#A50044",
  },
  {
    name: "🏆 UEFA Champions League",
    description: "Matchday talk, predictions & classic moments.",
    time: "3 hours ago",
    icon: "🏆",
    color: "#FFD700",
  },
];

const RoomCard = ({ name, description, icon, color, time }: Item) => {
  return (
    <figure
      className={cn(
        "relative mx-auto w-full max-w-[700px] border cursor-pointer overflow-hidden rounded-2xl p-4",
        "transition-all duration-200 ease-in-out hover:scale-[103%]",
        "bg-white shadow-md",
        "transform-gpu border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05] dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]"
      )}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div
          className="flex items-center justify-center w-10 h-10 rounded-2xl text-xl shrink-0"
          style={{ backgroundColor: color }}
        >
          {icon}
        </div>

        {/* Room content */}
        <div className={`flex flex-col flex-1 gap-1 ${bricolage_grotesque}`}>
          <div className="flex items-center justify-between">
            <figcaption className="text-sm sm:text-lg font-semibold text-gray-900 dark:text-white">
              {name}
            </figcaption>
            <span className="text-xs text-gray-500">{time}</span>
          </div>
          <p className="text-sm font-normal text-gray-600 dark:text-gray-300">
            {description}
          </p>
        </div>
      </div>
    </figure>
  );
};


export function AllRoomDemo({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative flex h-[500px] max-sm:h-[560px] w-full flex-col p-6 overflow-hidden rounded-lg",
        className
      )}
    >
      <AnimatedList>
        {rooms.map((room, idx) => (
          <RoomCard {...room} key={idx} />
        ))}
      </AnimatedList>
    </div>
  );
}
