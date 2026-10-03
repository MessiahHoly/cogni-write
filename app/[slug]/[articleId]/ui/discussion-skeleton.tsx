import { MessageSquare } from "lucide-react";

export default function DiscussionSkeleton(){
  return (
    <section id="discussion" className="space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-muted-foreground/40" />
        <div className="w-40 h-7 bg-muted/60 rounded-md" />
      </div>

      {/* Auth / Input Box Skeleton */}
      <div className="border border-dashed rounded-xl p-6 bg-muted/10 space-y-4">
        <div className="h-4 w-48 bg-muted/60 rounded" />
        <div className="h-20 w-full bg-muted/40 rounded-lg" />
        <div className="flex justify-end">
          <div className="h-9 w-24 bg-muted/60 rounded-md" />
        </div>
      </div>

      {/* Comment List Skeletons */}
      <div className="space-y-6">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="flex gap-4 border rounded-xl p-4 bg-card/50">
            {/* Avatar Skeleton */}
            <div className="h-10 w-10 bg-muted/60 rounded-full shrink-0" />

            <div className="flex-1 space-y-3">
              {/* User Meta Row */}
              <div className="flex items-center gap-2">
                <div className="h-4 w-28 bg-muted/60 rounded" />
                <div className="h-3 w-16 bg-muted/40 rounded" />
              </div>

              {/* Comment Content Lines */}
              <div className="space-y-2">
                <div className="h-4 w-11/12 bg-muted/40 rounded" />
                <div className="h-4 w-3/4 bg-muted/40 rounded" />
              </div>
            </div>

            {/* Actions / Reply Link Skeleton */}
            <div className="pt-1 flex gap-4">
              <div className="h-3 w-12 bg-muted/40 rounded" />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}