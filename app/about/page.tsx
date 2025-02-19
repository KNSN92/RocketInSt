import { RocketInStLogo } from "@/components/common/RocketInStLogos";
import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About",
};

export default function About() {
  return (
    <div className="h-fit w-screen">
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="mx-auto my-auto h-fit w-fit">
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold">
            便利を世界へ。
          </h1>
          <div className="mt-4 flex flex-row items-center justify-center">
            <div className="ml-12 md:ml-24 lg:ml-48 mr-4 inline-block h-0 w-5 md:w-10 lg:w-20 border-t-2 border-black align-middle"></div>
            <h2 className="inline-block text-xl md:text-2xl lg:text-4xl">
              RocketIn.St Development Team
            </h2>
          </div>
        </div>
      </div>
      <div className="mx-auto h-1 w-[80vw] bg-gray-200" />
      <div className="min-h-screen flex h-full w-full items-center justify-center">
        <div className="flex flex-col-reverse md:flex-row items-center justify-center gap-8 px-4 md:px-16 py-4">
          <div className="overflow-scroll w-full">
            <h1 className="text-2xl md:text-4xl font-bold">
              RocketIn.stのきっかけ
            </h1>
            <p className="pt-4 text-lg md:text-xl overflow-auto">
              当サイトはN/S高等学校内で行われる学内コンペティションに応募するために誕生しました。
              <br />
              それ以来私たちRocketIn.st Development Teamは
              <span className="text-nowrap font-bold">便利を世界へ。</span>
              という言葉をモットーに当サイトを制作してまいりました。
              <br />
              現在では生徒がどの部屋に居るのかという情報を表示するだけに留まらず、
              <br />
              部屋の混雑状況の表示などの更なるサービスの開発も行っており、これからも
              <span className="text-nowrap font-bold">便利を世界へ。</span>
              という言葉を追い求めてまいります。
            </p>
            <s className="text-lg opacity-40">
              結構Aboutっぽい文章じゃない？コレ。
            </s>
          </div>
          <div>
            <Image
              src="/about/about_document.png"
              alt="about document"
              width={1864}
              height={1138}
              className="w-[80vw] md:w-[50vw]"
            />
          </div>
        </div>
      </div>
      <div className="mx-auto h-1 w-[80vw] bg-gray-200" />
      <div className="min-h-screen flex h-full w-full items-center justify-center">
        <div className="flex flex-col-reverse md:flex-row items-center justify-center gap-8 px-4 md:px-16 py-4">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold">
              RocketIn.stの由来
            </h1>
            <p className="pt-4 text-xl">
              当サイトの名称の由来はLocation Informationから来ています。
              <br />
              この状態だと長過ぎる為省略をする事になり、ロケインと省略されました。
              <br />
              そこから更に、言葉が似ていて、カッコイイと言う理由でロケがRocketに変わり、RocketInとなりました。
              <br />
              最後の.stはアフリカにあるサントメプリンシペと呼ばれる国から来ています。
              <br />
              偶然見つけたその国にチーム一同感銘を受けたため、その国のドメインである.stを付け加える事としました。
              <br />
              これによってRocketIn.stと言う名前は誕生しました。
            </p>
            <s className="text-lg opacity-20">
              .stって本当はストーカーの英単語stalkerの最初の2文字から来ているんだけどな！
            </s>
          </div>
          <div>
            <Image
              src="/about/about_rocketinst.png"
              alt="about rocketinst"
              width={859}
              height={659}
              className="w-[80vw] md:w-[50vw]"
            />
          </div>
        </div>
      </div>
      <div className="mx-auto h-1 w-[80vw] bg-gray-200" />
      <div className="min-h-screen flex flex-col-reverse md:flex-row items-center justify-center gap-16 px-4 md:px-8 py-4">
        <div>
          <h1 className="text-4xl font-bold">使用技術</h1>
          <p className="py-2 text-xl">
            いずれの技術も当サイトの制作に欠かせない存在です。その感謝を込め、ここに記します。
          </p>
          <ul className="text-xl">
            <li>TypeScript</li>
            <li>Node.js</li>
            <li>React</li>
            <li>TailWindCSS</li>
            <li>Next.js</li>
            <li>NextAuth.js</li>
            <li>Prisma</li>
            <li>Zod</li>
            <li>その他多数！</li>
          </ul>
          <s className="text-lg opacity-20">
            プロジェクトのメンテナンス等々いつもお疲れ様です。
          </s>
        </div>
        <div>
          <RocketInStLogo
            width={459}
            height={459}
            loading="lazy"
            className="w-[80vw] md:w-[25vw]"
          />
        </div>
      </div>
    </div>
  );
}
