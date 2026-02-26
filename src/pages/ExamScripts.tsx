import { useState, useMemo } from "react";
import AppLayout from "@/components/AppLayout";
import StatCard from "@/components/StatCard";
import FilterDropdown from "@/components/FilterDropdown";
import ScriptPDFViewer from "@/components/ScriptPDFViewer";
import MarksBreakdownPanel from "@/components/MarksBreakdownPanel";
import {
  departments,
  subjects,
  exams,
  students,
  examResults,
} from "@/data/mockData";
import { Users, FileCheck, Clock, TrendingUp } from "lucide-react";

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

  return (
    <AppLayout title="Exam Scripts" subtitle="View and evaluate student answer scripts">
      {/* Stats */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Students" value={totalStudents} icon={Users} accentColor="hsl(215, 60%, 42%)" />
        <StatCard
          title="Evaluated"
          value={totalEvaluated}
          subtitle="Answer scripts"
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
        <StatCard title="Avg Score" value={`${avgPercentage}%`} icon={Clock} accentColor="hsl(200, 80%, 50%)" />
      </div>

      {/* Filters */}
      <div className="filter-bar mb-6">
        <div className="mb-3 flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
          <h3 className="text-sm font-semibold text-foreground">Filter Scripts</h3>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <FilterDropdown
            label="Department"
            placeholder="Select department"
            options={departments.map((d) => ({ value: d.id, label: `${d.code} - ${d.name}` }))}
            value={selectedDept}
            onValueChange={handleDeptChange}
          />
          <FilterDropdown
            label="Subject"
            placeholder="Select subject"
            options={filteredSubjects.map((s) => ({ value: s.id, label: `${s.code} - ${s.name}` }))}
            value={selectedSubject}
            onValueChange={handleSubjectChange}
            disabled={!selectedDept}
          />
          <FilterDropdown
            label="Exam"
            placeholder="Select exam"
            options={filteredExams.map((e) => ({ value: e.id, label: e.name }))}
            value={selectedExam}
            onValueChange={setSelectedExam}
            disabled={!selectedSubject}
          />
          <FilterDropdown
            label="Student"
            placeholder="Select student"
            options={filteredStudents.map((s) => ({ value: s.id, label: `${s.rollNumber} - ${s.name}` }))}
            value={selectedStudent}
            onValueChange={setSelectedStudent}
            disabled={!selectedDept}
          />
        </div>
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
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-card p-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <FileCheck className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-foreground">Select Filters to View Script</h3>
          <p className="max-w-md text-sm text-muted-foreground">
            Choose a department, subject, exam, and student from the filters above to view their answer script and marks breakdown.
          </p>
        </div>
      )}
    </AppLayout>
  );
};

export default ExamScriptsPage;
