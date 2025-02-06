import { RocketInStLogo } from "@/components/common/RocketInStLogos";
import Image from "next/image";

export default function About() {
  return (
    <div className="w-screen h-screen overflow-y-scroll snap-y snap-mandatory">
      <div className="w-screen h-screen snap-start">
        <div className="w-full h-full flex items-center justify-center">
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
      </div>
      <div className="w-screen h-screen snap-start">
        <div className="w-full h-full flex items-center justify-center">
          <div className="px-16 gap-16 flex flex-row items-center justify-center">
            <div>
              <h1 className="text-4xl font-bold">RocketIn.stのきっかけ</h1>
              <p className="pt-4 text-xl">
                当サイトはN/S高等学校内で行われる学内コンペティションに応募するために誕生しました。
                <br />
                それ以来私たちRocketIn.st Development Teamは
                <span className="font-bold text-nowrap">便利を世界へ。</span>
                という言葉をモットーに当サイトを制作してまいりました。
                <br />
                現在では生徒がどの部屋に居るのかという情報を表示するだけに留まらず、
                <br />
                部屋の混雑状況の表示などの更なるサービスの開発も行っており、これからも
                <span className="font-bold  text-nowrap">便利を世界へ。</span>
                という言葉を追い求めてまいります。
              </p>
              <s className="opacity-40 text-lg">
                結構Aboutっぽい文章じゃない？コレ。
              </s>
            </div>
              <div>
                <Image
                src="/about/about_document.png"
                alt="about document"
                width={1864}
                height={1138}
                className="w-[50vw]"
              />
            </div>
          </div>
        </div>
        <div className="w-[80vw] mx-auto h-1 bg-gray-200" />
      </div>
      <div className="w-screen h-screen snap-start">
        <div className="w-full h-full flex items-center justify-center">
          <div className="px-16 gap-16 flex flex-row items-center justify-center">
            <div>
              <h1 className="text-4xl font-bold">RocketIn.stの由来</h1>
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
              <s className="opacity-20 text-lg">
                .stって本当はストーカーの英単語stalkerの最初の2文字から来ているんだけどな！
              </s>
            </div>
            <div>
              <Image
                src="/about/about_rocketinst.png"
                alt="about rocketinst"
                width={859}
                height={659}
                className="w-[50vw]"
              />
            </div>
          </div>
        </div>
        <div className="w-[80vw] mx-auto h-1 bg-gray-200" />
      </div>
      <div className="w-screen h-screen snap-start flex items-center justify-center">
        <div className="px-16 gap-16 flex flex-row items-center justify-center">
          <div>
            <h1 className="text-4xl font-bold">使用技術</h1>
            <p className="pt-4 text-xl pb-4">
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
            <s className="opacity-20 text-lg">
              プロジェクトのメンテナンス等々いつもお疲れ様です。
            </s>
          </div>
          <div>
            <RocketInStLogo
              width={459}
              height={459}
              loading="lazy"
              className="w-[25vw]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
