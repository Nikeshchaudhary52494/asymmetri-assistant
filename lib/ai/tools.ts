import { tool } from "ai";
import { z } from "zod";

import { getWeather } from "@/tools/weather";
import { getStockPrice } from "@/tools/stock";
import { getF1NextRace } from "@/tools/f1";
import { toolFailure } from "./errors";

export const tools = {
  weather: tool({
    description: "Get current weather for a city",
    parameters: z.object({ location: z.string() }),
    execute: async ({ location }) => {
      try {
        return await getWeather(location);
      } catch (e) {
        return toolFailure("weather", e);
      }
    },
  }),

  stock: tool({
    description: "Get stock price by ticker",
    parameters: z.object({ symbol: z.string() }),
    execute: async ({ symbol }) => {
      try {
        return await getStockPrice(symbol);
      } catch (e) {
        return toolFailure("stock", e);
      }
    },
  }),

  f1: tool({
    description: "Next Formula 1 race info",
    parameters: z.object({}),
    execute: async () => {
      try {
        return await getF1NextRace();
      } catch (e) {
        return toolFailure("f1", e);
      }
    },
  }),
};
