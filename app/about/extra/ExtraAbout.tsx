"use client";

import {
  RocketInStSvgLogo,
  RocketInStSvgTextLogo,
} from "@/components/common/RocketInStLogos";
import { useGSAP } from "@gsap/react";
import clsx from "clsx";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ReactNode, useRef } from "react";

export default function ExtraAbout() {
  const { replace } = useRouter();
  const page = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);
      gsap.registerPlugin(MotionPathPlugin);

      addEventListener("DOMContentLoaded", () => ScrollTrigger.refresh());
      addEventListener("resize", () => ScrollTrigger.refresh());

      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const vw50 = vw / 2;
      const vh50 = vh / 2;

      gsap
        .timeline({
          scrollTrigger: {
            trigger: page.current,
            start: "top",
            end: () => window.innerHeight * 45,
            toggleActions: "play none reverse none",
            scrub: true,
            pin: true,
          },
          onComplete: () => {
            replace("/");
          },
        })
        .fromTo(
          ".logo",
          {
            autoAlpha: 0.1,
          },
          {
            autoAlpha: 1,
          },
        )
        //針回転
        .to(".logo-needle", {
          transformOrigin: "50% 50%",
          rotate: 360,
          ease: "back.inOut",
          duration: 4,
        })
        //針逆回転 & 移動
        .to(
          ".logo-needle",
          {
            delay: 0.25,
            rotate: 0,
            duration: 3,
          },
          "+=0.5",
        )
        .to(
          ".logo",
          {
            motionPath: {
              path: [
                { x: -vw50 * 0.5, y: vh50 * 0.25 },
                { x: -vw50 * 0.75, y: 0 },
                { x: vw50 * 0.5, y: vh50 * 0.25 },
                { x: vw50 * 0.75, y: 0 },
              ],
              alignOrigin: [0.5, 0.5],
            },
            scale: 0.3,
            duration: 4,
            ease: "power1.inOut",
          },
          "<",
        )
        //画面右移動
        .to(
          ".logo",
          {
            x: -vw50 * 0.6,
            duration: 2,
            ease: "power2.inOut",
          },
          "+=0.25",
        )
        .to(
          ".logo-needle",
          {
            rotate: -360,
            duration: 2,
            ease: "power2.inOut",
          },
          "<",
        )
        //RocketInSt出現
        .to(
          ".logo",
          {
            x: vw50 * (0.05 * 18),
            duration: 0.25 * 18,
          },
          "+=0.25",
        )
        .to(
          ".logo-needle",
          {
            rotate: 720,
            ease: "power2.inOut",
            duration: 0.25 * 18,
          },
          "<",
        )
        .add(
          gsap.timeline().fromTo(
            ".textlogo-rocket0",
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: 0.25 }
          ).to(
            ".textlogo-rocket0",
            { yPercent: -50, yoyo: true, repeat: 1, duration: 2 }
          ),
          "<",
        )
        .add(
          gsap.timeline().fromTo(
            ".textlogo-R1",
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: 0.25 }
          ).to(
            ".textlogo-R1",
            { rotate: -15, transformOrigin: "50% 50%" }
          ).to(
            ".textlogo-R1",
            { rotate: 15 }
          ).to(
            ".textlogo-R1",
            { rotate: 0 }
          ),
          "<+=0.25",
        )
        .add(
          gsap.timeline().fromTo(
            ".textlogo-compass2",
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: 0.25 }
          ).to(
            ".textlogo-compass2",
            { rotate: 360, transformOrigin: "50% 50%", duration: 2 }
          ),
          "<+=0.25",
        )
        .add(
          gsap.timeline().fromTo(
          ".textlogo-c3",
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.25 }
        ).to(
          ".textlogo-c3",
          { rotate: 90, transformOrigin: "50% 50%" }
        )
        .to(
          ".textlogo-c3",
          { rotate: 0, ease: "back.in", transformOrigin: "50% 50%" }
        ),
          "<+=0.25",
        )
        .add(
          gsap.timeline().fromTo(
            ".textlogo-k4",
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: 0.25 }
          ).to(
            ".textlogo-k4",
            { yPercent: -20 },
          ).to(
            ".textlogo-k4",
            { yPercent: 20 },
          ).to(
            ".textlogo-k4",
            { yPercent: 0 },
          ),
          "<+=0.25",
        )
        .add(
          gsap.timeline().fromTo(
            ".textlogo-e5",
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: 0.25 }
          ).to(
            ".textlogo-e5",
            { scaleX: -1, transformOrigin: "50% 50%" }
          ).to(
            ".textlogo-e5",
            { scaleX: 1, transformOrigin: "50% 50%" },
            "+=1"
          ),
          "<+=0.25",
        )
        .add(
          gsap.timeline().fromTo(
            ".textlogo-t6",
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: 0.25 }
          ).to(
            ".textlogo-t6",
            { scale: 1.25, duration: 1.5, repeat: 1, yoyo: true }
          ),
          "<+=0.25",
        )
        .add(
          gsap.timeline().fromTo(
            ".textlogo-I7",
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: 0.25 }
          ).to(
            ".textlogo-I7",
            { scaleY: 1.5, transformOrigin: "50% 50%", duration: 1.5 }
          ).to(
            ".textlogo-I7",
            { scaleY: 1, transformOrigin: "50% 50%", duration: 1 }
          ),
          "<+=0.25",
        )
        .add(
          gsap.timeline().fromTo(
            ".textlogo-n8",
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: 0.25 }
          ).to(
            ".textlogo-n8",
            { rotate: 360, transformOrigin: "50% 50%", ease: "back.inOut", duration: 2 }
          ),
          "<+=0.25",
        )
        .add(
          gsap.timeline().fromTo(
            ".textlogo-dot9",
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: 0.25 }
          ).to(
            ".textlogo-dot9",
            { yPercent: -1000 }
          ).to(
            ".textlogo-dot9",
            { yPercent: 0 }
          ),
          "<+=0.25",
        )
        .add(
          gsap.timeline().fromTo(
              ".textlogo-s10",
              { autoAlpha: 0 },
              { autoAlpha: 1, duration: 0.25 }
            ).to(
              ".textlogo-s10",
              { scaleY: 0.1, repeat: 1, yoyo: true, transformOrigin: "50% 50%" }
            ),
          "<+=0.25",
        )
        .add(
          gsap.timeline().fromTo(
            ".textlogo-t11",
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: 0.25 }
          ).to(
            ".textlogo-t11",
            { scaleY: 10, repeat: 1, yoyo: true, transformOrigin: "50% 50%" }
          ),
          "<+=0.25",
        )
        //コンパス画面右下へ移動
        .to(
          ".logo",
          {
            motionPath: {
              path: [
                { x: vw50, y: -vh50 * 0.25 },
                { x: vw50, y: vh50 },
              ],
            },
            scale: 1,
            alpha: 0.25,
            duration: 2,
          }
        )
        .set(".logo", {
          zIndex: 0,
        })
        .addLabel("startNeedleRotate")
        //テキストロゴ上へ参りまーす
        .add(
          gsap
            .timeline()
            .to(
              ".textlogo",
              {
                y: -vh50 * 1.5,
                duration: 2,
              },
              ">",
            )
            //便利を世界へ。 出現
            .fromTo(
              ".useful-to-the-world-char-odd",
              {
                autoAlpha: 0,
                yPercent: 20,
              },
              {
                autoAlpha: 1,
                yPercent: 0,
                duration: 2,
                stagger: 0.4,
              },
              "<+=50%",
            )
            .fromTo(
              ".useful-to-the-world-char-even",
              {
                autoAlpha: 0,
                yPercent: -20,
              },
              {
                autoAlpha: 1,
                yPercent: 0,
                duration: 2,
                stagger: 0.4,
              },
              "<",
            )
            .fromTo(
              ".useful-to-the-world-sub",
              {
                autoAlpha: 0,
              },
              {
                autoAlpha: 1,
              },
            )
            .to(
              ".useful-to-the-world",
              {
                y: -vh,
                duration: 2,
              },
              "+=1",
            )
            //特徴 出現
            .fromTo(
              ".features",
              { y: vh },
              { y: 0, duration: 2 },
              "<+=10%",
            )
            .to(
              ".feature-title-bar",
              {
                width: "35vw",
              },
              ">",
            )
            .add(
              gsap
                .timeline()
                .to(".features", { x: -vw * 1, duration: 2 }, "+=0.00")
                .to(".features", { x: -vw * 2, duration: 2 }, "+=0.25")
                .to(".features", { x: -vw * 3, duration: 2 }, "+=0.25")
                .to(".features", { x: -vw * 4, duration: 2 }, "+=0.25")
                .to(".features", { x: -vw * 5, duration: 2 }, "+=0.25")
                .to(".features", { x: -vw * 6, duration: 2 }, "+=0.25")
                .to(".features", { x: -vw * 7, duration: 2 }, "+=0.25"),
              "+=0.5",
            )
            .to(
              ".features",
              {
                y: -vh,
                duration: 2,
              },
              "+=1",
            )
            //使用ライブラリとか 出現
            .fromTo(
              ".usedlibs",
              { y: vh },
              { y: 0, duration: 2 },
              "<+=50%",
            )
            .to(
              ".usedlibs-title-bar",
              {
                width: "35vw",
              },
              "+=0.5",
            )
            .fromTo(
              ".usedlibs-card",
              {
                autoAlpha: 0,
                yPercent: 20,
              },
              {
                autoAlpha: 1,
                yPercent: 0,
                stagger: 0.4,
              },
              "+=0.5",
            )
            .to(
              ".usedlibs",
              {
                y: -vh,
                duration: 2,
              },
              "+=1",
            ),
        )
        .to(
          ".logo-needle",
          {
            rotate: 360 * 5,
            duration: 40.5,
          },
          "startNeedleRotate",
        )
        .to(
          ".logo",
          {
            motionPath: {
              path: [
                { x: vw50, y: vh50 },
                { x: vw50 * 0.4, y: vh50 * 0.6 },
                { x: 0, y: 0 },
              ],
            },
            alpha: 1,
            duration: 2,
            ease: "power1.inOut",
          },
          ">-=1.5",
        )
        .to(".logo", {
          rotate: 360,
          duration: 1.5,
          ease: "expo.inOut",
        })
        .fromTo(
          ".logo-needle",
          { rotate: 0 },
          {
            rotate: -720,
            duration: 1.5,
            ease: "expo.inOut",
          },
          "<",
        )
        .to(".logo", {
          motionPath: {
            path: [
              { x: 0, y: 0 },
              { x: -vw * 0.6, y: -vh * 0.4 },
              { x: -vw, y: -vw },
            ],
          },
          duration: 2,
          ease: "power1.in",
        })
        .fromTo(
          ".flying-rocket.cluster",
          {
            transformOrigin: "50% 0%",
            scale: "random(1, 0.1)",
            x: () => gsap.utils.random(0, 1) * vw,
            y: vh,
          },
          {
            y: -vh,
            duration: "random(2, 4)",
            delay: "random(0, 2)",
          },
        )
        .fromTo(
          ".flying-rocket.last",
          {
            transformOrigin: "50% 0%",
            scale: 3.6,
            y: vh,
          },
          {
            y: -vh * 3,
            duration: "3",
            delay: "2",
          },
          "<",
        )
        .fromTo(
          ".last-circle",
          {
            y: -vh50*1.1,
          },
          {
            duration: 3,
            ease: "power1.in",
            y: 0,
          },
          ">-=2",
        )
        .to(
          ".last-circle",
          {
            y: -vh50 * 0.5,
          },
          "+=0.25",
        )
        .to(".last-circle", {
          scale: 30,
          duration: 2,
        });
    },
    { scope: page.current as Element },
  );
  return (
    <div
      className="relative w-screen h-screen flex justify-start items-center overflow-hidden"
      ref={page}
    >
      <Intro />
      <UsefulToTheWorld />
      <Features />
      <UsedLibs />
      <div className="absolute w-screen h-screen">
        {Array(20)
          .fill(0)
          .map((v, i) => (
            <FlyingRocket className="cluster absolute" key={i} />
          ))}
        <FlyingRocket className="last absolute -translate-x-1/2 left-1/2" />
      </div>
      <div className="last-circle absolute w-[5vw] aspect-square rounded-full bg-bgcolorinverse -translate-x-1/2 -translate-y-1/2 left-1/2" />
    </div>
  );
}

