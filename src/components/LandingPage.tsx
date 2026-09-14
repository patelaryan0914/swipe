"use client";

import Link from "next/link";
import {
  Brain,
  Clock,
  FileSearch,
  Gauge,
  KeyRound,
  LayoutDashboard,
  Lock,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  TimerReset,
  Upload,
  UserRoundCheck,
  Wallet,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { FileUploadComponent } from "@/components/FileUploadComponent";
import { SiteFooter } from "@/components/SiteHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const benefits = [
  {
    icon: FileSearch,
    title: "Resume-aware questions",
    body: "The buddy reads your resume first, then asks about the real skills, projects, and experience on the page.",
  },
  {
    icon: Clock,
    title: "Timed like the real thing",
    body: "Every answer has a countdown. When time is up, it submits — so you practice under interview pressure.",
  },
  {
    icon: Gauge,
    title: "Easy → medium → hard",
    body: "Difficulty ramps as you go, so you warm up, then get pushed the way a live interviewer would.",
  },
  {
    icon: Brain,
    title: "Score and summary",
    body: "Finish the round and get an overall score plus an AI write-up of how you did — not just a pass/fail.",
  },
  {
    icon: UserRoundCheck,
    title: "Missing details, handled",
    body: "If name, email, or phone is missing from the file, the bot politely collects it before the interview starts.",
  },
  {
    icon: LayoutDashboard,
    title: "Interviewer dashboard",
    body: "Review candidates, interview history, and scores in one place when you are on the hiring side.",
  },
  {
    icon: TimerReset,
    title: "Pick up where you left off",
    body: "Walk away mid-round and continue later. Your in-progress interview stays ready.",
  },
  {
    icon: MessageSquare,
    title: "Chat-style practice",
    body: "It feels like a conversation, not a form. Ask, answer, and keep moving in a familiar chat thread.",
  },
];

const privacyPoints = [
  {
    icon: Wallet,
    title: "Completely free",
    body: "No paywall. No premium tier hiding the good stuff.",
  },
  {
    icon: KeyRound,
    title: "No account needed",
    body: "Zero auth. You never create a login to practice.",
  },
  {
    icon: Lock,
    title: "Nothing is stored",
    body: "Chats, resumes, and scores are not kept on our servers.",
  },
];

const steps = [
  {
    step: "01",
    title: "Upload your resume",
    body: "Drop a PDF or Word file. We extract your profile in a few seconds.",
  },
  {
    step: "02",
    title: "Continue into the interview",
    body: "Confirm your details, then start a timed, resume-tailored round with your buddy.",
  },
  {
    step: "03",
    title: "Get scored",
    body: "Walk away with a score, a summary, and a clear sense of what to tighten next.",
  },
];

