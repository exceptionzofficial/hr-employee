import { Employee, Company } from "@/data/mockData";
import { SECTIONS } from "@/data/questions";

function generateBarSvg(data: { label: string; value: number; color: string }[], width = 500, barHeight = 24): string {
  const gap = 6;
  const labelWidth = 140;
  const height = data.length * (barHeight + gap) + 20;
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`;
  data.forEach((d, i) => {
    const y = i * (barHeight + gap) + 10;
    const barW = ((width - labelWidth - 60) * d.value) / 100;
    svg += `<text x="0" y="${y + barHeight / 2 + 4}" font-size="11" fill="#555" font-family="Inter, sans-serif">${d.label}</text>`;
    svg += `<rect x="${labelWidth}" y="${y}" width="${barW}" height="${barHeight}" rx="4" fill="${d.color}" />`;
    svg += `<text x="${labelWidth + barW + 8}" y="${y + barHeight / 2 + 4}" font-size="12" font-weight="600" fill="#333" font-family="Inter, sans-serif">${d.value}%</text>`;
  });
  svg += `</svg>`;
  return svg;
}

function generatePieSvg(data: { label: string; value: number; color: string }[], size = 200): string {
  const cx = size / 2, cy = size / 2, r = size * 0.35;
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) return "";
  let currentAngle = -90;
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size + 160}" height="${size}" viewBox="0 0 ${size + 160} ${size}">`;

  data.forEach((d, i) => {
    const sliceAngle = (d.value / total) * 360;
    const startRad = (currentAngle * Math.PI) / 180;
    const endRad = ((currentAngle + sliceAngle) * Math.PI) / 180;
    const x1 = cx + r * Math.cos(startRad);
    const y1 = cy + r * Math.sin(startRad);
    const x2 = cx + r * Math.cos(endRad);
    const y2 = cy + r * Math.sin(endRad);
    const largeArc = sliceAngle > 180 ? 1 : 0;
    svg += `<path d="M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${largeArc},1 ${x2},${y2} Z" fill="${d.color}" />`;
    // legend
    svg += `<rect x="${size + 10}" y="${20 + i * 25}" width="12" height="12" rx="2" fill="${d.color}" />`;
    svg += `<text x="${size + 28}" y="${31 + i * 25}" font-size="11" fill="#555" font-family="Inter, sans-serif">${d.label} (${d.value})</text>`;
    currentAngle += sliceAngle;
  });

  svg += `</svg>`;
  return svg;
}

