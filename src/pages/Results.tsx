import AppLayout from "@/components/AppLayout";
import { examResults, students, exams, subjects } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const ResultsPage = () => {
  const [search, setSearch] = useState("");

  const allResults = examResults.map((r) => {
    const student = students.find((s) => s.id === r.studentId);
    const exam = exams.find((e) => e.id === r.examId);
    const subject = subjects.find((s) => s.id === exam?.subjectId);
    return { ...r, student, exam, subject };
  });

  const filtered = allResults.filter(
    (r) =>
      r.student?.name.toLowerCase().includes(search.toLowerCase()) ||
      r.student?.rollNumber.toLowerCase().includes(search.toLowerCase()) ||
      r.subject?.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout title="Results" subtitle="View all examination results">
      <div className="rounded-lg border bg-card">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h3 className="text-sm font-semibold text-foreground">All Results</h3>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search student or subject..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 text-sm"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Student</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Roll No</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Subject</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Exam</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Marks</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">%</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Grade</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((r) => (
                <tr key={r.id} className="transition-colors hover:bg-muted/20">
                  <td className="px-5 py-3 text-sm font-medium text-foreground">{r.student?.name}</td>
                  <td className="px-5 py-3 text-sm text-muted-foreground">{r.student?.rollNumber}</td>
                  <td className="px-5 py-3 text-sm text-foreground">{r.subject?.code} - {r.subject?.name}</td>
                  <td className="px-5 py-3 text-sm text-muted-foreground">{r.exam?.name}</td>
                  <td className="px-5 py-3 text-sm font-semibold text-foreground">
                    {r.totalMarksObtained}/{r.exam?.totalMarks}
                  </td>
                  <td className="px-5 py-3 text-sm font-medium text-foreground">{r.percentage}%</td>
                  <td className="px-5 py-3">
                    <span className="rounded-md bg-primary/10 px-2 py-1 text-xs font-bold text-primary">{r.grade}</span>
                  </td>
                  <td className="px-5 py-3">
                    <Badge
                      variant={r.status === "Pass" ? "default" : "destructive"}
                      className={r.status === "Pass" ? "bg-success/10 text-success border-success/20" : "bg-destructive/10 text-destructive border-destructive/20"}
                    >
                      {r.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
};

export default ResultsPage;
