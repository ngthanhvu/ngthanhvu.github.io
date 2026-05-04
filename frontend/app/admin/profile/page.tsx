"use client";

import type { LucideIcon } from "lucide-react";
import {
  Activity,
  BarChart3,
  Database,
  Home,
  LayoutDashboard,
  Link2,
  LogOut,
  Menu,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AuthSession,
  clearSession,
  readStoredSession,
  requestJson,
} from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const navigationItems = [
  {
    label: "Tổng quan",
    icon: LayoutDashboard,
    href: "/admin/dashboard",
    active: false,
  },
  { label: "Short URL", icon: Link2, href: "/admin/url", active: false },
  { label: "Hồ sơ", icon: UserRound, href: "/admin/profile", active: true },
];

export default function ProfilePage() {
  const router = useRouter();
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [apiHealth, setApiHealth] = useState<"unknown" | "online" | "offline">(
    "unknown",
  );
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

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

  const logout = () => {
    clearSession();
    setSession(null);
    setShowLogoutConfirm(false);
    router.replace("/login");
  };

  if (isCheckingSession || !session) {
    return null;
  }

  return (
    <main className="min-h-svh bg-background text-foreground">
      <div className="grid min-h-svh lg:grid-cols-[260px_1fr]">
        <aside className="sticky top-0 hidden h-svh border-r bg-sidebar text-sidebar-foreground lg:flex lg:flex-col">
          <SidebarContent
            session={session}
            apiHealth={apiHealth}
            logout={() => setShowLogoutConfirm(true)}
          />
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
              <p className="text-sm text-muted-foreground">Hồ sơ</p>
              <h1 className="text-base font-semibold leading-6 sm:text-lg">
                Hồ sơ của {session.user.fullName}
              </h1>
            </div>
            <Badge
              className="shrink-0"
              variant={apiHealth === "online" ? "default" : "secondary"}
            >
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
              <StatCard
                title="User ID"
                value={`#${session.user.id}`}
                icon={UserRound}
              />
              <StatCard
                title="Trạng thái"
                value="Đã đăng nhập"
                icon={ShieldCheck}
              />
              <StatCard
                title="Backend"
                value={apiHealth === "online" ? "Ổn định" : "Không khả dụng"}
                icon={Activity}
              />
            </section>

            <section className="grid items-start gap-4 xl:grid-cols-[1.15fr_0.85fr]">
              <Card>
                <CardHeader>
                  <CardTitle>Hồ sơ</CardTitle>
                  <CardDescription>
                    Thông tin user được trả về từ backend.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3 p-4 pt-0 sm:grid-cols-2 sm:p-5 sm:pt-0">
                  <InfoRow label="Họ tên" value={session.user.fullName} />
                  <InfoRow label="Email" value={session.user.email} />
                  <InfoRow
                    label="Ngày tạo"
                    value={formatDate(session.user.createdAt)}
                  />
                  <InfoRow
                    label="Cập nhật"
                    value={formatDate(session.user.updatedAt)}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Access token</CardTitle>
                  <CardDescription>
                    Token hiện được lưu trong localStorage.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0 sm:p-5 sm:pt-0">
                  <code className="block break-all rounded-lg border bg-muted p-3 text-xs leading-6 text-muted-foreground">
                    {maskToken(session.token)}
                  </code>
                </CardContent>
              </Card>
            </section>

            <Card>
              <CardHeader>
                <CardTitle>Hoạt động gần đây</CardTitle>
                <CardDescription>
                  Những trạng thái chính liên quan đến phiên đăng nhập.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 p-4 pt-0 sm:p-5 sm:pt-0">
                <ActivityRow
                  icon={BarChart3}
                  title="Dashboard updated"
                  description="Dashboard hiện tập trung vào thống kê route."
                />
                <ActivityRow
                  icon={Database}
                  title="Profile loaded"
                  description="Thông tin hồ sơ đang được lấy từ session backend trả về."
                />
                <ActivityRow
                  icon={ShieldCheck}
                  title="Session active"
                  description="Phiên đăng nhập vẫn được lưu trong localStorage."
                />
              </CardContent>
            </Card>
          </div>
        </section>
      </div>

      <AlertDialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận đăng xuất</AlertDialogTitle>
            <AlertDialogDescription>
              Phiên đăng nhập hiện tại sẽ bị xoá khỏi trình duyệt.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Huỷ</AlertDialogCancel>
            <AlertDialogAction
              className={buttonDestructiveClassName}
              onClick={logout}
            >
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
  compact = false,
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
          <p className="truncate text-xs text-muted-foreground">
            {session.user.email}
          </p>
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
                item.active &&
                "bg-sidebar-accent text-sidebar-accent-foreground",
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
          <p className="text-xs font-medium text-muted-foreground">
            API status
          </p>
          <p className="mt-1 text-sm font-semibold">
            {apiHealth === "online" ? "Online" : "Offline"}
          </p>
        </div>
        <Button
          className="w-full justify-start"
          variant="outline"
          type="button"
          onClick={logout}
        >
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
  icon: Icon,
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

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-muted/40 p-3">
      <p className="text-xs font-medium uppercase tracking-normal text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 break-words text-sm font-medium">{value}</p>
    </div>
  );
}

function ActivityRow({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-3 rounded-lg border p-3">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
        <Icon className="size-4 text-muted-foreground" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium">{title}</p>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

function maskToken(token: string) {
  return `${token.slice(0, 18)}...${token.slice(-10)}`;
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}
