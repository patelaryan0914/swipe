"use client";
import { useAppSelector } from "@/store/hooks";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Markdown from "react-markdown";
import { ModeToggle } from "./theme-toggle";

export default function InterviewInfo({
  interviewId,
}: {
  interviewId: string;
}) {
  const { interviews, candidates } = useAppSelector((state) => state.candidate);
  const interview = interviews[interviewId];
  const candidate = candidates[interview.candidateId];

  return (
    <div className="flex w-full flex-col gap-8 p-6 max-w-4xl mx-auto">
      <div className="flex justify-center items-center gap-8">
        <h1 className="text-4xl font-bold tracking-tight">
          Interview Info of {candidate.name}
        </h1>
        <ModeToggle />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Over All Score</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {interview.overAllScore}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Questions Attempted</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {interview.answers.length}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardDescription>Over All Summary</CardDescription>
          <CardTitle className="text-md font-semibold tabular-nums @[250px]/card:text-3xl">
            <Markdown>
              {interview.overAllSummary || "Not Generated Yet"}
            </Markdown>
          </CardTitle>
        </CardHeader>
      </Card>
      <div className="flex justify-center items-center mt-8">
        <h2 className="text-2xl font-bold tracking-tight">
          Questions & Answers
        </h2>
      </div>
      <div className="grid gap-4 md:grid-cols-1">
        {interview.questions.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No Questions</CardTitle>
            </CardHeader>
            <CardContent>
              No questions have been asked in this interview yet.
            </CardContent>
          </Card>
        ) : (
          interview.questions.map((q, idx) => (
            <Card key={q.id || idx}>
              <CardHeader>
                <CardTitle>Question {idx + 1}</CardTitle>
                <CardDescription>{q.category || "General"}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-2">
                  <strong>Q:</strong> {q.text}
                </div>
                <div className="mb-2">
                  <strong>Answer:</strong>{" "}
                  {interview.answers[idx]?.text || (
                    <span className="italic text-gray-500">No answer yet.</span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
