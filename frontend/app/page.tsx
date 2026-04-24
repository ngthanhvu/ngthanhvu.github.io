"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { readStoredSession } from "@/lib/auth-client";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace(readStoredSession() ? "/dashboard" : "/login");
  }, [router]);

  return null;
}
