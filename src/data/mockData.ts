export interface Company {
  id: string;
  name: string;
  logo?: string;
  employeeCount: number;
  testsCompleted: number;
  testsPending: number;
  avgScore: number;
  createdAt: string;
  uniqueCode: string;
  contactEmail: string;
  industry: string;
}

export interface Employee {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  companyId: string;
  companyName: string;
  testStatus: "pending" | "in_progress" | "completed";
  overallScore?: number;
  classification?: string;
  completedAt?: string;
  sectionScores?: Record<string, number>;
}

export const companies: Company[] = [
  { id: "c1", name: "TechCorp Solutions", employeeCount: 45, testsCompleted: 32, testsPending: 13, avgScore: 78, createdAt: "2024-01-15", uniqueCode: "TECH2024", contactEmail: "hr@techcorp.com", industry: "Technology" },
  { id: "c2", name: "Global Finance Ltd", employeeCount: 120, testsCompleted: 95, testsPending: 25, avgScore: 72, createdAt: "2024-02-20", uniqueCode: "GFIN2024", contactEmail: "hr@globalfin.com", industry: "Finance" },
  { id: "c3", name: "HealthCare Plus", employeeCount: 67, testsCompleted: 50, testsPending: 17, avgScore: 81, createdAt: "2024-03-10", uniqueCode: "HCP2024", contactEmail: "hr@healthcare.com", industry: "Healthcare" },
  { id: "c4", name: "EduTech Academy", employeeCount: 30, testsCompleted: 28, testsPending: 2, avgScore: 85, createdAt: "2024-04-05", uniqueCode: "EDU2024", contactEmail: "hr@edutech.com", industry: "Education" },
  { id: "c5", name: "RetailMax Group", employeeCount: 89, testsCompleted: 60, testsPending: 29, avgScore: 69, createdAt: "2024-05-12", uniqueCode: "RMX2024", contactEmail: "hr@retailmax.com", industry: "Retail" },
  { id: "c6", name: "AutoDrive Inc", employeeCount: 55, testsCompleted: 40, testsPending: 15, avgScore: 74, createdAt: "2024-06-01", uniqueCode: "ADI2024", contactEmail: "hr@autodrive.com", industry: "Automotive" },
];

