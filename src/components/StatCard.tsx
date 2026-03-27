import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: { value: number; positive: boolean };
  className?: string;
  color?: string;
}

export default function StatCard({ title, value, subtitle, icon: Icon, trend, className = "", color = "bg-sky" }: StatCardProps) {
  return (
    <div className={`p-6 rounded-xl bg-card border border-border hover:shadow-glow transition-all duration-300 animate-fade-in ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
          {trend && (
            <p className={`text-xs mt-2 font-medium ${trend.positive ? "text-success" : "text-danger"}`}>
              {trend.positive ? "↑" : "↓"} {Math.abs(trend.value)}% from last month
            </p>
          )}
        </div>
        <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center shrink-0`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
    </div>
  );
}