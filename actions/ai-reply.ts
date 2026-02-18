"use server";

import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText, tool } from "ai";
import { z } from "zod";
import { saveMessage } from "./save-message";
import { getWeather } from "@/tools/weather";
import { getStockPrice } from "@/tools/stock";
import { getF1NextRace } from "@/tools/f1";
import { getMessages } from "./get-messages";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

export async function aiReply(userId: string, userMessage: string) {
  try {
    await saveMessage(userId, "user", userMessage);

    const history = await getMessages(userId);
    const formattedMessages = history.map((msg) => ({
      role: msg.role as "user" | "assistant",
      content: msg.content,
    }));

    const { text } = await generateText({
      model: google("gemini-2.5-flash"),
      system: "You are a helpful assistant. Use tools to provide real-time info on weather, stocks, and F1.",
      messages: formattedMessages,
      maxSteps: 5,
      tools: {
        getWeather: tool({
          description: "Get current weather by city name",
          parameters: z.object({
            location: z.string(),
          }),
          execute: async ({ location }) => {
            return getWeather(location);
          },
        }),
        getStockPrice: tool({
          description: "Get stock price by ticker symbol like AAPL or TSLA",
          parameters: z.object({
            symbol: z.string(),
          }),
          execute: async ({ symbol }) => {
            return getStockPrice(symbol);
          },
        }),
        getF1NextRace: tool({
          description: "Get details of the next Formula 1 race",
          parameters: z.object({}),
          execute: async () => {
            return getF1NextRace();
          },
        }),
      },
    });

    const reply = text || "I'm sorry, I couldn't generate a response.";

    await saveMessage(userId, "assistant", reply);

    return reply;
  } catch (error) {
    console.error("AI Action Error:", error);
    return "Sorry, I'm having trouble connecting right now. Please try again.";
  }
}
