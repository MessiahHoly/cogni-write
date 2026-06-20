'use client'

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { ContentEngine } from "@/generated/prisma/client";
import { createContentEngine } from "@/lib/actions/content-engine";
import { useActionState } from "react";

export default function ContentEngineField({ contentEngine }: { contentEngine: ContentEngine | null }) {
  const [state, action, pending] = useActionState(createContentEngine, null)

  return (
    <div className="w-full max-w-md">
      <form action={action}>
        <FieldGroup>
          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="topic">
                  Topic
                </FieldLabel>
                <Textarea
                  id="topic"
                  placeholder="Enter a topic for your AI-generated posts..."
                  required
                  defaultValue={contentEngine?.topic}
                  name="topic"
                />
              </Field>
            </FieldGroup>
          </FieldSet>
          <Field orientation="horizontal">
            {pending ? (
              <Button type="submit" disabled>
                <Spinner data-icon="inline-start" />
                Saving...
              </Button>
            ) : (
              <Button type="submit">Save</Button>
            )}
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  )
}