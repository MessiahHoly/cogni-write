import { getSession } from "@/lib/auth/server";
import { SignInField } from "./ui/sign-in-field";

export default async function Page() {
  const session = await getSession()

  if (!session) {
    return (
      <main className="prose p-4">
        <h1>Admin Page</h1>
        <p>You must be signed in to view this page.</p>
        <SignInField />
      </main>
    );
  }

  return (
    <main className="prose p-4">
      <h1>Admin Page</h1>
      <p>Welcome to the admin dashboard.</p>
      {/* <SignInField /> */}
    </main>
  );
}