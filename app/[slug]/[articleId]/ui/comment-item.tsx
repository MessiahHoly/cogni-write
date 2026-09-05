'use client';

import { Button } from "@/components/ui/button";
// import { Prisma } from "@/generated/prisma/client";
import { MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";
import CommentField from "./comment-field";
import { CommentNode } from "@/lib/schemas/comment";

export default function CommentItem({ comment, isAuthenticated }: { comment: CommentNode, isAuthenticated: boolean }) {
  const [isReplying, setIsReplying] = useState(false);
  const [isTargeted, setIsTargeted] = useState(false);

  useEffect(() => {
    const checkHash = () => {
      const currentHash = window.location.hash.replace('#', '');
      setIsTargeted(currentHash === comment.id);
    };

    // Check the initial hash when the component mounts
    checkHash();

    // Listen for hash changes
    window.addEventListener('hashchange', checkHash);

    // Cleanup the event listener on unmount
    return () => {
      window.removeEventListener('hashchange', checkHash);
    };
  }, [comment.id]);

  return (
    <div
      className={`space-y-4 border-b pb-6 last:border-0 last:pb-0 scroll-mt-20 transition-all rounded-lg
         ${isTargeted ? 'bg-accent p-3 ring-2 ringbg-primary/50' : 'target:bg-accent target:p-3'}`}
      // className="space-y-4 border-b pb-6 last:border-0 last:pb-0 scroll-mt-20 transition-colors duration-500 target:bg-accent target:p-3 target:rounded-lg"
      // className="space-y-4 border-b pb-6 last:border-0 last:pb-0 scroll-mt-20 transition-colors duration-500 target:bg-primary/10 target:p-3 target:rounded-lg"
      id={comment.id}>
        
      {/* Top Level Comment */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm">{comment.user.name}</span>
          <span className="text-xs text-muted-foreground">
            {new Date(comment.createdAt).toLocaleString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>

        <p className="text-foreground/90 text-sm whitespace-pre-wrap">{comment.content}</p>

        {isAuthenticated && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsReplying(!isReplying)}
            className="h-7 px-2 text-xs text-muted-foreground gap-1.5 mt-1"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Reply
          </Button>
        )}
      </div>

      {/* Inline Reply Form */}
      {isReplying && (
        <div className="ml-6 pl-4 border-l-2 border-muted space-y-2">
          <CommentField
            articleId={comment.articleId}
            commentId={comment.id}
            placeholder={`Replying to ${comment.user.name}...`}
            label=""
            onSuccess={() => setIsReplying(false)}
          />
        </div>
      )}

      {/* Render Nested Replies */}
      {comment.comments.length > 0 && (
        <div className="ml-6 pl-4 border-l-2 border-muted space-y-4 pt-2">
          {comment.comments.map(childComment => (
            <CommentItem key={childComment.id} comment={childComment} isAuthenticated={isAuthenticated} />
          ))}
        </div>
      )}
    </div>
  )
}