export const employees: Employee[] = [
  { id: "e1", employeeId: "EMP001", name: "Rahul Sharma", email: "rahul@techcorp.com", companyId: "c1", companyName: "TechCorp Solutions", testStatus: "completed", overallScore: 82, classification: "High Potential (HiPo)", completedAt: "2024-03-15", sectionScores: { Personality: 85, "Emotional Intelligence": 78, "Cognitive Ability": 90, "Situational Judgment": 82, Motivation: 80, "Culture Fit": 75, "Behavioral Risk": 88, Leadership: 79, Communication: 83, "Learning Agility": 80 } },
  { id: "e2", employeeId: "EMP002", name: "Priya Patel", email: "priya@techcorp.com", companyId: "c1", companyName: "TechCorp Solutions", testStatus: "completed", overallScore: 91, classification: "High Potential (HiPo)", completedAt: "2024-03-14", sectionScores: { Personality: 92, "Emotional Intelligence": 88, "Cognitive Ability": 95, "Situational Judgment": 90, Motivation: 93, "Culture Fit": 85, "Behavioral Risk": 90, Leadership: 92, Communication: 91, "Learning Agility": 94 } },
  { id: "e3", employeeId: "EMP003", name: "Amit Kumar", email: "amit@globalfin.com", companyId: "c2", companyName: "Global Finance Ltd", testStatus: "in_progress" },
  { id: "e4", employeeId: "EMP004", name: "Sneha Reddy", email: "sneha@globalfin.com", companyId: "c2", companyName: "Global Finance Ltd", testStatus: "completed", overallScore: 65, classification: "Average Performer", completedAt: "2024-03-12", sectionScores: { Personality: 68, "Emotional Intelligence": 62, "Cognitive Ability": 70, "Situational Judgment": 60, Motivation: 65, "Culture Fit": 72, "Behavioral Risk": 58, Leadership: 60, Communication: 67, "Learning Agility": 68 } },
  { id: "e5", employeeId: "EMP005", name: "Vikram Singh", email: "vikram@healthcare.com", companyId: "c3", companyName: "HealthCare Plus", testStatus: "pending" },
  { id: "e6", employeeId: "EMP006", name: "Ananya Gupta", email: "ananya@healthcare.com", companyId: "c3", companyName: "HealthCare Plus", testStatus: "completed", overallScore: 88, classification: "High Potential (HiPo)", completedAt: "2024-03-16", sectionScores: { Personality: 90, "Emotional Intelligence": 92, "Cognitive Ability": 85, "Situational Judgment": 88, Motivation: 86, "Culture Fit": 90, "Behavioral Risk": 85, Leadership: 88, Communication: 92, "Learning Agility": 84 } },
  { id: "e7", employeeId: "EMP007", name: "Karan Mehta", email: "karan@edutech.com", companyId: "c4", companyName: "EduTech Academy", testStatus: "completed", overallScore: 42, classification: "Risk Candidate", completedAt: "2024-03-11", sectionScores: { Personality: 45, "Emotional Intelligence": 38, "Cognitive Ability": 50, "Situational Judgment": 35, Motivation: 40, "Culture Fit": 48, "Behavioral Risk": 30, Leadership: 42, Communication: 45, "Learning Agility": 47 } },
  { id: "e8", employeeId: "EMP008", name: "Deepika Nair", email: "deepika@retailmax.com", companyId: "c5", companyName: "RetailMax Group", testStatus: "completed", overallScore: 76, classification: "Average Performer", completedAt: "2024-03-13", sectionScores: { Personality: 78, "Emotional Intelligence": 74, "Cognitive Ability": 80, "Situational Judgment": 72, Motivation: 76, "Culture Fit": 70, "Behavioral Risk": 82, Leadership: 74, Communication: 78, "Learning Agility": 76 } },
  { id: "e9", employeeId: "EMP009", name: "Rohan Desai", email: "rohan@techcorp.com", companyId: "c1", companyName: "TechCorp Solutions", testStatus: "in_progress" },
  { id: "e10", employeeId: "EMP010", name: "Meera Joshi", email: "meera@globalfin.com", companyId: "c2", companyName: "Global Finance Ltd", testStatus: "completed", overallScore: 71, classification: "Average Performer", completedAt: "2024-03-18", sectionScores: { Personality: 72, "Emotional Intelligence": 68, "Cognitive Ability": 75, "Situational Judgment": 70, Motivation: 73, "Culture Fit": 68, "Behavioral Risk": 74, Leadership: 70, Communication: 72, "Learning Agility": 68 } },
  { id: "e11", employeeId: "EMP011", name: "Arjun Rao", email: "arjun@healthcare.com", companyId: "c3", companyName: "HealthCare Plus", testStatus: "completed", overallScore: 55, classification: "Average Performer", completedAt: "2024-03-17", sectionScores: { Personality: 58, "Emotional Intelligence": 52, "Cognitive Ability": 60, "Situational Judgment": 50, Motivation: 55, "Culture Fit": 58, "Behavioral Risk": 48, Leadership: 52, Communication: 56, "Learning Agility": 61 } },
  { id: "e12", employeeId: "EMP012", name: "Nisha Agarwal", email: "nisha@autodrive.com", companyId: "c6", companyName: "AutoDrive Inc", testStatus: "completed", overallScore: 79, classification: "High Potential (HiPo)", completedAt: "2024-03-19", sectionScores: { Personality: 82, "Emotional Intelligence": 78, "Cognitive Ability": 80, "Situational Judgment": 76, Motivation: 80, "Culture Fit": 78, "Behavioral Risk": 82, Leadership: 76, Communication: 80, "Learning Agility": 78 } },
];

export const dashboardStats = {
  totalCompanies: companies.length,
  totalEmployees: companies.reduce((sum, c) => sum + c.employeeCount, 0),
  testsCompleted: companies.reduce((sum, c) => sum + c.testsCompleted, 0),
  testsPending: companies.reduce((sum, c) => sum + c.testsPending, 0),
  completionRate: Math.round(
    (companies.reduce((sum, c) => sum + c.testsCompleted, 0) /
      companies.reduce((sum, c) => sum + c.employeeCount, 0)) * 100
  ),
  avgScore: Math.round(companies.reduce((sum, c) => sum + c.avgScore, 0) / companies.length),
};
