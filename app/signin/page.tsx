import authConfig from "@/auth.config";
import { SignInButton } from "@/components/common/AuthButtons";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { Roboto } from "next/font/google";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Signin",
};

const RobotoMidiumFont = Roboto({
  weight: "500",
  subsets: ["latin"],
});

export default async function SignIn({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl: string }>;
}) {
  const { callbackUrl } = await searchParams;
  const session = await getServerSession(authConfig);

  if (session) {
    redirect("/");
  } else {
    return (
      <div className="flex h-main-content w-full items-center justify-center">
        <div className="p-4 flex h-[30rem] w-[36rem] flex-col items-center justify-center rounded-3xl border-4 border-blue-200 bg-blue-600 dark:bg-blue-800 dark:border-blue-600">
          <h1 className="mb-2 block text-4xl md:text-5xl font-bold text-white">
            サインイン
          </h1>
          <h2 className="mb-8 block text-center text-xl font-bold text-white">
            学園のGoogleアカウントでのみサインインが可能です。
          </h2>
          <GoogleSignInButton
            callbackUrl={`/auth/success?callbackUrl=${callbackUrl}`}
          />
        </div>
      </div>
    );
  }
}

function GoogleSignInButton({ callbackUrl }: { callbackUrl: string }) {
  return (
    <SignInButton provider="google" options={{ callbackUrl: callbackUrl }}>
      <div className="flex h-20 w-fit items-center justify-center rounded-full border-2 border-[#747775] bg-gray-100 px-6 text-[#1F1F1F] shadow-md">
        <div className="mr-5 h-10 w-10">
          <svg
            className="block"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            xmlnsXlink="http://www.w3.org/1999/xlink"
          >
            <path
              fill="#EA4335"
              d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
            ></path>
            <path
              fill="#4285F4"
              d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
            ></path>
            <path
              fill="#FBBC05"
              d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
            ></path>
            <path
              fill="#34A853"
              d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
            ></path>
            <path fill="none" d="M0 0h48v48H0z"></path>
          </svg>
        </div>
        <div className={`text-2xl md:text-3xl ${RobotoMidiumFont.className}`}>
          Sign in with Google
        </div>
      </div>
    </SignInButton>
  );
}
