import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Brain, CheckCircle2, UserPlus } from "lucide-react";
import logo from "@/assets/logo.png";
import { companies } from "@/data/mockData";
import { toast } from "sonner";

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [companyCode, setCompanyCode] = useState("");
  const [registered, setRegistered] = useState(false);
  const [generatedId, setGeneratedId] = useState("");

  const selectedCompany = companies.find(c => c.id === companyId);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (!companyId) {
      toast.error("Please select a company");
      return;
    }
    if (companyCode !== selectedCompany?.uniqueCode) {
      toast.error("Invalid company code. Please contact your HR admin.");
      return;
    }

    const newId = `EMP${String(Math.floor(Math.random() * 9000 + 1000))}`;
    setGeneratedId(newId);
    setRegistered(true);
    toast.success("Registration successful!");
  };

  if (registered) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <Card className="max-w-md w-full border-border/50 shadow-xl">
          <CardContent className="p-8 text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 text-success" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Registration Complete!</h2>
              <p className="text-muted-foreground text-sm">Your account has been created successfully</p>
            </div>
            <div className="space-y-3 text-left bg-muted/50 rounded-xl p-6">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Name</span>
                <span className="font-medium">{name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Employee ID</span>
                <span className="font-bold text-primary">{generatedId}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Company</span>
                <span className="font-medium">{selectedCompany?.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Email</span>
                <span className="font-medium">{email}</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Please save your Employee ID. You will need it to login.</p>
            <Button onClick={() => navigate("/login")} className="w-full gradient-primary text-primary-foreground border-0">
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-background">
      <div className="hidden lg:flex lg:w-1/2 bg-sky relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-40" />
        <div className="relative z-10 flex flex-col justify-center p-12 text-primary-foreground">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-16 h-16 rounded-xl bg-white p-2 shadow-lg flex items-center justify-center overflow-hidden font-display">
              <img src={logo} alt="Perfy" className="w-full h-full object-contain" />
            </div>
            <span className="text-3xl font-bold text-white drop-shadow-sm">Perfy</span>
          </div>
          <h2 className="text-4xl font-bold leading-tight mb-4">
            Join Your Team's
            <br />Assessment Portal
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-8 max-w-md">
            Register with your company code to access psychometric assessments assigned to you.
          </p>
          <div className="space-y-3">
            {["Get your unique Employee ID", "Access your assigned assessments", "View personalized results", "Track your development"].map(f => (
              <div key={f} className="flex items-center gap-2 text-sm text-primary-foreground/90">
                <CheckCircle2 className="w-4 h-4 text-primary-foreground/60" />
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-6 lg:hidden">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="w-14 h-14 rounded-xl bg-white p-2 shadow-xl flex items-center justify-center overflow-hidden ring-1 ring-border/5">
                <img src={logo} alt="Perfy" className="w-full h-full object-contain" />
              </div>
              <span className="text-2xl font-bold font-display tracking-tight">Perfy</span>
            </Link>
          </div>

          <Card className="border-border/50 shadow-xl shadow-primary/5">
            <CardHeader className="pb-4 text-center">
              <div className="w-12 h-12 rounded-xl bg-sky flex items-center justify-center mx-auto mb-3">
                <UserPlus className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-2xl">Employee Registration</CardTitle>
              <CardDescription>Create your assessment account</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input placeholder="Enter your full name" value={name} onChange={e => setName(e.target.value)} required className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <Input type="email" placeholder="you@company.com" value={email} onChange={e => setEmail(e.target.value)} required className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label>Select Company</Label>
                  <Select value={companyId} onValueChange={setCompanyId}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Choose your company" />
                    </SelectTrigger>
                    <SelectContent>
                      {companies.map(c => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Company Code</Label>
                  <Input placeholder="Enter code provided by HR" value={companyCode} onChange={e => setCompanyCode(e.target.value)} required className="h-11" />
                  <p className="text-xs text-muted-foreground">Ask your HR admin for the unique company code</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Password</Label>
                    <Input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required className="h-11" />
                  </div>
                  <div className="space-y-2">
                    <Label>Confirm Password</Label>
                    <Input type="password" placeholder="••••••••" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="h-11" />
                  </div>
                </div>
                <Button type="submit" className="w-full h-11 bg-sky hover:bg-sky/90 text-white border-0 font-semibold shadow-lg transition-all">
                  Register
                </Button>
              </form>
              <p className="text-center text-xs text-muted-foreground mt-4">
                Already registered? <Link to="/login" className="text-primary hover:underline">Sign in</Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
