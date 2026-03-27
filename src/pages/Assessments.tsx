import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SECTIONS } from "@/data/questions";
import { companies } from "@/data/mockData";
import { Plus, Settings, X } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

const mockAssessments = companies.slice(0, 6).map((c, i) => ({
  id: `a${i + 1}`,
  companyId: c.id,
  companyName: c.name,
  sections: SECTIONS.slice(0, 7 + (i % 4)),
  duration: 45,
  status: i < 2 ? "active" : i < 4 ? "draft" : "completed",
  assignedCount: c.employeeCount,
  completedCount: c.testsCompleted,
}));

export default function Assessments() {
  const [configOpen, setConfigOpen] = useState<string | null>(null);
  const [configs, setConfigs] = useState<Record<string, { duration: number; sections: Record<string, boolean>; shuffle: boolean }>>({});

  const getConfig = (id: string) => {
    if (configs[id]) return configs[id];
    const defaultSections: Record<string, boolean> = {};
    SECTIONS.forEach(s => defaultSections[s] = true);
    return { duration: 45, sections: defaultSections, shuffle: true };
  };

  const updateConfig = (id: string, key: string, value: any) => {
    setConfigs(prev => ({
      ...prev,
      [id]: { ...getConfig(id), [key]: value },
    }));
  };

  const toggleSection = (id: string, section: string) => {
    const config = getConfig(id);
    const updated = { ...config.sections, [section]: !config.sections[section] };
    updateConfig(id, "sections", updated);
  };

  const saveConfig = () => {
    toast.success("Assessment configuration saved successfully");
    setConfigOpen(null);
  };

  const currentAssessment = mockAssessments.find(a => a.id === configOpen);
  const currentConfig = configOpen ? getConfig(configOpen) : null;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1">Assessments</h1>
            <p className="text-muted-foreground text-sm">Configure and manage test assignments per company</p>
          </div>
          <Button className="bg-sky hover:bg-sky/90 text-white border-0 shadow-md transition-all" onClick={() => toast.info("Create a new company first, then configure its assessment")}>
            <Plus className="w-4 h-4 mr-2" /> Create Assessment
          </Button>
        </div>

        <div className="space-y-4">
          {mockAssessments.map(a => (
            <Card key={a.id} className="border-border hover:shadow-glow transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{a.companyName}</h3>
                      <Badge
                        variant="secondary"
                        className={`text-xs capitalize ${a.status === "active" ? "bg-emerald text-white" : a.status === "draft" ? "bg-violet text-white" : "bg-muted text-muted-foreground"}`}
                      >
                        {a.status}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {(configs[a.id] ? SECTIONS.filter(s => configs[a.id].sections[s]) : a.sections).map(s => (
                        <Badge key={s} variant="outline" className="text-[10px] font-normal">{s}</Badge>
                      ))}
                    </div>
                    <div className="flex gap-4 text-xs text-muted-foreground">
                      <span>{configs[a.id]?.duration || a.duration} min duration</span>
                      <span>{a.assignedCount} assigned</span>
                      <span>{a.completedCount} completed</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setConfigOpen(a.id)} className="border-sky text-sky hover:bg-sky/5 transition-colors">
                    <Settings className="w-3.5 h-3.5 mr-1" /> Configure
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Configure Dialog */}
        <Dialog open={!!configOpen} onOpenChange={(open) => !open && setConfigOpen(null)}>
          <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary" />
                Configure: {currentAssessment?.companyName}
              </DialogTitle>
              <DialogDescription>Customize assessment settings for this company</DialogDescription>
            </DialogHeader>
            {currentConfig && configOpen && (
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label>Test Duration (minutes)</Label>
                  <Input
                    type="number"
                    min={10}
                    max={180}
                    value={currentConfig.duration}
                    onChange={e => updateConfig(configOpen, "duration", Number(e.target.value))}
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="text-sm font-medium">Shuffle Questions</p>
                    <p className="text-xs text-muted-foreground">Randomize question order per candidate</p>
                  </div>
                  <Switch
                    checked={currentConfig.shuffle}
                    onCheckedChange={v => updateConfig(configOpen, "shuffle", v)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Assessment Sections</Label>
                  <p className="text-xs text-muted-foreground mb-2">Enable or disable sections for this company</p>
                  <div className="space-y-1.5">
                    {SECTIONS.map(section => (
                      <div key={section} className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary/20 transition-colors">
                        <div className="flex items-center gap-3">
                          <Switch
                            checked={currentConfig.sections[section] ?? true}
                            onCheckedChange={() => toggleSection(configOpen, section)}
                          />
                          <span className="text-sm">{section}</span>
                        </div>
                        <Badge variant={currentConfig.sections[section] ? "default" : "secondary"} className="text-[10px]">
                          {currentConfig.sections[section] ? "On" : "Off"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 justify-end pt-2">
                  <Button variant="outline" onClick={() => setConfigOpen(null)}>Cancel</Button>
                  <Button onClick={saveConfig} className="bg-emerald hover:bg-emerald/90 text-white border-0 shadow-lg transition-all">
                    Save Configuration
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
