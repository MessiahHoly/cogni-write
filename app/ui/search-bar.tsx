'use client';

import { Input } from "@/components/ui/input";
import { Loader2, Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Suspense,
  // useEffect, useRef, useState,
  useTransition
} from "react";
import { useDebouncedCallback } from "use-debounce";

const SearchBarContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  // const queryParam = searchParams.get("q") ?? "";
  // const [text, setText] = useState(queryParam);
  // const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (term.trim()) {
      params.set("q", term);
    } else {
      params.delete("q");
    }

    // const targetPath = pathname === "/search" ? pathname : "/search";

    startTransition(() => {
      // Replaces parameters on current path smoothly without unmounting SearchBar
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      // router.replace(`${targetPath}?${params.toString()}`, { scroll: false });
    });
  }, 300);

  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input type="search"
        defaultValue={searchParams.get("q")?.toString()}
        onChange={e => handleSearch(e.target.value)}
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