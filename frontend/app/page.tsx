"use client";

import { Clock3, FileText, KeyRound, Link2 } from "lucide-react";
import Link from "next/link";

import { PublicShell } from "@/components/public-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const toolCards = [
  {
    title: "2FA Generator",
    description: "Tạo mã TOTP từ secret hoặc otpauth URI, không cần đăng nhập.",
    icon: KeyRound,
    href: "/2fa",
    action: "Mở 2FA",
    enabled: true
  },
  {
    title: "Short URL",
    description: "Rút gọn liên kết nhanh cho các đường dẫn cần chia sẻ.",
    icon: Link2,
    href: "/url",
    action: "Mở Short URL",
    enabled: true
  },
  {
    title: "Ghi chú",
    description: "Lưu nhanh các đoạn nội dung ngắn dùng trong công việc.",
    icon: FileText,
    href: "#",
    action: "Sắp có",
    enabled: false
  },
  {
    title: "Nhắc việc",
    description: "Theo dõi các mốc thời gian và việc cần xử lý tiếp theo.",
    icon: Clock3,
    href: "#",
    action: "Sắp có",
    enabled: false
  }
];

export default function HomePage() {
  return (
    <PublicShell eyebrow="Tiện ích" title="Công cụ cho người dùng">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {toolCards.map((tool) => {
          const Icon = tool.icon;

          return (
            <Card key={tool.title}>
              <CardHeader>
                <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                  <Icon className="size-5 text-muted-foreground" />
                </div>
                <CardTitle className="text-lg">{tool.title}</CardTitle>
                <CardDescription>{tool.description}</CardDescription>
              </CardHeader>
              <CardContent>
                {tool.enabled ? (
                  <Button asChild className="w-full">
                    <Link href={tool.href}>{tool.action}</Link>
                  </Button>
                ) : (
                  <Button className="w-full" type="button" variant="outline" disabled>
                    {tool.action}
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </PublicShell>
  );
}
