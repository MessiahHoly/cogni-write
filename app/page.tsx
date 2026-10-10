import { Suspense } from "react";
import SearchBar from "./ui/search-bar";
import HomeContent from "./ui/home-content";
import HomeContentSkeleton from "./ui/home-content-skeleton";
import RecentArticles from "./ui/recent-articles";
import RecentArticlesSkeleton from "./ui/recent-articles-skeleton";

export default async function Home({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  // 'use cache: remote'

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
        <SearchBar />
      </div>
      <Suspense fallback={<RecentArticlesSkeleton />}>
        <RecentArticles />
      </Suspense>
      <Suspense fallback={<HomeContentSkeleton />}>
        <HomeContent searchParams={searchParams} />
      </Suspense>
    </main>
  );
}