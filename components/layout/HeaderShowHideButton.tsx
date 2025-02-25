"use client";

import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function HeaderShowHideButton() {
  const path = usePathname();
  const [showed, setShowed] = useState(!path.includes("/about/extra"));
  useEffect(() => {
    if (showed && !document.documentElement.classList.contains("header")) {
      document.documentElement.classList.add("header");
    } else {
      document.documentElement.classList.remove("header");
    }
    ScrollTrigger.refresh();
  }, [showed]);
  return (
    <button
      className="fixed top-[var(--header-height)] z-[60] px-2 py-1 bg-blue-600 dark:bg-blue-900 text-white rounded-b-lg"
      onClick={() => {
        setShowed(!showed);
      }}
    >
      {showed ? "hide" : "show"}
    </button>
  );
}
