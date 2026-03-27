import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { companies, employees } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  ArrowLeft, Download, Users, ClipboardList, TrendingUp, AlertTriangle,
  Award, FileText, Building2, Mail, BarChart3
} from "lucide-react";
import { generateIndividualReport, generateCompanyReport } from "@/utils/reportGenerator";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from "recharts";
import { SECTIONS } from "@/data/questions";

const PIE_COLORS = ["hsl(142, 71%, 45%)", "hsl(38, 92%, 50%)", "hsl(0, 84%, 60%)"];

export default function CompanyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const company = companies.find(c => c.id === id);
  const companyEmployees = employees.filter(e => e.companyId === id);
  const completed = companyEmployees.filter(e => e.testStatus === "completed");
  const pending = companyEmployees.filter(e => e.testStatus === "pending");
  const inProgress = companyEmployees.filter(e => e.testStatus === "in_progress");

  if (!company) {
    return (
      <DashboardLayout>
        <div className="text-center py-20">
          <h2 className="text-xl font-bold">Company not found</h2>
          <Button variant="outline" onClick={() => navigate("/companies")} className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Companies
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const avgScore = completed.length > 0
    ? Math.round(completed.reduce((s, e) => s + (e.overallScore || 0), 0) / completed.length)
    : 0;

  const hiPo = completed.filter(e => e.classification?.includes("HiPo")).length;
  const avgPerf = completed.filter(e => e.classification === "Average Performer").length;
  const risk = completed.filter(e => e.classification?.includes("Risk")).length;

  const classificationData = [
    { name: "HiPo", value: hiPo },
    { name: "Average", value: avgPerf },
    { name: "Risk", value: risk },
  ];

  const sectionAvg = SECTIONS.map(s => {
    const scores = completed.map(e => e.sectionScores?.[s] ?? 0).filter(v => v > 0);
    return {
      section: s.split(" ")[0],
      average: scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0,
      fullMark: 100,
    };
  });

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/companies")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{company.name}</h1>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span>{company.industry}</span>
                    <span>•</span>
                    <span>Code: <strong className="text-primary">{company.uniqueCode}</strong></span>
                    <span>•</span>
                    <span>{company.contactEmail}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Button onClick={() => generateCompanyReport(company, companyEmployees)} className="gradient-primary text-primary-foreground border-0">
            <Download className="w-4 h-4 mr-2" /> Download Report
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total Employees", value: companyEmployees.length, icon: Users, color: "text-primary" },
            { label: "Completed", value: completed.length, icon: ClipboardList, color: "text-success" },
            { label: "Avg Score", value: `${avgScore}%`, icon: TrendingUp, color: "text-accent" },
            { label: "HiPo Count", value: hiPo, icon: Award, color: "text-warning" },
          ].map(s => (
            <Card key={s.label} className="border-border">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <s.icon className={`w-5 h-5 ${s.color}`} />
                </div>
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-base">Classification Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={classificationData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                    {classificationData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-6 mt-2">
                {classificationData.map((d, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-xs">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }} />
                    {d.name} ({d.value})
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-base">Competency Radar</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <RadarChart data={sectionAvg}>
                  <PolarGrid stroke="hsl(220, 13%, 91%)" />
                  <PolarAngleAxis dataKey="section" tick={{ fontSize: 9 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 9 }} />
                  <Radar dataKey="average" stroke="hsl(221, 83%, 53%)" fill="hsl(221, 83%, 53%)" fillOpacity={0.3} />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Completion Progress */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-base">Test Completion Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "Completed", count: completed.length, total: companyEmployees.length, color: "bg-success" },
              { label: "In Progress", count: inProgress.length, total: companyEmployees.length, color: "bg-primary" },
              { label: "Pending", count: pending.length, total: companyEmployees.length, color: "bg-warning" },
            ].map(item => (
              <div key={item.label} className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="font-medium">{item.count} / {item.total}</span>
                </div>
                <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.color} transition-all duration-700`}
                    style={{ width: `${item.total > 0 ? (item.count / item.total) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Employee Table */}
        <Card className="border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Employees ({companyEmployees.length})</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Classification</TableHead>
                  <TableHead>Completed</TableHead>
                  <TableHead>Report</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {companyEmployees.map(emp => (
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
                    <TableCell className="text-sm font-mono text-muted-foreground">{emp.employeeId}</TableCell>
                    <TableCell>
                      <Badge
                        variant={emp.testStatus === "completed" ? "default" : emp.testStatus === "in_progress" ? "secondary" : "outline"}
                        className="text-xs capitalize"
                      >
                        {emp.testStatus.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm font-bold">{emp.overallScore ? `${emp.overallScore}%` : "—"}</TableCell>
                    <TableCell>
                      {emp.classification ? (
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            emp.classification.includes("HiPo") ? "text-success border-success/20"
                            : emp.classification.includes("Risk") ? "text-destructive border-destructive/20"
                            : "text-warning border-warning/20"
                          }`}
                        >
                          {emp.classification.includes("HiPo") ? "HiPo" : emp.classification.includes("Risk") ? "Risk" : "Average"}
                        </Badge>
                      ) : "—"}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{emp.completedAt || "—"}</TableCell>
                    <TableCell>
                      {emp.testStatus === "completed" ? (
                        <Button variant="outline" size="sm" onClick={() => generateIndividualReport(emp)}>
                          <Download className="w-3.5 h-3.5 mr-1" /> PDF
                        </Button>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
