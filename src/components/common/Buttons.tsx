import clsx from "clsx";
import Link from "next/link";
import { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode } from "react";

export function LinkButton({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex h-fit w-fit items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-xl font-bold text-white hover:bg-blue-700"
    >
      {children}
    </Link>
  );
}

type ButtonProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

const ButtonColors = {
  "primary": "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-900 dark:bg-blue-700 dark:hover:bg-blue-800 dark:disabled:bg-blue-900",
  "secondary": "bg-gray-600 text-white hover:bg-gray-700 disabled:bg-gray-900",
  "error": "bg-red-600 text-white hover:bg-red-700 disabled:bg-red-900 dark:bg-red-700 dark:hover:bg-red-800 dark:disabled:bg-red-900",
};
type ButtonColor = keyof typeof ButtonColors;

export function Button(props: ButtonProps & { color: ButtonColor }) {
  return (
    <button
    className={clsx("flex h-fit w-fit items-center justify-center rounded-lg  px-4 py-2 text-xl font-bold ", ButtonColors[props.color], props.className)}
    {...props}
  ></button>
  )
}
