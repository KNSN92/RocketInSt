"use client";
import clsx from "clsx";
import Link, { LinkProps } from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ReactNode, useEffect } from "react";

export default function PaginationButtons({
  pageParam,
  page,
  limit,
  total,
}: {
  pageParam: string;
  page: number;
  limit: number;
  total: number;
}) {
  const totalPages = Math.ceil(total / limit);

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  const { replace } = useRouter();
  useEffect(() => {
    const currentPage = Math.max(1, Math.min(totalPages, page));
    if (currentPage === page) return;
    params.set(pageParam, currentPage.toString());
    replace(`${pathname}?${params.toString()}`, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total]);

  const pages: (
    | { page: number | string; url: string; disabled?: boolean }
    | string
  )[] = [];

  params.set(pageParam, "1");
  pages.push({
    page: 1,
    url: `${pathname}?${params.toString()}`,
    disabled: page === 1,
  });

  pages.push("...");

  // params.set("page", (page - 2).toString());
  // pages.push({
  //   page: page <= 2 ? "<" : page - 2,
  //   url: `${pathname}?${params.toString()}`,
  //   disabled: page <= 2,
  // });

  params.set("page", (page - 1).toString());
  pages.push({
    page: page <= 1 ? "<" : page - 1,
    url: `${pathname}?${params.toString()}`,
    disabled: page <= 1,
  });

  params.set("page", page.toString());
  pages.push({
    page: page,
    url: `${pathname}?${params.toString()}`,
    disabled: true,
  });

  params.set("page", (page + 1).toString());
  pages.push({
    page: page >= totalPages ? "<" : page + 1,
    url: `${pathname}?${params.toString()}`,
    disabled: page >= totalPages,
  });

  // params.set("page", (page + 2).toString());
  // pages.push({
  //   page: page >= totalPages - 1 ? ">" : page + 2,
  //   url: `${pathname}?${params.toString()}`,
  //   disabled: page >= totalPages - 1,
  // });

  pages.push("...");

  params.set("page", totalPages.toString());
  pages.push({
    page: totalPages,
    url: `${pathname}?${params.toString()}`,
    disabled: page >= totalPages,
  });

  return (
    <div className="flex items-end gap-1">
      {pages.map((page, i) => {
        if (typeof page === "string") {
          return (
            <span className="block" key={i}>
              {page}
            </span>
          );
        } else {
          return (
            <PaginationButton
              href={page.url}
              scroll={false}
              disabled={page.disabled}
              key={i}
            >
              {page.page}
            </PaginationButton>
          );
        }
      })}
    </div>
  );
}

function PaginationButton(
  props: LinkProps & { children: ReactNode; disabled?: boolean },
) {
  const className = clsx(
    "flex justify-center items-center size-10 rounded-lg border-1 text-white text-lg",
    props.disabled
      ? "bg-blue-700 border-blue-300 select-none"
      : "bg-blue-500 border-blue-400 hover:bg-blue-400 hover:border-blue-300",
  );
  if (props.disabled) {
    return <span className={className}>{props.children}</span>;
  } else {
    return (
      <Link className={className} {...props}>
        {props.children}
      </Link>
    );
  }
}
