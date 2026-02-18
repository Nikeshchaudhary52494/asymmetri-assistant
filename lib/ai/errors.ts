export class ApiError extends Error {
  status: number;

  constructor(message: string, status = 500) {
    super(message);
    this.status = status;
  }
}

export function normalizeError(error: unknown): ApiError {
  if (!(error instanceof Error)) {
    return new ApiError("Unexpected error");
  }

  const msg = error.message.toLowerCase();

  if (msg.includes("quota") || msg.includes("429"))
    return new ApiError("Gemini quota exhausted. Try later.", 429);

  if (msg.includes("api key") || msg.includes("401") || msg.includes("403"))
    return new ApiError("Invalid Gemini API key.", 401);

  if (msg.includes("network") || msg.includes("timeout"))
    return new ApiError("Network error contacting Gemini.", 503);

  if (msg.includes("overloaded") || msg.includes("503"))
    return new ApiError("Gemini temporarily unavailable.", 503);

  return new ApiError(error.message || "Internal server error");
}

export function toolFailure(toolName: string, error: unknown): string {
  const msg = error instanceof Error ? error.message : "Unknown error";
  console.error(`[Tool:${toolName}]`, msg);
  return `Failed to fetch ${toolName} data: ${msg}`;
}
