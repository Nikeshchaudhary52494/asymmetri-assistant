"use client";

import { Button } from "@/components/ui/button";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Github, Loader2 } from "lucide-react";
import Image from "next/image";

export default function Home() {
  const { status } = useSession();
  const router = useRouter();
  const [providerLoading, setProviderLoading] = useState<string | null>(null);

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/chat");
    }
  }, [status, router]);

  const handleSignIn = async (provider: "github" | "google") => {
    setProviderLoading(provider);
    await signIn(provider, { callbackUrl: "/chat" });
  };

  if (status === "loading") {
    return (
      <main className="flex h-screen items-center justify-center bg-slate-50 dark:bg-zinc-950">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </main>
    );
  }

  return (
    <main className="flex h-screen flex-col items-center justify-center gap-8 bg-slate-50 dark:bg-zinc-950">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
          Asymmetri <span className="text-blue-600">AI</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium">
          Your intelligent assistant for seamless conversations.
        </p>
      </div>

      <div className="w-full max-w-sm p-8 sm:bg-white dark:bg-zinc-900 rounded-3xl sm:shadow-2xl sm:border sm:border-slate-100 dark:border-zinc-800 flex flex-col gap-4">
        <Button
          size="lg"
          variant="outline"
          onClick={() => handleSignIn("google")}
          disabled={providerLoading !== null}
          className="w-full gap-3 py-6 border-slate-200 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all active:scale-95"
        >
          {providerLoading === "google" ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Image
              src="/googleIcon.png"
              alt="Google"
              width={20}
              height={20}
              className="object-contain"
            />
          )}
          Continue with Google
        </Button>

        <Button
          size="lg"
          onClick={() => handleSignIn("github")}
          disabled={providerLoading !== null}
          className="w-full gap-3 bg-slate-900 hover:bg-slate-800 text-white dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 py-6 transition-all active:scale-95"
        >
          {providerLoading === "github" ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Github className="h-5 w-5" />
          )}
          Continue with GitHub
        </Button>

        <div className="relative mt-2">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-100 dark:border-zinc-800" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="sm:bg-white dark:bg-zinc-900 px-2 text-slate-400">
              Secure Authentication
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
