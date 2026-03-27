import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, AlertCircle, Eye, EyeOff, Shield, Users, ClipboardList, UserPlus } from "lucide-react";
import logo from "@/assets/logo.png";

const DEMO_ACCOUNTS = [
  { label: "Employee", email: "candidate@perfy.com", password: "emp123", icon: ClipboardList, color: "text-success" },
];

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (await login(email, password)) {
        navigate("/dashboard");
      } else {
        setError("Invalid credentials. Please check your email and password.");
      }
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = async (account: typeof DEMO_ACCOUNTS[0]) => {
    setEmail(account.email);
    setPassword(account.password);
    setError("");
    setLoading(true);
    try {
      if (await login(account.email, account.password)) {
        navigate("/dashboard");
      } else {
        setError("Invalid credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      <div className="hidden lg:flex lg:w-1/2 gradient-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-40" />
        <div className="relative z-10 flex flex-col justify-center p-12 text-primary-foreground">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-16 h-16 rounded-xl bg-white p-2 shadow-lg flex items-center justify-center overflow-hidden">
              <img src={logo} alt="Perfy" className="w-full h-full object-contain" />
            </div>
            <span className="text-3xl font-bold font-display tracking-tight text-white drop-shadow-sm">Perfy</span>
          </div>
          <h2 className="text-4xl font-bold leading-tight mb-4">
            Enterprise Psychometric
            <br />Assessment Platform
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-8 max-w-md">
            AI-powered assessments across 10 behavioral dimensions for HR companies managing 300+ clients.
          </p>
          <div className="space-y-3">
            {["90 scientifically validated questions", "Real-time analytics & 9-Box Grid", "Auto-scoring with reverse logic", "Multi-tenant architecture"].map(f => (
              <div key={f} className="flex items-center gap-2 text-sm text-primary-foreground/90">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-foreground/60" />
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 lg:hidden">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-14 h-14 rounded-xl bg-white p-2 shadow-xl flex items-center justify-center overflow-hidden ring-1 ring-border/5">
                <img src={logo} alt="Perfy" className="w-full h-full object-contain" />
              </div>
              <span className="text-2xl font-bold font-display tracking-tight">Perfy</span>
            </Link>
          </div>

          <Card className="border-border/50 shadow-xl shadow-primary/5">
            <CardHeader className="pb-4 text-center">
              <CardTitle className="text-2xl">Assessment Portal</CardTitle>
              <CardDescription>Sign in to begin your evaluation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm animate-fade-in">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {error}
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <Input id="email" type="email" placeholder="rahul@techcorp.com" value={email} onChange={e => setEmail(e.target.value)} required className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input id="password" type={showPassword ? "text" : "password"} placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} required className="h-11 pr-10" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <Button type="submit" disabled={loading} className="w-full h-11 gradient-primary text-primary-foreground border-0 text-sm font-semibold">
                  {loading ? "Signing in..." : "Start Assessment"}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Quick Access</span>
                </div>
              </div>

              <div className="grid gap-2">
                {DEMO_ACCOUNTS.map(account => (
                  <button key={account.label} onClick={() => quickLogin(account)} className="flex items-center gap-3 w-full p-3 rounded-lg border border-border hover:border-primary/30 hover:bg-muted/50 transition-all text-left group">
                    <account.icon className={`w-4 h-4 ${account.color} shrink-0`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium group-hover:text-primary transition-colors">{account.label}</p>
                      <p className="text-xs text-muted-foreground truncate">{account.email}</p>
                    </div>
                  </button>
                ))}
              </div>

              <div className="text-center">
                <Link to="/register" className="inline-flex items-center gap-2 text-sm text-primary hover:underline font-medium">
                  <UserPlus className="w-4 h-4" /> Not invited yet? Register here
                </Link>
              </div>
            </CardContent>
          </Card>

          <p className="text-center text-xs text-muted-foreground mt-6">
            <Link to="/" className="hover:text-primary transition-colors">← Back to landing page</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
