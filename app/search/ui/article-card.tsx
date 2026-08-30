import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Prisma } from "@/generated/prisma/client"
import { Calendar, FileText } from "lucide-react"
import Link from "next/link"

export default function ArticleCard({ article }: {
  article: Prisma.ArticleGetPayload<{
    include: { contentEngine: { select: { slug: true } } }
  }>
}) {
  const { contentEngine, createdAt, topic, content, id } = article
  const articleUrl = `${contentEngine.slug}/${id}`

  return (
    <Card className="hover:border-primary/40 transition-all shadow-none hover:shadow-sm">
      <CardHeader className="p-5 pb-2 space-y-2">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="gap-1 font-normal text-xs text-primary border-primary/20 bg-primary/5">
            <FileText className="w-3 h-3" /> Article
          </Badge>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Calendar className="w-3 h-3" /> {new Date(createdAt).toLocaleDateString(undefined, {
              year: 'numeric', month: 'short', day: 'numeric'
            })}
          </span>
        </div>
        <CardTitle className="text-xl font-bold tracking-tight hover:text-primary transition-colors">
          <Link href={articleUrl}>
            {topic}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5 pt-0">
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {content}
        </p>
      </CardContent>
    </Card>
  )
}