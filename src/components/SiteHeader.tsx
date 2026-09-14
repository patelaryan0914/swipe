"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles } from "lucide-react";
import { ModeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  const pathname = usePathname();
  const onDashboard = pathname.startsWith("/dashboard");

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-6">
        <Link href="/" className="group flex items-center gap-3">
          <div className="relative size-9 shrink-0">
            <span className="absolute inset-0 rotate-6 rounded-lg bg-secondary/50 transition-transform group-hover:rotate-12" />
            <span className="relative flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <Sparkles className="size-4" />
            </span>
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold tracking-tight">Swipe</p>
            <p className="text-muted-foreground text-[11px] tracking-wide">
              Your Interview Buddy
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/#benefits">Benefits</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/#how-it-works">How it works</Link>
          </Button>
          <Button
            variant={onDashboard ? "secondary" : "ghost"}
            size="sm"
            asChild
          >
            <Link href="/dashboard">Dashboard</Link>
          </Button>
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="md:hidden" asChild>
            <Link href="/dashboard">Dashboard</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/#start">Upload resume</Link>
          </Button>
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-8 sm:flex-row">
        <p className="text-muted-foreground text-sm">
          Swipe Your Interview Buddy · Free · No auth · Chats not stored
        </p>
        <p className="text-muted-foreground text-xs">Made by Aryan Patel ❤️</p>
      </div>
    </footer>
  );
}
