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

export function PrimaryButton(props: Omit<ButtonProps, "className">) {
  return (
    <button
      className="flex h-fit w-fit items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-xl font-bold text-white hover:bg-blue-700 disabled:bg-blue-900 dark:bg-blue-700 hover:dark:bg-blue-800 disabled:dark:bg-blue-900"
      {...props}
    ></button>
  );
}

export function SecondaryButton(props: Omit<ButtonProps, "className">) {
  return (
    <button
      className="flex h-fit w-fit items-center justify-center rounded-lg bg-gray-600 px-4 py-2 text-xl font-bold text-white hover:bg-gray-700 disabled:bg-gray-900"
      {...props}
    ></button>
  );
}
