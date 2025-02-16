import clsx from "clsx";
import Image from "next/image";
import { CSSProperties } from "react";

export function UserIcon({
  src,
  width,
  height,
  className,
}: {
  src: string | null | undefined;
  width: number;
  height: number;
  className?: HTMLDivElement["className"];
}) {
  if (src) {
    return (
      <Image
        src={src}
        alt="icon"
        width={width}
        height={height}
        loading="lazy"
        className={clsx(className, "rounded-full")}
      />
    );
  } else {
    return (
      <UnknownUserIcon
        className={className}
        style={{ width: `${width}px`, height: `${height}px` }}
      />
    );
  }
}

export function UnknownUserIcon({
  className,
  style,
}: {
  className?: HTMLDivElement["className"];
  style?: CSSProperties;
}) {
  return (
    <div
      className={clsx(
        className,
        "flex items-center justify-center rounded-full bg-gray-400 text-4xl font-bold text-black",
      )}
      style={style}
    >
      ?
    </div>
  );
}
