import { fetchArticleBySlugAndId, fetchArticles } from "@/lib/data/article";
import { Calendar } from "lucide-react";
import { notFound } from "next/navigation";
import ArticleBody from "./ui/article-body";
import BackButton from "./ui/back-button";
import AdUnit from "@/app/ads/ad-unit";
import { Suspense } from "react";
import DiscussionSection from "./ui/discussion-section";
import DiscussionSkeleton from "./ui/discussion-skeleton";

export const generateStaticParams = async () => {
  "use cache: remote"

  return await fetchArticles()
}

export const generateMetadata = async ({ params }: { params: Promise<{ slug: string, articleId: string }> }) => {
  const { slug, articleId } = await params
  const article = await fetchArticleBySlugAndId(slug)(articleId)

  if (!article) {
    return {}
  }

  const textLines = article.content.split("\n")
  const parsedTitle = textLines[0].replace(/^#\s*/, "") || "Untitled Article"
  const descriptionSnippet = textLines.slice(1).join(" ").trim().substring(0, 150) + "...";

  return {
    title: parsedTitle,
    description: descriptionSnippet,
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
      <BackButton fallbackHref={`/${slug}`} fallbackLabel="Back" />

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

        <AdUnit slotId="8811843407" format="auto" />

        <div className="prose prose-stone dark:prose-invert max-w-none leading-relaxed text-foreground/90">
          <Suspense fallback={<div>{bodyMarkdown}</div>}>
            <ArticleBody bodyMarkdown={bodyMarkdown} />
          </Suspense>
        </div>
      </article>

      <AdUnit slotId="7315706559" format="auto" />

      <hr className="my-8" />

      <Suspense fallback={<DiscussionSkeleton />}>
        <DiscussionSection slug={slug} articleId={articleId} />
      </Suspense>
    </main>
  );
}

//TODO: When generating a comment, you should send all the comments/replies so that the reply from Cogni sounds right. 
// cogni-write/lib/data/comment.ts at main · MessiahHoly/cogni-write

//TODO: Use "use cache: remote"