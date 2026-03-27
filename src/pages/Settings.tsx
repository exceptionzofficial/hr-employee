import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SECTIONS } from "@/data/questions";
import { useAuth } from "@/contexts/AuthContext";
import {
  Settings as SettingsIcon, Shield, Bell, Clock, Brain,
  Save, Users, Building2, Mail, Globe, Palette, Lock,
  ToggleLeft, FileText, AlertTriangle
} from "lucide-react";
import { toast } from "sonner";

const defaultSectionConfig = SECTIONS.reduce((acc, s) => {
  acc[s] = { enabled: true, weight: 1 };
  return acc;
}, {} as Record<string, { enabled: boolean; weight: number }>);

export default function Settings() {
  const { user } = useAuth();
  const [platformName, setPlatformName] = useState("Perfy");
  const [supportEmail, setSupportEmail] = useState("support@perfy.com");
  const [testDuration, setTestDuration] = useState(45);
  const [autoSubmit, setAutoSubmit] = useState(true);
  const [shuffleQuestions, setShuffleQuestions] = useState(true);
  const [shuffleOptions, setShuffleOptions] = useState(true);
  const [showResults, setShowResults] = useState(true);
  const [emailOnComplete, setEmailOnComplete] = useState(true);
  const [emailReminders, setEmailReminders] = useState(true);
  const [reminderFrequency, setReminderFrequency] = useState("daily");
  const [sectionConfig, setSectionConfig] = useState(defaultSectionConfig);
  const [allowRetake, setAllowRetake] = useState(false);
  const [passingScore, setPassingScore] = useState(60);
  const [darkMode, setDarkMode] = useState(false);

  const toggleSection = (section: string) => {
    setSectionConfig(prev => ({
      ...prev,
      [section]: { ...prev[section], enabled: !prev[section].enabled },
    }));
  };

  const handleSave = () => {
    toast.success("Settings saved successfully");
  };

  if (user?.role !== "super_admin") {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="max-w-md w-full border-border">
            <CardContent className="p-8 text-center">
              <Lock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">Access Restricted</h2>
              <p className="text-muted-foreground text-sm">Only Super Admins can access platform settings.</p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1">Platform Settings</h1>
            <p className="text-muted-foreground text-sm">Configure your assessment platform</p>
          </div>
          <Button onClick={handleSave} className="gradient-primary text-primary-foreground border-0">
            <Save className="w-4 h-4 mr-2" /> Save Changes
          </Button>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="bg-muted/50 p-1 h-auto flex-wrap">
            <TabsTrigger value="general" className="gap-1.5 text-xs">
              <SettingsIcon className="w-3.5 h-3.5" /> General
            </TabsTrigger>
            <TabsTrigger value="test" className="gap-1.5 text-xs">
              <Brain className="w-3.5 h-3.5" /> Test Config
            </TabsTrigger>
            <TabsTrigger value="sections" className="gap-1.5 text-xs">
              <ToggleLeft className="w-3.5 h-3.5" /> Sections
            </TabsTrigger>
            <TabsTrigger value="access" className="gap-1.5 text-xs">
              <Shield className="w-3.5 h-3.5" /> Access Control
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-1.5 text-xs">
              <Bell className="w-3.5 h-3.5" /> Notifications
            </TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Globe className="w-4 h-4 text-primary" /> Platform Information
                </CardTitle>
                <CardDescription>Basic platform configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Platform Name</Label>
                    <Input value={platformName} onChange={e => setPlatformName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Support Email</Label>
                    <Input type="email" value={supportEmail} onChange={e => setSupportEmail(e.target.value)} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Palette className="w-4 h-4 text-primary" /> Appearance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                  <div>
                    <p className="text-sm font-medium">Dark Mode</p>
                    <p className="text-xs text-muted-foreground">Enable dark theme for the portal</p>
                  </div>
                  <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Test Configuration */}
          <TabsContent value="test" className="space-y-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" /> Timer & Submission
                </CardTitle>
                <CardDescription>Configure test timing and submission behavior</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Test Duration (minutes)</Label>
                    <Input type="number" value={testDuration} onChange={e => setTestDuration(Number(e.target.value))} min={10} max={180} />
                  </div>
                  <div className="space-y-2">
                    <Label>Passing Score (%)</Label>
                    <Input type="number" value={passingScore} onChange={e => setPassingScore(Number(e.target.value))} min={0} max={100} />
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    { label: "Auto-submit on timeout", desc: "Automatically submit test when timer expires", checked: autoSubmit, onChange: setAutoSubmit },
                    { label: "Shuffle questions", desc: "Randomize question order for each test taker", checked: shuffleQuestions, onChange: setShuffleQuestions },
                    { label: "Shuffle answer options", desc: "Randomize MCQ option order", checked: shuffleOptions, onChange: setShuffleOptions },
                    { label: "Allow retake", desc: "Allow employees to retake assessments", checked: allowRetake, onChange: setAllowRetake },
                    { label: "Show results to employees", desc: "Let employees view their results after completion", checked: showResults, onChange: setShowResults },
                  ].map(item => (
                    <div key={item.label} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                      <div>
                        <p className="text-sm font-medium">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                      <Switch checked={item.checked} onCheckedChange={item.onChange} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Section Management */}
          <TabsContent value="sections" className="space-y-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Brain className="w-4 h-4 text-primary" /> Assessment Sections
                </CardTitle>
                <CardDescription>Enable or disable sections for all assessments. Companies can further customize per-assessment.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {SECTIONS.map(section => {
                    const questionCounts: Record<string, number> = {
                      "Personality": 20, "Emotional Intelligence": 20, "Cognitive Ability": 10,
                      "Situational Judgment": 5, "Motivation": 10, "Culture Fit": 5,
                      "Behavioral Risk": 5, "Leadership": 5, "Communication": 5, "Learning Agility": 5,
                    };
                    return (
                      <div key={section} className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/20 transition-colors">
                        <div className="flex items-center gap-3">
                          <Switch
                            checked={sectionConfig[section]?.enabled ?? true}
                            onCheckedChange={() => toggleSection(section)}
                          />
                          <div>
                            <p className="text-sm font-medium">{section}</p>
                            <p className="text-xs text-muted-foreground">{questionCounts[section] || 5} questions</p>
                          </div>
                        </div>
                        <Badge variant={sectionConfig[section]?.enabled ? "default" : "secondary"} className="text-xs">
                          {sectionConfig[section]?.enabled ? "Active" : "Disabled"}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Access Control */}
          <TabsContent value="access" className="space-y-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" /> Role Permissions
                </CardTitle>
                <CardDescription>Manage what each role can access</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      role: "Super Admin", badge: "Full Access", color: "text-primary",
                      perms: ["Manage all companies", "Configure platform settings", "View all analytics", "Download all reports", "Manage question bank", "Control user access"],
                    },
                    {
                      role: "Company Admin", badge: "Company Scope", color: "text-accent",
                      perms: ["View own employees", "Monitor test progress", "Download company reports", "View company dashboard"],
                    },
                    {
                      role: "Employee", badge: "Limited", color: "text-muted-foreground",
                      perms: ["Take assigned tests", "View own results (if enabled)", "Update profile"],
                    },
                  ].map(r => (
                    <div key={r.role} className="p-4 rounded-lg border border-border">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-semibold">{r.role}</h4>
                        <Badge variant="outline" className={`text-xs ${r.color}`}>{r.badge}</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-1.5">
                        {r.perms.map(p => (
                          <p key={p} className="text-xs text-muted-foreground flex items-center gap-1.5">
                            <span className="w-1 h-1 rounded-full bg-primary shrink-0" />
                            {p}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Lock className="w-4 h-4 text-primary" /> Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { label: "Enforce single session", desc: "Prevent login from multiple devices" },
                  { label: "IP restriction", desc: "Restrict test-taking to specific IP ranges" },
                  { label: "Browser lockdown", desc: "Prevent tab switching during tests" },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div>
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <Switch />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" /> Email Notifications
                </CardTitle>
                <CardDescription>Configure automated email notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: "Test completion emails", desc: "Notify admins when an employee completes a test", checked: emailOnComplete, onChange: setEmailOnComplete },
                  { label: "Reminder emails", desc: "Send reminders to employees with pending tests", checked: emailReminders, onChange: setEmailReminders },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div>
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <Switch checked={item.checked} onCheckedChange={item.onChange} />
                  </div>
                ))}

                {emailReminders && (
                  <div className="space-y-2 p-4 rounded-lg border border-border">
                    <Label>Reminder Frequency</Label>
                    <Select value={reminderFrequency} onValueChange={setReminderFrequency}>
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="every_2_days">Every 2 Days</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-border border-warning/30 bg-warning/5">
              <CardContent className="p-4 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Email Delivery</p>
                  <p className="text-xs text-muted-foreground">
                    Email notifications require a backend service. Enable Lovable Cloud to activate automated emails.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