function Intro() {
  return (
    <div className="absolute w-screen h-screen flex justify-center items-center">
      <RocketInStSvgLogo className="logo absolute z-10 logo w-1/2" />
      <RocketInStSvgTextLogo className="textlogo absolute w-2/3 overflow-visible" />
    </div>
  );
}

function UsefulToTheWorld() {
  return (
    <div className="useful-to-the-world absolute w-screen h-screen flex justify-center items-center">
      <div>
        <div className="text-8xl flex">
          <div className="useful-to-the-world-char-odd">便</div>
          <div className="useful-to-the-world-char-even">利</div>
          <div className="useful-to-the-world-char-odd">を</div>
          <div className="useful-to-the-world-char-even">世</div>
          <div className="useful-to-the-world-char-odd">界</div>
          <div className="useful-to-the-world-char-even">へ</div>
          <div className="useful-to-the-world-char-odd">。</div>
        </div>
        <div className="useful-to-the-world-sub flex items-center gap-4 pt-4 pl-48">
          <div className="inline-block w-16 h-[1px] bg-bgcolorinverse" />
          <h2 className="text-4xl">RocketInSt Development Team</h2>
        </div>
      </div>
    </div>
  );
}

function Features() {
  return (
    <div className="features absolute w-fit h-screen flex justify-start">
      <div className="w-screen h-screen px-8 flex items-center justify-between gap-6">
        <div className="feature-title-bar w-0 h-1 bg-bgcolorinverse" />
        <h1 className="text-8xl">特徴</h1>
        <div className="feature-title-bar w-0 h-1 bg-bgcolorinverse" />
      </div>
      <FeatureSection
        title="居場所表示機能"
        desc="この人どこに居るっけ？と言う事とはもうおさらば。"
        img="/extraabout/location.png"
      />
      <FeatureSection
        title="混雑状況マップ"
        desc="混雑しているか色ですぐに判別。部屋を決める際にどうぞ。"
        img="/extraabout/congestion.png"
      />
      <FeatureSection
        title="ユーザー検索機能"
        desc="ユーザー名で検索出来ることは勿論。ユーザーが今居る部屋でも検索出来ます。"
        img="/extraabout/search.png"
      />
      <FeatureSection
        title="フレンド機能"
        desc="メインページからでもユーザーがどこに居るのかすぐに分かります。今後さらなる機能が追加される可能性があります。"
        img="/extraabout/friend.png"
      />
      <FeatureSection
        title="レスポンシブ対応"
        desc="このページを除く全てのページをレスポンシブ対応済みです。スマホでも問題無く閲覧が可能です。"
        img="/extraabout/responsive.png"
      />
      <FeatureSection
        title="ダークモード対応"
        desc="フッターから切り替える事が出来るダークモードは目に優しく、夜でも快適に閲覧が可能な上、画面が暗くなるため電力消費量の削減にもつながります。"
        img="/extraabout/dark.png"
      />
      <FeatureSection
        title="N/S高生のみログイン可能"
        desc="メールアドレスが@nnn.ed.jpで終わるユーザーのみ登録を許可することで、N/S高生のみログイン出来る機能が実現されました。"
        img="/extraabout/onlylogin.png"
      />
    </div>
  );
}

