import AppLayout from "@/components/AppLayout";
import StatCard from "@/components/StatCard";
import { departments, subjects, exams, students, examResults } from "@/data/mockData";
import { Users, BookOpen, FileText, TrendingUp, GraduationCap, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  const passCount = examResults.filter((r) => r.status === "Pass").length;
  const passRate = Math.round((passCount / examResults.length) * 100);
  const avgScore = Math.round(examResults.reduce((s, r) => s + r.percentage, 0) / examResults.length);

  // Recent evaluations
  const recentResults = examResults.slice(0, 6).map((r) => {
    const student = students.find((s) => s.id === r.studentId);
    const exam = exams.find((e) => e.id === r.examId);
    const subject = subjects.find((s) => s.id === exam?.subjectId);
    return { ...r, student, exam, subject };
  });

  // Top performers
  const topPerformers = [...examResults]
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 5)
    .map((r) => {
      const student = students.find((s) => s.id === r.studentId);
      return { ...r, student };
    });

  return (
    <AppLayout title="Dashboard" subtitle="Exam evaluation overview">
      {/* Stats */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
        <StatCard title="Departments" value={departments.length} icon={GraduationCap} accentColor="hsl(215, 60%, 42%)" />
        <StatCard title="Subjects" value={subjects.length} icon={BookOpen} accentColor="hsl(260, 60%, 50%)" />
        <StatCard title="Total Students" value={students.length} icon={Users} accentColor="hsl(200, 80%, 50%)" />
        <StatCard title="Exams" value={exams.length} icon={FileText} accentColor="hsl(38, 92%, 50%)" />
        <StatCard title="Pass Rate" value={`${passRate}%`} icon={TrendingUp} accentColor="hsl(152, 60%, 40%)" />
        <StatCard title="Avg Score" value={`${avgScore}%`} icon={Award} accentColor="hsl(340, 65%, 50%)" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Evaluations */}
        <div className="lg:col-span-2">
          <div className="rounded-lg border bg-card">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <h3 className="text-sm font-semibold text-foreground">Recent Evaluations</h3>
              <a href="/scripts" className="text-xs font-medium text-primary hover:underline">View All →</a>
            </div>
            <div className="divide-y">
              {recentResults.map((r) => (
                <div key={r.id} className="flex items-center justify-between px-5 py-3 transition-colors hover:bg-muted/30">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      {r.student?.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{r.student?.name}</p>
                      <p className="text-xs text-muted-foreground">{r.subject?.code} · {r.exam?.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-foreground">{r.totalMarksObtained}/{exams.find(e => e.id === r.examId)?.totalMarks}</span>
                    <Badge
                      variant={r.status === "Pass" ? "default" : "destructive"}
                      className={r.status === "Pass" ? "bg-success/10 text-success border-success/20" : "bg-destructive/10 text-destructive border-destructive/20"}
                    >
                      {r.grade}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Performers */}
        <div>
          <div className="rounded-lg border bg-card">
            <div className="border-b px-5 py-4">
              <h3 className="text-sm font-semibold text-foreground">Top Performers</h3>
              <p className="text-xs text-muted-foreground">Across all exams</p>
            </div>
            <div className="divide-y">
              {topPerformers.map((r, i) => (
                <div key={r.id} className="flex items-center justify-between px-5 py-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-[10px] font-bold text-muted-foreground">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-foreground">{r.student?.name}</p>
                      <p className="text-xs text-muted-foreground">{r.student?.rollNumber}</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-primary">{r.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Department summary */}
      <div className="mt-6 rounded-lg border bg-card">
        <div className="border-b px-5 py-4">
          <h3 className="text-sm font-semibold text-foreground">Department Overview</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Department</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Code</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Students</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Subjects</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {departments.map((dept) => {
                const deptStudents = students.filter((s) => s.departmentId === dept.id).length;
                const deptSubjects = subjects.filter((s) => s.departmentId === dept.id).length;
                return (
                  <tr key={dept.id} className="transition-colors hover:bg-muted/20">
                    <td className="px-5 py-3 text-sm font-medium text-foreground">{dept.name}</td>
                    <td className="px-5 py-3">
                      <span className="rounded-md bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">{dept.code}</span>
                    </td>
                    <td className="px-5 py-3 text-sm text-foreground">{deptStudents}</td>
                    <td className="px-5 py-3 text-sm text-foreground">{deptSubjects}</td>
                    <td className="px-5 py-3">
                      <Badge className="bg-success/10 text-success border-success/20">Active</Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;
