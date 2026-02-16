"use client";

import { useState, useTransition } from "react";
import { aiReply } from "@/actions/ai-reply";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function MessageForm({ userId }: { userId: string }) {
  const [text, setText] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() || isPending) return;

    const currentText = text;
    setText("");

    startTransition(async () => {
      try {
        await aiReply(userId, currentText);
      } catch (error) {
        console.error("Failed to send message:", error);
        setText(currentText);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message..."
        disabled={isPending}
        className="flex-1"
      />
      <Button type="submit" disabled={isPending || !text.trim()}>
        {isPending ? "Thinking..." : "Send"}
      </Button>
    </form>
  );
}
