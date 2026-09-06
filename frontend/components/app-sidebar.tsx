"use client";

import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  LayoutDashboardIcon,
  FileTextIcon,
  ListIcon,
  MailIcon,
  BarChart3Icon,
  UsersIcon,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

const navMain = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: <LayoutDashboardIcon />,
    isActive: true,
  },
  // {
  //   title: "Resume",
  //   url: "/resume",
  //   icon: <FileTextIcon />,
  // },
  // {
  //   title: "Bullet Generator",
  //   url: "/bullets",
  //   icon: <ListIcon />,
  // },
  // {
  //   title: "Cover Letter",
  //   url: "/cover-letter",
  //   icon: <MailIcon />,
  // },
  // {
  //   title: "Job Fit",
  //   url: "/job-fit",
  //   icon: <BarChart3Icon />,
  // },
  // {
  //   title: "Networking",
  //   url: "/networking",
  //   icon: <UsersIcon />,
  // },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();

  return (
    <Sidebar
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<a href="/dashboard" />}>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">Sunset</span>
                <span className="truncate text-xs">
                  AI Job Application Tracker
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter>{user && <NavUser />}</SidebarFooter>
    </Sidebar>
  );
}
