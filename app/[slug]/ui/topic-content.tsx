import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchContentEngineAndArticlesBySlug } from "@/lib/data/content-engine"
import { Calendar } from "lucide-react"
import { cacheTag } from "next/cache"
import Link from "next/link"
import { notFound } from "next/navigation"

export default async function TopicContent({ params }: { params: Promise<{ slug: string }> }) {
  'use cache'
  
  const { slug } = await params
  cacheTag(`topic-${slug}`)

  const contentEngine = await fetchContentEngineAndArticlesBySlug(slug)

  if (!contentEngine) {
    return notFound()
  }

  return (
    <div className="space-y-6">
      <div className="border-b pb-5">
        <h1 className="text-3xl font-extrabold tracking-tight capitalize mt-2">
          {contentEngine.topic}
        </h1>
      </div>

      <div className="space-y-6">
        {contentEngine.articles.length === 0 ? (
          <div className="border border-dashed rounded-xl p-12 text-center space-y-3 bg-muted/10">
            <p className="text-muted-foreground font-medium">No articles generated yet.</p>
            <p className="text-xs text-muted-foreground/70 max-w-sm mx-auto">
              Articles will appear here once they are generated.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {contentEngine.articles.map((article) => (
              <Card key={article.id} className="hover:border-primary/40 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(article.updatedAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <CardTitle className="text-xl pt-2 hover:text-primary transition-colors">
                    <Link href={`/${slug}/${article.id}`} className="block">
                      {article.content.split("\n")[0].replace(/^#\s*/, "") || "Untitled Article"}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                    {article.content.split("\n").slice(1).join(" ").replace(/[#*`_-]/g, '').trim()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}