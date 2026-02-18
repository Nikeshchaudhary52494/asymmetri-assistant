import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/logout-button";
import { getMessages } from "@/actions/get-messages";
import { ChatWindow } from "@/components/chat-window";

export default async function ChatPage() {
  const session = await auth();
  if (!session) redirect("/");

  const userId = session.user?.email;
  if (!userId) redirect("/");

  const history = await getMessages(userId);

  return (
    <main className="h-screen flex flex-col max-w-5xl mx-auto px-4 py-4">
      <header className="flex justify-between items-center mb-4 shrink-0">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
          Asymmetri <span className="text-blue-600">AI</span>
        </h1>
        <LogoutButton />
      </header>

      <ChatWindow userId={userId} initialMessages={history} />
    </main>
  );
}
