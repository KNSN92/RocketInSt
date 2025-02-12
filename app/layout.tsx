import authConfig from "@/auth.config";
import { SignInButton, SignOutButton } from "@/components/common/AuthButtons";
import {
  RocketInStLogo,
  RocketInStWhiteTextLogo,
} from "@/components/common/RocketInStLogos";
import { UserIcon } from "@/components/common/UserIcon";
import { NextAuthProvider } from "@/lib/providers";
import { getServerSession } from "next-auth";
import { Sawarabi_Gothic } from "next/font/google";
import Link from "next/link";
import React, { ReactNode, Suspense } from "react";
import "./globals.css";
import Loading from "./loading";

const SawarabiGothicFont = Sawarabi_Gothic({
  weight: "400",
  style: "normal",
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`min-h-screen w-screen antialiased ${SawarabiGothicFont.className}`}
      >
        <NextAuthProvider>
          <Header />
          <div className="min-h-screen w-full pt-[var(--header-height)]">
            <Suspense fallback={<Loading />}>{children}</Suspense>
          </div>
          <Footer />
        </NextAuthProvider>
      </body>
    </html>
  );
}

async function Header() {
  const session = await getServerSession(authConfig);
  return (
    <div className="fixed inset-0 z-50 flex h-[var(--header-height)] w-screen items-center justify-between overflow-hidden bg-blue-600 text-white shadow-md">
      <div className="flex items-center">
        <NavElement>
          <Link href="/" className="block text-3xl font-bold">
            <RocketInStWhiteTextLogo
              width={1532}
              height={200}
              loading="lazy"
              className="relative top-1 hidden h-12 w-fit object-contain md:inline"
            />
            <div className="md:hidden h-12 w-12">
              <RocketInStLogo
                width={459}
                height={459}
                loading="lazy"
                className="inline-block h-12 w-12 aspect-square object-contain"
              />
            </div>
          </Link>
        </NavElement>
        <NavLink href="/about" title="about" />
        <NavLink href="/search" title="search" />
      </div>
      <div className="flex items-center">
        {session?.user ? (
          <>
            <NavLink href="/register" title="register" />
            <SignOutButton>
              <NavElement>signout</NavElement>
            </SignOutButton>
            <Link href={`/user/${session.user.id}`} className="h-fit w-fit">
              <NavElement>
                <UserIcon
                  src={session.user.image}
                  width={48}
                  height={48}
                  className="block"
                />
              </NavElement>
            </Link>
          </>
        ) : (
          <SignInButton>
            <NavElement>signin</NavElement>
          </SignInButton>
        )}
      </div>
    </div>
  );
}

function NavElement({ children }: { children: ReactNode }) {
  return (
    <div className="duration-400 flex h-16 items-center justify-center px-4 text-xl transition hover:bg-white hover:bg-opacity-10">
      {children}
    </div>
  );
}

function NavLink({ href, title }: { href: string; title: string }) {
  return (
    <Link href={href} className="h-fit w-fit">
      <NavElement>{title}</NavElement>
    </Link>
  );
}

function Footer() {
  return (
    <div className="h-[var(--footer-height)] w-screen bg-blue-600 flex items-center justify-between">
      <p className="ml-8 text-white text-2xl">
        © 2025 RocketInSt Development Team
      </p>
      <div></div>
    </div>
  );
}
