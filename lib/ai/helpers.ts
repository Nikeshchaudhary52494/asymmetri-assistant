import { auth } from "@/lib/auth";
import { ApiError } from "./errors";

export async function requireUser() {
  const session = await auth();
  const email = session?.user?.email;

  if (!email) throw new ApiError("Unauthorized", 401);
  return email;
}

export function validateMessage(body: any): string {
  const message = body?.message?.trim();
  if (!message) throw new ApiError("Invalid message", 400);
  return message;
}
