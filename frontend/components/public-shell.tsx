"use client";

import { Home, KeyRound, Link2, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const publicNavigationItems = [
  { label: "Trang chủ", icon: Home, href: "/" },
  { label: "2FA", icon: KeyRound, href: "/2fa" },
  { label: "Short URL", icon: Link2, href: "/url" }
];

export function PublicShell({
  eyebrow,
  title,
  children
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    document.title = `${title} | Portfolio Tools`;
  }, [title]);

  return (
    <main className="min-h-svh bg-background text-foreground">
      <div className="grid min-h-svh lg:grid-cols-[240px_1fr]">
        <aside className="sticky top-0 hidden h-svh border-r bg-sidebar text-sidebar-foreground lg:flex lg:flex-col">
          <PublicSidebar pathname={pathname} />
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
            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">{eyebrow}</p>
              <h1 className="text-base font-semibold leading-6 sm:text-lg">{title}</h1>
            </div>
          </header>

          {isMobileSidebarOpen ? (
            <div
              className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm lg:hidden"
              onClick={() => setIsMobileSidebarOpen(false)}
            >
              <aside
                className="h-full w-[min(300px,86vw)] border-r bg-sidebar p-4 text-sidebar-foreground shadow-xl"
                onClick={(event) => event.stopPropagation()}
              >
                <PublicSidebar compact pathname={pathname} />
              </aside>
            </div>
          ) : null}

          <div className="flex-1 p-4 sm:p-6">{children}</div>
        </section>
      </div>
    </main>
  );
}

function PublicSidebar({
  compact = false,
  pathname
}: {
  compact?: boolean;
  pathname: string;
}) {
  return (
    <div className={cn("flex h-full flex-col gap-4", compact ? "" : "p-4")}>
      <div className="flex items-center gap-3 px-2">
        <div className="flex size-9 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
          <Home className="size-4" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">Portfolio Tools</p>
          <p className="truncate text-xs text-muted-foreground">Công cụ tiện ích</p>
        </div>
      </div>

      <nav className="grid gap-1">
        {publicNavigationItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Button
              key={item.href}
              asChild
              variant="ghost"
              className={cn(
                "justify-start gap-3 px-3 text-sm font-medium text-sidebar-foreground/75 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                active && "bg-sidebar-accent text-sidebar-accent-foreground"
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
    </div>
  );
}
