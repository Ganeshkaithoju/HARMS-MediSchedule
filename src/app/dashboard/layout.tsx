"use client";

import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { SidebarNav } from "@/components/dashboard/sidebar-nav";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { UserNav } from "@/components/dashboard/user-nav";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isClient, setIsClient] = React.useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && !user) {
      router.push("/");
    }
  }, [user, router, isClient]);

  if (!isClient || !user) {
    return (
      <div className="flex h-screen w-full">
        <div className="hidden md:flex flex-col gap-4 p-2 border-r">
            <div className="p-2 flex justify-between items-center">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-7 w-7" />
            </div>
            <div className="flex-1 p-2 space-y-2">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
            </div>
             <div className="p-2 mt-auto">
                <Skeleton className="h-10 w-full" />
            </div>
        </div>
        <div className="flex-1 p-8">
            <Skeleton className="h-10 w-48 mb-8" />
            <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center justify-between">
            <Button variant="ghost" className="w-full justify-start gap-2 px-2" asChild>
              <Link href="/dashboard">
                <Icons.logo className="h-6 w-6 text-primary" />
                <span className="font-bold text-lg font-headline">MediSchedule</span>
              </Link>
            </Button>
            <SidebarTrigger className="group-data-[collapsible=icon]:hidden" />
          </div>
        </SidebarHeader>
        <Separator />
        <SidebarContent>
            <SidebarNav role={user.role} />
        </SidebarContent>
        <Separator />
        <SidebarFooter>
            <UserNav user={user} logout={logout} />
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
