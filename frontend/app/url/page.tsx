"use client";

import { Check, Copy, Link2, Loader2 } from "lucide-react";
import { type FormEvent, useState } from "react";
import { toast } from "sonner";

import { PublicShell } from "@/components/public-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requestJson } from "@/lib/auth-client";

interface ShortUrlRecord {
  id: number;
  code: string;
  originalUrl: string;
  shortUrl: string;
  accessCount: number;
  createdAt: string;
  updatedAt: string;
  lastAccessedAt: string | null;
}

type CodeMode = "random" | "custom";

export default function PublicUrlPage() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [codeMode, setCodeMode] = useState<CodeMode>("random");
  const [customCode, setCustomCode] = useState("");
  const [createdShortUrl, setCreatedShortUrl] = useState<ShortUrlRecord | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const createShortUrl = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsCreating(true);
    setIsCopied(false);

    try {
      const result = await requestJson<ShortUrlRecord>("/api/urls", {
        method: "POST",
        body: JSON.stringify({
          originalUrl,
          customCode: codeMode === "custom" ? customCode : undefined
        })
      });

      setCreatedShortUrl(result);
      setOriginalUrl("");
      setCustomCode("");
      toast.success("Đã tạo short URL");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không thể tạo short URL");
    } finally {
      setIsCreating(false);
    }
  };

  const copyUrl = async () => {
    if (!createdShortUrl) {
      return;
    }

    await navigator.clipboard.writeText(createdShortUrl.shortUrl);
    setIsCopied(true);
    toast.success("Đã copy link");
    window.setTimeout(() => setIsCopied(false), 1500);
  };

  return (
    <PublicShell eyebrow="Tiện ích" title="Short URL">
      <div className="grid w-full items-start gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Rút gọn liên kết</CardTitle>
            <CardDescription>Nhập URL đầy đủ gồm http:// hoặc https:// để tạo link ngắn.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-5" onSubmit={createShortUrl}>
              <div className="space-y-2">
                <Label htmlFor="originalUrl">URL gốc</Label>
                <Input
                  id="originalUrl"
                  className="h-11"
                  type="url"
                  placeholder="https://example.com/bai-viet-rat-dai"
                  value={originalUrl}
                  onChange={(event) => setOriginalUrl(event.target.value)}
                  required
                />
              </div>

              <div className="space-y-3">
                <div className="grid w-full grid-cols-2 rounded-lg border bg-muted p-1 sm:w-fit">
                  <Button
                    type="button"
                    variant={codeMode === "random" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setCodeMode("random")}
                  >
                    Ngẫu nhiên
                  </Button>
                  <Button
                    type="button"
                    variant={codeMode === "custom" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setCodeMode("custom")}
                  >
                    Tùy chỉnh
                  </Button>
                </div>

                {codeMode === "custom" ? (
                  <div className="space-y-2">
                    <Label htmlFor="customCode">Mã tùy chỉnh</Label>
                    <Input
                      id="customCode"
                      type="text"
                      placeholder="vd: khuyen-mai-2026"
                      value={customCode}
                      onChange={(event) => setCustomCode(event.target.value)}
                      minLength={3}
                      maxLength={32}
                      pattern="[a-zA-Z0-9_-]{3,32}"
                      required
                    />
                    <p className="text-xs leading-5 text-muted-foreground">
                      Chỉ dùng chữ không dấu, số, dấu gạch ngang hoặc gạch dưới, từ 3 đến 32 ký tự.
                    </p>
                  </div>
                ) : null}
              </div>

              <Button type="submit" disabled={isCreating} className="w-full sm:w-auto">
                {isCreating ? <Loader2 className="size-4 animate-spin" /> : <Link2 className="size-4" />}
                Tạo link
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Link vừa tạo</CardTitle>
            <CardDescription>Copy link ngắn và chia sẻ ngay sau khi tạo thành công.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-lg border bg-muted/40 p-5 sm:p-8">
              <p className="text-xs font-medium uppercase tracking-normal text-muted-foreground">Short URL</p>
              <p className="mt-4 break-all font-mono text-xl font-semibold sm:text-2xl">
                {createdShortUrl ? createdShortUrl.shortUrl : "Chưa có link"}
              </p>
              {createdShortUrl ? (
                <p className="mt-4 break-all text-sm text-muted-foreground">{createdShortUrl.originalUrl}</p>
              ) : null}
            </div>

            <Button
              type="button"
              variant="outline"
              className="h-12 w-full sm:w-fit"
              onClick={copyUrl}
              disabled={!createdShortUrl}
            >
              {isCopied ? <Check className="size-4" /> : <Copy className="size-4" />}
              Copy link
            </Button>
          </CardContent>
        </Card>
      </div>
    </PublicShell>
  );
}
