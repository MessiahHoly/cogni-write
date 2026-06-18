'use client'

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth/auth-client"
import { SubmitEvent, useState } from "react"

export function SignInField() {
  const [email, setEmail] = useState("")
  const [magicLinkSent, setMagicLinkSent] = useState(false)

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    const { data, error } = await authClient.signIn.magicLink({
      email,
      callbackURL: `/admin`,
    })
    if (data) {
      setMagicLinkSent(true)
    }
  }

  if (magicLinkSent) {
    return (
      <div className="w-full max-w-md">
        <p className="text-sm text-muted-foreground">
          A magic link has been sent to your email. Please check your inbox.
        </p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit}>
        <FieldGroup>
          <FieldSet>
            {/* <FieldLegend>Sign in</FieldLegend> */}
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">
                  Email
                </FieldLabel>
                <Input
                  id="email"
                  placeholder="you@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                />
              </Field>
            </FieldGroup>
          </FieldSet>
          <Field orientation="horizontal">
            <Button type="submit">Sign in</Button>
            {/* <Button type="submit">Sign in</Button> */}
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  )
}
