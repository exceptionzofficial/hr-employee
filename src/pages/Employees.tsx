import DashboardLayout from "@/components/DashboardLayout";
import { employees, companies } from "@/data/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Search, Download, Mail, UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { generateIndividualReport } from "@/utils/reportGenerator";

export default function Employees() {
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [inviteData, setInviteData] = useState({ name: "", email: "", companyId: "" });

  const filtered = employees.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.companyName.toLowerCase().includes(search.toLowerCase()) ||
    e.employeeId.toLowerCase().includes(search.toLowerCase())
  );

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteData.name || !inviteData.email || !inviteData.companyId) {
      toast.error("Please fill all fields");
      return;
    }
    const company = companies.find(c => c.id === inviteData.companyId);
    const newId = `EMP${String(Math.floor(Math.random() * 9000 + 1000))}`;
    toast.success(`Invitation sent to ${inviteData.email}. Employee ID: ${newId} — Company: ${company?.name}`);
    setDialogOpen(false);
    setInviteData({ name: "", email: "", companyId: "" });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1">Employees</h1>
            <p className="text-muted-foreground text-sm">Manage employees across all companies</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-primary text-primary-foreground border-0">
                <UserPlus className="w-4 h-4 mr-2" /> Invite Employee
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-primary" /> Invite Employee
                </DialogTitle>
                <DialogDescription>Send an invitation email to a new employee</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleInvite} className="space-y-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input placeholder="Employee name" value={inviteData.name} onChange={e => setInviteData(p => ({ ...p, name: e.target.value }))} required />
                </div>
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <Input type="email" placeholder="employee@company.com" value={inviteData.email} onChange={e => setInviteData(p => ({ ...p, email: e.target.value }))} required />
                </div>
                <div className="space-y-2">
                  <Label>Company</Label>
                  <Select value={inviteData.companyId} onValueChange={v => setInviteData(p => ({ ...p, companyId: v }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select company" />
                    </SelectTrigger>
                    <SelectContent>
                      {companies.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="p-3 rounded-lg bg-muted/50 text-xs text-muted-foreground">
                  <p>📧 An invitation email will be sent with registration link and company code.</p>
                  <p className="mt-1">A unique Employee ID will be auto-generated upon registration.</p>
                </div>
                <div className="flex gap-3 justify-end pt-2">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                  <Button type="submit" className="gradient-primary text-primary-foreground border-0">
                    <Mail className="w-4 h-4 mr-2" /> Send Invitation
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search employees..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        <Card className="border-border">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Classification</TableHead>
                  <TableHead>Report</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(emp => (
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
                    <TableCell className="text-sm">{emp.companyName}</TableCell>
                    <TableCell>
                      <Badge variant={emp.testStatus === "completed" ? "default" : emp.testStatus === "in_progress" ? "secondary" : "outline"} className="text-xs capitalize">
                        {emp.testStatus.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm font-medium">{emp.overallScore ? `${emp.overallScore}%` : "—"}</TableCell>
                    <TableCell>
                      {emp.classification ? (
                        <Badge variant="outline" className={`text-xs ${
                          emp.classification.includes("HiPo") ? "text-success border-success/20"
                          : emp.classification.includes("Risk") ? "text-destructive border-destructive/20"
                          : "text-warning border-warning/20"
                        }`}>
                          {emp.classification.includes("HiPo") ? "HiPo" : emp.classification.includes("Risk") ? "Risk" : "Average"}
                        </Badge>
                      ) : "—"}
                    </TableCell>
                    <TableCell>
                      {emp.testStatus === "completed" ? (
                        <Button variant="outline" size="sm" onClick={() => generateIndividualReport(emp)}>
                          <Download className="w-3.5 h-3.5 mr-1" /> PDF
                        </Button>
                      ) : "—"}
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
