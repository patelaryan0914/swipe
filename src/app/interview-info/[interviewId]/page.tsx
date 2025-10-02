import InterviewInfo from "@/components/InterviewInfo";
import React from "react";

export default async function page({
  params,
}: {
  params: Promise<{ interviewId: string }>;
}) {
  const { interviewId } = await params;
  return <InterviewInfo interviewId={interviewId} />;
}
