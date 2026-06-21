import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

interface ButtonFieldProps {
  pending: boolean;
  children: ReactNode;
  pendingText?: string;
}

export default function ButtonField({
  pending,
  children,
  pendingText = "Saving..."
}: ButtonFieldProps) {
  const router = useRouter();

  return (
    <Field orientation="horizontal">
      <Button type="submit" disabled={pending}>
        {pending && <Spinner data-icon="inline-start" />}
        {pending ? pendingText : children}
      </Button>

      <Button 
        variant="outline" 
        type="button" 
        disabled={pending} 
        onClick={() => router.back()}
      >
        Cancel
      </Button>
    </Field>
  );
}
