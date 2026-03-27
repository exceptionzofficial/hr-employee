import { useState, useEffect, useMemo } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { SECTIONS, SECTION_COLORS } from "@/data/questions";
import { apiFetch } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Award, TrendingUp, AlertTriangle, Download, Loader2 } from "lucide-react";
import { generateIndividualReport } from "@/utils/reportGenerator";
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell
} from "recharts";
import { toast } from "sonner";

export default function Results() {
  const [assessment, setAssessment] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const results = await apiFetch("/assessments");
        // Get the latest assessment
        if (results && results.length > 0) {
          setAssessment(results.sort((a: any, b: any) => 
            new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
          )[0]);
        }
      } catch (error) {
        toast.error("Failed to load results");
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Generating your profile...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!assessment) {
    return (
      <DashboardLayout>
        <div className="text-center py-20">
          <AlertTriangle className="w-12 h-12 text-warning mx-auto mb-4" />
          <h2 className="text-xl font-bold">No results found</h2>
          <p className="text-muted-foreground mt-2">Please complete the assessment first.</p>
          <Button onClick={() => window.location.href = "/test"} className="mt-6 bg-sky hover:bg-sky/90 text-white border-0 shadow-lg transition-all">
            Go to Test
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const scores = assessment.sectionScores;
  const classification = assessment.classification;
  const overallPercentage = assessment.overallScore;

  const radarData = SECTIONS.map(s => ({ section: s.split(" ")[0], score: scores[s], fullMark: 100 }));
  const barData = SECTIONS.map(s => ({ name: s.length > 12 ? s.split(" ")[0] : s, score: scores[s], fill: SECTION_COLORS[s] }));
  const strengths = SECTIONS.filter(s => scores[s] >= 75).sort((a, b) => scores[b] - scores[a]);
  const weaknesses = SECTIONS.filter(s => scores[s] < 50).sort((a, b) => scores[a] - scores[b]);

  const handleDownload = () => {
    generateIndividualReport({
      ...assessment,
      testStatus: "completed",
    });
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1">Assessment Results</h1>
            <p className="text-muted-foreground text-sm">Your comprehensive psychometric profile</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge className={`text-sm px-4 py-1.5 ${classification === "High Potential (HiPo)" ? "bg-success/10 text-success border-success/20" : classification === "Risk Candidate" ? "bg-destructive/10 text-destructive border-destructive/20" : "bg-warning/10 text-warning border-warning/20"}`} variant="outline">
              {classification}
            </Badge>
            <Button variant="outline" size="sm" onClick={handleDownload} className="border-emerald text-emerald hover:bg-emerald/5 transition-colors">
              <Download className="w-4 h-4 mr-1" /> Download PDF
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border-border">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-violet mx-auto mb-3 flex items-center justify-center shadow-lg">
                <span className="text-2xl font-bold text-white">{overallPercentage}</span>
              </div>
              <p className="text-sm font-medium">Overall Score</p>
              <p className="text-xs text-muted-foreground">Out of 100%</p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-8 h-8 text-success mx-auto mb-3" />
              <p className="text-sm font-medium">Top Strength</p>
              <p className="text-xs text-muted-foreground">{strengths[0] || "N/A"}</p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="p-6 text-center">
              <AlertTriangle className="w-8 h-8 text-warning mx-auto mb-3" />
              <p className="text-sm font-medium">Growth Area</p>
              <p className="text-xs text-muted-foreground">{weaknesses[0] || "None identified"}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="border-border">
            <CardHeader><CardTitle className="text-base">Competency Radar</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="hsl(220, 13%, 91%)" />
                  <PolarAngleAxis dataKey="section" tick={{ fontSize: 10 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
                  <Radar dataKey="score" stroke="hsl(221, 83%, 53%)" fill="hsl(221, 83%, 53%)" fillOpacity={0.3} />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardHeader><CardTitle className="text-base">Section Scores</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10 }} />
                  <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="score" radius={[0, 6, 6, 0]}>
                    {barData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card className="border-border">
          <CardHeader><CardTitle className="text-base">Detailed Section Breakdown</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {SECTIONS.map(section => (
              <div key={section} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{section}</span>
                  <span className="text-sm font-bold" style={{ color: SECTION_COLORS[section] }}>{scores[section]}%</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${scores[section]}%`, backgroundColor: SECTION_COLORS[section] }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="grid sm:grid-cols-2 gap-6">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2"><Award className="w-4 h-4 text-success" /> Strengths</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {strengths.length > 0 ? strengths.map(s => (
                <div key={s} className="flex items-center justify-between p-2 rounded-lg bg-success/5">
                  <span className="text-sm">{s}</span>
                  <Badge variant="outline" className="text-success border-success/20">{scores[s]}%</Badge>
                </div>
              )) : <p className="text-sm text-muted-foreground">Complete the assessment to see strengths</p>}
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-warning" /> Areas for Growth</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {weaknesses.length > 0 ? weaknesses.map(s => (
                <div key={s} className="flex items-center justify-between p-2 rounded-lg bg-warning/5">
                  <span className="text-sm">{s}</span>
                  <Badge variant="outline" className="text-warning border-warning/20">{scores[s]}%</Badge>
                </div>
              )) : <p className="text-sm text-muted-foreground">No major growth areas identified</p>}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
