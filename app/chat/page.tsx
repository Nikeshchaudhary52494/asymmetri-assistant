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
    <div className="flex flex-col h-screen p-4 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Chat</h1>
        <LogoutButton />
      </div>
      <ChatWindow userId={userId} initialMessages={history} />
    </div>
  );
}
