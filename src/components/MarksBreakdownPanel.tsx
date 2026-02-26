import { ExamResult, QuestionMark } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface MarksBreakdownPanelProps {
  result: ExamResult;
  totalMarks: number;
  studentName: string;
}

const MarksBreakdownPanel = ({ result, totalMarks, studentName }: MarksBreakdownPanelProps) => {
  const sections = result.questionBreakdown.reduce<Record<string, QuestionMark[]>>((acc, q) => {
    if (!acc[q.section]) acc[q.section] = [];
    acc[q.section].push(q);
    return acc;
  }, {});

  return (
    <div className="marks-panel animate-slide-in-right">
      {/* Header */}
      <div className="border-b p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">Marks Breakdown</h3>
          <Badge
            variant={result.status === "Pass" ? "default" : "destructive"}
            className={result.status === "Pass" ? "bg-success text-success-foreground" : ""}
          >
            {result.status}
          </Badge>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">{studentName}</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3 border-b p-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-primary">{result.totalMarksObtained}</p>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Obtained</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-foreground">{totalMarks}</p>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Total</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-foreground">{result.grade}</p>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Grade</p>
        </div>
      </div>

      {/* Percentage bar */}
      <div className="border-b p-4">
        <div className="mb-1 flex justify-between">
          <span className="text-xs text-muted-foreground">Percentage</span>
          <span className="text-xs font-semibold text-foreground">{result.percentage}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${result.percentage}%`,
              backgroundColor:
                result.percentage >= 60
                  ? "hsl(var(--success))"
                  : result.percentage >= 40
                  ? "hsl(var(--warning))"
                  : "hsl(var(--destructive))",
            }}
          />
        </div>
      </div>

      {/* Question-wise */}
      <div className="max-h-[350px] overflow-y-auto p-4">
        {Object.entries(sections).map(([section, questions]) => (
          <div key={section} className="mb-4 last:mb-0">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Section {section}
            </p>
            <div className="space-y-1.5">
              {questions.map((q) => (
                <div key={q.questionNumber} className="flex items-center justify-between rounded-md bg-muted/50 px-3 py-2">
                  <span className="text-xs text-foreground">Q{q.questionNumber}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-foreground">{q.obtainedMarks}</span>
                    <span className="text-[10px] text-muted-foreground">/ {q.maxMarks}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Separator />

      {/* Footer */}
      <div className="p-4">
        <p className="text-[10px] text-muted-foreground">
          Evaluated by: <span className="font-medium text-foreground">{result.evaluatedBy}</span>
        </p>
        <p className="text-[10px] text-muted-foreground">
          Date: <span className="font-medium text-foreground">{result.evaluatedOn}</span>
        </p>
      </div>
    </div>
  );
};

export default MarksBreakdownPanel;
