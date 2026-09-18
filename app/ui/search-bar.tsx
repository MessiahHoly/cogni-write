'use client';

import { Input } from "@/components/ui/input";
import { Loader2, Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState, useTransition } from "react";
import { useDebouncedCallback } from "use-debounce";

const SearchBarContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const queryParam = searchParams.get("q") ?? "";
  const [text, setText] = useState(queryParam);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (term.trim()) {
      params.set("q", term);
    } else {
      params.delete("q");
    }

    const targetPath = pathname === "/search" ? pathname : "/search";

    startTransition(() => {
      router.replace(`${targetPath}?${params.toString()}`, { scroll: false });
    });
  }, 300);

  // Maintain focus position during route transition
  // useEffect(() => {
  //   setText(queryParam);
  //   if (pathname === "/search" && inputRef.current) {
  //     // Small timeout allows the incoming DOM route tree to mount before focusing
  //     const timer = setTimeout(() => {
  //       if (inputRef.current) {
  //         inputRef.current.focus();
  //         const length = inputRef.current.value.length;
  //         inputRef.current.setSelectionRange(length, length);
  //       }
  //     }, 0)
  //     return () => clearTimeout(timer);
  //   }
  // }, [queryParam, pathname]);

  // 1. Only sync URL param to local text if URL was updated externally (e.g. Back/Forward button)
  // useEffect(() => {
  //   setText(queryParam);
  // }, [queryParam]);

  // 2. Debounced navigation without resetting local text state
  // useEffect(() => {
  //   // Skip navigating if the local text already matches the URL parameter
  //   if (text === queryParam) return;

  //   const timer = setTimeout(() => {
  //     const params = new URLSearchParams(searchParams.toString());
  //     if (text.trim()) {
  //       params.set("q", text);
  //     } else {
  //       params.delete("q");
  //     }

  //     const targetPath = pathname === "/search" ? pathname : "/search";

  //     startTransition(() => {
  //       // Pass scroll: false to stop Next.js from triggering scroll-to-top focus resets
  //       router.replace(`${targetPath}?${params.toString()}`, { scroll: false });
  //       // router.replace(`/search?${params.toString()}`, { scroll: false });
  //     });
  //   }, 300);

  //   return () => clearTimeout(timer);
  // }, [text, queryParam, router, searchParams, pathname]);
  // }, [text, queryParam, router, searchParams, startTransition]);

  //TODO: npm audit fix

  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input type="search"
        // ref={inputRef}
        // value={text}
        defaultValue={searchParams.get("q")?.toString()}
        onChange={e => handleSearch(e.target.value)}
        // onChange={e => setText(e.target.value)}
        placeholder="Search articles and comments..." className="pl-9 pr-9" />
      {isPending && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />}
    </div>
  )
}

export default function SearchBar() {
  return (
    <Suspense fallback={<div className="h-10 w-full bg-muted/20 animate-pulse rounded-md" />}>
      <SearchBarContent />
    </Suspense>
  )
}