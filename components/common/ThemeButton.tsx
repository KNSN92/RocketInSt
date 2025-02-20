"use client";

import { useEffect, useState } from "react";

import OutlineSunIcon from "@heroicons/react/24/outline/SunIcon";
import OutlineMoonIcon from "@heroicons/react/24/outline/MoonIcon";
import OutlineComputerDesktopIcon from "@heroicons/react/24/outline/ComputerDesktopIcon";
import SolidSunIcon from "@heroicons/react/24/solid/SunIcon";
import SolidMoonIcon from "@heroicons/react/24/solid/MoonIcon";
import SolidComputerDesktopIcon from "@heroicons/react/24/solid/ComputerDesktopIcon";
import clsx from "clsx";

export default function ThemeButton() {

	const [theme, setTheme] = useState<"light" | "dark" | undefined>("light");

	useEffect(() => {
		if(typeof window !== "undefined") {
			const rawTheme = typeof window !== "undefined" ? localStorage.theme : undefined;
			setTheme(rawTheme === "undefined" ? undefined : rawTheme);
		};
	}, [])
	
	useEffect(() => {
		if(typeof window !== "undefined") {
			localStorage.theme = theme;
		};
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
				<OutlineSunIcon height={24} className={theme !== "light" ? "inline" : "hidden"} />
				<SolidSunIcon height={24} className={theme === "light" ? "inline" : "hidden"} />
			</button>
			<button className={clsx("w-fit h-fit p-2 flex gap-1 items-center", theme === "dark" && "bg-blue-800")}
				onClick={() => setTheme("dark")}
			>
				<OutlineMoonIcon height={24} className={theme !== "dark" ? "inline" : "hidden"} />
				<SolidMoonIcon height={24} className={theme === "dark" ? "inline" : "hidden"} />
			</button>
			<button className={clsx("w-fit h-fit p-2 flex gap-1 items-center rounded-r-full", theme === undefined && "bg-blue-800")}
				onClick={() => setTheme(undefined)}
			>
				<OutlineComputerDesktopIcon height={24} className={theme !== undefined ? "inline" : "hidden"} />
				<SolidComputerDesktopIcon height={24} className={theme === undefined ? "inline" : "hidden"} />
			</button>
		</div>
	);
}