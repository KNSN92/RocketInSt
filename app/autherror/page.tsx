export default function AuthError() {
  return (
    <div className="mt-16 w-fit h-fit mx-auto">
      <h1 className="mx-auto w-fit text-4xl font-bold">認証に失敗しました。</h1>
      <h2 className="mt-4">
        @nnn.ed.jpもしくは@nnn.ac.jpのアカウントでログインを試みているかを確認し、再度ログインを試みて下さい。
      </h2>
    </div>
  );
}
