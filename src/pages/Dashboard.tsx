import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import { ClipboardList, Award, CheckCircle2, Clock, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { apiFetch } from "@/lib/api";
import { SECTIONS } from "@/data/questions";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

function EmployeeDashboard() {
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        setLoading(true);
        const results = await apiFetch("/assessments");
        if (results && results.length > 0) {
          setAssessment(results.sort((a: any, b: any) => 
            new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
          )[0]);
        }
      } catch (error) {
        toast.error("Failed to load assessment status");
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold mb-1">Welcome back</h1>
        <p className="text-muted-foreground text-sm">Your assessment overview</p>
      </div>
      
      <div className="grid sm:grid-cols-2 gap-4">
        <StatCard 
          title="Assessment Status" 
          value={assessment ? "Completed" : "Ready"} 
          icon={assessment ? CheckCircle2 : ClipboardList} 
          subtitle={assessment ? `Finished on ${new Date(assessment.completedAt).toLocaleDateString()}` : "45 minutes • 90 questions"} 
          color="bg-emerald"
        />
        <StatCard 
          title="Overall Score" 
          value={assessment ? `${assessment.overallScore}%` : "—"} 
          icon={Award} 
          subtitle={assessment ? assessment.classification : "10 dimensions"} 
          color="bg-violet"
        />
      </div>

      {!assessment && (
        <Card className="border-border bg-primary/5 border-primary/20">
          <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-sky/10 flex items-center justify-center">
              <Clock className="w-6 h-6 text-sky" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Start Your Assessment</h3>
              <p className="text-sm text-muted-foreground max-w-md">Your psychometric assessment is ready. Complete it now to generate your behavioral profile and share it with your employer.</p>
            </div>
            <Button onClick={() => navigate("/test")} className="bg-sky hover:bg-sky/90 text-white border-0 px-8 shadow-lg transition-all">
              Begin Now
            </Button>
          </CardContent>
        </Card>
      )}

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-base">Assessment Sections</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {SECTIONS.map((s, i) => (
            <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
              <span className="text-sm">{s}</span>
              <Badge variant={assessment ? "default" : "outline"} className="text-xs">
                {assessment ? `${assessment.sectionScores[s]}%` : "Pending"}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {assessment && (
        <Button onClick={() => navigate("/results")} variant="outline" className="w-full">
          View Detailed Report
        </Button>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <EmployeeDashboard />
    </DashboardLayout>
  );
}
