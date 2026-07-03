'use client'

import { useState } from "react"
import { PlusCircle, Settings2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import ContentEngineField from "./content-engine-field"
import { ContentEngine } from "@/generated/prisma/browser"

type ContentEngineDialogProps = {
  contentEngine?: ContentEngine | null
}

export default function ContentEngineDialog({ contentEngine }: ContentEngineDialogProps) {
  const [open, setOpen] = useState(false)
  const isUpdateMode = !!contentEngine

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isUpdateMode ? (
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
            <Settings2 className="h-4 w-4" />
            <span className="sr-only">Edit Content Engine</span>
          </Button>
        ) : (
          <Button className="sm:w-auto w-full flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            Create New Engine
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>{isUpdateMode ? "Update Content Engine" : "Create Content Engine"}</DialogTitle>
          <DialogDescription>
            {isUpdateMode
              ? "Update the settings of your content engine. Changes will affect future article generation."
              : "Add a main topic workspace. The engine will run fallback logic to generate relevant articles."}
          </DialogDescription>
        </DialogHeader>

        <div className="pt-4">
          <ContentEngineField contentEngine={contentEngine} onSuccess={() => setOpen(false)} />
        </div>
      </DialogContent>
    </Dialog>
  )
}