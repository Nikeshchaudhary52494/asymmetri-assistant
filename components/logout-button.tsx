"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export function LogoutButton() {
  const [loading, setLoading] = useState(false);

  return (
    <Button
      variant="outline"
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        await signOut({ callbackUrl: "/" });
      }}
      className="gap-2"
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      Logout
    </Button>
  );
}