export function LandingPage({
  onStartInterview,
}: {
  onStartInterview?: () => void;
}) {
  const [resumeReady, setResumeReady] = useState(false);

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-12%] left-[-8%] h-[28rem] w-[28rem] rounded-full bg-primary/20 blur-3xl dark:bg-primary/12" />
        <div className="absolute top-[8%] right-[-10%] h-[26rem] w-[26rem] rounded-full bg-secondary/20 blur-3xl dark:bg-secondary/14" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:2.75rem_2.75rem] opacity-40 [mask-image:radial-gradient(ellipse_at_top,black,transparent_72%)]" />
      </div>

      <section className="mx-auto grid w-full max-w-6xl items-start gap-12 px-6 pt-14 pb-20 lg:grid-cols-2 lg:pt-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="flex flex-col gap-6"
        >
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className="w-fit gap-1.5 border-primary/30 bg-primary/10 px-3 py-1 text-primary"
            >
              <Sparkles className="size-3.5" />
              Completely free
            </Badge>
            <Badge variant="outline" className="w-fit gap-1.5 px-3 py-1">
              <KeyRound className="size-3.5" />
              No sign-up
            </Badge>
            <Badge variant="outline" className="w-fit gap-1.5 px-3 py-1">
              <Lock className="size-3.5" />
              Chats not stored
            </Badge>
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-[3.4rem] lg:leading-[1.1]">
              Swipe Your Interview Buddy
            </h1>
            <p className="text-muted-foreground max-w-xl text-base leading-relaxed text-pretty sm:text-lg">
              Upload your resume, continue into a live-feeling round, and
              practice with an AI buddy that already knows your story — timed
              questions, rising difficulty, and a score at the end. Completely
              free, no auth, and we never store your chats.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button size="lg" asChild>
              <a href="#start">
                <Upload className="size-4" />
                Upload resume
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="#benefits">See the benefits</a>
            </Button>
          </div>
          <dl className="mt-2 grid max-w-lg grid-cols-3 gap-4 border-t border-border/70 pt-6">
            <div>
              <dt className="text-muted-foreground text-xs tracking-wide uppercase">
                Price
              </dt>
              <dd className="mt-1 text-sm font-medium">Free forever</dd>
            </div>
            <div>
              <dt className="text-muted-foreground text-xs tracking-wide uppercase">
                Account
              </dt>
              <dd className="mt-1 text-sm font-medium">None required</dd>
            </div>
            <div>
              <dt className="text-muted-foreground text-xs tracking-wide uppercase">
                Storage
              </dt>
              <dd className="mt-1 text-sm font-medium">Chats not saved</dd>
            </div>
          </dl>
        </motion.div>

        <motion.div
          id="start"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="flex w-full min-w-0 scroll-mt-24 flex-col gap-4"
        >
          <div className="border-primary/20 bg-card w-full rounded-xl border p-6 shadow-xl ring-1 ring-primary/10">
            <div className="mb-6 flex flex-col gap-2">
              <div className="flex items-center justify-between gap-3">
                <Badge variant="secondary">Step 1 of 2</Badge>
                <ShieldCheck className="text-secondary size-4" />
              </div>
              <h2 className="text-xl font-semibold tracking-tight">
                Upload your resume
              </h2>
              <p className="text-muted-foreground text-sm">
                Drop a PDF or Word file. No account, no payment. We don&apos;t
                store the resume or the chat — continue straight into the
                interview.
              </p>
            </div>
            <FileUploadComponent onProfileReady={setResumeReady} />
          </div>
          {resumeReady && (
            <Button
              type="button"
              size="lg"
              className="h-11 w-full"
              onClick={onStartInterview}
            >
              Continue
            </Button>
          )}
        </motion.div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="grid gap-4 md:grid-cols-3">
          {privacyPoints.map((point) => (
            <Card
              key={point.title}
              className="gap-3 border-secondary/20 bg-secondary/5 py-5"
            >
              <CardHeader className="gap-3">
                <span className="flex size-9 items-center justify-center rounded-lg border border-secondary/25 bg-secondary/10 text-secondary">
                  <point.icon className="size-4" />
                </span>
                <CardTitle className="text-base">{point.title}</CardTitle>
                <CardDescription className="leading-relaxed">
                  {point.body}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section id="benefits" className="mx-auto max-w-6xl scroll-mt-24 px-6 pb-20">
        <div className="mb-10 max-w-2xl space-y-3">
          <Badge variant="outline">Why Swipe</Badge>
          <h2 className="text-3xl font-bold tracking-tight text-balance">
            Everything you need to walk in ready
          </h2>
          <p className="text-muted-foreground text-pretty">
            Built around a real interview loop — not a quiz. Your buddy uses
            your resume, keeps time, and reports back like a recruiter would.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.35, delay: index * 0.04 }}
            >
              <Card className="h-full gap-4 py-5 transition-colors hover:border-primary/30 hover:bg-accent/40">
                <CardHeader className="gap-3">
                  <span className="flex size-9 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
                    <benefit.icon className="size-4" />
                  </span>
                  <CardTitle className="text-base">{benefit.title}</CardTitle>
                  <CardDescription className="leading-relaxed">
                    {benefit.body}
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <section
        id="how-it-works"
        className="mx-auto max-w-6xl scroll-mt-24 px-6 pb-20"
      >
        <div className="mb-10 max-w-2xl space-y-3">
          <Badge variant="outline">The loop</Badge>
          <h2 className="text-3xl font-bold tracking-tight">
            Upload. Continue. Get better.
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {steps.map((item) => (
            <Card key={item.step} className="gap-3 py-5">
              <CardHeader>
                <p className="text-primary font-mono text-sm tracking-widest">
                  {item.step}
                </p>
                <CardTitle className="text-lg">{item.title}</CardTitle>
                <CardDescription className="leading-relaxed">
                  {item.body}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <Card className="overflow-hidden border-secondary/25 bg-secondary/5 py-0">
          <div className="flex flex-col items-start justify-between gap-6 px-6 py-8 sm:flex-row sm:items-center">
            <div className="space-y-2">
              <p className="text-sm font-medium text-secondary">
                Hiring with Swipe?
              </p>
              <h3 className="text-xl font-semibold tracking-tight">
                Review candidates and scores from the dashboard
              </h3>
              <p className="text-muted-foreground max-w-xl text-sm">
                See who practiced, open interview recaps, and keep every
                candidate in one place.
              </p>
            </div>
            <Button variant="secondary" asChild>
              <Link href="/dashboard">Open dashboard</Link>
            </Button>
          </div>
        </Card>
      </section>

      <SiteFooter />
    </div>
  );
}
