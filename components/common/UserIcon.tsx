import clsx from "clsx";
import Image from "next/image";
import { CSSProperties } from "react";

export function UserIcon({
  src,
  size,
  status,
  statusStyle,
  className,
}: {
  src: string | null | undefined;
  size: number;
  status?: "active" | "inactive" | "none";
  statusStyle?: "dot" | "border";
  className?: HTMLDivElement["className"];
}) {
  const statusIconClassName = clsx(
    statusStyle === "border" && {
      "border-green-400": status === "active",
      "border-gray-600": status === "inactive",
    },
  );
  const statusDotClassName = clsx(
    statusStyle === "dot" && {
      "bg-green-400 border-green-600": status === "active",
      "bg-gray-400 border-gray-600": status === "inactive",
    },
  );
  const iconBorderWidth =
    statusStyle === "border" && (status === "active" || status === "inactive")
      ? `${size / 24}px`
      : undefined;
  let iconElement = null;
  iconElement = src ? (
    <Image
      src={src}
      alt="icon"
      width={size}
      height={size}
      loading="lazy"
      className={clsx(className, "rounded-full", statusIconClassName)}
      style={{
        borderWidth: iconBorderWidth,
      }}
    />
  ) : (
    <UnknownUserIcon
      className={clsx(className, statusIconClassName)}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        fontSize: `${size / 1.5}px`,
        borderWidth: iconBorderWidth,
      }}
    />
  );
  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
    >
      {iconElement}
      {status && statusStyle && (
        <div
          className={clsx(
            "relative -translate-y-full -translate-x-full left-full rounded-full",
            statusDotClassName,
          )}
          style={{
            width: `${size / 3}px`,
            height: `${size / 3}px`,
            borderWidth:
              statusStyle === "dot" &&
              (status === "active" || status === "inactive")
                ? `${size / 32}px`
                : undefined,
          }}
        />
      )}
    </div>
  );
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
