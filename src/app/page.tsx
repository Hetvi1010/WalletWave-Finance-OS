import Link from "next/link";
import { ArrowRight, BadgeDollarSign, ChartNoAxesCombined, ShieldCheck } from "lucide-react";
import { buttonVariants } from "@/components/ui/button-variants";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/utils";

const highlights = [
  {
    icon: BadgeDollarSign,
    title: "Track every rupee or dollar",
    text: "Capture income, expenses, categories, and notes with a polished transaction workflow."
  },
  {
    icon: ChartNoAxesCombined,
    title: "Animated analytics",
    text: "See cash flow, category breakdowns, and budget usage with smooth chart transitions."
  },
  {
    icon: ShieldCheck,
    title: "Auth-ready architecture",
    text: "JWT-based Express API built for real deployments."
  }
];

export default function HomePage() {
  return (
    <main className="relative overflow-hidden px-6 py-10 sm:px-8 lg:px-10">
      <div className="w-full">
        <div className="flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-3">
            <Link href="/login" className={cn(buttonVariants({ variant: "ghost", size: "md" }))}>
              Login
            </Link>
            <Link href="/signup" className={cn(buttonVariants({ variant: "primary", size: "md" }))}>
              Get Started
            </Link>
          </div>
        </div>

        <section className="grid items-center gap-8 py-20 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-8">
            <div className="inline-flex rounded-full border border-brand-500/20 bg-brand-500/10 px-4 py-2 text-sm font-medium text-brand-700 dark:text-brand-300">
              Modern finance tracking for focused people
            </div>
            <div className="space-y-5">
              <h1 className="max-w-3xl text-5xl font-semibold leading-tight sm:text-6xl">
                Manage cash flow with a dashboard that feels premium.
              </h1>
              <p className="max-w-2xl text-lg text-slate-600 dark:text-slate-300">
                WalletWave pairs a highly animated Next.js experience with a production-ready Express backend.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link href="/dashboard" className={cn(buttonVariants({ variant: "primary", size: "lg" }))}>
                Explore Demo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link href="/signup" className={cn(buttonVariants({ variant: "secondary", size: "lg" }))}>
                Create Account
              </Link>
            </div>
          </div>

          <Card className="relative overflow-hidden p-7">
            <div className="absolute -right-20 top-6 h-48 w-48 rounded-full bg-brand-500/20 blur-3xl" />
            <div className="absolute -left-10 bottom-4 h-40 w-40 rounded-full bg-cyan-400/20 blur-3xl" />
            <div className="relative space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">April Balance</p>
                  <p className="text-4xl font-semibold">$6,690</p>
                </div>
                <div className="rounded-full bg-emerald-500/10 px-3 py-2 text-sm font-medium text-emerald-600">
                  +14.8%
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="glass-panel p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Income</p>
                  <p className="mt-3 text-2xl font-semibold">$7,650</p>
                </div>
                <div className="glass-panel p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Expenses</p>
                  <p className="mt-3 text-2xl font-semibold">$960</p>
                </div>
                <div className="glass-panel p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Budget</p>
                  <p className="mt-3 text-2xl font-semibold">68%</p>
                </div>
              </div>
            </div>
          </Card>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {highlights.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.title} className="space-y-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-400">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{item.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.text}</p>
                </div>
              </Card>
            );
          })}
        </section>
      </div>
    </main>
  );
}
