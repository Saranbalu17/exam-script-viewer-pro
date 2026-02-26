import AppLayout from "@/components/AppLayout";
import { subjects, departments } from "@/data/mockData";

const SubjectsPage = () => {
  return (
    <AppLayout title="Subjects" subtitle="Course subjects across departments">
      <div className="rounded-lg border bg-card">
        <div className="border-b px-5 py-4">
          <h3 className="text-sm font-semibold text-foreground">All Subjects</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Code</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Subject Name</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Department</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {subjects.map((sub) => {
                const dept = departments.find((d) => d.id === sub.departmentId);
                return (
                  <tr key={sub.id} className="transition-colors hover:bg-muted/20">
                    <td className="px-5 py-3">
                      <span className="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">{sub.code}</span>
                    </td>
                    <td className="px-5 py-3 text-sm font-medium text-foreground">{sub.name}</td>
                    <td className="px-5 py-3 text-sm text-muted-foreground">{dept?.name}</td>
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

export default SubjectsPage;
