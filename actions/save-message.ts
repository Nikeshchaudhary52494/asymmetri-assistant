"use server";

import { db } from "@/db";
import { messages } from "@/db/schema";

export async function saveMessage(
  userId: string,
  role: string,
  content: string,
) {
  await db.insert(messages).values({
    userId,
    role,
    content,
  });
}
