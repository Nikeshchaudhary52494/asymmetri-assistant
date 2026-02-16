import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/logout-button";
import { getMessages } from "@/actions/get-messages";
import { MessageForm } from "@/components/message-form";

export default async function ChatPage() {
  const session = await auth();

  if (!session) redirect("/");

  const userId = session.user?.email;
  if (!userId) redirect("/");
  const history = await getMessages(userId);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">
          Welcome to the protected chat page
        </h1>
        <LogoutButton />
      </div>
      <div>
        {history.length === 0 && <p>No messages yet.</p>}
        {history.map((msg) => (
          <div key={msg.id}>
            <b>{msg.role}:</b> {msg.content}
          </div>
        ))}
      </div>

      <MessageForm userId={userId} />
    </div>
  );
}
