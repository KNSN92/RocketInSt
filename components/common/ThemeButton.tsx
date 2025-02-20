"use client";

import { useEffect, useState } from "react";

import SunIcon from "@heroicons/react/24/outline/SunIcon";
import MoonIcon from "@heroicons/react/24/outline/MoonIcon";
import ComputerDesktopIcon from "@heroicons/react/24/outline/ComputerDesktopIcon";
import clsx from "clsx";

export default function ThemeButton() {

	const rawTheme = typeof window !== "undefined" ? localStorage.theme : undefined;
	const [theme, setTheme] = useState<"light" | "dark" | undefined>(rawTheme === "undefined" ? undefined : rawTheme);

	useEffect(() => {
		if(typeof window !== "undefined") localStorage.theme = theme;
		document.documentElement.classList.toggle(
			"dark",
			theme === "dark" ||
			(theme === undefined && window.matchMedia("(prefers-color-scheme: dark)").matches)
		)
	}, [theme]);
	return (
		<div className="w-fit mx-8 flex text-lg border-2 border-blue-800 rounded-full">
			<button className={clsx("w-fit h-fit p-2 flex gap-1 items-center rounded-l-full", theme === "light" && "bg-blue-800")}
				onClick={() => setTheme("light")}
			>
				<SunIcon height={24} />
			</button>
			<button className={clsx("w-fit h-fit p-2 flex gap-1 items-center", theme === "dark" && "bg-blue-800")}
				onClick={() => setTheme("dark")}
			>
				<MoonIcon height={24} />
			</button>
			<button className={clsx("w-fit h-fit p-2 flex gap-1 items-center rounded-r-full", theme === undefined && "bg-blue-800")}
				onClick={() => setTheme(undefined)}
			>
				<ComputerDesktopIcon height={24} />
			</button>
		</div>
	);
}