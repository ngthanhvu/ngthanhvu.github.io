"use client";

import {
  ChevronLeft,
  ChevronRight,
  Home,
  LayoutDashboard,
  Link2,
  LogOut,
  Menu,
  UserRound
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

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
import { AuthSession, clearSession, readStoredSession, requestJson } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const navigationItems = [
  { label: "Overview", icon: LayoutDashboard, href: "/admin/dashboard", active: true },
  { label: "Short URL", icon: Link2, href: "/admin/url", active: false },
  { label: "Profile", icon: UserRound, href: "/admin/profile", active: false }
];

const frontendRoutes = [
  { method: "GET", path: "/", source: "frontend/app/page.tsx" },
  { method: "GET", path: "/login", source: "frontend/app/login/page.tsx" },
  { method: "GET", path: "/admin/dashboard", source: "frontend/app/admin/dashboard/page.tsx" },
  { method: "GET", path: "/admin/url", source: "frontend/app/admin/url/page.tsx" },
  { method: "GET", path: "/admin/profile", source: "frontend/app/admin/profile/page.tsx" },
  { method: "GET", path: "/2fa", source: "frontend/app/2fa/page.tsx" }
];

const backendRoutes = [
  { method: "GET", path: "/health", source: "backend/src/app.ts" },
  { method: "GET", path: "/api/hello", source: "backend/src/app.ts" },
  { method: "POST", path: "/api/auth/register", source: "backend/src/routes/auth.routes.ts" },
  { method: "POST", path: "/api/auth/login", source: "backend/src/routes/auth.routes.ts" },
  { method: "POST", path: "/api/auth/forgot-password", source: "backend/src/routes/auth.routes.ts" },
  { method: "POST", path: "/api/auth/reset-password", source: "backend/src/routes/auth.routes.ts" },
  { method: "GET", path: "/api/urls", source: "backend/src/routes/short-url.routes.ts" },
  { method: "POST", path: "/api/urls", source: "backend/src/routes/short-url.routes.ts" },
  { method: "GET", path: "/u/:code", source: "backend/src/app.ts" }
];

export default function DashboardPage() {
  const router = useRouter();
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [apiHealth, setApiHealth] = useState<"unknown" | "online" | "offline">("unknown");
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
              <p className="text-sm text-muted-foreground">Dashboard</p>
              <h1 className="text-base font-semibold leading-6 sm:text-lg">Xin chào, {session.user.fullName}</h1>
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
            <Card>
              <CardHeader>
                <CardTitle>Routes</CardTitle>
                <CardDescription>Thống kê route của frontend và backend.</CardDescription>
              </CardHeader>
              <CardContent className="grid items-start gap-4 p-4 pt-0 sm:p-5 sm:pt-0 xl:grid-cols-2">
                <RouteTable title="Frontend routes" rows={frontendRoutes} />
                <RouteTable title="Backend routes" rows={backendRoutes} />
              </CardContent>
            </Card>
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

function RouteTable({
  title,
  rows
}: {
  title: string;
  rows: Array<{ method: string; path: string; source: string }>;
}) {
  const pageSize = 10;
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const visibleRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return rows.slice(start, start + pageSize);
  }, [currentPage, rows]);

  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-xs text-muted-foreground">
          {rows.length} routes, page {currentPage} of {totalPages}
        </p>
      </div>
      <div className="grid gap-3 md:hidden">
        {visibleRows.map((route) => (
          <div key={`${route.method}-${route.path}`} className="rounded-lg border p-3">
            <div className="flex items-center justify-between gap-3">
              <Badge variant="secondary">{route.method}</Badge>
              <span className="text-xs text-muted-foreground">
                {currentPage}/{totalPages}
              </span>
            </div>
            <p className="mt-3 break-all font-mono text-xs">{route.path}</p>
            <p className="mt-2 break-all text-xs text-muted-foreground">{route.source}</p>
          </div>
        ))}
        {visibleRows.length === 0 ? (
          <div className="rounded-lg border px-4 py-6 text-center text-sm text-muted-foreground">No routes</div>
        ) : null}
      </div>
      <div className="hidden overflow-hidden rounded-lg border md:block">
        <table className="w-full table-fixed border-collapse text-sm">
          <thead className="bg-muted/60 text-left">
            <tr>
              <th className="w-[18%] px-4 py-3 font-medium">Method</th>
              <th className="w-[32%] px-4 py-3 font-medium">Path</th>
              <th className="w-[50%] px-4 py-3 font-medium">Source</th>
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((route) => (
              <tr key={`${route.method}-${route.path}`} className="border-t">
                <td className="px-4 py-3 font-medium">{route.method}</td>
                <td className="break-all px-4 py-3 font-mono text-xs">{route.path}</td>
                <td className="break-all px-4 py-3 text-muted-foreground">{route.source}</td>
              </tr>
            ))}
            {visibleRows.length === 0 ? (
              <tr className="border-t">
                <td className="px-4 py-6 text-center text-sm text-muted-foreground" colSpan={3}>
                  No routes
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between gap-3">
        <Button
          className="min-w-0 flex-1 sm:flex-none"
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setPage((current) => Math.max(1, current - 1))}
          disabled={currentPage <= 1}
        >
          <ChevronLeft className="size-4" />
          Prev
        </Button>
        <Button
          className="min-w-0 flex-1 sm:flex-none"
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
          disabled={currentPage >= totalPages}
        >
          Next
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
