export type QuestionType = "likert" | "mcq";

export type Section =
  | "Personality"
  | "Emotional Intelligence"
  | "Cognitive Ability"
  | "Situational Judgment"
  | "Motivation"
  | "Culture Fit"
  | "Behavioral Risk"
  | "Leadership"
  | "Communication"
  | "Learning Agility";

export interface Question {
  id: number;
  section: Section;
  type: QuestionType;
  question: string;
  reverse: boolean;
  options?: { label: string; value: string; score: number }[];
  correctAnswer?: string;
}

export const SECTIONS: Section[] = [
  "Personality",
  "Emotional Intelligence",
  "Cognitive Ability",
  "Situational Judgment",
  "Motivation",
  "Culture Fit",
  "Behavioral Risk",
  "Leadership",
  "Communication",
  "Learning Agility",
];

export const SECTION_COLORS: Record<Section, string> = {
  "Personality": "hsl(221, 83%, 53%)",
  "Emotional Intelligence": "hsl(262, 83%, 58%)",
  "Cognitive Ability": "hsl(142, 71%, 45%)",
  "Situational Judgment": "hsl(38, 92%, 50%)",
  "Motivation": "hsl(0, 84%, 60%)",
  "Culture Fit": "hsl(180, 70%, 45%)",
  "Behavioral Risk": "hsl(330, 70%, 50%)",
  "Leadership": "hsl(45, 90%, 50%)",
  "Communication": "hsl(200, 80%, 50%)",
  "Learning Agility": "hsl(280, 60%, 55%)",
};

const likert = (id: number, section: Section, question: string, reverse = false): Question => ({
  id, section, type: "likert", question, reverse,
});

const mcq = (id: number, section: Section, question: string, options: { label: string; value: string; score: number }[], correctAnswer?: string): Question => ({
  id, section, type: "mcq", question, reverse: false, options, correctAnswer,
});

