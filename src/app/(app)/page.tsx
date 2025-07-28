import {AllRoomDemo} from "@/components/Allroomsdemo";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { bricolage_grotesque,inter } from "@/lib/font";
import Link from "next/link";
import { RiArrowRightSLine } from "react-icons/ri";


export default function Home() {
  return (
    <div className="">
      <div className="">

      </div>
      <div className="flex flex-col justify-center items-center pt-32 ">
          <h1 className={`font-bold text-7xl text-center ${bricolage_grotesque}`}>Chat Room Disappears <br /> When You’re Done</h1>
          <p className={`mt-5  text-lg text-gray-300 tracking-normal leading-6 ${inter}`}>Hushhub - Built for One Moment, and That’s Enough.</p>
          <div className="mt-8 flex flex-col justify-center items-center ">
            <Link href={"/joinroom"}>
            <RainbowButton size={"lg"}   className={`${bricolage_grotesque} space-x-3`}>
               <span>Get Started</span>
               <span><RiArrowRightSLine/></span>
            </RainbowButton>
            </Link>
          </div>
      </div>
      <div className="py-20 flex flex-col justify-center pt-70">
         <h1 className={`${bricolage_grotesque} font-bold text-5xl text-center mb-8`}>  Discover Live Spaces</h1>
        <AllRoomDemo/>
      </div>
    </div>
  );
}
