export interface Department {
  id: string;
  name: string;
  code: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  departmentId: string;
}

export interface Exam {
  id: string;
  name: string;
  subjectId: string;
  date: string;
  totalMarks: number;
  passingMarks: number;
}

export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  departmentId: string;
  semester: number;
}

export interface ExamResult {
  id: string;
  studentId: string;
  examId: string;
  totalMarksObtained: number;
  percentage: number;
  grade: string;
  status: "Pass" | "Fail";
  scriptUrl: string;
  questionBreakdown: QuestionMark[];
  evaluatedBy: string;
  evaluatedOn: string;
}

export interface QuestionMark {
  questionNumber: number;
  maxMarks: number;
  obtainedMarks: number;
  section: string;
}

export const departments: Department[] = [
  { id: "dept-1", name: "Computer Science & Engineering", code: "CSE" },
  { id: "dept-2", name: "Electronics & Communication", code: "ECE" },
  { id: "dept-3", name: "Mechanical Engineering", code: "ME" },
  { id: "dept-4", name: "Civil Engineering", code: "CE" },
  { id: "dept-5", name: "Electrical & Electronics", code: "EEE" },
];

export const subjects: Subject[] = [
  { id: "sub-1", name: "Data Structures & Algorithms", code: "CS301", departmentId: "dept-1" },
  { id: "sub-2", name: "Database Management Systems", code: "CS302", departmentId: "dept-1" },
  { id: "sub-3", name: "Operating Systems", code: "CS303", departmentId: "dept-1" },
  { id: "sub-4", name: "Digital Signal Processing", code: "EC301", departmentId: "dept-2" },
  { id: "sub-5", name: "VLSI Design", code: "EC302", departmentId: "dept-2" },
  { id: "sub-6", name: "Thermodynamics", code: "ME301", departmentId: "dept-3" },
  { id: "sub-7", name: "Fluid Mechanics", code: "ME302", departmentId: "dept-3" },
  { id: "sub-8", name: "Structural Analysis", code: "CE301", departmentId: "dept-4" },
  { id: "sub-9", name: "Power Systems", code: "EE301", departmentId: "dept-5" },
];

export const exams: Exam[] = [
  { id: "exam-1", name: "Mid Semester I - 2025", subjectId: "sub-1", date: "2025-09-15", totalMarks: 100, passingMarks: 40 },
  { id: "exam-2", name: "End Semester I - 2025", subjectId: "sub-1", date: "2025-12-10", totalMarks: 100, passingMarks: 40 },
  { id: "exam-3", name: "Mid Semester I - 2025", subjectId: "sub-2", date: "2025-09-16", totalMarks: 100, passingMarks: 40 },
  { id: "exam-4", name: "Mid Semester I - 2025", subjectId: "sub-4", date: "2025-09-17", totalMarks: 100, passingMarks: 40 },
  { id: "exam-5", name: "End Semester I - 2025", subjectId: "sub-6", date: "2025-12-12", totalMarks: 100, passingMarks: 40 },
];

export const students: Student[] = [
  { id: "stu-1", name: "Rahul Sharma", rollNumber: "CSE2021001", departmentId: "dept-1", semester: 5 },
  { id: "stu-2", name: "Priya Patel", rollNumber: "CSE2021002", departmentId: "dept-1", semester: 5 },
  { id: "stu-3", name: "Amit Kumar", rollNumber: "CSE2021003", departmentId: "dept-1", semester: 5 },
  { id: "stu-4", name: "Sneha Reddy", rollNumber: "CSE2021004", departmentId: "dept-1", semester: 5 },
  { id: "stu-5", name: "Vikram Singh", rollNumber: "ECE2021001", departmentId: "dept-2", semester: 5 },
  { id: "stu-6", name: "Anjali Gupta", rollNumber: "ECE2021002", departmentId: "dept-2", semester: 5 },
  { id: "stu-7", name: "Karthik Nair", rollNumber: "ME2021001", departmentId: "dept-3", semester: 5 },
  { id: "stu-8", name: "Divya Menon", rollNumber: "CE2021001", departmentId: "dept-4", semester: 5 },
  { id: "stu-9", name: "Suresh Babu", rollNumber: "EEE2021001", departmentId: "dept-5", semester: 5 },
];

const generateQuestionBreakdown = (total: number, count: number): QuestionMark[] => {
  const sections = ["A", "B", "C"];
  const maxPerQ = Math.floor(total / count);
  return Array.from({ length: count }, (_, i) => ({
    questionNumber: i + 1,
    maxMarks: maxPerQ,
    obtainedMarks: Math.floor(Math.random() * (maxPerQ + 1)),
    section: sections[Math.floor(i / (count / sections.length))],
  }));
};

const getGrade = (pct: number): string => {
  if (pct >= 90) return "O";
  if (pct >= 80) return "A+";
  if (pct >= 70) return "A";
  if (pct >= 60) return "B+";
  if (pct >= 50) return "B";
  if (pct >= 40) return "C";
  return "F";
};

export const examResults: ExamResult[] = (() => {
  const results: ExamResult[] = [];
  const deptStudents: Record<string, Student[]> = {};
  students.forEach((s) => {
    if (!deptStudents[s.departmentId]) deptStudents[s.departmentId] = [];
    deptStudents[s.departmentId].push(s);
  });

  exams.forEach((exam) => {
    const sub = subjects.find((s) => s.id === exam.subjectId);
    if (!sub) return;
    const studs = deptStudents[sub.departmentId] || [];
    studs.forEach((student) => {
      const breakdown = generateQuestionBreakdown(exam.totalMarks, 10);
      const totalObtained = breakdown.reduce((s, q) => s + q.obtainedMarks, 0);
      const pct = Math.round((totalObtained / exam.totalMarks) * 100);
      results.push({
        id: `result-${exam.id}-${student.id}`,
        studentId: student.id,
        examId: exam.id,
        totalMarksObtained: totalObtained,
        percentage: pct,
        grade: getGrade(pct),
        status: pct >= 40 ? "Pass" : "Fail",
        scriptUrl: "",
        questionBreakdown: breakdown,
        evaluatedBy: "Dr. Raghavan",
        evaluatedOn: "2025-10-01",
      });
    });
  });
  return results;
})();
