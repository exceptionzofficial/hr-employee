import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { questions, shuffleArray, SECTIONS, type Question, calculateSectionScores, classifyEmployee } from "@/data/questions";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Clock, ChevronLeft, ChevronRight, AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "sonner";

const LIKERT_OPTIONS = [
  { value: 1, label: "Strongly Disagree" },
  { value: 2, label: "Disagree" },
  { value: 3, label: "Neutral" },
  { value: 4, label: "Agree" },
  { value: 5, label: "Strongly Agree" },
];

const TEST_DURATION = 45 * 60; // 45 minutes in seconds

export default function TestEngine() {
  const navigate = useNavigate();
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number | string>>({});
  const [timeLeft, setTimeLeft] = useState(TEST_DURATION);
  const [submitting, setSubmitting] = useState(false);

  const shuffledQuestions = useMemo(() => shuffleArray(questions), []);

  // Also shuffle MCQ options per question
  const questionsWithShuffledOptions = useMemo(() => {
    return shuffledQuestions.map(q => {
      if (q.options) {
        return { ...q, options: shuffleArray(q.options) };
      }
      return q;
    });
  }, [shuffledQuestions]);

  const currentQ = questionsWithShuffledOptions[currentIndex];
  const progress = (Object.keys(answers).length / questionsWithShuffledOptions.length) * 100;

  // Timer
  useEffect(() => {
    if (!started || submitting) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [started, submitting]);

  const handleSubmit = useCallback(async () => {
    setSubmitting(true);
    try {
      const scores = calculateSectionScores(answers);
      const classification = classifyEmployee(scores);
      const overallScore = Math.round(Object.values(scores).reduce((s, v) => s + v.percentage, 0) / Object.values(scores).length);

      const assessmentData = {
        answers,
        sectionScores: Object.fromEntries(Object.entries(scores).map(([k, v]) => [k, v.percentage])),
        overallScore,
        classification,
      };

      await apiFetch("/assessments", {
        method: "POST",
        body: JSON.stringify(assessmentData)
      });

      toast.success("Assessment submitted successfully!");
      navigate("/results");
    } catch (error) {
      toast.error("Failed to submit assessment. Please contact support.");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  }, [answers, navigate]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleAnswer = (value: number | string) => {
    setAnswers(prev => ({ ...prev, [currentQ.id]: value }));
  };

  if (!started) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">Psychometric Assessment</h1>
            <p className="text-muted-foreground">Complete the following assessment to evaluate your behavioral competencies</p>
          </div>

          <Card className="border-border">
            <CardContent className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-sky/5 text-center border border-sky/10">
                  <p className="text-2xl font-bold text-sky">90</p>
                  <p className="text-xs text-muted-foreground">Questions</p>
                </div>
                <div className="p-4 rounded-lg bg-violet/5 text-center border border-violet/10">
                  <p className="text-2xl font-bold text-violet">45</p>
                  <p className="text-xs text-muted-foreground">Minutes</p>
                </div>
                <div className="p-4 rounded-lg bg-emerald/5 text-center border border-emerald/10">
                  <p className="text-2xl font-bold text-emerald">10</p>
                  <p className="text-xs text-muted-foreground">Sections</p>
                </div>
                <div className="p-4 rounded-lg bg-sky/5 text-center border border-sky/10">
                  <p className="text-2xl font-bold text-sky">Auto</p>
                  <p className="text-xs text-muted-foreground">Submit</p>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-warning/10 border border-warning/20 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-foreground">Important Instructions</p>
                  <ul className="text-muted-foreground mt-1 space-y-1">
                    <li>• Questions are randomized — every candidate gets a unique order</li>
                    <li>• Timer starts immediately — test auto-submits at 45 minutes</li>
                    <li>• You can navigate between questions freely</li>
                    <li>• Answer all questions for the most accurate assessment</li>
                  </ul>
                </div>
              </div>

              <Button onClick={() => setStarted(true)} className="w-full bg-sky hover:bg-sky/90 text-white border-0 shadow-lg" size="lg">
                Start Assessment
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-4">
        {/* Timer + Progress Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">{currentQ.section}</Badge>
            <span className="text-sm text-muted-foreground">
              {currentIndex + 1} of {questionsWithShuffledOptions.length}
            </span>
          </div>
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono text-sm font-bold ${timeLeft < 300 ? "bg-destructive/10 text-destructive" : "bg-muted"}`}>
            <Clock className="w-4 h-4" />
            {formatTime(timeLeft)}
          </div>
        </div>

        <Progress value={progress} className="h-2" />

        {/* Question Card */}
        <Card className="border-border animate-fade-in" key={currentQ.id}>
          <CardHeader>
            <CardTitle className="text-lg leading-relaxed">
              <span className="text-muted-foreground mr-2">Q{currentIndex + 1}.</span>
              {currentQ.question}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {currentQ.type === "likert" ? (
              <div className="space-y-2">
                {LIKERT_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => handleAnswer(opt.value)}
                    className={`w-full p-4 rounded-lg border text-left text-sm font-medium transition-all
                      ${answers[currentQ.id] === opt.value
                        ? "border-sky bg-sky/5 text-sky"
                        : "border-border hover:border-sky/20 hover:bg-muted/50"
                      }`}
                  >
                    <span className="mr-3 text-muted-foreground">{opt.value}.</span>
                    {opt.label}
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {currentQ.options?.map((opt, i) => (
                  <button
                    key={opt.value}
                    onClick={() => handleAnswer(opt.value)}
                    className={`w-full p-4 rounded-lg border text-left text-sm font-medium transition-all
                      ${answers[currentQ.id] === opt.value
                        ? "border-sky bg-sky/5 text-sky"
                        : "border-border hover:border-sky/20 hover:bg-muted/50"
                      }`}
                  >
                    <span className="mr-3 text-muted-foreground">{String.fromCharCode(65 + i)}.</span>
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentIndex(i => Math.max(0, i - 1))}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> Previous
          </Button>

          <div className="flex gap-1 overflow-hidden max-w-[200px]">
            {questionsWithShuffledOptions.slice(
              Math.max(0, currentIndex - 3),
              Math.min(questionsWithShuffledOptions.length, currentIndex + 4)
            ).map((q, i) => {
              const actualIndex = Math.max(0, currentIndex - 3) + i;
              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(actualIndex)}
                  className={`w-7 h-7 rounded text-xs font-medium transition-colors
                    ${actualIndex === currentIndex
                      ? "bg-sky text-white"
                      : answers[q.id] !== undefined
                      ? "bg-sky/20 text-sky"
                      : "bg-muted text-muted-foreground"
                    }`}
                >
                  {actualIndex + 1}
                </button>
              );
            })}
          </div>

          {currentIndex === questionsWithShuffledOptions.length - 1 ? (
            <Button onClick={handleSubmit} disabled={submitting} className="bg-emerald hover:bg-emerald/90 text-white border-0 shadow-lg">
              {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              {submitting ? "Submitting..." : "Submit Test"}
            </Button>
          ) : (
            <Button
              onClick={() => setCurrentIndex(i => Math.min(questionsWithShuffledOptions.length - 1, i + 1))}
            >
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>

        {/* Question Map */}
        <Card className="border-border">
          <CardContent className="p-4">
            <p className="text-xs font-medium text-muted-foreground mb-2">Question Map</p>
            <div className="flex flex-wrap gap-1">
              {questionsWithShuffledOptions.map((q, i) => (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(i)}
                  className={`w-6 h-6 rounded text-[10px] font-medium transition-colors
                    ${i === currentIndex
                      ? "bg-sky text-white"
                      : answers[q.id] !== undefined
                      ? "bg-emerald/20 text-emerald border border-emerald/30"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  title={`Q${i + 1}: ${q.section}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}