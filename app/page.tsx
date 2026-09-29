// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { fetchContentEnginesWithLatestArticleAndCount } from "@/lib/data/content-engine";
// import { BookOpen, Calendar, ChevronRight } from "lucide-react";
// import Link from "next/link";
import SearchBar from "./ui/search-bar";
// import { searchAll } from "@/lib/data/search";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import ArticleCard from "./search/ui/article-card";
// import CommentCard from "./search/ui/comment-card";
import { Suspense } from "react";
import HomeContentSkeleton from "./ui/home-content-skeleton";
import HomeContent from "./ui/home-content";

// export const instant = false;

export default async function Home({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const query = q || '';
  // const [contentEngines, searchResults] = await Promise.all([
  //   fetchContentEnginesWithLatestArticleAndCount(),
  //   query ? searchAll(query) : Promise.resolve({ articles: [], comments: [] })
  // ]);

  // const { articles, comments } = searchResults; // Destructure search results if needed, currently unused
  // const totalResults = articles.length + comments.length; // Calculate total results if needed, currently unused

  return (
    <main className="w-full max-w-4xl mx-auto p-6 md:p-10 space-y-12 min-h-screen">
      {/* Hero Banner Area - Renders instantly */}
      <div className="text-center py-10 space-y-4 border-b">
        <div className="space-y-6">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Cogni Write
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-left">
            Explore automated, deep-dive articles curated across specialized niche topics.
          </p>
        </div>

        {/* Embedded Search Input */}
        <SearchBar />
        {/* {query && (
          <p className="text-sm text-muted-foreground">
            Found <span className="font-semibold text-foreground">{totalResults}</span> result{totalResults !== 1 ? 's' : ''} for "{query}"
          </p>
        )} */}
        <Suspense fallback={<HomeContentSkeleton />}>
          <HomeContent query={query} />
        </Suspense>
      </div>
    </main>
  );
}