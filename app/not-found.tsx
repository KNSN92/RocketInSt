"use client";

import { Typewriter } from "react-simple-typewriter";

const words: string[] = [
  "のっと ふぁうんど！",
  "ユニークリソースロケーターを確認してね！",
  "あなたが探している物が見つかると良いですね！",
  "何故だ！何故見つからない！",
  "見つからなかったよ...",
  "申し訳ありませんが、要求されたページには何も存在しないようです。",
  "探し物かい？URLを良く見てごらん？",
  "残念ながら無いようだ。",
  "一体何故見つからないと言うのだ！",
  "捜索しても無駄だ！このページを探してもこれ以上はもう何も無い！",
  "貴方が探しているのはこの404ですか？それとも他のページですか？正直者ですね。貴方にはこの404をあげましょう。",
  "ここには何も無いぜ〜 他を当たりなー",
  "悲しきかな... ここには何も無いのじゃ...",
  "404って前から読んでも後ろから読んでも404だよな!",
  '新しいプログラミング言語を学ぶときはまず"Hello World!"を出力するプログラムを書くんだ。これ常識ね。',
  "ここまで読むと言う事は流石に放置しているか全部読み終わるまで終われません! をやっているみたいだね。もし見たいページを開いてこれが出てきたなら一度URLを確認してみてくれ。ほら、単語の打ち間違いとかあるでしょ？それとももし全部読み終わるまで終われません!をやっているなら随分物好きな人だね。良いねー。これでまた最初にリセットされるよ。サラダバー。ではリセットォォー！!",
];

export default function NotFound() {
  return (
    <div className="w-screen h-main-content flex flex-col items-center justify-center">
      <h1 className="text-3xl md:text-6xl font-bold"> - 404 Not Found - </h1>
      <div className="text-xl md:text-4xl px-8">
        <Typewriter words={words} cursor={true} loop={true} />
      </div>
    </div>
  );
}
