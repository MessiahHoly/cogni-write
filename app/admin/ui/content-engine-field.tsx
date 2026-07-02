'use client'

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { ContentEngine } from "@/generated/prisma/client";
// import Link from "next/link";
import { useActionState } from "react";
import ButtonField from "./button-field";
import { createContentEngine } from "@/lib/actions/content-engine";

//TODO: update nextjs

export default function ContentEngineField({ contentEngine, onSuccess }: { contentEngine: ContentEngine | null; onSuccess: () => void }) {
  const [state, action, pending] = useActionState(createContentEngine, null)

  if (state?.success) return (
    <div className="flex flex-col gap-10">
      <p>Topic created successfully.</p>
      <Button className="w-min" onClick={onSuccess}>
        Okay
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