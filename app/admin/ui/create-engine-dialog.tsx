'use client'

import { useState } from "react"
import { PlusCircle } from "lucide-react"
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

export default function CreateEngineDialog() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="sm:w-auto w-full flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          Create New Engine
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Content Engine</DialogTitle>
          <DialogDescription>
            Add a main topic workspace. The engine will run fallback logic to generate relevant articles.
          </DialogDescription>
        </DialogHeader>
        
        <div className="pt-4">
          {/* Reusing your component, passing null for clean creation */}
          <ContentEngineField contentEngine={null} />
        </div>
      </DialogContent>
    </Dialog>
  )
}