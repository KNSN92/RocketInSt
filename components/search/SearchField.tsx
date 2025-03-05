"use client";

import MagnifyingGlassIcon from "@heroicons/react/24/outline/MagnifyingGlassIcon";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  DetailedHTMLProps,
  InputHTMLAttributes,
  useEffect,
  useRef,
  useState,
} from "react";
import { useDebouncedCallback } from "use-debounce";

export default function SearchField(
  props: Omit<
    DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
    "defaultValue"
  >,
) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);
  return (
    <input
      {...props}
      onChange={(e) => {
        if (props.onChange) props.onChange(e);
        handleSearch(e.target.value);
      }}
      defaultValue={searchParams.get("query")?.toString()}
    />
  );
}

export function DefaultSearchField() {
  const [focus, setFocus] = useState(false);
  const [hasText, setHasText] = useState(false);
  const searchInput = useRef<HTMLInputElement>(null);
  useEffect(() => {
    setHasText(
      searchInput.current ? searchInput.current.value.length > 0 : false,
    );
  }, [searchInput.current?.value]);
  const magnifyingGlassX =
    focus || hasText
      ? `calc(${searchInput.current?.clientWidth}px - 100%)`
      : "0px";
  return (
    <div className="mx-4 relative flex transition w-full md:w-[60vw] xl:w-[40vw]">
      <div
        className="w-fit h-fit px-4 absolute pointer-events-none transition"
        style={{
          top: "50%",
          transform: `translate(${magnifyingGlassX}, -50%)`,
        }}
      >
        <MagnifyingGlassIcon className="w-8 text-zinc-900 dark:text-zinc-100 opacity-30 transition" />
      </div>
      <SearchField
        placeholder={focus ? undefined : "        名前/ニックネームで検索"}
        className="w-full h-12 rounded-lg border-1 outline-0 border-blue-600 focus:border-2 focus:border-blue-800 focus:dark:border-blue-400 px-4 md:w-[60vw] xl:w-[40vw] dark:bg-dark"
        onFocus={() => {
          setFocus(true);
        }}
        onBlur={() => {
          setFocus(false);
        }}
        ref={searchInput}
      />
    </div>
  );
}
