"use client";

import Interviewee from "@/components/Interviewee";
import { SiteHeader } from "@/components/SiteHeader";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Interviewee variant="landing" />
      </main>
    </div>
  );
}
