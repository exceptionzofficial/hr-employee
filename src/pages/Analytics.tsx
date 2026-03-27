import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { employees, companies } from "@/data/mockData";
import { SECTIONS, SECTION_COLORS } from "@/data/questions";
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ScatterChart, Scatter, ZAxis, Cell
} from "recharts";

// 9-Box Grid data
const nineBoxData = employees.filter(e => e.overallScore).map(e => ({
  name: e.name,
  performance: e.overallScore || 0,
  potential: Math.min(100, (e.overallScore || 0) + Math.floor(Math.random() * 20) - 10),
  classification: e.classification,
}));

const SCATTER_COLORS: Record<string, string> = {
  "High Potential (HiPo)": "hsl(142, 71%, 45%)",
  "Average Performer": "hsl(38, 92%, 50%)",
  "Risk Candidate": "hsl(0, 84%, 60%)",
};

export default function Analytics() {
  const companyComparison = companies.map(c => ({
    name: c.name.split(" ")[0],
    score: c.avgScore,
    employees: c.employeeCount,
  }));

  // Mock section averages
  const sectionAvg = SECTIONS.map(s => ({
    section: s.split(" ")[0],
    average: Math.floor(Math.random() * 30) + 55,
    fullMark: 100,
  }));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Analytics</h1>
          <p className="text-muted-foreground text-sm">Deep insights across all assessments</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* 9-Box Grid */}
          <Card className="border-border lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">9-Box Grid — Performance vs Potential</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <ResponsiveContainer width="100%" height={350}>
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
                    <XAxis type="number" dataKey="performance" name="Performance" domain={[0, 100]} label={{ value: "Performance →", position: "bottom", fontSize: 12 }} />
                    <YAxis type="number" dataKey="potential" name="Potential" domain={[0, 100]} label={{ value: "Potential →", angle: -90, position: "left", fontSize: 12 }} />
                    <ZAxis range={[80, 80]} />
                    <Tooltip cursor={{ strokeDasharray: "3 3" }} content={({ payload }) => {
                      if (!payload?.[0]) return null;
                      const d = payload[0].payload;
                      return (
                        <div className="bg-card border border-border rounded-lg p-2 shadow-lg text-xs">
                          <p className="font-medium">{d.name}</p>
                          <p>Performance: {d.performance}%</p>
                          <p>Potential: {d.potential}%</p>
                        </div>
                      );
                    }} />
                    <Scatter data={nineBoxData}>
                      {nineBoxData.map((d, i) => (
                        <Cell key={i} fill={SCATTER_COLORS[d.classification || "Average Performer"]} />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
                {/* Grid overlay lines */}
                <div className="absolute inset-0 pointer-events-none" style={{ left: "60px", right: "20px", top: "20px", bottom: "40px" }}>
                  <div className="absolute left-1/3 top-0 bottom-0 border-l border-dashed border-border/50" />
                  <div className="absolute left-2/3 top-0 bottom-0 border-l border-dashed border-border/50" />
                  <div className="absolute top-1/3 left-0 right-0 border-t border-dashed border-border/50" />
                  <div className="absolute top-2/3 left-0 right-0 border-t border-dashed border-border/50" />
                </div>
              </div>
              <div className="flex justify-center gap-6 mt-2">
                {Object.entries(SCATTER_COLORS).map(([label, color]) => (
                  <div key={label} className="flex items-center gap-1.5 text-xs">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                    {label.includes("HiPo") ? "HiPo" : label.includes("Risk") ? "Risk" : "Average"}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Competency Radar */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-base">Organization Competency Map</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={sectionAvg}>
                  <PolarGrid stroke="hsl(220, 13%, 91%)" />
                  <PolarAngleAxis dataKey="section" tick={{ fontSize: 10 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
                  <Radar dataKey="average" stroke="hsl(262, 83%, 58%)" fill="hsl(262, 83%, 58%)" fillOpacity={0.3} />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Company Comparison */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-base">Company Score Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={companyComparison}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="score" fill="hsl(221, 83%, 53%)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}