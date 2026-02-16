import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/logout-button";

export default async function ChatPage() {
  const session = await auth();

  if (!session) redirect("/");

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Welcome to the protected chat page</h1>
        <LogoutButton />
      </div>
      <div>
        {/* Chat interface will go here */}
        <p>Logged in as: {session.user?.email}</p>
      </div>
    </div>
  );
}
