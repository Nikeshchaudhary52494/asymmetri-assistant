"use server";

import { db } from "@/db";
import { messages } from "@/db/schema";
import { revalidatePath } from "next/cache";

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
  revalidatePath("/chat");
}
