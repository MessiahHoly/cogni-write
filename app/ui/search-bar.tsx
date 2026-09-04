'use client';

import { Input } from "@/components/ui/input";
import { Loader2, Search } from "lucide-react";
import {
  // usePathname,
  useRouter, useSearchParams
} from "next/navigation";
import { Suspense, useCallback, useRef, useTransition } from "react";

const SearchBarContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced URL updates
  const debouncedSearch = useCallback((term: string) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      if (term.trim()) {
        params.set("q", term);
      } else {
        params.delete("q");
      }

      startTransition(() => {
        router.replace(`/search?${params.toString()}`);
      });
    }, 300)
  },
    [router, searchParams, startTransition]
  );

  // const handleSearch = (term: string) => {
  //   const params = new URLSearchParams(searchParams);
  //   if (term.trim()) {
  //     params.set("q", term);
  //   } else {
  //     params.delete("q");
  //   }

  //   startTransition(() => {
  //     router.replace(`/search?${params.toString()}`);
  //   });
  // }

  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input type="search" defaultValue={searchParams.get("q")?.toString() ?? ""} onChange={e => debouncedSearch(e.target.value)}
      // <Input type="search" defaultValue={searchParams.get("q")?.toString() ?? ""} onChange={e => handleSearch(e.target.value)}
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