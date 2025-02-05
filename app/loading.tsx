import { RocketInStLoadingLogo } from "@/components/common/RocketInStLogos";

export default function Loading() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <RocketInStLoadingLogo className="w-[min(10vw 10vh)]" />
      <div className="text-2xl">Loading...</div>
    </div>
  );
}
