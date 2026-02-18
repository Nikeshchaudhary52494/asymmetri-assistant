"use client";

import { useChat } from "ai/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";

type InitialMessage = {
  id: string;
  role: string;
  content: string;
};

export function ChatWindow({
  userId,
  initialMessages,
}: {
  userId: string;
  initialMessages: InitialMessage[];
}) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: "/api/chat",
      initialMessages: initialMessages.map((m) => ({
        id: m.id,
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
      onFinish: () => inputRef.current?.focus(),
    });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    handleSubmit(e, { body: { message: input } });
  };

  return (
    <div className="flex flex-col flex-1 bg-muted/30 rounded-xl overflow-hidden">
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.length === 0 && (
          <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
            Start chatting with Asymmetri AI! Ask me anything or share your
            thoughts.
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[70%] rounded-lg px-4 py-2 text-sm whitespace-pre-wrap shadow-sm ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-background border"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Loader2 className="w-4 h-4 animate-spin" />
              Thinking…
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleFormSubmit} className="p-4 bg-background border-t">
        <div className="flex gap-2 max-w-5xl mx-auto">
          <Input
            ref={inputRef}
            value={input}
            onChange={handleInputChange}
            placeholder="Type a message..."
            disabled={isLoading}
            className="flex-1"
          />

          <Button type="submit" disabled={isLoading || !input.trim()}>
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send"}
          </Button>
        </div>
      </form>
    </div>
  );
}
