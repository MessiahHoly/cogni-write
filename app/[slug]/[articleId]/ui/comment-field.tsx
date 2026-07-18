'use client'

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { useActionState } from "react";
import { createComment } from "@/lib/actions/comment";
import ButtonField from "@/app/admin/ui/button-field";

export default function CommentField({ articleId }: { articleId: string }) {
  const createCommentWithArticleId = createComment.bind(null, articleId)
  const [state, action, pending] = useActionState(createCommentWithArticleId, null)

  // if (state?.success) return (
  //   <div className="flex flex-col gap-10">
  //     <p>Comment created successfully.</p>
  //     <Button className="w-min">
  //       Okay
  //     </Button>
  //   </div>
  // )

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
          <ButtonField children="Save" pending={pending} />
        </FieldGroup>
      </form>
    </div>
  )
}