import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { fetchContentEngineAndArticlesBySlug } from "@/lib/data/content-engine";
import { ArrowLeft, Calendar } from "lucide-react";
import Link from "next/link";
// import { notFound } from "next/navigation";
import { Suspense } from "react";
import TopicPageSkeleton from "./ui/topic-page-skeleton";
import TopicContent from "./ui/topic-content";

// export const instant = false;

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  // const { slug } = await params
  // const contentEngine = await fetchContentEngineAndArticlesBySlug(slug)

  // if (!contentEngine) {
  //   return notFound()
  // }

  return (
    <main className="max-w-4xl mx-auto p-6 md:p-10 space-y-8 min-h-screen">
      {/* <main className="max-w-5xl mx-auto p-6 md:p-10 space-y-8 min-h-screen"> */}
      {/* <div className="space-y-4"> */}
      <Button asChild variant="ghost" size="sm" className="gap-2 -ml-2 text-muted-foreground">
        <Link href="/">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </Button>

      <Suspense fallback={<TopicPageSkeleton />}>
        <TopicContent params={params} />
      </Suspense>

      {/* <div className="border-b pb-5">
        <h1 className="text-3xl font-extrabold tracking-tight capitalize mt-2">
          {contentEngine.topic}
        </h1>
      </div> */}

      
      {/* </div> */}
    </main>
  );
}