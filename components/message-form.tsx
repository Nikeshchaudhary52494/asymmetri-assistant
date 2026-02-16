"use client";

import { useState } from "react";
import { saveMessage } from "@/actions/save-message";

export function MessageForm({ userId }: { userId: string }) {
  const [text, setText] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!text.trim()) return;

    await saveMessage(userId, "user", text);
    setText("");

    // reload to show new message
    window.location.reload();
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message..."
        className="border px-3 py-2 rounded w-full"
      />
      <button className="border px-4 py-2 rounded">Send</button>
    </form>
  );
}
