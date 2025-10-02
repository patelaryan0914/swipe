import CandidateInterviews from "@/components/CandidateInterviews";
import React from "react";

export default async function page({
  params,
}: {
  params: Promise<{ candidateId: string }>;
}) {
  const { candidateId } = await params;
  return <CandidateInterviews candidateId={candidateId} />;
}
