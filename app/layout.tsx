import Link from "next/link";
import "./globals.css";
import { NextAuthProvider } from "@/lib/providers";
import { getServerSession } from "next-auth";
import authConfig from "@/auth.config";
import { SignInButton, SignOutButton } from "@/components/common/AuthButtons";
import Image from "next/image";
import { RocketInStWhiteTextLogo } from "@/components/common/RocketInStLogos";
import React, { ReactNode } from "react";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authConfig);
  return (
    <html lang="ja">
      <body className="antialiased font-extralight w-screen h-screen">
        <NextAuthProvider>
          <div className="w-auto h-16 flex items-center justify-between bg-blue-600 text-white">
            <div className="flex items-center">
              <NavElement>
                <Link
                  href="/"
                  className="block text-3xl font-bold"
                >
                  <RocketInStWhiteTextLogo width={1532} height={200} className="h-12 w-fit object-contain relative top-1"/>
                </Link>
              </NavElement>
              <NavLink href="/about" title="about" />
              <NavLink href="/search" title="search" />
            </div>
            <div className="flex items-center">
              {session ? (
                <>
                  <NavLink href="/register" title="register" />
                  <SignOutButton>
                    <NavElement>
                          signout
                    </NavElement>
                  </SignOutButton>
                  {session?.user?.image ? (
                    <NavElement>
                      <Image
                        alt="icon"
                        src={session?.user?.image}
                        width={48}
                        height={48}
                        className="block rounded-full"
                      />
                    </NavElement>
                  ) : undefined}
                </>
              ) : (
                <SignInButton>
                  <NavElement>
                    signin
                  </NavElement>
                </SignInButton>
              )}
            </div>
          </div>
          <div className="w-full h-[calc(100vh-4rem)]">
            {children}
          </div>
        </NextAuthProvider>
      </body>
    </html>
  );
}

function NavElement({ children }: { children: ReactNode }) {
  return (
    <div className="transition duration-400 h-16 px-4 text-xl flex items-center justify-center hover:bg-white hover:bg-opacity-10">
      {children}
    </div>
  )
}

function NavLink({ href, title }: { href: string, title: string }) {
  return (
    <Link
      href={href}
      className="w-fit h-fit"
    >
      <NavElement>
        {title}
      </NavElement>
    </Link>
  )
}
