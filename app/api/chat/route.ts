import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText, tool } from "ai";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { saveMessage } from "@/actions/save-message";
import { getMessages } from "@/actions/get-messages";
import { getWeather } from "@/tools/weather";
import { getStockPrice } from "@/tools/stock";
import { getF1NextRace } from "@/tools/f1";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return new Response("Unauthorized", { status: 401 });
  }

  const userId = session.user.email;
  const { message } = await req.json();

  await saveMessage(userId, "user", message);

  const history = await getMessages(userId);
  const formattedMessages = history.map((msg) => ({
    role: msg.role as "user" | "assistant",
    content: msg.content,
  }));

  const result = streamText({
    model: google("gemini-2.5-flash"),
    system: "You are a helpful assistant. Use tools to provide real-time info on weather, stocks, and F1.",
    messages: formattedMessages,
    maxSteps: 5,
    tools: {
      getWeather: tool({
        description: "Get current weather by city name",
        parameters: z.object({ location: z.string() }),
        execute: async ({ location }) => getWeather(location),
      }),
      getStockPrice: tool({
        description: "Get stock price by ticker symbol like AAPL or TSLA",
        parameters: z.object({ symbol: z.string() }),
        execute: async ({ symbol }) => getStockPrice(symbol),
      }),
      getF1NextRace: tool({
        description: "Get details of the next Formula 1 race",
        parameters: z.object({}),
        execute: async () => getF1NextRace(),
      }),
    },
    async onFinish({ text }) {
      await saveMessage(userId, "assistant", text || "");
    },
  });

  return result.toDataStreamResponse();
}