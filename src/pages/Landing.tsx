import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Brain, Shield, BarChart3, Users, ArrowRight, CheckCircle2, Target, Eye } from "lucide-react";
import logo from "@/assets/logo.png";

// Simple Reveal On Scroll Component
function Reveal({ children, className = "", style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={style}
      className={`${className} transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
    >
      {children}
    </div>
  );
}

const features = [
  { icon: Brain, title: "Self-Discovery", desc: "Gain deep insights into your behavioral preferences and professional strengths", color: "bg-sky" },
  { icon: CheckCircle2, title: "10 behavioral dimensions", desc: "Comprehensive evaluation covering critical workplace competencies", color: "bg-emerald" },
  { icon: BarChart3, title: "Personalized Insights", desc: "Receive immediate feedback and understand your unique professional profile", color: "bg-violet" },
  { icon: Shield, title: "Private & Secure", desc: "Your assessment results are handled with the highest level of confidentiality", color: "bg-sky" },
];

const stats = [
  { value: "90", label: "Validated Questions" },
  { value: "45min", label: "Avg completion time" },
  { value: "10", label: "Key Dimensions" },
  { value: "Instant", label: "Evaluation" },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b border-border/50 bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-2">
            <div className="relative w-32 h-20">
              <div className="w-32 h-32 flex items-center justify-center overflow-hidden absolute -top-6 left-0 filter drop-shadow-xl z-20">
                <img src={logo} alt="Perfy" className="w-full h-full object-contain" />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">Candidate Login</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden pt-20 pb-16">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000"
            alt="Office"
            className="w-full h-full object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center text-left">
            <div className="animate-in fade-in slide-in-from-left-8 duration-1000">
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-[1.1]">
                Uncover Your
                <br />
                <span className="text-gradient">Professional Strengths</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl mb-10 leading-relaxed">
                Take your psychometric assessment to discover your workplace behavioral profile.
                Identify your strengths and prepare for your next growth opportunity with Perfy's AI-driven insights.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/login">
                  <Button size="lg" className="bg-sky hover:bg-sky/90 text-white border-0 px-8 shadow-lg transition-all duration-300">
                    Start Your Assessment <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="px-8">
                  Learn More
                </Button>
              </div>
            </div>

            <div className="hidden lg:block relative animate-in fade-in zoom-in duration-1000 delay-300">
              <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full" />
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border animate-float max-h-[650px] w-fit mx-auto">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800"
                  alt="Candidate"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <Reveal key={i} style={{ transitionDelay: `${100 * i}ms` }}>
              <div className="text-center p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors shadow-sm">
                <div className="text-3xl font-extrabold text-gradient mb-1">{s.value}</div>
                <div className="text-sm text-muted-foreground">{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="container mx-auto px-4 py-24">
        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <Reveal className="p-1">
            <div className="relative h-full p-8 md:p-12 rounded-3xl bg-card border border-border hover:border-primary/30 transition-all duration-500 shadow-sm overflow-hidden group">
              <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-40 transition-opacity duration-700">
                <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1500" alt="Mission" className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-1000" />
              </div>
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-8">
                  <Target className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-3xl font-bold mb-6 text-gradient">Our Mission</h2>
                <div className="space-y-6 text-muted-foreground leading-relaxed">
                  <p>
                    Our mission is to empower organizations to achieve their goals through intelligent, performance-driven software solutions that transform the way businesses operate. We are committed to enabling at least 300 companies by 2027 to reach their full potential by improving efficiency, enhancing productivity, and driving measurable growth. Through data-driven insights, automation, and user-friendly technology, we aim to simplify complex processes and provide clear visibility into performance at every level of an organization.
                  </p>
                  <p>
                    We believe that every business, regardless of its size or industry, deserves access to powerful tools that support better decision-making and sustainable success. Our software is designed to identify opportunities, eliminate inefficiencies, and create a culture of accountability and continuous improvement. By focusing on real results and long-term value, we strive to become a trusted partner in our clients’ growth journey, helping them move from effort to meaningful impact.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal className="p-1" style={{ transitionDelay: "200ms" }}>
            <div className="relative h-full p-8 md:p-12 rounded-3xl bg-card border border-border hover:border-primary/30 transition-all duration-500 shadow-sm overflow-hidden group">
              <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-40 transition-opacity duration-700">
                <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1500" alt="Vision" className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-1000" />
              </div>
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-8">
                  <Eye className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-3xl font-bold mb-6 text-gradient">Our Vision</h2>
                <div className="space-y-6 text-muted-foreground leading-relaxed">
                  <p>
                    Our vision is to create a future where every company can confidently achieve its goals and turn its ambitions into reality. We aspire to build a world where businesses no longer struggle with inefficiency, lack of clarity, or underperformance, but instead operate with precision, purpose, and confidence.
                  </p>
                  <p>
                    We envision becoming a leading force in performance optimization, delivering innovative and adaptive solutions that evolve with the changing needs of organizations worldwide. By continuously improving our technology and expanding our reach, we aim to support companies in unlocking their full potential and achieving consistent success.
                  </p>
                  <p>
                    Ultimately, our vision is to redefine how businesses measure and achieve success, ensuring that every organization has the tools, insights, and support needed to grow, excel, and thrive without limitations.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <Reveal className="text-center mb-12">
          <h2 className="text-3xl font-bold">Everything You Need</h2>
        </Reveal>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <Reveal key={i} style={{ transitionDelay: `${100 * i}ms` }}>
              <div className="p-6 h-full rounded-2xl bg-card border border-border hover:shadow-glow transition-all duration-300 group">
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Assessment Sections */}
      <section className="container mx-auto px-4 py-16">
        <Reveal className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">10 Assessment Dimensions</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Comprehensive behavioral profiling across all critical workplace competencies
          </p>
        </Reveal>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 max-w-4xl mx-auto">
          {["Personality", "Emotional Intelligence", "Cognitive Ability", "Situational Judgment", "Motivation", "Culture Fit", "Behavioral Risk", "Leadership", "Communication", "Learning Agility"].map((s, i) => (
            <Reveal key={i} style={{ transitionDelay: `${50 * i}ms` }}>
              <div className="p-4 rounded-lg bg-card border border-border text-center hover:border-primary/50 transition-colors">
                <CheckCircle2 className="w-5 h-5 text-emerald mx-auto mb-2" />
                <span className="text-xs font-medium">{s}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-16">
        <Reveal>
          <div className="relative rounded-[2.5rem] overflow-hidden">
            <div className="absolute inset-0 z-0">
              <img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1500" alt="CTA Background" className="w-full h-full object-cover opacity-50" />
               <div className="absolute inset-0 bg-sky opacity-60" />
            </div>
            <div className="relative z-10 p-12 md:p-20 text-center">
              <h2 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-6">Ready to Begin?</h2>
              <p className="text-lg text-primary-foreground/80 mb-10 max-w-lg mx-auto leading-relaxed">
                Discover your potential and take the first step towards a deeper understanding of your workplace behavioral profile.
              </p>
              <Link to="/login">
                <Button size="lg" variant="secondary" className="px-10 h-14 text-lg shadow-xl hover:scale-105 transition-transform">
                  Login to Start <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2026 Perfy. Assessment Center | Enterprise Psychometric Assessment Platform
        </div>
      </footer>
    </div>
  );
}