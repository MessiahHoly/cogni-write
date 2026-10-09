import { getSession } from "@/lib/auth/server";
import { SignInField } from "../ui/sign-in-field";
import CreateEngineDialog from "./ui/content-engine-dialog";
import { Suspense } from "react";
import ContentEngineGrid from "./ui/content-engine-grid";
import GridSkeleton from "./ui/grid-skeleton";


// 1. Dynamic Check: Evaluate session per request
// We will keep this as this is an admin dashboard. 
export const instant = false;

export default async function Page() {
  // const [session, contentEngines] = await Promise.all([getSession(), fetchContentEngines()])
  
  // 1. Dynamic Check: Evaluate session per request
  const session = await getSession()

  if (!session) {
    return (
      <main className="p-4 flex flex-col items-center justify-center min-h-screen">
        <SignInField callbackURL="/admin" showCancel={true} />
      </main>
    );
  }

  if (session.user.email !== process.env.ADMIN) {
    return (
      <main className="p-4 flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p>You do not have permission to access this page.</p>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto p-6 md:p-10 space-y-8 min-h-screen">
      {/* Dashboard Top Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-5">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Content Engines</h1>
          <p className="text-muted-foreground mt-1">Manage automated article generation workspaces by topic.</p>
        </div>
        <CreateEngineDialog />
      </div>

      {/* 2. Stream & Render Cached Data inside Suspense boundary */}
      <Suspense fallback={<GridSkeleton />}>
        <ContentEngineGrid />
      </Suspense>
    </main>
  );
}