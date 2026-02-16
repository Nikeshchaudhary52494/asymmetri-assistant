"use server";

import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { saveMessage } from "./save-message";
import { getMessages } from "./get-messages";

export async function aiReply(userId: string, userMessage: string) {
  await saveMessage(userId, "user", userMessage);

  const history = await getMessages(userId);
  const messages = history.map((msg) => ({
    role: msg.role as "user" | "assistant",
    content: msg.content,
  }));

  const result = await generateText({
    model: google("gemini-3-flash-preview"),
    messages: messages,
  });

  const reply = result.text;

  await saveMessage(userId, "assistant", reply);

  return reply;
}
