import { FileText } from "lucide-react";

interface ScriptPDFViewerProps {
  studentName: string;
  rollNumber: string;
  examName: string;
}

const ScriptPDFViewer = ({ studentName, rollNumber, examName }: ScriptPDFViewerProps) => {
  return (
    <div className="pdf-container flex flex-col">
      {/* PDF Header */}
      <div className="flex items-center justify-between border-b bg-card px-4 py-3">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-foreground">Answer Script</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="rounded-md border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted">
            Download
          </button>
          <button className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90">
            Full Screen
          </button>
        </div>
      </div>

      {/* PDF Body (Simulated) */}
      <div className="flex min-h-[500px] flex-col items-center justify-center bg-muted/50 p-8">
        <div className="w-full max-w-lg rounded-lg border-2 border-dashed border-border bg-card p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <FileText className="h-8 w-8 text-primary" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-foreground">Answer Script Preview</h3>
          <p className="mb-1 text-sm text-muted-foreground">
            Student: <span className="font-medium text-foreground">{studentName}</span>
          </p>
          <p className="mb-1 text-sm text-muted-foreground">
            Roll No: <span className="font-medium text-foreground">{rollNumber}</span>
          </p>
          <p className="mb-4 text-sm text-muted-foreground">
            Exam: <span className="font-medium text-foreground">{examName}</span>
          </p>
          <p className="text-xs text-muted-foreground">
            PDF viewer will render the scanned answer script here.
            <br />
            Connect your storage backend to load actual scripts.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ScriptPDFViewer;
