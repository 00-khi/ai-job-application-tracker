"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { bricolageGrotesque } from "@/styles/fonts";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboardIcon,
  CalendarIcon,
  SparklesIcon,
  BriefcaseIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowRightIcon,
} from "lucide-react";

const features = [
  {
    title: "See everything at a glance",
    description:
      "All your applications in one view. Filter by status, search by company, sort by date. No more scattered spreadsheets.",
    icon: LayoutDashboardIcon,
  },
  {
    title: "Never miss a follow-up",
    description:
      "Log interviews, outcomes, and notes. Know exactly where each application stands.",
    icon: CalendarIcon,
  },
  {
    title: "AI when you need it",
    description: "Get AI suggestions for your applications. ",
    icon: SparklesIcon,
  },
] as const;

const footerLinks = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
] as const;

export default function LandingPage() {
  const { user, loading } = useAuth();

  const ctaHref = user ? "/dashboard" : "/signup";
  const ctaLabel = user ? "Go to dashboard" : "Get started";

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative min-h-[100dvh] flex items-center">
        <div className="mx-auto w-full max-w-7xl px-6 py-24 lg:py-32">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            {/* Left: Copy */}
            <div>
              <h1
                className={`${bricolageGrotesque.className} text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl`}
                style={{ textWrap: "balance" }}
              >
                Stop losing track
                <br />
                of where you applied
              </h1>
              <p
                className="mt-6 max-w-lg text-xl leading-relaxed text-muted-foreground"
                style={{ textWrap: "pretty" }}
              >
                One place to track every application, interview, and follow-up.
              </p>
              <div className="mt-10 flex items-center gap-3">
                <Link href={ctaHref} className={buttonVariants({ size: "lg" })}>
                  {ctaLabel}
                  <ArrowRightIcon className="size-4" data-icon="inline-end" />
                </Link>
                {!loading && !user && (
                  <Link
                    href="/login"
                    className={buttonVariants({ variant: "ghost", size: "lg" })}
                  >
                    Log in
                  </Link>
                )}
              </div>
            </div>

            {/* Right: Dashboard Preview */}
            <div className="hidden lg:block">
              <Card className="shadow-lg shadow-foreground/5">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Applications
                      </p>
                      <p className="text-3xl font-semibold tabular-nums tracking-tight">
                        24
                      </p>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                      <BriefcaseIcon className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <Separator className="mb-6" />
                  <div className="grid grid-cols-3 gap-4">
                    <div className="rounded-xl bg-muted/50 p-3">
                      <p className="text-xs text-muted-foreground">
                        Interviews
                      </p>
                      <p className="text-xl font-semibold tabular-nums mt-1">
                        8
                      </p>
                    </div>
                    <div className="rounded-xl bg-muted/50 p-3">
                      <p className="text-xs text-muted-foreground">Offers</p>
                      <p className="text-xl font-semibold tabular-nums mt-1">
                        2
                      </p>
                    </div>
                    <div className="rounded-xl bg-muted/50 p-3">
                      <p className="text-xs text-muted-foreground">Pending</p>
                      <p className="text-xl font-semibold tabular-nums mt-1">
                        14
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 space-y-3">
                    {[
                      {
                        company: "Acme Corp",
                        role: "Frontend Engineer",
                        status: "Interviewing",
                      },
                      {
                        company: "Globex",
                        role: "Full Stack Dev",
                        status: "Applied",
                      },
                      {
                        company: "Initech",
                        role: "React Developer",
                        status: "Offer",
                      },
                    ].map((app) => (
                      <div
                        key={app.company}
                        className="flex items-center justify-between rounded-lg border border-border/60 px-4 py-3"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">
                            {app.role}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {app.company}
                          </p>
                        </div>
                        <Badge
                          variant={
                            app.status === "Offer"
                              ? "default"
                              : app.status === "Interviewing"
                                ? "secondary"
                                : "outline"
                          }
                          className="shrink-0 ml-3"
                        >
                          {app.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-b border-border">
        <div className="mx-auto w-full max-w-7xl px-6 py-24 lg:py-32">
          <div className="max-w-2xl mb-12">
            <h2
              className={`${bricolageGrotesque.className} text-3xl font-bold tracking-tight sm:text-4xl`}
            >
              Everything you need
            </h2>
            <p className="mt-3 text-lg text-muted-foreground">
              No complexity. Just the tools to manage your job search.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="group hover:ring-foreground/20 transition-shadow"
              >
                <CardHeader>
                  <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent">
                    <feature.icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section>
        <div className="mx-auto w-full max-w-7xl px-6 py-24 lg:py-32 text-center">
          <h2
            className={`${bricolageGrotesque.className} text-3xl font-bold tracking-tight sm:text-4xl`}
          >
            Ready to get organized?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-lg mx-auto">
            Start tracking your applications today.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link href={ctaHref} className={buttonVariants({ size: "lg" })}>
              {ctaLabel}
              <ArrowRightIcon className="size-4" data-icon="inline-end" />
            </Link>
            {!loading && !user && (
              <Link
                href="/login"
                className={buttonVariants({ variant: "ghost", size: "lg" })}
              >
                Log in
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="text-sm font-medium text-foreground">Sunset</span>
            <span className="mx-2 text-border">|</span>
            <span className="text-sm text-muted-foreground">
              AI Job Application Tracker
            </span>
          </div>
          <nav className="flex items-center gap-6">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
            {!loading && !user && (
              <Link
                href="/login"
                className={buttonVariants({ variant: "ghost", size: "sm" })}
              >
                Log in
              </Link>
            )}
          </nav>
        </div>
      </footer>
    </div>
  );
}
