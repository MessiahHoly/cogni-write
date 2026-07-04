import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchContentEngineAndArticlesBySlug } from "@/lib/data/content-engine";
import { ArrowLeft, Calendar, Cpu, FileText } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const contentEngine = await fetchContentEngineAndArticlesBySlug(slug)

  if (!contentEngine) {
    return notFound()
  }

  return (
    <main className="max-w-5xl mx-auto p-6 md:p-10 space-y-8 min-h-screen">
      <div className="space-y-4">
        <Button asChild variant="ghost" size="sm" className="gap-2 -ml-2 text-muted-foreground">
          <Link href="/admin">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </Button>

        <div className="border-b pb-5">
          <span className="text-xs font-mono bg-primary/10 text-primary px-2 py-1 rounded">
            /{contentEngine.slug}
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight capitalize mt-2">
            {contentEngine.topic}
          </h1>
          <p className="text-muted-foreground mt-1">
            Review and track all automated articles generated for this core topic channel.
          </p>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FileText className="w-5 h-5 text-muted-foreground" />
            Generated Articles {contentEngine.articles.length || 0}
          </h2>

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
                      <span className="flex items-center gap-1 font-mono bg-muted px-2 py-0.5 rounded w-max">
                        <Cpu className="w-3 h-3" />
                        Model used supposed to be here.
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
    </main>
  );
}