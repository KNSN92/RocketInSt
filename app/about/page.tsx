import Image from "next/image";

export default function About() {
  return (
    <div>
      <div className="w-screen h-screen flex items-center justify-center">
        <div className="w-fit h-fit mx-auto my-auto">
          <h1 className="text-8xl font-bold">便利を世界へ。</h1>
          <div className="flex flex-row justify-center items-center mt-4">
            <div className="inline-block ml-48 mr-4 align-middle h-0 w-20 border-t-2 border-black"></div>
            <h2 className="inline-block text-4xl">
              RocketIn.St Development Team
            </h2>
          </div>
        </div>
      </div>
      <div className="w-[80vw] mx-auto h-1 bg-gray-200" />
      <div className="w-screen h-screen flex items-center justify-center">
        <div className="px-16 gap-16 flex flex-row items-center justify-center">
          <div>
            <h1 className="text-4xl font-bold">RocketIn.stのきっかけ</h1>
            <p className="pt-4 text-xl">
              当サイトはN/S高等学校内で行われる学内コンペティションに応募するために誕生しました。<br/>
              それ以来私たちRocketIn.st Development Teamは<span className="font-bold">便利を世界へ。</span>という言葉をモットーに当サイトを制作してまいりました。<br/>
              現在では生徒がどの部屋に居るのかという情報に留まらず、部屋の混雑状況などの更なるサービスの開発も行っており、これからも<span className="font-bold">便利を世界へ。</span>という言葉を追い求めてまいります。
            </p>
            <s className="opacity-20">結構Aboutっぽい文章じゃない？コレ。</s>
          </div>
          <div>
            <Image src="/about/about_document.png" alt="about document" width={1864} height={1138} />
          </div>
        </div>
      </div>
    </div>
  );
}
