"use client";

import { KeyRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AuthSession,
  readStoredSession,
  requestJson,
  saveSession
} from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (readStoredSession()) {
      router.replace("/dashboard");
    }
  }, [router]);

  const submitLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    setStatus("submitting");

    try {
      const session = await requestJson<AuthSession>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
      });

      saveSession(session);
      router.push("/dashboard");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to login");
    } finally {
      setStatus("idle");
    }
  };

  return (
    <main className="grid min-h-svh place-items-center bg-muted/40 px-4 py-8 text-foreground">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto flex size-11 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <KeyRound className="size-5" />
          </div>
          <div className="space-y-2">
            <Badge className="mx-auto" variant="secondary">
              Portfolio Admin
            </Badge>
            <CardTitle className="text-2xl">Đăng nhập</CardTitle>
            <CardDescription>Nhập tài khoản để vào dashboard.</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={submitLogin}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                minLength={5}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                minLength={6}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            {message ? <Alert variant="destructive">{message}</Alert> : null}

            <Button className="w-full" disabled={status === "submitting"} type="submit">
              {status === "submitting" ? "Đang xử lý..." : "Đăng nhập"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
