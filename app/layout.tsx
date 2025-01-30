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
      <body className="antialiased">
        <NextAuthProvider>
          <div className="px-4 h-16 flex items-center justify-between bg-gray-800">
            <div className="flex items-center">
              <Link
                href="/"
                className="block px-2 py-1 text-3xl font-bold"
              >
                (ろご)RocketIn.st
              </Link>
              <Link
                href="/about"
                className="block px-2 py-1 text-xl"
              >
                about
              </Link>
              <Link
                href="/search"
                className="block px-2 py-1 text-xl"
              >
                search
              </Link>
            </div>
            <div className="flex items-center">
              {session ? (
                <>
                  <Link
                    href="/register"
                    className="block px-2 py-1 text-xl"
                  >
                    register
                  </Link>
                  <SignOutButton>
                    <div className="block px-2 py-1 text-xl">
                      signout
                    </div>
                  </SignOutButton>
                  {session?.user?.image ? (
                    <Image
                      alt="icon"
                      src={session?.user?.image}
                      width={48}
                      height={48}
                      className="block rounded-full"
                    />
                  ) : undefined}
                </>
              ) : (
                <SignInButton>
                  <div className="block px-2 py-1 text-xl">
                    signin
                  </div>
                </SignInButton>
              )}
            </div>
          </div>
          {children}
        </NextAuthProvider>
      </body>
    </html>
  );
}
