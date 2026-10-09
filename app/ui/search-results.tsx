import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { searchAll } from "@/lib/data/search"
import ArticleCard from "./article-card"
import CommentCard from "./comment-card"

export default async function SearchResults({ query }: { query: string }) {
  const { articles, comments } = await searchAll(query)
  const totalResults = articles.length + comments.length

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground -mt-6">
        Found <span className="font-semibold text-foreground">{totalResults}</span> result{totalResults !== 1 ? 's' : ''} for "{query}"
      </p>

      {totalResults === 0 ? (
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
      )}
    </div>)
}