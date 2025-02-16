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
import Image from "next/image";
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
    <div className="fixed inset-0 z-50 flex h-[var(--header-height)] w-screen items-center justify-between bg-blue-600 text-white shadow-md">
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
                  width={48}
                  height={48}
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
                href: undefined,
                element: <div className="w-full h-0.5 bg-blue-700" />,
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
      <div className="bg-blue-600 opacity-0 invisible group-hover:visible group-hover:opacity-100 transition">
        {linklist.map((link, i) =>
          link.href !== undefined ? (
            <Link href={link.href} className="w-full" key={i}>
              <div className="duration-400 w-full flex h-16 items-center justify-center px-4 text-xl transition hover:bg-white hover:bg-opacity-10">
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
    <div className="h-[var(--footer-height)] w-full overflow-scroll bg-blue-600 flex items-center justify-between text-nowrap">
      <p className="ml-8 text-white text-2xl">
        © 2025 RocketInSt Development Team
      </p>
      <div className="mr-8 w-48 flex items-center text-white">
        <NavLink href="/about">about</NavLink>
        <div className="bg-white h-16 w-[1px]" />
        <NavElement>
          <a className="w-12 h-12" href="https://github.com/KNSN92/RocketInSt">
            <Image alt="github icon" src="/github.svg" width="48" height="48" />
          </a>
        </NavElement>
      </div>
    </div>
  );
}
