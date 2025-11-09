
export interface ScoredCategory {
  category: string;
  score: number;
  justification: string[];
}

export interface VivaQuestion {
  question_number: number;
  question: string;
  expected_answer_points: string[];
}

export interface OriginalityFinding {
  finding: string;
  explanation: string;
}

export interface OriginalityReport {
  originalityScore: number;
  summary: string;
  findings: OriginalityFinding[];
}

export interface ProjectReport {
  id: string;
  savedDate: string;
  projectTitle: string;
  submissionType: string;
  discipline: string;
  academicLevel: string;
  overallScore: number;
  summaryTitle: string;
  scoredCategories: ScoredCategory[];
  originalityReport?: OriginalityReport;
  overallAnalysis: string;
  suggestedActions: string[];
  vivaQuestions: VivaQuestion[];
}

export interface UploadedFile {
  name: string;
  type: string;
  content: string; // base64 encoded
}

export interface AppConfig {
  projectTitle: string;
  discipline: string;
  academicLevel: string;
  evaluationContext: string;
  projectURL: string;
  evaluationCriteria: string[];
  checkOriginality: boolean;
}

export type DisciplineKey = 'General' | 'Computer Science' | 'Electrical Engineering' | 'Biology' | 'Literature' | 'Finance' | 'History' | 'Art' | 'Physics' | 'Pharmacy' | 'Law';
