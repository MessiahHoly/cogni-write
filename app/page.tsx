// 

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchContentEnginesWithLatestArticleAndCount } from "@/lib/data/content-engine";
import { BookOpen, Calendar, ChevronRight } from "lucide-react";
import Link from "next/link";

export default async function Home() {
  const contentEngines = await fetchContentEnginesWithLatestArticleAndCount();

  return (
    <main className="max-w-5xl mx-auto p-6 md:p-10 space-y-12 min-h-screen">
      {/* Hero Banner Area */}
      <div className="text-center py-12 space-y-4 border-b">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
          Knowledge Channels
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-left">
          Explore automated, deep-dive articles curated across specialized niche topics.
        </p>
      </div>

      {/* Grid Directory of Channels */}
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
            {/* Fixed Destructuring Arguments here */}
            {contentEngines.map(({ _count, articles, id, topic, slug }) => {
              const count = _count.articles;
              const latestArticle = articles[0];

              return (
                <Link key={id} href={`/${slug}`} className="group block">
                  {/* Reverted w-full back to h-full for perfectly uniform card heights */}
                  <Card className="h-full hover:border-primary/40 transition-all group-hover:shadow-sm flex flex-col justify-between">
                    <CardHeader className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold tracking-wider uppercase text-primary bg-primary/5 px-2.5 py-1 rounded-full">
                          {count} {count === 1 ? "article" : "articles"}
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
                          <span>
                            Updated {new Date(latestArticle.createdAt).toLocaleDateString(undefined, {
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
        )}
      </div>
    </main>
  );
}