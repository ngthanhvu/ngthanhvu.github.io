"use client";

import { Check, Clock3, Copy, KeyRound } from "lucide-react";
import { type FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";

import { PublicShell } from "@/components/public-shell";
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
        setError(nextError instanceof Error ? nextError.message : "Không thể tạo mã");
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
      setError(nextError instanceof Error ? nextError.message : "Secret không hợp lệ");
      toast.error("Không hợp lệ", {
        description: nextError instanceof Error ? nextError.message : "Secret không hợp lệ"
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
    <PublicShell eyebrow="Tiện ích" title="2FA Generator">
      <div className="grid w-full items-start gap-4 xl:grid-cols-[0.85fr_1.15fr]">
        <Card>
          <CardHeader>
            <Badge className="w-fit" variant="secondary">
              2FA Tool
            </Badge>
            <CardTitle className="text-xl sm:text-2xl">Tạo mã 2FA</CardTitle>
            <CardDescription>Nhập secret base32 hoặc otpauth:// URI để xem mã TOTP hiện tại.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <form className="space-y-4" onSubmit={submitSecret}>
              <div className="space-y-2">
                <Label htmlFor="secret">Secret</Label>
                <Input
                  id="secret"
                  className="h-11"
                  value={secretInput}
                  onChange={(event) => setSecretInput(event.target.value)}
                  placeholder="JBSWY3DPEHPK3PXP hoặc otpauth://..."
                  spellCheck={false}
                  required
                />
              </div>

              <div className="grid gap-2 sm:flex sm:flex-wrap">
                <Button type="submit" className="w-full sm:w-auto">
                  <KeyRound className="size-4" />
                  Tạo mã
                </Button>
                <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={resetSecret}>
                  Xóa
                </Button>
              </div>
            </form>

            {error ? (
              <Alert variant="destructive">
                <AlertTitle>Không thể tạo mã</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mã hiện tại</CardTitle>
            <CardDescription>Mã tự cập nhật theo chu kỳ 30 giây khi secret hợp lệ.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border bg-muted/40 p-5 sm:p-8">
              <p className="text-xs font-medium uppercase tracking-normal text-muted-foreground">Mã TOTP</p>
              <p className="mt-4 break-all font-mono text-5xl font-semibold tracking-[0.12em] sm:text-6xl lg:text-7xl">
                {code ? code : "------"}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
              <div className="rounded-lg border p-4">
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock3 className="size-4" />
                  Thời gian còn lại
                </p>
                <p className="mt-2 text-2xl font-semibold">{remainingSeconds} giây</p>
              </div>
              <Button
                type="button"
                variant="outline"
                className="h-14 w-full sm:w-14"
                size="icon"
                onClick={copyCode}
                disabled={!code}
                aria-label="Copy 2FA code"
              >
                {isCopied ? <Check className="size-5" /> : <Copy className="size-5" />}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 xl:col-span-2 md:grid-cols-3">
          <InfoCard title="Không cần đăng nhập" description="Công cụ chạy trực tiếp trên trình duyệt người dùng." />
          <InfoCard title="Secret linh hoạt" description="Hỗ trợ cả base32 secret và otpauth URI." />
          <InfoCard title="Copy nhanh" description="Sao chép mã hiện tại ngay khi mã được tạo." />
        </div>
      </div>
    </PublicShell>
  );
}

function InfoCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <p className="text-sm font-medium">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
