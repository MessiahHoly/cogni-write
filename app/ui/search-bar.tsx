'use client';

import { Input } from "@/components/ui/input";
import { Loader2, Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Suspense,
  // useCallback,
  useEffect,
  // useRef,
  useState, useTransition
} from "react";

const SearchBarContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  // const timerRef = useRef<NodeJS.Timeout | null>(null);
  const queryParam = searchParams.get("q") ?? "";
  const [text, setText] = useState(queryParam);

  useEffect(() => {
    setText(queryParam);
  }, [queryParam]);

  useEffect(() => {
    // Skip navigating if the local text already matches the URL parameter
    if (text === queryParam) return;

    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (text.trim()) {
        params.set("q", text);
      } else {
        params.delete("q");
      }

      startTransition(() => {
        router.replace(`/search?${params.toString()}`);
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [text, queryParam, router, searchParams, startTransition]);

  // Debounced URL updates
  // const debouncedSearch = useCallback((term: string) => {
  //   if (timerRef.current) {
  //     clearTimeout(timerRef.current);
  //   }

  //   timerRef.current = setTimeout(() => {
  //     const params = new URLSearchParams(searchParams);
  //     if (term.trim()) {
  //       params.set("q", term);
  //     } else {
  //       params.delete("q");
  //     }

  //     startTransition(() => {
  //       router.replace(`/search?${params.toString()}`);
  //     });
  //   }, 300)
  // },
  //   [router, searchParams, startTransition]
  // );

  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input type="search"
        value={text}
        // defaultValue={searchParams.get("q")?.toString() ?? ""}
        // onChange={e => debouncedSearch(e.target.value)}
        onChange={e => setText(e.target.value)}
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