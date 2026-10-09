import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchContentEngines } from "@/lib/data/content-engine"
import ContentEngineDialog from "./content-engine-dialog"
import { ArrowRight, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function ContentEngineGrid() {
  const contentEngines = await fetchContentEngines()
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {contentEngines.map((engine) => (
        <Card key={engine.id} className="hover:shadow-md transition-shadow flex flex-col justify-between">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono bg-muted px-2 py-1 rounded text-muted-foreground">
                {engine.slug}
              </span>
              <ContentEngineDialog contentEngine={engine} />
            </div>
            <CardTitle className="text-xl capitalize pt-2">{engine.topic}</CardTitle>
            <CardDescription>
              Created on {new Date(engine.createdAt).toLocaleDateString()}
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-0 flex items-center justify-between border-t mt-4 p-6 bg-muted/30">
            <span className="text-sm text-muted-foreground flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-primary" />
              {engine.articles.length || 0} Articles
            </span>
            <Button asChild variant="ghost" size="sm" className="gap-1">
              <Link href={`/${engine.slug}`}>
                Workspace <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}