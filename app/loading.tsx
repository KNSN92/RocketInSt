"use client";

import { RocketInStLoadingLogo } from "@/components/common/RocketInStLogos";
import { Typewriter } from "react-simple-typewriter";

export default function Loading() {
  return (
    <div className="flex h-main-content w-screen flex-col items-center justify-center">
      <RocketInStLoadingLogo className="w-[min(10vw 10vh)]" />
      <div className="text-2xl">
        <Typewriter words={["Loading..."]} cursor={true} loop={true} />
      </div>
    </div>
  );
}
