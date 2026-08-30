import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Prisma } from "@/generated/prisma/client";
import { MessageSquare } from "lucide-react";
import Link from "next/link";

export default function CommentCard({ comment }: {
  comment: Prisma.CommentGetPayload<{
    include: { article: { include: { contentEngine: true } }, user: { select: { name: true } } }
  }>
}) {
  const { article, id, user, createdAt, content } = comment
  // Direct link to article page where comment was posted
  //TODO: implemenet hash link to comment in article page
  const targetUrl = `/${article.contentEngine.slug}/${article.id}#comment-${id}`
  return (
    <Card className="bg-muted/20 border-dashed shadow-none">
      <CardHeader className="p-5 pb-2 space-y-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <Badge variant="secondary" className="gap-1 font-normal">
            <MessageSquare className="w-3 h-3" /> {user.name}
          </Badge>
          <span>
            {new Date(createdAt).toLocaleDateString(undefined, {
              year: 'numeric', month: 'short', day: 'numeric'
            })}
          </span>
        </div>
        <CardTitle className="text-sm font-semibold hover:underline">
          <Link href={targetUrl}>
            Re: {article.topic}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5 pt-0">
        <p className="text-sm text-foreground italic line-clamp-3 leading-relaxed">
          "{content}"
        </p>
      </CardContent>
    </Card>
  )
}