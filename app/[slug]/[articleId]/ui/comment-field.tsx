'use client'

import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { useActionState } from "react";
import ButtonField from "@/app/admin/ui/button-field";
import { createCommentAction } from "@/lib/actions/comment";

export default function CommentField({
  articleId, commentId = null, placeholder = "Share your thoughts or ask a question about this article...", label = "Comment", onSuccess }: {
    articleId: string, commentId: string | null, placeholder?: string, label?: string, onSuccess?: () => void
  }) {
  const createCommentWithArticleIdAndCommentId = createCommentAction.bind(null, articleId, commentId)
  const [state, action, pending] = useActionState(createCommentWithArticleIdAndCommentId, null)

  return (
    <div className="w-full">
      <form action={action}>
        <FieldGroup>
          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="content">
                  {label}
                </FieldLabel>
                <Textarea
                  id="content"
                  placeholder={placeholder}
                  required
                  name="content"
                />
                {state?.error && <p className="text-sm font-medium text-destructive">{state.error.toString()}</p>}
              </Field>
            </FieldGroup>
          </FieldSet>
          <ButtonField pending={pending} showCancel={false}>{commentId ? "Reply" : "Save"}</ButtonField>
        </FieldGroup>
      </form>
    </div>
  )
}