"use client";

import { RocketInStSvgLogo } from "@/src/components/common/RocketInStLogos";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { Typewriter } from "react-simple-typewriter";

export default function Loading() {
  const containerRef = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      gsap.to(".logo-needle", {
        rotate: 360,
        repeat: -1,
        transformOrigin: "50% 50%",
        ease: "power1",
        duration: 1,
      });
    },
    { scope: containerRef },
  );
  return (
    <div
      className="flex h-main-content w-screen flex-col items-center justify-center"
      ref={containerRef}
    >
      <RocketInStSvgLogo className="logo size-[max(10vw,_10vh)]" />
      <div className="text-2xl">
        <Typewriter words={["Loading..."]} cursor={true} loop={true} />
      </div>
    </div>
  );
}
