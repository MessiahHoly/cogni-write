'use client'

import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { useActionState } from "react";
import ButtonField from "@/app/admin/ui/button-field";
import { createCommentAction } from "@/lib/actions/comment";

export default function CommentField({ articleId, commentId = null }: { articleId: string, commentId: string | null }) {
  const createCommentWithArticleIdAAndCommentId = createCommentAction.bind(null, articleId, commentId)
  const [state, action, pending] = useActionState(createCommentWithArticleIdAAndCommentId, null)

  //TODO: remove You must sign in to share a comment. message on comment feild after signning in

  return (
    <div className="w-full">
      <form action={action}>
        <FieldGroup>
          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="content">
                  Comment
                </FieldLabel>
                <Textarea
                  id="content"
                  placeholder="Share your thoughts or ask a question about this article..."
                  required
                  name="content"
                />
                {state?.error && <p className="text-sm font-medium text-destructive">{state.error.toString()}</p>}
              </Field>
            </FieldGroup>
          </FieldSet>
          <ButtonField pending={pending} showCancel={false}>{commentId ? "Reply" : "Save"}</ButtonField>
          {/* <ButtonField pending={pending} showCancel={false}>Save</ButtonField> */}
        </FieldGroup>
      </form>
    </div>
  )
}