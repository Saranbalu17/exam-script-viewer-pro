import { useState, useRef } from "react";
import {
  FileText,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Columns,
  Rows,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ScriptPDFViewerProps {
  studentName: string;
  rollNumber: string;
  examName: string;
}

const DUMMY_PAGES = [
  {
    qNo: "1(a)",
    question: "Define the term 'Operating System'. Explain its main functions.",
    answer:
      "An Operating System (OS) is system software that manages computer hardware, software resources, and provides common services for computer programs.\n\nMain functions:\n1. Process Management – handles creation, scheduling, and termination of processes.\n2. Memory Management – allocates and deallocates memory space as needed.\n3. File System Management – manages files on storage devices.\n4. Device Management – manages device communication via drivers.\n5. Security – protects data and resources from unauthorized access.",
    marks: "8/10",
  },
  {
    qNo: "1(b)",
    question: "Explain the difference between multiprogramming and multitasking.",
    answer:
      "Multiprogramming:\n- Multiple programs reside in main memory simultaneously.\n- CPU switches between programs when one is waiting for I/O.\n- Objective is to keep the CPU busy at all times.\n\nMultitasking:\n- Extension of multiprogramming where CPU switches between tasks so frequently that users can interact with each program while it is running.\n- Provides interactive response to the user.\n- Time-sharing is a form of multitasking.\n\nKey difference: Multiprogramming focuses on CPU utilization while multitasking focuses on user responsiveness.",
    marks: "9/10",
  },
  {
    qNo: "2(a)",
    question: "Describe the process state diagram with all possible states and transitions.",
    answer:
      "A process during its lifetime passes through several states:\n\n1. New – Process is being created.\n2. Ready – Process is waiting to be assigned to a processor.\n3. Running – Instructions are being executed.\n4. Waiting – Process is waiting for some event (I/O completion).\n5. Terminated – Process has finished execution.\n\nTransitions:\n- New → Ready: Process admitted to ready queue.\n- Ready → Running: Scheduler dispatches process.\n- Running → Waiting: Process requests I/O.\n- Waiting → Ready: I/O completed.\n- Running → Ready: Interrupt occurs (preemption).\n- Running → Terminated: Process completes execution.",
    marks: "7/10",
  },
  {
    qNo: "2(b)",
    question: "What is a semaphore? Explain with example.",
    answer:
      "A semaphore is a synchronization tool used to control access to a shared resource in a concurrent system.\n\nTypes:\n1. Binary Semaphore (Mutex) – Value is 0 or 1.\n2. Counting Semaphore – Value can range over an unrestricted domain.\n\nOperations:\n- wait(S): while(S <= 0); S--;\n- signal(S): S++;\n\nExample – Producer-Consumer Problem:\nThe producer produces items and places them in a buffer. The consumer removes items. Semaphores 'empty' and 'full' track available and filled slots, while 'mutex' ensures mutual exclusion during buffer access.",
    marks: "10/10",
  },
  {
    qNo: "3(a)",
    question: "Explain Banker's Algorithm for deadlock avoidance.",
    answer:
      "Banker's Algorithm is a deadlock avoidance algorithm that tests for safety by simulating the allocation of predetermined maximum possible amounts of all resources.\n\nData Structures:\n- Available[m]: Available instances of each resource.\n- Max[n][m]: Maximum demand of each process.\n- Allocation[n][m]: Currently allocated resources.\n- Need[n][m]: Remaining resource need (Max - Allocation).\n\nSafety Algorithm:\n1. Initialize Work = Available, Finish[i] = false.\n2. Find process i where Finish[i] == false and Need[i] <= Work.\n3. Work = Work + Allocation[i], Finish[i] = true.\n4. If all Finish[i] == true, system is in safe state.\n\nResource Request Algorithm checks if granting a request leads to a safe state before allocating.",
    marks: "8/10",
  },
];

const ScriptPDFViewer = ({ studentName, rollNumber, examName }: ScriptPDFViewerProps) => {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [viewMode, setViewMode] = useState<"vertical" | "horizontal">("vertical");
  const [currentPage, setCurrentPage] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => setZoom((z) => Math.min(z + 20, 200));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 20, 60));
  const handleRotate = () => setRotation((r) => (r + 90) % 360);

  const totalPages = DUMMY_PAGES.length;

  const renderPage = (page: typeof DUMMY_PAGES[0], index: number) => (
    <div
      key={index}
      className="relative mx-auto border border-border bg-white shadow-md"
      style={{
        width: `${5.5 * (zoom / 100)}in`,
        minHeight: `${8 * (zoom / 100)}in`,
        padding: `${0.6 * (zoom / 100)}in`,
        transform: `rotate(${rotation}deg)`,
        transformOrigin: "center center",
        transition: "transform 0.3s ease",
      }}
    >
      {/* Page header watermark */}
      <div className="mb-3 border-b border-neutral-300 pb-2 text-center" style={{ fontSize: `${11 * (zoom / 100)}px` }}>
        <span className="font-semibold text-neutral-500">{examName}</span>
        <span className="mx-2 text-neutral-300">|</span>
        <span className="text-neutral-400">{studentName} ({rollNumber})</span>
      </div>

      {/* Question */}
      <div className="mb-2" style={{ fontSize: `${12 * (zoom / 100)}px` }}>
        <span className="font-bold text-neutral-800">Q {page.qNo}: </span>
        <span className="font-medium text-neutral-700">{page.question}</span>
      </div>

      {/* Answer */}
      <div
        className="whitespace-pre-line leading-relaxed text-neutral-600"
        style={{
          fontSize: `${12.5 * (zoom / 100)}px`,
          fontFamily: "'Caveat', 'Segoe Script', cursive",
          lineHeight: 1.85,
        }}
      >
        {page.answer}
      </div>

      {/* Marks stamp */}
      <div
        className="absolute right-4 top-4 flex items-center justify-center rounded-full border-2 border-red-400 bg-red-50 font-bold text-red-600"
        style={{
          width: `${48 * (zoom / 100)}px`,
          height: `${48 * (zoom / 100)}px`,
          fontSize: `${13 * (zoom / 100)}px`,
        }}
      >
        {page.marks}
      </div>

      {/* Page number */}
      <div
        className="absolute bottom-3 left-1/2 -translate-x-1/2 text-neutral-400"
        style={{ fontSize: `${10 * (zoom / 100)}px` }}
      >
        Page {index + 1} of {totalPages}
      </div>
    </div>
  );

  return (
    <div className="pdf-container flex flex-col overflow-hidden rounded-xl border bg-card">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b bg-muted/40 px-4 py-2">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">Answer Script</span>
          <span className="ml-1 rounded bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
            {totalPages} pages
          </span>
        </div>

        <TooltipProvider delayDuration={200}>
          <div className="flex items-center gap-1">
            {/* View mode toggle */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={viewMode === "vertical" ? "default" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setViewMode("vertical")}
                >
                  <Rows className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Vertical (Scroll)</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={viewMode === "horizontal" ? "default" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => { setViewMode("horizontal"); setCurrentPage(0); }}
                >
                  <Columns className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Horizontal (Page by Page)</TooltipContent>
            </Tooltip>

            <div className="mx-1 h-5 w-px bg-border" />

            {/* Zoom */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleZoomOut} disabled={zoom <= 60}>
                  <ZoomOut className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Zoom Out</TooltipContent>
            </Tooltip>
            <span className="min-w-[40px] text-center text-xs font-medium text-muted-foreground">{zoom}%</span>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleZoomIn} disabled={zoom >= 200}>
                  <ZoomIn className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Zoom In</TooltipContent>
            </Tooltip>

            <div className="mx-1 h-5 w-px bg-border" />

            {/* Rotate */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleRotate}>
                  <RotateCw className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Rotate 90°</TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </div>

      {/* Viewer Area */}
      {viewMode === "vertical" ? (
        <ScrollArea className="h-[600px]" ref={scrollRef}>
          <div className="flex flex-col items-center gap-6 bg-muted/30 p-6">
            {DUMMY_PAGES.map((page, i) => renderPage(page, i))}
          </div>
        </ScrollArea>
      ) : (
        <div className="flex h-[600px] flex-col bg-muted/30">
          <div className="flex flex-1 items-center justify-center overflow-auto p-6">
            {renderPage(DUMMY_PAGES[currentPage], currentPage)}
          </div>
          {/* Pagination */}
          <div className="flex items-center justify-center gap-3 border-t bg-muted/40 px-4 py-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1 text-xs"
              onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
              disabled={currentPage === 0}
            >
              <ChevronLeft className="h-3.5 w-3.5" /> Previous
            </Button>
            <span className="text-xs font-medium text-muted-foreground">
              Page {currentPage + 1} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1 text-xs"
              onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={currentPage === totalPages - 1}
            >
              Next <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScriptPDFViewer;
