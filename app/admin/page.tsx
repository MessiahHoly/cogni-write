import { getSession } from "@/lib/auth/server";
import { SignInField } from "../ui/sign-in-field";
import {
  fetchContentEngines
} from "@/lib/data/content-engine";
import {
  ArrowRight, FileText,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import CreateEngineDialog from "./ui/content-engine-dialog";
import ContentEngineDialog from "./ui/content-engine-dialog";

export default async function Page() {
  const [session,
    contentEngines] = await Promise.all([getSession(),
    fetchContentEngines()])

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

      {/* Grid Display of Content Engines */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {contentEngines?.map((engine) => (
          <Card key={engine.id} className="hover:shadow-md transition-shadow flex flex-col justify-between">
            <CardHeader className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono bg-muted px-2 py-1 rounded text-muted-foreground">
                  /{engine.slug}
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
                <FileText className="h-4 w-4 text-primary" />
                {/* Adjust according to whether your fetch relation count is loaded */}
                {engine.articles?.length || 0} Articles
              </span>
              <Button asChild variant="ghost" size="sm" className="gap-1">
                <Link href={`/${engine.slug}`}>
                  Workspace <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}