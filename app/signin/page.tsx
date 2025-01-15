import authConfig from "@/auth.config";
import { SignInButton } from "@/components/AuthButtons";
import { getServerSession } from "next-auth";
import Image from "next/image";

export default async function SignIn({
  searchParams,
}: {
  searchParams: { callbackUrl: string };
}) {
  const { callbackUrl } = await searchParams;
  const session = await getServerSession(authConfig);

  if (session) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <div className="w-64 h-16 flex items-center justify-center rounded-lg bg-gray-300 border-gray-400 border-[4px] text-black font-bold">
          既にサインインしています。
        </div>
      </div>
    );
  } else {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <SignInButton provider="google" options={{ callbackUrl: callbackUrl }}>
          <div className="w-64 h-16 flex items-center justify-center rounded-lg bg-gray-100 border-gray-200 border-[4px] text-black font-bold hover:bg-gray-200 hover:border-gray-300">
            <Image
              alt="google"
              src="https://authjs.dev/img/providers/google.svg"
              width={24}
              height={24}
              loading="lazy"
              className="mr-4"
            ></Image>
            <div className="text-lg">Googleでサインイン</div>
          </div>
        </SignInButton>
      </div>
    );
  }
}
