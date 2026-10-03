import { getSession } from "@/lib/auth/server";
import { fetchCommentsWithRepliesByArticleId } from "@/lib/data/comment";
import { MessageSquare } from "lucide-react";
import OnboardingNameField from "./onboarding-name-field";
import CommentField from "./comment-field";
import { SignInField } from "@/app/ui/sign-in-field";
import CommentItem from "./comment-item";

export default async function DiscussionSection({ slug, articleId }: { slug: string, articleId: string }) {
  const [comments, session] = await Promise.all([fetchCommentsWithRepliesByArticleId(articleId), getSession()])

  const currentPath = `/${slug}/${articleId}`
  const isAuthenticated = Boolean(session?.user.id)

  return (
    <section id="discussion" className="space-y-8">
      <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-primary" />
        Discussion ({comments.length})
      </h2>

      {session?.user.id ? (
        !session?.user.name || session?.user.name === session?.user.email ? (
          <OnboardingNameField currentPath={currentPath} />
        ) : (
          <CommentField articleId={articleId} commentId={null} />
        )
      ) : (
        <div className="border border-dashed rounded-xl p-6 bg-muted/5 space-y-10">
          <SignInField callbackURL={`${currentPath}`} hash="discussion" showCancel={false} text="You must sign in to share a comment." />
        </div>
      )}

      <div className="space-y-6">
        {comments.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">
            No comments yet. Be the first to the discussion!
          </p>
        ) : (
          comments.map(comment => (
            <CommentItem comment={comment} isAuthenticated={isAuthenticated} key={comment.id} />
          ))
        )}
      </div>
    </section>
  )
}