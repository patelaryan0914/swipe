"use client";
import { AppWindowIcon, CodeIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Interviewee from "@/components/Interviewee";
import Interviewer from "@/components/Interviewer";
import { ModeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <div className="flex w-full flex-col gap-8 p-6 max-w-4xl mx-auto">
      <div className="flex justify-center items-center gap-8">
        <h1 className="text-4xl font-bold tracking-tight">
          Interview Dashboard
        </h1>
        <ModeToggle />
      </div>
      <div className="flex justify-center items-center gap-8">
        <h1 className="text-2xl font-bold tracking-tight">
          Made By Aryan Patel
        </h1>
      </div>
      <Tabs
        defaultValue="interviewee"
        className="w-full flex justify-center items-center space-y-6"
      >
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="interviewee" className="flex items-center gap-2">
            <AppWindowIcon className="h-4 w-4" />
            Interviewee
          </TabsTrigger>
          <TabsTrigger value="interviewer" className="flex items-center gap-2">
            <CodeIcon className="h-4 w-4" />
            Interviewer
          </TabsTrigger>
        </TabsList>
        <TabsContent value="interviewee" className="w-full mt-6">
          <Interviewee />
        </TabsContent>
        <TabsContent value="interviewer" className="w-full mt-6">
          <Interviewer />
        </TabsContent>
      </Tabs>
    </div>
  );
}
