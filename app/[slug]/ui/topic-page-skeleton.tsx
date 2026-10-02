import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function TopicPageSkeleton() {
  return (
    <div className="w-full space-y-6 animate-pulse">
      {/* Header section matching TopicContent structure */}
      <div className="w-full border-b pb-5">
        <div className="h-9 w-64 bg-muted rounded mt-2" />
      </div>

      {/* Articles List matching exact Card dimensions */}
      <div className="w-full space-y-6">
        <div className="grid w-full gap-4">
          {[...Array(3)].map((_, index) => (
            <Card key={index} className="w-full border">
              <CardHeader className="pb-3 space-y-3">
                {/* Date placeholder */}
                <div className="h-4 w-32 bg-muted/60 rounded" />
                {/* Title placeholder */}
                <div className="h-6 w-3/4 bg-muted/80 rounded" />
              </CardHeader>
              <CardContent className="space-y-2">
                {/* Paragraph lines placeholder */}
                <div className="h-4 w-full bg-muted/40 rounded" />
                <div className="h-4 w-5/6 bg-muted/40 rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}