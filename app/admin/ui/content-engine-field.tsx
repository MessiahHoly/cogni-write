'use client'

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { ContentEngine } from "@/generated/prisma/client";
import { createContentEngine } from "@/lib/actions/content-engine";
import Link from "next/link";
import { useActionState } from "react";

export default function ContentEngineField({ contentEngine }: { contentEngine: ContentEngine | null }) {
  const [state, action, pending] = useActionState(createContentEngine, null)

  if (state?.success) return (
    <div className="flex flex-col gap-10">
      <p>The topic updated successfully.</p>
      <Button asChild className="w-min">
        <Link href='/'>
          Okay
        </Link>
      </Button>
    </div>
  )

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
                {state?.error && <p className="text-sm font-medium text-destructive">{state.error.toString()}</p>}
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