import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { employees, companies } from "@/data/mockData";
import { Download, FileText, Building2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generateIndividualReport, generateCompanyReport } from "@/utils/reportGenerator";

export default function Reports() {
  const completed = employees.filter(e => e.testStatus === "completed");

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Reports</h1>
          <p className="text-muted-foreground text-sm">Download individual and company assessment reports</p>
        </div>

        <Tabs defaultValue="individual" className="space-y-4">
          <TabsList>
            <TabsTrigger value="individual" className="gap-1.5 text-xs">
              <FileText className="w-3.5 h-3.5" /> Individual Reports
            </TabsTrigger>
            <TabsTrigger value="company" className="gap-1.5 text-xs">
              <Building2 className="w-3.5 h-3.5" /> Company Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="individual">
            <Card className="border-border">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Classification</TableHead>
                      <TableHead>Completed</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {completed.map(emp => (
                      <TableRow key={emp.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-xs font-bold shrink-0">
                              {emp.name.split(" ").map(n => n[0]).join("")}
                            </div>
                            <div>
                              <p className="text-sm font-medium">{emp.name}</p>
                              <p className="text-xs text-muted-foreground">{emp.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{emp.companyName}</TableCell>
                        <TableCell className="text-sm font-bold">{emp.overallScore}%</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              emp.classification?.includes("HiPo") ? "text-success border-success/20"
                              : emp.classification?.includes("Risk") ? "text-destructive border-destructive/20"
                              : "text-warning border-warning/20"
                            }`}
                          >
                            {emp.classification?.includes("HiPo") ? "HiPo" : emp.classification?.includes("Risk") ? "Risk" : "Average"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{emp.completedAt}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm" onClick={() => generateIndividualReport(emp)}>
                            <Download className="w-3.5 h-3.5 mr-1" /> PDF
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="company">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {companies.map(company => {
                const companyEmps = employees.filter(e => e.companyId === company.id);
                const compCompleted = companyEmps.filter(e => e.testStatus === "completed");
                return (
                  <Card key={company.id} className="border-border hover:shadow-glow transition-all duration-300">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{company.name}</h3>
                          <p className="text-xs text-muted-foreground">{company.industry}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="p-2 rounded-lg bg-muted/50 text-center">
                          <p className="font-bold text-primary">{companyEmps.length}</p>
                          <p className="text-[10px] text-muted-foreground">Employees</p>
                        </div>
                        <div className="p-2 rounded-lg bg-muted/50 text-center">
                          <p className="font-bold text-success">{compCompleted.length}</p>
                          <p className="text-[10px] text-muted-foreground">Completed</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => generateCompanyReport(company, companyEmps)}
                        disabled={compCompleted.length === 0}
                      >
                        <Download className="w-4 h-4 mr-2" /> Download Company Report
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
