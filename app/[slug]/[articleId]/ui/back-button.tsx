'use client'

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BackButton({ fallbackHref, fallbackLabel }: { fallbackHref: string, fallbackLabel: string }) {
  // export default function BackButton({ fallbackHref, fallbackLabel }: { fallbackHref: string, fallbackLabel: string }) {
  const { back } = useRouter();

  const handleBack = () => {
    // Check if there is history in the current session to go back to
    if (window.history.length > 1) {
      back();
    } else {
      // If no history, navigate to the fallback URL
      window.location.href = fallbackHref;
    }
  }

  return (
    <Button variant="ghost" size="sm" className="gap-2 -ml-2 text-muted-foreground" onClick={handleBack}>
      <ArrowLeft className="w-4 h-4" />
      <span>{fallbackLabel}</span>
    </Button>
  )
}