function FeatureSection({
  title,
  desc,
  img,
}: {
  title: ReactNode;
  desc: ReactNode;
  img: string;
}) {
  return (
    <div className="px-32 w-screen h-screen flex flex-col items-center justify-center gap-6">
      <div className="w-1/3 h-1/3 relative mb-16">
        <Image src={img} alt="feature img" fill={true} objectFit="contain" />
      </div>
      <h1 className="text-6xl">{title}</h1>
      <p className="text-3xl">{desc}</p>
    </div>
  );
}

function UsedLibs() {
  return (
    <div className="usedlibs absolute w-screen h-screen flex flex-col items-center justify-center gap-24">
      <div className="w-screen h-fit px-8 flex items-center justify-between gap-6">
        <div className="usedlibs-title-bar w-0 h-1 bg-bgcolorinverse" />
        <h1 className="text-8xl">使用技術</h1>
        <div className="usedlibs-title-bar w-0 h-1 bg-bgcolorinverse" />
      </div>
      <div className="flex flex-wrap items-center justify-center gap-16">
        <TechCard
          title="Next.js"
          img={{
            light: "/brandlogo/nextjs-dark.svg",
            dark: "/brandlogo/nextjs-light.svg",
          }}
        />
        <TechCard title="React" img="/brandlogo/react.svg" />
        <TechCard title="TypeScript" img="/brandlogo/typescript.svg" />
        <TechCard
          title="tailwindcss"
          img={{
            light: "/brandlogo/tailwindcss-dark.svg",
            dark: "/brandlogo/tailwindcss-light.svg",
          }}
        />
        <TechCard
          title="Prisma"
          img={{
            light: "/brandlogo/prisma-dark.svg",
            dark: "/brandlogo/prisma-light.svg",
          }}
        />
        <TechCard
          title="Vercel"
          img={{
            light: "/brandlogo/vercel-dark.svg",
            dark: "/brandlogo/vercel-light.svg",
          }}
        />
      </div>
      <div>
        <h1 className="usedlibs-card text-6xl">その他</h1>
        <ul className="pl-8 pt-8 flex flex-col gap-2 text-3xl">
          <li className="usedlibs-card">NextAuth.js</li>
          <li className="usedlibs-card">Zod</li>
          <li className="usedlibs-card">HeroIcons</li>
          <li className="usedlibs-card">clsx</li>
          <li className="usedlibs-card">gsap</li>
          <li className="usedlibs-card">他幾つか</li>
        </ul>
      </div>
    </div>
  );
}

