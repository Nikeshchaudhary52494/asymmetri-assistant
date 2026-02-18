"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import { aiReply } from "@/actions/ai-reply";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Message = {
  id: string;
  role: string;
  content: string;
};

export function ChatWindow({
  userId,

  initialMessages,
}: {
  userId: string;

  initialMessages: Message[];
}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  const [text, setText] = useState("");

  const [isPending, startTransition] = useTransition();

  const bottomRef = useRef<HTMLDivElement>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isPending]);

  useEffect(() => {
    if (!isPending) inputRef.current?.focus();
  }, [isPending]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!text.trim() || isPending) return;

    const currentText = text;

    setText("");

    const optimisticUser: Message = {
      id: crypto.randomUUID(),

      role: "user",

      content: currentText,
    };

    setMessages((prev) => [...prev, optimisticUser]);

    startTransition(async () => {
      try {
        const reply = await aiReply(userId, currentText);

        const assistantMsg: Message = {
          id: crypto.randomUUID(),

          role: "assistant",

          content: reply,
        };

        setMessages((prev) => [...prev, assistantMsg]);
      } catch (error) {
        console.error("Failed to send message:", error);

        setMessages((prev) => prev.filter((m) => m.id !== optimisticUser.id));

        setText(currentText);
      }
    });
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-1">
        {messages.length === 0 && (
          <p className="text-muted-foreground text-sm">
            No messages yet. Ask about weather, stocks, or F1!
          </p>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`rounded-lg px-4 py-2 max-w-[75%] text-sm whitespace-pre-wrap ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {isPending && (
          <div className="flex justify-start">
            <div className="rounded-lg px-4 py-2 bg-muted text-foreground text-sm">
              <span className="animate-pulse">Thinking...</span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Ask about weather, stocks, F1..."
          disabled={isPending}
          className="flex-1"
        />

        <Button type="submit" disabled={isPending || !text.trim()}>
          {isPending ? "Thinking..." : "Send"}
        </Button>
      </form>
    </div>
  );
}
