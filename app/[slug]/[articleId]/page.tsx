import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/auth/server";
import { fetchArticleBySlugAndId } from "@/lib/data/article";
import { fetchCommentsByArticleId } from "@/lib/data/comment";
import { ArrowLeft, Calendar, MessageSquare } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CommentField from "./ui/comment-field";
import { SignInField } from "@/app/ui/sign-in-field";

export const generateMetadata = async ({ params }: { params: Promise<{ slug: string, articleId: string }> }) => {
  const { slug, articleId } = await params
  //TODO: check if article can be fetched only by articleId
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

  const [comments, session] = await Promise.all([fetchCommentsByArticleId(articleId), getSession()])

  const textLines = article.content.split("\n")
  const parsedTitle = textLines[0].replace(/^#\s*/, "") || "Untitled Article"
  const bodyMarkdown = textLines.slice(1).join("\n").trim() || "No content available."

  const currentPath = `/${slug}/${articleId}`

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

        <div className="prose prose-stone dark:prose-invert max-w-none leading-relaxed text-foreground/90">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {bodyMarkdown}
          </ReactMarkdown>
        </div>
      </article>

      <hr className="my-8" />

      <section id="discussion" className="space-y-8">
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-primary" />
          Discussion ({comments.length})
        </h2>

        {session?.user.id ? (
          <CommentField articleId={articleId}
          />
        ) : (
          <div className="border border-dashed rounded-xl p-6 text-center bg-muted/5 space-y-10">
            <p className="text-sm text-muted-foreground">
              You must sign in to share a comment.
            </p>
            <SignInField callbackURL={`${currentPath}`} hash="discussion" showCancel={false} />
          </div>
        )}

        <div className="space-y-6">
          {comments.length === 0 ? (
            <p className="text-sm text-muted-foreground italic">
              No comments yet. Be the first to start the discussion!
            </p>
          ) : (
            comments.map(({ id, user, createdAt, content }) => (
              <div key={id} className="flex gap-4 items-start text-sm border-b pb-6 last:border-0 last:pb-0">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{user.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(createdAt).toLocaleString(undefined, {
                        year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
                      })}
                      {/* {new Date(createdAt).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })} */}
                    </span>
                  </div>
                  <p className="text-foreground/90 whitespace-pre-wrap">{content}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}