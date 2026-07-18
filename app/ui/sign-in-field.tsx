'use client'

import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth/auth-client"
import { SubmitEvent, useState } from "react" // Fixed import
import ButtonField from "../admin/ui/button-field"

export function SignInField({ callbackURL }: { callbackURL: string }) {
  const [email, setEmail] = useState("")
  const [magicLinkSent, setMagicLinkSent] = useState(false)
  const [signingIn, setSigningIn] = useState(false)
  const [error, setError] = useState<{
    code?: string;
    message?: string;
    status: number;
    statusText: string;
  } | null>(null)

  console.log(callbackURL)

  // Changed SubmitEvent to React.FormEvent
  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSigningIn(true)
    setError(null) // CRITICAL: Clear previous error before a new attempt

    const { data, error: fetchError } = await authClient.signIn.magicLink({
      email,
      callbackURL,
      // callbackURL: `/admin`,
    })

    if (fetchError) {
      setError(fetchError)
    } else if (data) {
      setMagicLinkSent(true)
    }

    setSigningIn(false)
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
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  placeholder="you@example.com"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (error) setError(null) // OPTIONAL UX: Clear error when user type fixes it
                  }}
                  type="email"
                  // Accessibility anchor
                  aria-describedby={error ? "email-error" : undefined}
                  aria-invalid={!!error}
                />

                {/* Fixed fallback condition and added id for accessibility */}
                {error && (
                  <p id="email-error" className="text-sm font-medium text-destructive">
                    {error.message || `An error occurred (${error.status})`}
                  </p>
                )}
              </Field>
            </FieldGroup>
          </FieldSet>
          {/* Note: changed children prop usage to standard React children mapping */}
          <ButtonField pending={signingIn} pendingText="Signing in...">
            Sign in
          </ButtonField>
        </FieldGroup>
      </form>
    </div>
  )
}
