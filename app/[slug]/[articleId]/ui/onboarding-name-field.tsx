import ButtonField from "@/app/admin/ui/button-field";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { updateUserName } from "@/lib/actions/user";
import { useActionState } from "react";

export default function OnboardingNameField() {
  const [state, action, pending] = useActionState(updateUserName, null)

  return (
    <div className="border border-primary/20 rounded-xl p-6 bg-primary/5 space-y-4">
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-foreground">One last step!</h3>
        <p className="text-sm text-muted-foreground">
          Please enter a display name to use for your comments.
        </p>
      </div>

      <form action={action}>
        <FieldGroup className="space-y-4">
          <Field>
            <FieldLabel htmlFor="onboard-name">Display Name</FieldLabel>
            <Input id="onboard-name" name="name" required disabled={pending} />
            {state?.error && (
              <p className="text-xs font-medium text-destructive mt-1">{state.error}</p>
            )}
          </Field>
          <ButtonField pending={pending} showCancel={false} pendingText="Saving name...">
            Save and Continue
          </ButtonField>
        </FieldGroup>
      </form>
    </div>
  )
}