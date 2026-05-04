"use client";

import type { LucideIcon } from "lucide-react";
import {
  Activity,
  Copy,
  Home,
  LayoutDashboard,
  Link2,
  Loader2,
  LogOut,
  Menu,
  MousePointerClick,
  UserRound
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AuthSession, clearSession, readStoredSession, requestJson } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

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

const navigationItems = [
  { label: "Tổng quan", icon: LayoutDashboard, href: "/admin/dashboard", active: false },
  { label: "Short URL", icon: Link2, href: "/admin/url", active: true },
  { label: "Hồ sơ", icon: UserRound, href: "/admin/profile", active: false }
];

export default function UrlPage() {
  const router = useRouter();
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [apiHealth, setApiHealth] = useState<"unknown" | "online" | "offline">("unknown");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [originalUrl, setOriginalUrl] = useState("");
  const [codeMode, setCodeMode] = useState<CodeMode>("random");
  const [customCode, setCustomCode] = useState("");
  const [shortUrls, setShortUrls] = useState<ShortUrlRecord[]>([]);
  const [createdShortUrl, setCreatedShortUrl] = useState<ShortUrlRecord | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isLoadingUrls, setIsLoadingUrls] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const storedSession = readStoredSession();

      if (!storedSession) {
        router.replace("/login");
        return;
      }

      setSession(storedSession);
      setIsCheckingSession(false);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [router]);

  useEffect(() => {
    requestJson<{ ok: boolean }>("/health")
      .then(() => setApiHealth("online"))
      .catch(() => setApiHealth("offline"));
  }, []);

  useEffect(() => {
    if (!session) {
      return;
    }

    const timer = window.setTimeout(() => {
      setIsLoadingUrls(true);
      requestJson<{ data: ShortUrlRecord[] }>("/api/urls")
        .then((response) => setShortUrls(response.data))
        .catch((error: Error) => toast.error(error.message))
        .finally(() => setIsLoadingUrls(false));
    }, 0);

    return () => window.clearTimeout(timer);
  }, [session]);

  const totalClicks = useMemo(
    () => shortUrls.reduce((total, item) => total + item.accessCount, 0),
    [shortUrls]
  );

  const logout = () => {
    clearSession();
    setSession(null);
    setShowLogoutConfirm(false);
    router.replace("/login");
  };

  const createShortUrl = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsCreating(true);

    try {
      const result = await requestJson<ShortUrlRecord>("/api/urls", {
        method: "POST",
        body: JSON.stringify({
          originalUrl,
          customCode: codeMode === "custom" ? customCode : undefined
        })
      });

      setCreatedShortUrl(result);
      setShortUrls((current) => [result, ...current]);
      setOriginalUrl("");
      setCustomCode("");
      toast.success("Đã tạo short URL");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không thể tạo short URL");
    } finally {
      setIsCreating(false);
    }
  };

  const copyUrl = async (value: string) => {
    await navigator.clipboard.writeText(value);
    toast.success("Đã copy link");
  };

  if (isCheckingSession || !session) {
    return null;
  }

  return (
    <main className="min-h-svh bg-background text-foreground">
      <div className="grid min-h-svh lg:grid-cols-[260px_1fr]">
        <aside className="sticky top-0 hidden h-svh border-r bg-sidebar text-sidebar-foreground lg:flex lg:flex-col">
          <SidebarContent session={session} apiHealth={apiHealth} logout={() => setShowLogoutConfirm(true)} />
        </aside>

        <section className="flex min-w-0 flex-col">
          <header className="sticky top-0 z-10 flex min-h-16 items-center gap-3 border-b bg-background/95 px-4 py-3 backdrop-blur sm:px-6">
            <Button
              className="lg:hidden"
              size="icon"
              variant="ghost"
              type="button"
              onClick={() => setIsMobileSidebarOpen(true)}
            >
              <Menu className="size-5" />
            </Button>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-muted-foreground">Rút gọn link</p>
              <h1 className="text-base font-semibold leading-6 sm:text-lg">Short Url</h1>
            </div>
            <Badge className="shrink-0" variant={apiHealth === "online" ? "default" : "secondary"}>
              {apiHealth === "online" ? "API online" : "API offline"}
            </Badge>
          </header>

          {isMobileSidebarOpen ? (
            <div
              className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm lg:hidden"
              onClick={() => setIsMobileSidebarOpen(false)}
            >
              <aside
                className="h-full w-[min(320px,86vw)] border-r bg-sidebar p-4 text-sidebar-foreground shadow-xl"
                onClick={(event) => event.stopPropagation()}
              >
                <SidebarContent
                  session={session}
                  apiHealth={apiHealth}
                  logout={() => setShowLogoutConfirm(true)}
                />
              </aside>
            </div>
          ) : null}

          <div className="flex-1 space-y-4 p-4 sm:space-y-6 sm:p-6">
            <section className="grid items-start gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <StatCard title="Link đã tạo" value={`${shortUrls.length}`} icon={Link2} />
              <StatCard title="Tổng lượt truy cập" value={`${totalClicks}`} icon={MousePointerClick} />
              <StatCard title="Backend" value={apiHealth === "online" ? "Ổn định" : "Không khả dụng"} icon={Activity} />
            </section>

            <section className="grid items-start gap-4 xl:grid-cols-[0.9fr_1.1fr]">
              <Card>
                <CardHeader>
                  <CardTitle>Tạo short URL</CardTitle>
                  <CardDescription>Nhập URL đầy đủ gồm http:// hoặc https://.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4" onSubmit={createShortUrl}>
                    <Input
                      type="url"
                      placeholder="https://example.com/bai-viet-rat-dai"
                      value={originalUrl}
                      onChange={(event) => setOriginalUrl(event.target.value)}
                      required
                    />
                    <div className="grid gap-3">
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
                          Tuỳ chỉnh
                        </Button>
                      </div>

                      {codeMode === "custom" ? (
                        <div className="space-y-2">
                          <Input
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

                  {createdShortUrl ? (
                    <div className="mt-5 rounded-lg border bg-muted/40 p-4">
                      <p className="text-xs font-medium uppercase tracking-normal text-muted-foreground">Link mới tạo</p>
                      <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                        <code className="min-w-0 flex-1 break-all rounded-md border bg-background px-3 py-2 text-sm">
                          {createdShortUrl.shortUrl}
                        </code>
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full sm:w-auto"
                          onClick={() => copyUrl(createdShortUrl.shortUrl)}
                        >
                          <Copy className="size-4" />
                          Copy
                        </Button>
                      </div>
                    </div>
                  ) : null}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Lịch sử short URL</CardTitle>
                  <CardDescription>100 link gần nhất và số lần redirect đến URL gốc.</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingUrls ? (
                    <div className="flex items-center gap-2 py-8 text-sm text-muted-foreground">
                      <Loader2 className="size-4 animate-spin" />
                      Đang tải lịch sử
                    </div>
                  ) : (
                    <>
                      <div className="grid gap-3 md:hidden">
                        {shortUrls.map((item) => (
                          <ShortUrlMobileItem key={item.id} item={item} copyUrl={copyUrl} />
                        ))}
                        {shortUrls.length === 0 ? (
                          <div className="rounded-lg border px-4 py-8 text-center text-sm text-muted-foreground">
                            Chưa có short URL nào
                          </div>
                        ) : null}
                      </div>

                      <div className="hidden overflow-hidden rounded-lg border md:block">
                        <table className="w-full table-fixed border-collapse text-sm">
                          <thead className="bg-muted/60 text-center">
                            <tr>
                              <th className="w-[31%] px-4 py-3 font-medium">Short URL</th>
                              <th className="w-[34%] px-4 py-3 font-medium">URL gốc</th>
                              <th className="w-[11%] px-4 py-3 font-medium">Clicks</th>
                              <th className="w-[16%] px-4 py-3 font-medium">Tạo lúc</th>
                              <th className="w-[8%] px-4 py-3 font-medium">Copy</th>
                            </tr>
                          </thead>
                          <tbody>
                            {shortUrls.map((item) => (
                              <tr key={item.id} className="border-t text-center align-middle">
                                <td className="px-4 py-3 align-middle">
                                  <button
                                    type="button"
                                    className="mx-auto block max-w-full truncate font-mono text-xs underline-offset-4 hover:underline"
                                    title={item.shortUrl}
                                    onClick={() => copyUrl(item.shortUrl)}
                                  >
                                    {item.shortUrl}
                                  </button>
                                </td>
                                <td className="px-4 py-3 align-middle text-muted-foreground">
                                  <span className="mx-auto block max-w-full truncate" title={item.originalUrl}>
                                    {item.originalUrl}
                                  </span>
                                </td>
                                <td className="px-4 py-3 align-middle font-medium">{item.accessCount}</td>
                                <td className="px-4 py-3 align-middle text-muted-foreground">{formatDate(item.createdAt)}</td>
                                <td className="px-4 py-3 align-middle">
                                  <Button
                                    type="button"
                                    size="icon"
                                    variant="ghost"
                                    className="mx-auto"
                                    aria-label="Copy short URL"
                                    onClick={() => copyUrl(item.shortUrl)}
                                  >
                                    <Copy className="size-4" />
                                  </Button>
                                </td>
                              </tr>
                            ))}
                            {shortUrls.length === 0 ? (
                              <tr className="border-t">
                                <td className="px-4 py-8 text-center text-sm text-muted-foreground" colSpan={5}>
                                  Chưa có short URL nào
                                </td>
                              </tr>
                            ) : null}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </section>
          </div>
        </section>
      </div>

      <AlertDialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận đăng xuất</AlertDialogTitle>
            <AlertDialogDescription>Phiên đăng nhập hiện tại sẽ bị xoá khỏi trình duyệt.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Huỷ</AlertDialogCancel>
            <AlertDialogAction className={buttonDestructiveClassName} onClick={logout}>
              Đăng xuất
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}

const buttonDestructiveClassName =
  "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20";

function SidebarContent({
  session,
  apiHealth,
  logout,
  compact = false
}: {
  session: AuthSession;
  apiHealth: "unknown" | "online" | "offline";
  logout: () => void;
  compact?: boolean;
}) {
  return (
    <div className={cn("flex h-full flex-col gap-4", compact ? "" : "p-4")}>
      <div className="flex items-center gap-3 px-2">
        <div className="flex size-9 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
          <Home className="size-4" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">Portfolio Admin</p>
          <p className="truncate text-xs text-muted-foreground">{session.user.email}</p>
        </div>
      </div>

      <nav className="grid gap-1">
        {navigationItems.map((item) => {
          const Icon = item.icon;

          return (
            <Button
              key={item.label}
              asChild
              variant="ghost"
              className={cn(
                "justify-start gap-3 px-3 text-sm font-medium text-sidebar-foreground/75 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                item.active && "bg-sidebar-accent text-sidebar-accent-foreground"
              )}
            >
              <Link href={item.href}>
                <Icon className="size-4" />
                {item.label}
              </Link>
            </Button>
          );
        })}
      </nav>

      <div className="mt-auto grid gap-3 px-2">
        <div className="rounded-lg border bg-background p-3">
          <p className="text-xs font-medium text-muted-foreground">API status</p>
          <p className="mt-1 text-sm font-semibold">{apiHealth === "online" ? "Online" : "Offline"}</p>
        </div>
        <Button className="w-full justify-start" variant="outline" type="button" onClick={logout}>
          <LogOut className="size-4" />
          Đăng xuất
        </Button>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon: Icon
}: {
  title: string;
  value: string;
  icon: LucideIcon;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4 p-4 sm:p-6">
        <div className="min-w-0">
          <CardDescription>{title}</CardDescription>
          <CardTitle className="mt-2 text-xl sm:text-2xl">{value}</CardTitle>
        </div>
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
          <Icon className="size-5 text-muted-foreground" />
        </div>
      </CardHeader>
    </Card>
  );
}

function ShortUrlMobileItem({
  item,
  copyUrl
}: {
  item: ShortUrlRecord;
  copyUrl: (value: string) => void;
}) {
  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-start gap-3">
        <button
          type="button"
          className="min-w-0 flex-1 break-all text-left font-mono text-xs leading-5 underline-offset-4 hover:underline"
          onClick={() => copyUrl(item.shortUrl)}
        >
          {item.shortUrl}
        </button>
        <Button
          type="button"
          size="icon"
          variant="outline"
          className="shrink-0"
          aria-label="Copy short URL"
          onClick={() => copyUrl(item.shortUrl)}
        >
          <Copy className="size-4" />
        </Button>
      </div>

      <p className="mt-3 break-all text-sm text-muted-foreground">{item.originalUrl}</p>
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-md bg-muted px-3 py-2">
          <p className="text-xs text-muted-foreground">Clicks</p>
          <p className="mt-1 font-semibold">{item.accessCount}</p>
        </div>
        <div className="rounded-md bg-muted px-3 py-2">
          <p className="text-xs text-muted-foreground">Tạo lúc</p>
          <p className="mt-1 font-semibold">{formatDate(item.createdAt)}</p>
        </div>
      </div>
    </div>
  );
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "short",
    timeStyle: "short"
  }).format(date);
}