export function generateIndividualReport(emp: Employee): void {
  const sections = SECTIONS;
  const sectionColors = [
    "#000000", "#1a1a1a", "#333333", "#4d4d4d", "#666666",
    "#808080", "#999999", "#b3b3b3", "#cccccc", "#e6e6e6"
  ];

  const barData = sections.map((s, i) => ({
    label: s.length > 18 ? s.substring(0, 16) + "…" : s,
    value: emp.sectionScores?.[s] ?? Math.floor(Math.random() * 40 + 50),
    color: sectionColors[i],
  }));

  const classification = emp.classification || "Average Performer";
  const classColor = classification.includes("HiPo") ? "#22c55e" : classification.includes("Risk") ? "#ef4444" : "#f59e0b";

  const strengths = barData.filter(d => d.value >= 80).sort((a, b) => b.value - a.value);
  const weaknesses = barData.filter(d => d.value < 60).sort((a, b) => a.value - b.value);

  const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8">
<title>Assessment Report - ${emp.name}</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Inter', sans-serif; color: #1a1a2e; background: #fff; }
  .page { max-width: 800px; margin: 0 auto; padding: 40px; }
  .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #000; padding-bottom: 20px; margin-bottom: 30px; }
  .logo { font-size: 28px; font-weight: 800; background: linear-gradient(135deg, #000, #444); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .badge { padding: 6px 16px; border-radius: 20px; font-size: 12px; font-weight: 600; color: white; }
  .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 20px 0; }
  .info-card { background: #f8fafc; border-radius: 12px; padding: 16px; }
  .info-card label { font-size: 11px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; }
  .info-card p { font-size: 15px; font-weight: 600; margin-top: 4px; }
  .section-title { font-size: 18px; font-weight: 700; margin: 30px 0 16px; padding-left: 12px; border-left: 4px solid #000; }
  .score-circle { width: 100px; height: 100px; border-radius: 50%; background: linear-gradient(135deg, #000, #444); display: flex; align-items: center; justify-content: center; color: white; font-size: 32px; font-weight: 800; margin: 0 auto; }
  .strength-item { display: flex; justify-content: space-between; padding: 8px 12px; background: #f0fdf4; border-radius: 8px; margin: 4px 0; font-size: 13px; }
  .weakness-item { display: flex; justify-content: space-between; padding: 8px 12px; background: #fffbeb; border-radius: 8px; margin: 4px 0; font-size: 13px; }
  .hr-remarks { background: #f8fafc; border-radius: 12px; padding: 20px; margin-top: 20px; font-size: 13px; line-height: 1.6; }
  .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; }
  @media print { body { print-color-adjust: exact; -webkit-print-color-adjust: exact; } .page { padding: 20px; } }
</style></head><body>
<div class="page">
  <div class="header">
    <div>
      <div class="logo">Perfy</div>
      <p style="font-size:12px;color:#64748b;margin-top:4px;">Individual Assessment Report</p>
    </div>
    <div style="text-align:right">
      <span class="badge" style="background:${classColor}">${classification}</span>
      <p style="font-size:11px;color:#94a3b8;margin-top:8px;">Generated: ${new Date().toLocaleDateString()}</p>
    </div>
  </div>

  <div class="grid2">
    <div class="info-card"><label>Employee Name</label><p>${emp.name}</p></div>
    <div class="info-card"><label>Employee ID</label><p>${emp.employeeId}</p></div>
    <div class="info-card"><label>Company</label><p>${emp.companyName}</p></div>
    <div class="info-card"><label>Email</label><p>${emp.email}</p></div>
    <div class="info-card"><label>Completed On</label><p>${emp.completedAt || "N/A"}</p></div>
    <div class="info-card"><label>Overall Score</label><p>${emp.overallScore}%</p></div>
  </div>

  <div style="text-align:center;margin:30px 0">
    <div class="score-circle">${emp.overallScore}</div>
    <p style="margin-top:8px;font-size:13px;color:#64748b">Overall Score</p>
  </div>

  <div class="section-title">Section-wise Performance</div>
  ${generateBarSvg(barData)}

  <div class="grid2" style="margin-top:30px">
    <div>
      <div class="section-title" style="margin-top:0">Strengths</div>
      ${strengths.length > 0 ? strengths.map(s => `<div class="strength-item"><span>${s.label}</span><strong style="color:#22c55e">${s.value}%</strong></div>`).join("") : '<p style="font-size:13px;color:#94a3b8;">No strong areas identified</p>'}
    </div>
    <div>
      <div class="section-title" style="margin-top:0">Areas for Growth</div>
      ${weaknesses.length > 0 ? weaknesses.map(s => `<div class="weakness-item"><span>${s.label}</span><strong style="color:#f59e0b">${s.value}%</strong></div>`).join("") : '<p style="font-size:13px;color:#94a3b8;">No weak areas identified</p>'}
    </div>
  </div>

  <div class="section-title">HR Insights & Remarks</div>
  <div class="hr-remarks">
    <p><strong>${emp.name}</strong> has been classified as <strong style="color:${classColor}">${classification}</strong> based on the psychometric evaluation.</p>
    <br/>
    <p>${classification.includes("HiPo") ? `This candidate demonstrates exceptional potential across multiple dimensions. Recommended for leadership development programs and fast-track career advancement. Key strengths include high cognitive ability and emotional intelligence.` : classification.includes("Risk") ? `This candidate shows areas that require immediate attention. Recommended for targeted coaching and mentorship programs. Focus areas include behavioral risk management and situational judgment improvement.` : `This candidate shows solid performance across most dimensions. Recommended for skill development programs to elevate performance. With targeted coaching, this individual has potential for growth.`}</p>
  </div>

  <div class="footer">
    <p>Perfy Psychometric Assessment Platform • Confidential Report</p>
    <p>This report is auto-generated and intended for authorized HR personnel only.</p>
  </div>
</div>
</body></html>`;

  const win = window.open("", "_blank");
  if (win) {
    win.document.write(html);
    win.document.close();
    setTimeout(() => win.print(), 500);
  }
}

export function generateCompanyReport(company: Company, companyEmployees: Employee[]): void {
  const completed = companyEmployees.filter(e => e.testStatus === "completed");
  const avgScore = completed.length > 0 ? Math.round(completed.reduce((s, e) => s + (e.overallScore || 0), 0) / completed.length) : 0;

  const hiPo = completed.filter(e => e.classification?.includes("HiPo")).length;
  const avg = completed.filter(e => e.classification === "Average Performer").length;
  const risk = completed.filter(e => e.classification?.includes("Risk")).length;

  const sectionColors = [
    "#000000", "#1a1a1a", "#333333", "#4d4d4d", "#666666",
    "#808080", "#999999", "#b3b3b3", "#cccccc", "#e6e6e6"
  ];

  const sectionAverages = SECTIONS.map((s, i) => {
    const scores = completed.map(e => e.sectionScores?.[s] ?? 0).filter(v => v > 0);
    const average = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    return { label: s.length > 18 ? s.substring(0, 16) + "…" : s, value: average, color: sectionColors[i] };
  });

  const pieData = [
    { label: "HiPo", value: hiPo, color: "#22c55e" },
    { label: "Average", value: avg, color: "#f59e0b" },
    { label: "Risk", value: risk, color: "#ef4444" },
  ];

  const topPerformers = [...completed].sort((a, b) => (b.overallScore || 0) - (a.overallScore || 0)).slice(0, 5);

  const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8">
<title>Company Report - ${company.name}</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Inter', sans-serif; color: #1a1a2e; background: #fff; }
  .page { max-width: 800px; margin: 0 auto; padding: 40px; }
  .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #000; padding-bottom: 20px; margin-bottom: 30px; }
  .logo { font-size: 28px; font-weight: 800; background: linear-gradient(135deg, #000, #444); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .grid4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin: 20px 0; }
  .stat-card { background: #f8fafc; border-radius: 12px; padding: 16px; text-align: center; }
  .stat-card .value { font-size: 28px; font-weight: 800; color: #000; }
  .stat-card .label { font-size: 11px; color: #94a3b8; margin-top: 2px; }
  .section-title { font-size: 18px; font-weight: 700; margin: 30px 0 16px; padding-left: 12px; border-left: 4px solid #000; }
  .emp-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 12px; border-bottom: 1px solid #f1f5f9; font-size: 13px; }
  .emp-row:last-child { border-bottom: none; }
  .badge { padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 600; color: white; }
  .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; }
  @media print { body { print-color-adjust: exact; -webkit-print-color-adjust: exact; } }
</style></head><body>
<div class="page">
  <div class="header">
    <div>
      <div class="logo">Perfy</div>
      <p style="font-size:12px;color:#64748b;margin-top:4px;">Company Assessment Report</p>
    </div>
    <div style="text-align:right">
      <p style="font-size:16px;font-weight:700;">${company.name}</p>
      <p style="font-size:11px;color:#94a3b8;margin-top:4px;">Generated: ${new Date().toLocaleDateString()}</p>
    </div>
  </div>

  <div class="grid4">
    <div class="stat-card"><div class="value">${companyEmployees.length}</div><div class="label">Total Employees</div></div>
    <div class="stat-card"><div class="value">${completed.length}</div><div class="label">Completed</div></div>
    <div class="stat-card"><div class="value">${avgScore}%</div><div class="label">Avg Score</div></div>
    <div class="stat-card"><div class="value">${hiPo}</div><div class="label">HiPo</div></div>
  </div>

  <div class="section-title">Employee Classification</div>
  <div style="display:flex;align-items:center;gap:40px;margin:16px 0">
    ${generatePieSvg(pieData, 180)}
  </div>

  <div class="section-title">Section-wise Performance (Average)</div>
  ${generateBarSvg(sectionAverages)}

  <div class="section-title">Top Performers</div>
  <div style="background:#f8fafc;border-radius:12px;padding:12px;">
    ${topPerformers.map((e, i) => {
      const classColor = e.classification?.includes("HiPo") ? "#22c55e" : e.classification?.includes("Risk") ? "#ef4444" : "#f59e0b";
      return `<div class="emp-row">
        <div style="display:flex;align-items:center;gap:12px;">
          <span style="font-weight:700;color:#94a3b8;width:20px;">#${i + 1}</span>
          <div><strong>${e.name}</strong><br/><span style="color:#94a3b8;font-size:11px;">${e.employeeId}</span></div>
        </div>
        <div style="display:flex;align-items:center;gap:12px;">
          <strong>${e.overallScore}%</strong>
          <span class="badge" style="background:${classColor}">${e.classification?.includes("HiPo") ? "HiPo" : e.classification?.includes("Risk") ? "Risk" : "Average"}</span>
        </div>
      </div>`;
    }).join("")}
  </div>

  <div class="section-title">All Employees</div>
  <div style="background:#f8fafc;border-radius:12px;padding:12px;">
    ${companyEmployees.map(e => {
      const statusColor = e.testStatus === "completed" ? "#000" : e.testStatus === "in_progress" ? "#666" : "#94a3b8";
      return `<div class="emp-row">
        <div><strong>${e.name}</strong> <span style="color:#94a3b8">(${e.employeeId})</span></div>
        <div style="display:flex;align-items:center;gap:8px;">
          <span style="color:${statusColor};font-weight:600;text-transform:capitalize;">${e.testStatus.replace("_", " ")}</span>
          ${e.overallScore ? `<strong>${e.overallScore}%</strong>` : ""}
        </div>
      </div>`;
    }).join("")}
  </div>

  <div class="footer">
    <p>Perfy Psychometric Assessment Platform • Confidential Report</p>
    <p>This report is auto-generated and intended for authorized HR personnel only.</p>
  </div>
</div>
</body></html>`;

  const win = window.open("", "_blank");
  if (win) {
    win.document.write(html);
    win.document.close();
    setTimeout(() => win.print(), 500);
  }
}
