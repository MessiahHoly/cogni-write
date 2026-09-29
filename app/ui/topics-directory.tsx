import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchContentEnginesWithLatestArticleAndCount } from "@/lib/data/content-engine"
import { Calendar, ChevronRight } from "lucide-react"
import { cacheLife, cacheTag } from "next/cache"
import Link from "next/link"

//TODO: upgrade next.js

export default async function TopicsDirectory() {
  'use cache'
  cacheLife('default')
  cacheTag('topics-directory')

  const contentEngines = await fetchContentEnginesWithLatestArticleAndCount()

  if (contentEngines.length === 0) {
    return (
      <div className="border border-dashed rounded-xl p-12 text-center bg-muted/10">
        <p className="text-muted-foreground font-medium">
          No publication channels available right now.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {contentEngines.map(({ _count, articles, id, topic, slug }) => {
        const count = _count.articles;
        const latestArticle = articles[0]; // Assuming articles are sorted by date, with the latest first

        return (
          <Link key={id} href={`/${slug}`} className="group block">
            <Card className="h-full hover:border-primary/40 transition-all group-hover:shadow-sm flex flex-col justify-between">
              <CardHeader className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold tracking-wider uppercase text-primary bg-primary/5 px-2.5 py-1 rounded-full">
                    {count} article{count !== 1 ? 's' : ''}
                  </span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-0.5" />
                </div>

                <CardTitle className="text-2xl capitalize pt-1 group-hover:text-primary transition-colors">
                  {topic}
                </CardTitle>
              </CardHeader>

              <CardContent className="pt-0">
                {latestArticle ? (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground border-t pt-4 mt-2">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Updated{" "}
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
        );
      })}
    </div>
  )
}