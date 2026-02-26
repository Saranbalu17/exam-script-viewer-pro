import { useState, useMemo } from "react";
import AppLayout from "@/components/AppLayout";
import StatCard from "@/components/StatCard";
import SearchableDropdown from "@/components/SearchableDropdown";
import ScriptPDFViewer from "@/components/ScriptPDFViewer";
import MarksBreakdownPanel from "@/components/MarksBreakdownPanel";
import {
  departments,
  subjects,
  exams,
  students,
  examResults,
} from "@/data/mockData";
import { Users, FileCheck, TrendingUp, BarChart3, FileText, GraduationCap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const ExamScriptsPage = () => {
  const [selectedDept, setSelectedDept] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedExam, setSelectedExam] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");

  const filteredSubjects = useMemo(
    () => (selectedDept ? subjects.filter((s) => s.departmentId === selectedDept) : []),
    [selectedDept]
  );

  const filteredExams = useMemo(
    () => (selectedSubject ? exams.filter((e) => e.subjectId === selectedSubject) : []),
    [selectedSubject]
  );

  const filteredStudents = useMemo(
    () => (selectedDept ? students.filter((s) => s.departmentId === selectedDept) : []),
    [selectedDept]
  );

  const selectedResult = useMemo(() => {
    if (!selectedExam || !selectedStudent) return null;
    return examResults.find((r) => r.examId === selectedExam && r.studentId === selectedStudent) || null;
  }, [selectedExam, selectedStudent]);

  const selectedExamData = exams.find((e) => e.id === selectedExam);
  const selectedStudentData = students.find((s) => s.id === selectedStudent);

  const handleDeptChange = (val: string) => {
    setSelectedDept(val);
    setSelectedSubject("");
    setSelectedExam("");
    setSelectedStudent("");
  };

  const handleSubjectChange = (val: string) => {
    setSelectedSubject(val);
    setSelectedExam("");
  };

  // Stats
  const totalStudents = students.length;
  const totalEvaluated = examResults.length;
  const passCount = examResults.filter((r) => r.status === "Pass").length;
  const avgPercentage = Math.round(examResults.reduce((s, r) => s + r.percentage, 0) / examResults.length);

  const filtersComplete = selectedDept && selectedSubject && selectedExam && selectedStudent;

  return (
    <AppLayout title="Exam Scripts" subtitle="View and evaluate student answer scripts">
      {/* Stats Row */}
      <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Students" value={totalStudents} icon={Users} accentColor="hsl(215, 60%, 42%)" />
        <StatCard
          title="Scripts Evaluated"
          value={totalEvaluated}
          subtitle="Answer scripts graded"
          icon={FileCheck}
          accentColor="hsl(152, 60%, 40%)"
        />
        <StatCard
          title="Pass Rate"
          value={`${Math.round((passCount / totalEvaluated) * 100)}%`}
          icon={TrendingUp}
          trend={{ value: "3.2% vs last sem", positive: true }}
          accentColor="hsl(38, 92%, 50%)"
        />
        <StatCard title="Avg Score" value={`${avgPercentage}%`} subtitle="Across all exams" icon={BarChart3} accentColor="hsl(200, 80%, 50%)" />
      </div>

      {/* Filters Card */}
      <div className="mb-8 rounded-xl border bg-card p-6" style={{ boxShadow: "var(--shadow-card)" }}>
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <FileText className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">Select Script</h3>
            <p className="text-xs text-muted-foreground">Choose filters below to view the student's answer script</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <SearchableDropdown
            label="Department"
            placeholder="Select department"
            searchPlaceholder="Search departments…"
            options={departments.map((d) => ({ value: d.id, label: `${d.code} — ${d.name}` }))}
            value={selectedDept}
            onValueChange={handleDeptChange}
          />
          <SearchableDropdown
            label="Subject"
            placeholder="Select subject"
            searchPlaceholder="Search subjects…"
            options={filteredSubjects.map((s) => ({ value: s.id, label: `${s.code} — ${s.name}` }))}
            value={selectedSubject}
            onValueChange={handleSubjectChange}
            disabled={!selectedDept}
          />
          <SearchableDropdown
            label="Exam"
            placeholder="Select exam"
            searchPlaceholder="Search exams…"
            options={filteredExams.map((e) => ({ value: e.id, label: e.name }))}
            value={selectedExam}
            onValueChange={setSelectedExam}
            disabled={!selectedSubject}
          />
          <SearchableDropdown
            label="Student"
            placeholder="Select student"
            searchPlaceholder="Search by name or roll no…"
            options={filteredStudents.map((s) => ({ value: s.id, label: `${s.rollNumber} — ${s.name}` }))}
            value={selectedStudent}
            onValueChange={setSelectedStudent}
            disabled={!selectedDept}
          />
        </div>

        {/* Selection summary */}
        {filtersComplete && selectedStudentData && selectedExamData && (
          <div className="mt-5 flex flex-wrap items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3">
            <GraduationCap className="h-4 w-4 text-primary" />
            <span className="text-xs font-medium text-foreground">
              Viewing script for{" "}
              <span className="font-bold text-primary">{selectedStudentData.name}</span>
              {" "}({selectedStudentData.rollNumber}) — {selectedExamData.name}
            </span>
            {selectedResult && (
              <Badge
                variant={selectedResult.status === "Pass" ? "default" : "destructive"}
                className={selectedResult.status === "Pass" ? "ml-auto bg-success text-success-foreground" : "ml-auto"}
              >
                {selectedResult.status} • {selectedResult.percentage}%
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Script Viewer + Marks */}
      {selectedResult && selectedStudentData && selectedExamData ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ScriptPDFViewer
              studentName={selectedStudentData.name}
              rollNumber={selectedStudentData.rollNumber}
              examName={selectedExamData.name}
            />
          </div>
          <div>
            <MarksBreakdownPanel
              result={selectedResult}
              totalMarks={selectedExamData.totalMarks}
              studentName={selectedStudentData.name}
            />
          </div>
        </div>
      ) : (
        <div className="flex min-h-[420px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-card/60 p-12 text-center">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-muted">
            <FileCheck className="h-10 w-10 text-muted-foreground/60" />
          </div>
          <h3 className="mb-2 text-lg font-bold text-foreground">No Script Selected</h3>
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            Use the filters above to select a department, subject, exam, and student to view their answer script and detailed marks breakdown.
          </p>
          <div className="mt-6 flex items-center gap-6 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-primary/40" /> Department
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-primary/40" /> Subject
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-primary/40" /> Exam
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-primary/40" /> Student
            </span>
          </div>
        </div>
      )}
    </AppLayout>
  );
};

export default ExamScriptsPage;
