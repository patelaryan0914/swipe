import React from "react";
import { SectionCards } from "./sectionCards";
import { DataTableCandidate } from "./DataTableForCandidate";
export default function Interviewer() {
  return (
    <div className="p-4 grid gap-6">
      <SectionCards />
      <DataTableCandidate />
    </div>
  );
}