export const questions: Question[] = [
  // PERSONALITY (1-20)
  likert(1, "Personality", "I complete tasks before deadlines"),
  likert(2, "Personality", "I double-check my work for errors"),
  likert(3, "Personality", "I follow structured plans"),
  likert(4, "Personality", "I forget important tasks", true),
  likert(5, "Personality", "I pay attention to details"),
  likert(6, "Personality", "I enjoy social interactions"),
  likert(7, "Personality", "I initiate conversations easily"),
  likert(8, "Personality", "I prefer working alone", true),
  likert(9, "Personality", "I feel energized in groups"),
  likert(10, "Personality", "I avoid attention", true),
  likert(11, "Personality", "I remain calm under pressure"),
  likert(12, "Personality", "I get stressed easily", true),
  likert(13, "Personality", "I handle criticism well"),
  likert(14, "Personality", "I feel overwhelmed quickly", true),
  likert(15, "Personality", "I recover from setbacks fast"),
  likert(16, "Personality", "I enjoy new ideas"),
  likert(17, "Personality", "I resist change", true),
  likert(18, "Personality", "I think creatively"),
  likert(19, "Personality", "I like learning new things"),
  likert(20, "Personality", "I prefer routine", true),

  // EMOTIONAL INTELLIGENCE (21-40)
  likert(21, "Emotional Intelligence", "I recognize my emotions clearly"),
  likert(22, "Emotional Intelligence", "I control emotional reactions"),
  likert(23, "Emotional Intelligence", "I understand others' feelings"),
  likert(24, "Emotional Intelligence", "I struggle to read emotions", true),
  likert(25, "Emotional Intelligence", "I adapt behavior based on others"),
  mcq(26, "Emotional Intelligence", "A colleague is upset. You:", [
    { label: "Ignore", value: "A", score: 1 },
    { label: "Ask privately", value: "B", score: 5 },
    { label: "Report", value: "C", score: 2 },
    { label: "Avoid", value: "D", score: 1 },
  ]),
  mcq(27, "Emotional Intelligence", "You receive criticism:", [
    { label: "React emotionally", value: "A", score: 1 },
    { label: "Stay calm and respond", value: "B", score: 5 },
    { label: "Withdraw", value: "C", score: 2 },
    { label: "Argue", value: "D", score: 1 },
  ]),
  mcq(28, "Emotional Intelligence", "Team conflict arises:", [
    { label: "Ignore", value: "A", score: 1 },
    { label: "Mediate calmly", value: "B", score: 5 },
    { label: "Escalate", value: "C", score: 2 },
    { label: "Avoid", value: "D", score: 1 },
  ]),
  mcq(29, "Emotional Intelligence", "Under stress you:", [
    { label: "Panic", value: "A", score: 1 },
    { label: "Manage calmly", value: "B", score: 5 },
    { label: "Delay work", value: "C", score: 2 },
    { label: "Blame others", value: "D", score: 1 },
  ]),
  mcq(30, "Emotional Intelligence", "Emotional decision:", [
    { label: "Impulsive", value: "A", score: 1 },
    { label: "Balanced thinking", value: "B", score: 5 },
    { label: "Avoid", value: "C", score: 2 },
    { label: "Depend on others", value: "D", score: 3 },
  ]),
  likert(31, "Emotional Intelligence", "I stay composed in conflict"),
  likert(32, "Emotional Intelligence", "I empathize with others"),
  likert(33, "Emotional Intelligence", "I overreact emotionally", true),
  likert(34, "Emotional Intelligence", "I listen actively"),
  likert(35, "Emotional Intelligence", "I regulate stress well"),
  likert(36, "Emotional Intelligence", "I lose control under pressure", true),
  likert(37, "Emotional Intelligence", "I understand team emotions"),
  likert(38, "Emotional Intelligence", "I remain objective"),
  likert(39, "Emotional Intelligence", "I accept feedback positively"),
  likert(40, "Emotional Intelligence", "I take criticism personally", true),

  // COGNITIVE ABILITY (41-50)
  mcq(41, "Cognitive Ability", "Series: 2, 6, 12, 20, ___", [
    { label: "28", value: "A", score: 0 },
    { label: "30", value: "B", score: 5 },
    { label: "32", value: "C", score: 0 },
    { label: "26", value: "D", score: 0 },
  ], "B"),
  mcq(42, "Cognitive Ability", "5 workers = 10 hrs → 10 workers?", [
    { label: "2", value: "A", score: 0 },
    { label: "5", value: "B", score: 5 },
    { label: "10", value: "C", score: 0 },
    { label: "1", value: "D", score: 0 },
  ], "B"),
  mcq(43, "Cognitive Ability", "Book : Read :: Food :", [
    { label: "Eat", value: "A", score: 5 },
    { label: "Cook", value: "B", score: 0 },
    { label: "Buy", value: "C", score: 0 },
    { label: "Serve", value: "D", score: 0 },
  ], "A"),
  mcq(44, "Cognitive Ability", "Odd one out: Apple, Banana, Carrot, Mango", [
    { label: "Apple", value: "A", score: 0 },
    { label: "Banana", value: "B", score: 0 },
    { label: "Carrot", value: "C", score: 5 },
    { label: "Mango", value: "D", score: 0 },
  ], "C"),
  mcq(45, "Cognitive Ability", "15% of 200 =", [
    { label: "25", value: "A", score: 0 },
    { label: "30", value: "B", score: 5 },
    { label: "35", value: "C", score: 0 },
    { label: "40", value: "D", score: 0 },
  ], "B"),
  mcq(46, "Cognitive Ability", "Pattern: 3, 6, 11, 18, ___", [
    { label: "25", value: "A", score: 0 },
    { label: "27", value: "B", score: 5 },
    { label: "29", value: "C", score: 0 },
    { label: "31", value: "D", score: 0 },
  ], "B"),
  mcq(47, "Cognitive Ability", "If A>B and B>C, then:", [
    { label: "A<C", value: "A", score: 0 },
    { label: "A>C", value: "B", score: 5 },
    { label: "A=B", value: "C", score: 0 },
    { label: "Cannot say", value: "D", score: 0 },
  ], "B"),
  mcq(48, "Cognitive Ability", "Coding: CAT → DBU, DOG → ?", [
    { label: "EPH", value: "A", score: 5 },
    { label: "EOG", value: "B", score: 0 },
    { label: "DPH", value: "C", score: 0 },
    { label: "FQI", value: "D", score: 0 },
  ], "A"),
  mcq(49, "Cognitive Ability", "12 × 8 =", [
    { label: "88", value: "A", score: 0 },
    { label: "92", value: "B", score: 0 },
    { label: "96", value: "C", score: 5 },
    { label: "104", value: "D", score: 0 },
  ], "C"),
  mcq(50, "Cognitive Ability", "Half of 80 =", [
    { label: "20", value: "A", score: 0 },
    { label: "30", value: "B", score: 0 },
    { label: "40", value: "C", score: 5 },
    { label: "50", value: "D", score: 0 },
  ], "C"),

  // SITUATIONAL JUDGMENT (51-55)
  mcq(51, "Situational Judgment", "Missed deadline:", [
    { label: "Hide", value: "A", score: 1 },
    { label: "Inform and fix", value: "B", score: 5 },
    { label: "Blame", value: "C", score: 1 },
    { label: "Ignore", value: "D", score: 1 },
  ], "B"),
  mcq(52, "Situational Judgment", "Conflict in team:", [
    { label: "Avoid", value: "A", score: 1 },
    { label: "Mediate", value: "B", score: 5 },
    { label: "Escalate", value: "C", score: 2 },
    { label: "Ignore", value: "D", score: 1 },
  ], "B"),
  mcq(53, "Situational Judgment", "Feedback received:", [
    { label: "Reject", value: "A", score: 1 },
    { label: "Improve", value: "B", score: 5 },
    { label: "Argue", value: "C", score: 1 },
    { label: "Ignore", value: "D", score: 1 },
  ], "B"),
  mcq(54, "Situational Judgment", "Work overload:", [
    { label: "Panic", value: "A", score: 1 },
    { label: "Prioritize", value: "B", score: 5 },
    { label: "Delay", value: "C", score: 2 },
    { label: "Blame", value: "D", score: 1 },
  ], "B"),
  mcq(55, "Situational Judgment", "Mistake found:", [
    { label: "Hide", value: "A", score: 1 },
    { label: "Fix immediately", value: "B", score: 5 },
    { label: "Ignore", value: "C", score: 1 },
    { label: "Blame", value: "D", score: 1 },
  ], "B"),

  // MOTIVATION (56-65)
  likert(56, "Motivation", "I am driven by achievement"),
  likert(57, "Motivation", "I prefer recognition"),
  likert(58, "Motivation", "I work for financial rewards"),
  likert(59, "Motivation", "I seek learning opportunities"),
  likert(60, "Motivation", "I like competition"),
  likert(61, "Motivation", "I avoid challenges", true),
  likert(62, "Motivation", "I set personal goals"),
  likert(63, "Motivation", "I need external motivation", true),
  likert(64, "Motivation", "I push myself to improve"),
  likert(65, "Motivation", "I enjoy difficult tasks"),

  // CULTURE FIT (66-70)
  likert(66, "Culture Fit", "I value teamwork"),
  likert(67, "Culture Fit", "I follow company values"),
  likert(68, "Culture Fit", "I adapt to culture"),
  likert(69, "Culture Fit", "I resist policies", true),
  likert(70, "Culture Fit", "I support company goals"),

  // BEHAVIORAL RISK (71-75)
  likert(71, "Behavioral Risk", "I follow rules strictly"),
  likert(72, "Behavioral Risk", "I report unethical behavior"),
  likert(73, "Behavioral Risk", "It is okay to bend rules", true),
  likert(74, "Behavioral Risk", "I take responsibility"),
  likert(75, "Behavioral Risk", "I avoid accountability", true),

  // LEADERSHIP (76-80)
  likert(76, "Leadership", "I take initiative"),
  likert(77, "Leadership", "I guide others"),
  likert(78, "Leadership", "I avoid responsibility", true),
  likert(79, "Leadership", "I make decisions confidently"),
  likert(80, "Leadership", "I support team growth"),

  // COMMUNICATION (81-85)
  likert(81, "Communication", "I communicate clearly"),
  likert(82, "Communication", "I listen actively"),
  likert(83, "Communication", "I interrupt others", true),
  likert(84, "Communication", "I share ideas openly"),
  likert(85, "Communication", "I handle disagreements well"),

  // LEARNING AGILITY (86-90)
  likert(86, "Learning Agility", "I learn from mistakes"),
  likert(87, "Learning Agility", "I adapt quickly"),
  likert(88, "Learning Agility", "I resist learning", true),
  likert(89, "Learning Agility", "I seek feedback"),
  likert(90, "Learning Agility", "I improve continuously"),
];

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function calculateScore(questionId: number, answer: number | string): number {
  const q = questions.find(q => q.id === questionId);
  if (!q) return 0;

  if (q.type === "likert") {
    const val = typeof answer === "number" ? answer : parseInt(answer as string);
    return q.reverse ? 6 - val : val;
  }

  if (q.type === "mcq" && q.options) {
    const opt = q.options.find(o => o.value === answer);
    return opt ? opt.score : 0;
  }

  return 0;
}

export function calculateSectionScores(answers: Record<number, number | string>): Record<Section, { score: number; maxScore: number; percentage: number }> {
  const result: Record<string, { score: number; maxScore: number; percentage: number }> = {};

  for (const section of SECTIONS) {
    const sectionQuestions = questions.filter(q => q.section === section);
    let score = 0;
    let maxScore = sectionQuestions.length * 5;

    for (const q of sectionQuestions) {
      if (answers[q.id] !== undefined) {
        score += calculateScore(q.id, answers[q.id]);
      }
    }

    result[section] = {
      score,
      maxScore,
      percentage: maxScore > 0 ? Math.round((score / maxScore) * 100) : 0,
    };
  }

  return result as Record<Section, { score: number; maxScore: number; percentage: number }>;
}

export function classifyEmployee(sectionScores: Record<Section, { percentage: number }>): "High Potential (HiPo)" | "Average Performer" | "Risk Candidate" {
  const avgPercentage = Object.values(sectionScores).reduce((sum, s) => sum + s.percentage, 0) / Object.values(sectionScores).length;
  if (avgPercentage >= 75) return "High Potential (HiPo)";
  if (avgPercentage >= 45) return "Average Performer";
  return "Risk Candidate";
}