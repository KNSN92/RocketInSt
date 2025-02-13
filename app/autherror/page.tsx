import { SignInButton } from "@/components/common/AuthButtons";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function AuthError({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>;
}) {
  if (await getServerSession()) {
    redirect("/");
  }
  const { error } = await searchParams;
  return (
    <div className="w-full h-main-content flex items-center justify-center">
      <div className="w-fit px-8 h-[30rem] bg-red-600 rounded-3xl border-red-400 text-white border-4 flex flex-col items-center justify-center">
        <h1 className="mx-auto w-fit text-3xl md:text-4xl font-bold">
          認証に失敗しました :(
        </h1>
        {error === "AccessDenied" ? (
          <>
            <h2 className="mt-12">
              @nnn.ed.jpもしくは@nnn.ac.jpのアカウントでログインしようとしているかを確認し、再度ログインを試みて下さい。
            </h2>
          </>
        ) : (
          <>
            <h2 className="mx-auto w-fit mt-4">エラーの種類:{error}</h2>
            <h2 className="mt-4">
              何らかの理由でサインインに失敗しました。もう何回かサインインを試みて同じエラーが出る場合は、改善するまでしばらくお待ちください。
            </h2>
          </>
        )}
        <div className="h-16" />
        <SignInButton>
          <div className="transition duration-500 bg-blue-200 text-blue-600 text-md md:text-2xl font-semibold flex justify-center items-center w-fit h-fit px-8 py-4 rounded-full hover:bg-blue-600 hover:text-blue-200">
            再度サインインを試みる
          </div>
        </SignInButton>
      </div>
    </div>
  );
}