function TechCard({
  title,
  img,
}: {
  title: string;
  img: string | { light: string; dark: string };
}) {
  let imgEle = null;
  if (typeof img === "string") {
    imgEle = (
      <Image
        src={img}
        alt="lib/framework image"
        fill={true}
        objectFit="contain"
      />
    );
  } else {
    imgEle = (
      <>
        <Image
          src={img.light}
          alt="lib/framework image"
          fill={true}
          objectFit="contain"
          className="dark:hidden"
        />
        <Image
          src={img.dark}
          alt="lib/framework image"
          fill={true}
          objectFit="contain"
          className="hidden dark:inline"
        />
      </>
    );
  }
  return (
    <div className="usedlibs-card w-48">
      <div className="relative w-full aspect-video">{imgEle}</div>
      <div className="w-full h-fit mt-2 flex justify-center items-center text-3xl font-bold">
        <h1>{title}</h1>
      </div>
    </div>
  );
}

function FlyingRocket({ className }: { className?: string }) {
  const flyingRocketRef = useRef<SVGSVGElement>(null);
  useGSAP(
    () => {
      gsap.to(".fire-inner", {
        transformOrigin: "50% 50%",
        scale: "random(1.1, 0.9)",
        rotate: "random(-2, 2)",
        yoyo: true,
        repeat: -1,
        repeatRefresh: true,
        duration: 0.15,
      });
      gsap.to(".fire-outer", {
        transformOrigin: "50% 50%",
        scale: "random(1.1, 0.9)",
        rotate: "random(-2, 2)",
        yoyo: true,
        repeat: -1,
        repeatRefresh: true,
        duration: 0.15,
      });
    },
    { scope: flyingRocketRef.current as Element },
  );
  return (
    <svg
      viewBox="0 0 115.346 400"
      className={clsx("flying-rocket w-64", className)}
      ref={flyingRocketRef}
    >
      <path
        d="M86.02,91.907c0,39.138-12.691,50.866-28.346,50.866s-28.346-11.728-28.346-50.866S57.673,1.04,57.673,1.04c0,0,28.346,51.728,28.346,90.866Z"
        className="stroke-bgcolorinverse"
        fill="none"
        strokeLinecap="round"
        strokeMiterlimit="10"
      />
      <polygon
        points="28.846 162.076 .5 162.076 .5 132.05 28.846 105.383 28.846 162.076"
        className="stroke-bgcolorinverse"
        fill="none"
        strokeLinecap="round"
        strokeMiterlimit="10"
      />
      <polygon
        points="114.846 162.076 86.5 162.076 86.5 105.383 114.846 132.05 114.846 162.076"
        className="stroke-bgcolorinverse"
        fill="none"
        strokeLinecap="round"
        strokeMiterlimit="10"
      />
      <path
        d="M78.933,164.033s-6.692-21.26-21.26-21.26-21.26,21.26-21.26,21.26h42.52Z"
        className="stroke-bgcolorinverse"
        fill="none"
        strokeLinecap="round"
        strokeMiterlimit="10"
      />
      <path
        d="M86.461,264.899c0,39.138-12.691,50.866-28.346,50.866s-28.346-11.728-28.346-50.866,28.346-90.866,28.346-90.866c0,0,28.346,51.728,28.346,90.866Z"
        className="fire-outer stroke-bgcolorinverse"
        fill="none"
        strokeLinecap="round"
        strokeMiterlimit="10"
      />
      <path
        d="M80.792,251.726c0,31.311-10.153,40.693-22.677,40.693s-22.677-9.382-22.677-40.693,22.677-72.693,22.677-72.693c0,0,22.677,41.382,22.677,72.693Z"
        className="fire-inner stroke-bgcolorinverse"
        fill="none"
        strokeLinecap="round"
        strokeMiterlimit="10"
      />
    </svg>
  );
}
