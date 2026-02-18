import { streamText } from "ai";

import { google } from "@/lib/ai/client";
import { tools } from "@/lib/ai/tools";
import { normalizeError } from "@/lib/ai/errors";
import { requireUser, validateMessage } from "@/lib/ai/helpers";

import { saveMessage } from "@/actions/save-message";
import { getMessages } from "@/actions/get-messages";

export async function POST(req: Request) {
  try {
    const userId = await requireUser();
    const body = await req.json().catch(() => ({}));
    const message = validateMessage(body);

    await saveMessage(userId, "user", message);

    const history = await getMessages(userId);

    const result = streamText({
      model: google("gemini-2.5-flash"),
      system:
        "You are a helpful assistant. Use tools for weather, stock, and F1 info.",
      messages: history.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
      tools,
      maxSteps: 5,
      onFinish: async ({ text }) => {
        if (text) await saveMessage(userId, "assistant", text);
      },
    });

    return result.toDataStreamResponse({
      getErrorMessage: (e) => normalizeError(e).message,
    });
  } catch (error) {
    const err = normalizeError(error);

    return new Response(JSON.stringify({ error: err.message }), {
      status: err.status,
      headers: { "Content-Type": "application/json" },
    });
  }
}
