"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { MobileNav } from "@/components/layout/mobile-nav";
import { PageTransition } from "@/components/layout/page-transition";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { useAuth } from "@/hooks/use-auth";

const authRoutes = ["/login", "/signup"];

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user && !authRoutes.includes(pathname)) {
      router.push("/login");
    }
  }, [loading, pathname, router, user]);

  if (loading) {
    return (
      <div className="min-h-screen px-6 py-8">
        <LoadingSkeleton className="h-20 w-full" />
      </div>
    );
  }

  if (authRoutes.includes(pathname)) {
    return <PageTransition>{children}</PageTransition>;
  }

  return (
    <div className="min-h-screen p-4 sm:p-6">
      <div className="flex w-full gap-6">
        <Sidebar />
        <main className="w-full pb-24 lg:pb-6">
          <Topbar />
          <PageTransition>{children}</PageTransition>
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
