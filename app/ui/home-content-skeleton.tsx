export default function HomeContentSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-32 bg-muted rounded" />
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="h-40 bg-muted/50 rounded-xl" />
        <div className="h-40 bg-muted/50 rounded-xl" />
      </div>
    </div>
  )
 }
