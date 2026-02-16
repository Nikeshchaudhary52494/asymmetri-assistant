"use server";

import { db } from "@/db";
import { messages } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getMessages(userId: string) {
  return db.select().from(messages).where(eq(messages.userId, userId));
}
