"use client";

import { AppWindowIcon, CodeIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Interviewee from "@/components/Interviewee";
import Interviewer from "@/components/Interviewer";
import { SiteHeader } from "@/components/SiteHeader";

export default function Dashboard() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 p-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Interview Dashboard
          </h1>
          <p className="text-muted-foreground text-sm">
            Practice as a candidate or review interviews as a hiring buddy.
          </p>
        </div>
        <Tabs
          defaultValue="interviewee"
          className="flex w-full items-center justify-center space-y-6"
        >
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="interviewee" className="flex items-center gap-2">
              <AppWindowIcon className="h-4 w-4" />
              Interviewee
            </TabsTrigger>
            <TabsTrigger value="interviewer" className="flex items-center gap-2">
              <CodeIcon className="h-4 w-4" />
              Interviewer
            </TabsTrigger>
          </TabsList>
          <TabsContent value="interviewee" className="mt-6 w-full">
            <Interviewee />
          </TabsContent>
          <TabsContent value="interviewer" className="mt-6 w-full">
            <Interviewer />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
