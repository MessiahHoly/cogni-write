import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

interface ButtonFieldProps {
  pending: boolean;
  children: ReactNode;
  pendingText?: string;
  showCancel: boolean;
  onCancel?: () => void;
}

export default function ButtonField({
  pending,
  children,
  pendingText = "Saving...",
  onCancel,
  showCancel
}: ButtonFieldProps) {
  const router = useRouter();

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.back();
    }
  };

  return (
    <Field orientation="horizontal">
      <Button type="submit" disabled={pending}>
        {pending && <Spinner data-icon="inline-start" />}
        {pending ? pendingText : children}
      </Button>

      {showCancel && (
        <Button
          variant="outline"
          type="button"
          disabled={pending}
          onClick={handleCancel}
        >
          Cancel
        </Button>
      )}
    </Field>
  );
}
