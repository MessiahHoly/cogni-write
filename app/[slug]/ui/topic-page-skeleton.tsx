export default function TopicPageSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-10 w-64 bg-muted rounded border-b pb-5" />
      <div className="grid gap-4">
        <div className="h-32 bg-muted/50 rounded-xl" />
        <div className="h-40 bg-muted/50 rounded-xl" />
      </div>
    </div>
  )
}