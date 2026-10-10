import { fetchLatestArticlesLast24Hours } from "@/lib/data/article";
import { ArrowRight, Clock, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function RecentArticles() {
  const articles = await fetchLatestArticlesLast24Hours()

  if (articles.length === 0) {
    return (
      null
    )
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between border-b pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500 fill-amber-500" />
          <h2 className="text-2xl font-bold tracking-tight">Fresh Off the Press</h2>
          <Badge variant="secondary" className="ml-2" >
            Last 24 Hours ({articles.length})
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map(({ id, contentEngine, createdAt, content }) => (
          <Card key={id} className="flex flex-col justify-between hover:shadow-md transition-shadow">
            <CardHeader className="space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-mono bg-muted px-2 py-0.5 rounded">
                  {contentEngine.topic}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <CardTitle className="line-clamp-2 text-lg">
                <Link href={`/${contentEngine.slug}/${id}`} className="hover:underline">
                  {content.split('\n')[0]?.replace(/^#\s*/, '').trim() || "Untitled"}
                </Link>
              </CardTitle>
            </CardHeader>

            <CardContent className="pt-0">
              <CardDescription className="line-clamp-3 mb-4">
                {/* {content} */}
                {content.split("\n").slice(1).join(" ").replace(/[#*`_-]/g, '').trim()}
              </CardDescription>
              <Button asChild variant="ghost" size="sm" className="w-full justify-between gap-1">
                <Link href={`/${contentEngine.slug}/${id}`}>
                  Read Article <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}