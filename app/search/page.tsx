import { searchAll } from "@/lib/data/search";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import SearchBar from "../ui/search-bar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ArticleCard from "./ui/article-card";
import CommentCard from "./ui/comment-card";
import { Suspense } from "react";

export default async function Page({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const query = q || '';
  const { articles, comments } = query ? await searchAll(query) : { articles: [], comments: [] };
  const totalResults = articles.length + comments.length;

  return (
    <main className="max-w-4xl mx-auto p-6 md:p-10 space-y-8 min-h-screen">
      {/* Top Header & Navigation */}
      <div className="space-y-4">
        <Link href="/"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors gap-1.5">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>


        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Search</h1>

        {/* Global Search Input */}
        {/* <div className="max-w-xl mx-auto pt-2">
          <Suspense fallback={<div className="h-10 w-full bg-muted/20 animate-pulse rounded-md" />}> */}
        <SearchBar />
        {/* </Suspense>
        </div> */}

        {query && (
          <p className="text-sm text-muted-foreground">
            Found <span className="font-semibold text-foreground">{totalResults}</span> result{totalResults !== 1 ? 's' : ''} for "{query}"
          </p>
        )}
      </div>

      {/* Results Display */}
      {!query ? (
        <div className="border border-dashed rounded-xl p-12 text-center bg-muted/10 space-y-2">
          <p className="text-muted-foreground font-medium">Type a search query above to get started.</p>
          <p className="text-xs text-muted-foreground">You can search across all article topics, full content, and reader comments.</p>

        </div>
      ) : totalResults === 0 ? (
        <div className="border border-dashed rounded-xl p-12 text-center bg-muted/10">
          <p className="text-muted-foreground font-medium">No results found for "{query}".</p>
          <p className="text-xs text-muted-foreground mt-1">Try checking for typos or searching with different keywords.</p>
        </div>
      ) : (
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="all">All ({totalResults})</TabsTrigger>
            <TabsTrigger value="articles">Articles ({articles.length})</TabsTrigger>
            <TabsTrigger value="comments">Comments ({comments.length})</TabsTrigger>
          </TabsList>

          {/* ALL TAB */}
          <TabsContent value="all" className="space-y-8 mt-6">
            {articles.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Articles ({articles.length})
                </h2>
                <div className="grid gap-4">
                  {articles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              </div>
            )}

            {comments.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Comments ({comments.length})
                </h2>
                <div className="grid gap-4">
                  {comments.map((comment) => (
                    <CommentCard key={comment.id} comment={comment} />
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          {/* ARTICLES TAB */}
          <TabsContent value="articles" className="space-y-4 mt-6">
            {articles.length > 0 ? (
              articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))
            ) : (
              <p className="text-sm text-muted-foreground italic py-6">No matching articles found.</p>
            )}
          </TabsContent>

          {/* COMMENTS TAB */}
          <TabsContent value="comments" className="space-y-4 mt-6">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <CommentCard key={comment.id} comment={comment} />
              ))
            ) : (
              <p className="text-sm text-muted-foreground italic py-6">No matching comments found.</p>
            )}
          </TabsContent>
        </Tabs>
      )}
    </main>
  )
}