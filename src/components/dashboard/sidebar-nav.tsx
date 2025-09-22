
"use client";

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Role } from "@/lib/types";
import {
  LayoutDashboard,
  CalendarDays,
  HeartPulse,
  Syringe,
  User,
  Stethoscope,
  HelpCircle,
  Bell,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  roles: Role[];
}

const navItems: NavItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    roles: ["patient", "doctor", "admin"],
  },
  {
    href: "/dashboard/appointments",
    label: "Appointments",
    icon: CalendarDays,
    roles: ["patient", "doctor", "admin"],
  },
  {
    href: "/dashboard/doctors",
    label: "Doctors",
    icon: Stethoscope,
    roles: ["admin"],
  },
  {
    href: "/dashboard/resources",
    label: "Resources",
    icon: Syringe,
    roles: ["admin"],
  },
  {
    href: "/dashboard/notifications",
    label: "Notifications",
    icon: Bell,
    roles: ["admin"],
  },
  {
    href: "/dashboard/profile",
    label: "Profile",
    icon: User,
    roles: ["patient", "doctor", "admin"],
  },
  {
    href: "/dashboard/help",
    label: "Help",
    icon: HelpCircle,
    roles: ["patient", "doctor", "admin"],
  },
];

export function SidebarNav({ role }: { role: Role }) {
  const pathname = usePathname();

  const filteredNavItems = navItems.filter((item) => item.roles.includes(role));

  return (
    <div className="p-2">
      <SidebarMenu>
        {filteredNavItems.map((item) => (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              asChild
              isActive={pathname.startsWith(item.href) && (item.href !== '/dashboard' || pathname === '/dashboard')}
              tooltip={item.label}
            >
              <Link href={item.href}>
                <item.icon />
                <span>{item.label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </div>
  );
}
