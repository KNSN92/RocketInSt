import authConfig from "@/auth.config";
import { SignInButton, SignOutButton } from "@/components/common/AuthButtons";
import NotificationList from "@/components/common/NotificationList";
import {
  RocketInStLogo,
  RocketInStWhiteTextLogo,
} from "@/components/common/RocketInStLogos";
import ThemeButton from "@/components/common/ThemeButton";
import { UserIcon } from "@/components/common/UserIcon";
import { HeaderShowHideButton } from "@/components/layout/HeaderShowHideButton";
import { NotificationProvider } from "@/lib/notification";
import { NextAuthProvider } from "@/lib/providers";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { Sawarabi_Gothic } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import React, { ReactNode, Suspense } from "react";
import "./globals.css";
import Loading from "./loading";

export const metadata: Metadata = {
  title: {
    template: "%s | RocketInSt",
    default: "RocketInSt",
  },
  description: "N/S高生のキャンパス内位置や混雑状況を確認出来るサイトです。",
};

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
        className={`min-h-screen w-screen bg-bgcolor text-[var(--color-dark)] dark:text-gray-200 antialiased ${SawarabiGothicFont.className}`}
      >
        <NextAuthProvider>
          <NotificationProvider>
            <Header />
            <HeaderShowHideButton />
            <Main>{children}</Main>
            <Footer />
          </NotificationProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}

async function Header() {
  const session = await getServerSession(authConfig);
  return (
    <header className="fixed inset-0 z-50 flex h-[var(--header-height)] w-screen items-center justify-between bg-blue-600 dark:bg-blue-900 text-light shadow-md">
      <div className="flex items-center">
        <NavLink href="/">
          <div>
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
          </div>
        </NavLink>
        {session && <NavLink href="/search">search</NavLink>}
      </div>
      <div className="flex items-center">
        {session?.user ? (
          <NavDropDownLink
            href={`/user/${session.user.id}`}
            title={
              <>
                <UserIcon
                  src={session.user.image}
                  size={48}
                  status="none"
                  className="inline"
                />
                <div className="pl-2">{session.user.name}</div>
              </>
            }
            linklist={[
              {
                href: "/register",
                title: "register",
              },
              {
                href: "/settings",
                title: "settings",
              },
              {
                href: undefined,
                element: (
                  <div className="w-full h-0.5 bg-blue-700 dark:bg-blue-950" />
                ),
              },
              {
                href: undefined,
                element: (
                  <SignOutButton>
                    <NavElement>
                      <span className="text-red-500">signout</span>
                    </NavElement>
                  </SignOutButton>
                ),
              },
            ]}
          />
        ) : (
          <SignInButton>
            <NavElement>signin</NavElement>
          </SignInButton>
        )}
      </div>
    </header>
  );
}

function Main({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen w-full pt-[var(--header-height)]">
      <NotificationList className="pt-4" />
      <Suspense fallback={<Loading />}>{children}</Suspense>
    </main>
  );
}

function NavElement({ children }: { children: ReactNode }) {
  return (
    <div className="duration-400 flex h-16 items-center justify-center px-4 text-xl transition hover:bg-white/10">
      {children}
    </div>
  );
}

function NavLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="h-fit w-fit">
      <NavElement>{children}</NavElement>
    </Link>
  );
}

function NavDropDownLink({
  href,
  title,
  linklist,
}: {
  href: string;
  title: ReactNode;
  linklist: (
    | { href: string; title: ReactNode }
    | { href: undefined; element: ReactNode }
  )[];
}) {
  return (
    <div className="h-16 w-max group">
      <NavLink href={href}>{title}</NavLink>
      <div className="bg-blue-600 dark:bg-blue-900 opacity-0 invisible group-hover:visible group-hover:opacity-100 transition">
        {linklist.map((link, i) =>
          link.href !== undefined ? (
            <Link href={link.href} className="w-full" key={i}>
              <div className="duration-400 w-full flex h-16 items-center justify-center px-4 text-xl transition hover:bg-white/10">
                {link.title}
              </div>
            </Link>
          ) : (
            <div className="w-full h-fit" key={i}>
              {link.element}
            </div>
          ),
        )}
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="h-[var(--footer-height)] w-screen overflow-scroll bg-blue-600 dark:bg-blue-900 flex items-center justify-between text-nowrap">
      <p className="ml-8 text-white text-2xl">
        © 2025 RocketInSt Development Team
      </p>
      <div className="w-fit flex items-center text-white mr-8">
        <ThemeButton />
        <NavLink href="/about">about</NavLink>
        <div className="bg-white h-10 w-[1px]" />
        <a
          className="w-fit h-full flex items-center"
          href="https://github.com/KNSN92/RocketInSt"
        >
          <NavElement>
            <div className="w-8 h-8">
              <Image
                alt="github icon"
                src="/github_dark.svg"
                width="32"
                height="32"
                className="dark:hidden"
              />
              <Image
                alt="github icon"
                src="/github_light.svg"
                width="32"
                height="32"
                className="hidden dark:inline"
              />
            </div>
          </NavElement>
        </a>
      </div>
    </footer>
  );
}
