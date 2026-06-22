'use client'

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { ContentEngine } from "@/generated/prisma/client";
import { createOrUpdateContentEngine } from "@/lib/actions/content-engine";
import Link from "next/link";
import { useActionState } from "react";
import ButtonField from "./button-field";

export default function ContentEngineField({ contentEngine }: { contentEngine: ContentEngine | null }) {
  const [state, action, pending] = useActionState(createOrUpdateContentEngine, null)

  if (state?.success) return (
    <div className="flex flex-col gap-10">
      <p>Topic updated successfully.</p>
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
          <ButtonField children="Save" pending={pending} />
        </FieldGroup>
      </form>
    </div>
  )
}