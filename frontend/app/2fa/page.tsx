"use client";

import { Check, Clock3, Copy, KeyRound } from "lucide-react";
import { type FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { generateTotp, getTotpRemainingSeconds, parseTotpSecret } from "@/lib/totp";

export default function TwoFactorPage() {
  const [secretInput, setSecretInput] = useState("");
  const [secret, setSecret] = useState("");
  const [code, setCode] = useState("");
  const [remainingSeconds, setRemainingSeconds] = useState(30);
  const [error, setError] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (!secret) {
      return;
    }

    let active = true;

    const update = async () => {
      try {
        const nextCode = await generateTotp(secret);
        if (!active) {
          return;
        }

        setCode(nextCode);
        setRemainingSeconds(getTotpRemainingSeconds());
        setError("");
      } catch (nextError) {
        if (!active) {
          return;
        }

        setCode("");
        setError(nextError instanceof Error ? nextError.message : "Unable to generate code");
      }
    };

    update();
    const timer = window.setInterval(() => {
      void update();
    }, 1000);

    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [secret]);

  const submitSecret = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const normalized = parseTotpSecret(secretInput);
      setSecret(normalized);
      setCode("");
      setRemainingSeconds(30);
      setError("");
      toast.success("Đã tạo mã 2FA", {
        description: "Mã sẽ tự cập nhật mỗi 30 giây."
      });
    } catch (nextError) {
      setSecret("");
      setCode("");
      setError(nextError instanceof Error ? nextError.message : "Invalid secret");
      toast.error("Không hợp lệ", {
        description: nextError instanceof Error ? nextError.message : "Invalid secret"
      });
    }
  };

  const copyCode = async () => {
    if (!code) {
      return;
    }

    await navigator.clipboard.writeText(code);
    setIsCopied(true);
    toast.success("Đã sao chép mã 2FA");
    window.setTimeout(() => setIsCopied(false), 1500);
  };

  const resetSecret = () => {
    setSecretInput("");
    setSecret("");
    setCode("");
    setRemainingSeconds(30);
    setError("");
  };

  return (
    <main className="min-h-svh bg-muted/40 px-4 py-6 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100svh-3rem)] w-full max-w-2xl place-items-center">
        <Card className="w-full max-w-xl">
          <CardHeader>
            <Badge className="w-fit" variant="secondary">
              2FA Tool
            </Badge>
            <CardTitle className="text-2xl">Tạo mã 2FA</CardTitle>
            <CardDescription>
              Nhập secret base32 hoặc `otpauth://` URI để xem mã TOTP hiện tại.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form className="space-y-3" onSubmit={submitSecret}>
              <div className="space-y-2">
                <Label htmlFor="secret">Secret</Label>
                <Input
                  id="secret"
                  value={secretInput}
                  onChange={(event) => setSecretInput(event.target.value)}
                  placeholder="JBSWY3DPEHPK3PXP hoặc otpauth://..."
                  spellCheck={false}
                  required
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <Button type="submit">
                  <KeyRound className="size-4" />
                  Tạo mã
                </Button>
                <Button type="button" variant="outline" onClick={resetSecret}>
                  Xoá
                </Button>
              </div>
            </form>

            {error ? (
              <Alert variant="destructive">
                <AlertTitle>Không thể tạo mã</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : null}

            <div className="rounded-xl border bg-background p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-normal text-muted-foreground">
                    Current code
                  </p>
                  <p className="mt-2 font-mono text-4xl font-semibold tracking-[0.2em]">
                    {code ? code : "------"}
                  </p>
                  <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock3 className="size-4" />
                    {remainingSeconds}s remaining
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={copyCode}
                  disabled={!code}
                >
                  {isCopied ? <Check className="size-4" /> : <Copy className="size-4" />}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
