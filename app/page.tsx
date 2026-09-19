import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchContentEnginesWithLatestArticleAndCount } from "@/lib/data/content-engine";
import { BookOpen, Calendar, ChevronRight } from "lucide-react";
import Link from "next/link";
import SearchBar from "./ui/search-bar";
import { searchAll } from "@/lib/data/search";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ArticleCard from "./search/ui/article-card";
import CommentCard from "./search/ui/comment-card";
// import { Tabs } from "radix-ui";

// TODO: Cache Components adoption. Refactor this route so this opt-out can be removed.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

export default async function Home({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  // export default async function Home() {
  const { q } = await searchParams;
  const query = q || '';
  // const contentEngines = await fetchContentEnginesWithLatestArticleAndCount();
  const [contentEngines, searchResults] = await Promise.all([
    fetchContentEnginesWithLatestArticleAndCount(),
    query ? searchAll(query) : Promise.resolve({ articles: [], comments: [] })
  ]);

  const { articles, comments } = searchResults; // Destructure search results if needed, currently unused
  const totalResults = articles.length + comments.length; // Calculate total results if needed, currently unused

  //TODO: delete /search 

  return (
    <main className="w-full max-w-4xl mx-auto p-6 md:p-10 space-y-12 min-h-screen">
      {/* Hero Banner Area */}
      <div className="text-center py-10 space-y-4 border-b">
        {/* <div className="text-center py-12 space-y-6 border-b"> */}
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
        {query && (
          <p className="text-sm text-muted-foreground">
            Found <span className="font-semibold text-foreground">{totalResults}</span> result{totalResults !== 1 ? 's' : ''} for "{query}"
          </p>
        )}
      </div>

      {/* DYNAMIC CONTENT AREA */}
      {query ? (
        /* --- SEARCH RESULTS MODE --- */
        totalResults === 0 ? (
          <div className="w-full border border-dashed rounded-xl p-12 text-center bg-muted/10 space-y-2">
            <p className="text-muted-foreground font-medium">No results found for "{query}".</p>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">Try checking for typos or searching with different keywords.</p>
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
                      <ArticleCard key={article.id} article={article} query={query} />
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
                      <CommentCard key={comment.id} comment={comment} query={query} />
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            {/* ARTICLES TAB */}
            <TabsContent value="articles" className="space-y-4 mt-6">
              {articles.length > 0 ? (
                articles.map((article) => (
                  <ArticleCard key={article.id} article={article} query={query} />
                ))
              ) : (
                <p className="text-sm text-muted-foreground italic py-6">
                  No matching articles found.
                </p>
              )}
            </TabsContent>

            {/* COMMENTS TAB */}
            <TabsContent value="comments" className="space-y-4 mt-6">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <CommentCard key={comment.id} comment={comment} query={query} />
                ))
              ) : (
                <p className="text-sm text-muted-foreground italic py-6">
                  No matching comments found.
                </p>
              )}
            </TabsContent>
          </Tabs>
        )
      ) : (
        /* --- HOME TOPICS DIRECTORY MODE --- */
        <div className="space-y-6">
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Topics
          </h2>

          {contentEngines.length === 0 ? (
            <div className="border border-dashed rounded-xl p-12 text-center bg-muted/10">
              <p className="text-muted-foreground font-medium">
                No publication channels available right now.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2">
              {contentEngines.map(({ _count, articles, id, topic, slug }) => {
                const count = _count.articles;
                const latestArticle = articles[0];

                return (
                  <Link key={id} href={`/${slug}`} className="group block">
                    <Card className="h-full hover:border-primary/40 transition-all group-hover:shadow-sm flex flex-col justify-between">
                      <CardHeader className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span
                            className="text-xs font-semibold tracking-wider uppercase text-primary bg-primary/5 px-2.5 py-1 rounded-full">
                            {count} {count === 1 ? "article" : "articles"}
                          </span>
                          <ChevronRight
                            className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-transform 
                            group-hover:translate-x-0.5" />
                        </div>

                        <CardTitle className="text-2xl capitalize pt-1 group-hover:text-primary transition-colors">
                          {topic}
                        </CardTitle>
                      </CardHeader>

                      <CardContent className="pt-0">
                        {latestArticle ? (
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground border-t pt-4 mt-2">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>
                              Updated{" "}
                              {new Date(latestArticle.createdAt).toLocaleDateString(undefined, {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                        ) : (
                          <p className="text-xs text-muted-foreground border-t pt-4 mt-2 italic">
                            No articles available.
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      )}
    </main>
  );
}