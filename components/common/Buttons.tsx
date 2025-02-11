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
      className="w-fit h-fit px-4 py-2 flex items-center justify-center text-xl font-bold text-white rounded-lg bg-blue-600 hover:bg-blue-700"
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
      className="w-fit h-fit px-4 py-2 flex items-center justify-center text-xl font-bold text-white rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-blue-900"
      {...props}
    ></button>
  );
}

export function SecondaryButton(props: Omit<ButtonProps, "className">) {
  return (
    <button
      className="w-fit h-fit px-4 py-2 flex items-center justify-center text-xl font-bold text-white rounded-lg bg-gray-600 hover:bg-gray-700 disabled:bg-gray-900"
      {...props}
    ></button>
  );
}
