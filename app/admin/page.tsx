import { getSession } from "@/lib/auth/server";
import { SignInField } from "./ui/sign-in-field";
import ContentEngineField from "./ui/content-engine-field";

export default async function Page() {
  const session = await getSession()

  if (!session) {
    return (
      <main className="p-4 flex flex-col items-center justify-center min-h-screen">
        <SignInField />
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
    <main className="p-4 flex flex-col items-center justify-center min-h-screen">
      {/* <h1>Admin Page</h1>
      <p>Welcome to the admin dashboard.</p> */}
      {/* <SignInField /> */}
      <ContentEngineField />
    </main>
  );
}