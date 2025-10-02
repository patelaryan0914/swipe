import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAppSelector } from "@/store/hooks";

export function SectionCards() {
  const { totalCandidates, totalInterviews } = useAppSelector(
    (state) => state.candidate
  );
  return (
    <div className="grid gap-4 md:grid-cols-2 ">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Candidates</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalCandidates}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Interviews</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalInterviews}
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}
