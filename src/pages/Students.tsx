import AppLayout from "@/components/AppLayout";
import { students, departments } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const StudentsPage = () => {
  const [search, setSearch] = useState("");

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.rollNumber.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout title="Students" subtitle="Registered student directory">
      <div className="rounded-lg border bg-card">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h3 className="text-sm font-semibold text-foreground">All Students</h3>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search students..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 text-sm" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Name</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Roll Number</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Department</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Semester</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((s) => {
                const dept = departments.find((d) => d.id === s.departmentId);
                return (
                  <tr key={s.id} className="transition-colors hover:bg-muted/20">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                          {s.name.charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-foreground">{s.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-sm text-muted-foreground">{s.rollNumber}</td>
                    <td className="px-5 py-3">
                      <span className="rounded-md bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">{dept?.code}</span>
                    </td>
                    <td className="px-5 py-3 text-sm text-foreground">{s.semester}</td>
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

export default StudentsPage;
