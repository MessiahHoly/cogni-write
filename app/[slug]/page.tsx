import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import TopicPageSkeleton from "./ui/topic-page-skeleton";
import TopicContent from "./ui/topic-content";


export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <main className="max-w-4xl mx-auto p-6 md:p-10 space-y-8 min-h-screen">
      <Button asChild variant="ghost" size="sm" className="gap-2 -ml-2 text-muted-foreground">
        <Link href="/">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </Button>

      <Suspense fallback={<TopicPageSkeleton />}>
        <TopicContent params={params} />
      </Suspense>
    </main>
  );
}