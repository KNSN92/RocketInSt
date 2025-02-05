import Image, { ImageProps } from "next/image";

type NonSrcImageProps = Omit<Omit<ImageProps, "src">, "alt">;

export function RocketInStWhiteTextLogo(props: NonSrcImageProps) {
  return <Image src="/logo/text_white.png" alt="RocketIn.st Logo" {...props} />;
}

export function RocketInStBlackTextLogo(props: NonSrcImageProps) {
  return <Image src="/logo/text_black.png" alt="RocketIn.st Logo" {...props} />;
}

export function RocketInStLoadingLogo({
  className,
}: {
  className?: HTMLDivElement["className"];
}) {
  return (
    <div
      className={`bg-[url(/logo/loading_back.png)] bg-contain aspect-square flex items-center justify-center ${className}`}
    >
      <Image
        src="/logo/loading_needle.png"
        alt="RocketIn.st Loading Needle"
        width={47}
        height={367}
        className="h-[80%] w-fit rotate-45 animate-[loading-spin_1s_ease-in-out_infinite]"
      />
    </div>
  );
}
