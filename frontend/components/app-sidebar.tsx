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
  BriefcaseIcon,
  BarChart3Icon,
  UsersIcon,
  TerminalIcon,
  BriefcaseBusiness,
} from "lucide-react";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: <LayoutDashboardIcon />,
      isActive: true,
    },
    {
      title: "Resume",
      url: "/resume",
      icon: <FileTextIcon />,
    },
    {
      title: "Bullet Generator",
      url: "/bullets",
      icon: <ListIcon />,
    },
    {
      title: "Cover Letter",
      url: "/cover-letter",
      icon: <MailIcon />,
    },
    {
      title: "Job Tracker",
      url: "/tracker",
      icon: <BriefcaseIcon />,
    },
    {
      title: "Job Fit",
      url: "/job-fit",
      icon: <BarChart3Icon />,
    },
    {
      title: "Networking",
      url: "/networking",
      icon: <UsersIcon />,
    },
  ],
};
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
      {...props}
    >
      {/* <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<a href="#" />}>
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <BriefcaseBusiness className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  AI Job Application Tracker
                </span>
                <span className="truncate text-xs">Web Application</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader> */}
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
