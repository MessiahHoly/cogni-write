import { Button } from "@/components/ui/button";
import { fetchArticleBySlugAndId } from "@/lib/data/article";
import { ArrowLeft, Calendar } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export const generateMetadata = async ({ params }: { params: Promise<{ slug: string, articleId: string }> }) => {
  const { slug, articleId } = await params
  const article = await fetchArticleBySlugAndId(slug)(articleId)

  if (!article) {
    return {}
  }

  const textLines = article.content.split("\n")
  const parsedTitle = textLines[0].replace(/^#\s*/, "") || "Untitled Article"

  return {
    title: article.topic,
    description: parsedTitle,
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string, articleId: string }> }) {
  const { slug, articleId } = await params
  const article = await fetchArticleBySlugAndId(slug)(articleId)

  if (!article) {
    return notFound()
  }

  const textLines = article.content.split("\n")
  const parsedTitle = textLines[0].replace(/^#\s*/, "") || "Untitled Article"
  const bodyMarkdown = textLines.slice(1).join("\n").trim() || "No content available."

  return (
    <main className="max-w-3xl mx-auto p-6 md:p-10 space-y-8 min-h-screen">
      <Button asChild variant="ghost" size="sm" className="gap-2 -ml-2 text-muted-foreground">
        <Link href={`/${slug}`}>
          <ArrowLeft className="w-4 h-4" />
          Back to {article.contentEngine.topic}
        </Link>
      </Button>

      <article className="space-y-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <time dateTime={article.updatedAt.toISOString()}>
            {new Date(article.updatedAt).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
          </time>
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight text-foreground lg:text-5xl leading-tight">
          {parsedTitle}
        </h1>

        <hr className="my-4" />

        <div className="prose prose-stone dark:prose-invert max-w-none whitespace-pre-wrap leading-relaxed text-foreground/90">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {bodyMarkdown}
          </ReactMarkdown>
        </div>
      </article>
    </main>
  );
}