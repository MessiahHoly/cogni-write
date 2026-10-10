import { Suspense } from "react";
import RecentArticlesSkeleton from "./recent-articles-skeleton";
import SearchResults from "./search-results";
import TopicsDirectory from "./topics-directory";
import RecentArticles from "./recent-articles";

export default async function HomeContent({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams
  const query = q || ''

  if (query) {
    return <SearchResults query={query} />
  }

  return (
    <div className="space-y-12">
      <Suspense fallback={<RecentArticlesSkeleton />}>
        <RecentArticles />
      </Suspense>
      <TopicsDirectory />
    </div>
  )
}
