"use client";
import React from "react";
import { useAppSelector } from "@/store/hooks";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataTableInterview } from "./DataTableForInterview";
import { ModeToggle } from "./theme-toggle";
export default function CandidateInterviews({
  candidateId,
}: {
  candidateId: string;
}) {
  const { candidates, interviews } = useAppSelector((state) => state.candidate);
  const interviewsGiven = React.useMemo(
    () => (interviews ? Object.values(interviews) : []),
    [interviews]
  );
  return (
    <div className="flex w-full flex-col gap-8 p-6 max-w-4xl mx-auto">
      <div className="flex justify-center items-center gap-8">
        <h1 className="text-4xl font-bold tracking-tight">
          Candidate Information
        </h1>
        <ModeToggle />
      </div>
      <div className="grid gap-4 md:grid-cols-2 ">
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Candidate Info</CardDescription>
          </CardHeader>
          <CardContent>
            Name: {candidates[candidateId]?.name}
            <br />
            Email: {candidates[candidateId]?.email}
            <br />
            Phone: {candidates[candidateId]?.phone}
          </CardContent>
        </Card>
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Total Interviews Given</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {
                interviewsGiven.filter((i) => i.candidateId == candidateId)
                  .length
              }
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
      <DataTableInterview candidateId={candidateId} />
    </div>
  );
}
