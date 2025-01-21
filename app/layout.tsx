import Link from "next/link";
import "./globals.css";
import { NextAuthProvider } from "@/lib/providers";
import { getServerSession } from "next-auth";
import authConfig from "@/auth.config";
import { SignInButton, SignOutButton } from "@/components/common/AuthButtons";
import Image from "next/image";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authConfig);
  return (
    <html lang="ja">
      <body className="antialiased bg-black">
        <NextAuthProvider>
          <div>
            <Link
              href="/"
              className="inline-block px-2 py-1 border border-white"
            >
              RocketIn.st
            </Link>
            <Link
              href="/about"
              className="inline-block px-2 py-1 border border-white"
            >
              about
            </Link>
            <Link
              href="/search"
              className="inline-block px-2 py-1 border border-white"
            >
              Search
            </Link>
            <Link
              href="/form"
              className="inline-block px-2 py-1 border border-white"
            >
              Form
            </Link>
            {session ? (
              <SignOutButton>
                <div className="inline-block px-2 py-1 border border-white">
                  SignOut
                </div>
              </SignOutButton>
            ) : (
              <SignInButton>
                <div className="inline-block px-2 py-1 border border-white">
                  SignIn
                </div>
              </SignInButton>
            )}
            {session?.user?.image ? (
              <Image
                alt="icon"
                src={session?.user?.image}
                width={32}
                height={32}
                className="inline-block rounded-full"
              />
            ) : undefined}
          </div>
          {children}
        </NextAuthProvider>
      </body>
    </html>
  );
}
