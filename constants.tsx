import React from 'react';
import { DisciplineKey } from './types';
import { CodeIcon, GraduationCapIcon, LandmarkIcon, LeafIcon, PaletteIcon, ScaleIcon, AtomIcon, PillIcon, BookOpenIcon, BarChartIcon } from './components/icons';

export const CONFIG_STORAGE_KEY = 'asap-ai-config';
export const LOCAL_STORAGE_KEY = 'asap-ai-reports';

export const ACADEMIC_LEVELS: string[] = [
  "Undergraduate (Year 1-2)",
  "Undergraduate (Year 3-4)",
  "Masters",
  "PhD",
  "Professional Development"
];

export const DISCIPLINES: Record<DisciplineKey, { icon: React.FC<React.SVGProps<SVGSVGElement>>, criteria: string[] }> = {
    'General': { icon: GraduationCapIcon, criteria: ['Clarity & Structure', 'Depth of Research', 'Originality'] },
    'Computer Science': { icon: CodeIcon, criteria: ['Code Quality', 'Algorithmic Depth', 'System Design', 'Documentation'] },
    'Electrical Engineering': { icon: AtomIcon, criteria: ['Circuit Design', 'Signal Processing', 'Control Systems', 'Prototyping'] },
    'Biology': { icon: LeafIcon, criteria: ['Methodology', 'Data Analysis', 'Literature Review', 'Ethical Considerations'] },
    'Literature': { icon: BookOpenIcon, criteria: ['Textual Analysis', 'Argument Cohesion', 'Historical Context', 'Theoretical Framework'] },
    'Finance': { icon: BarChartIcon, criteria: ['Quantitative Analysis', 'Market Understanding', 'Risk Assessment', 'Model Validity'] },
    'History': { icon: LandmarkIcon, criteria: ['Primary Source Analysis', 'Historiography', 'Argumentation', 'Chronological Accuracy'] },
    'Art': { icon: PaletteIcon, criteria: ['Technical Skill', 'Conceptual Strength', 'Aesthetic Quality', 'Artist Statement'] },
    'Physics': { icon: AtomIcon, criteria: ['Theoretical Soundness', 'Experimental Design', 'Mathematical Rigor', 'Data Interpretation'] },
    'Pharmacy': { icon: PillIcon, criteria: ['Pharmacology', 'Clinical Application', 'Regulatory Compliance', 'Patient Safety'] },
    'Law': { icon: ScaleIcon, criteria: ['Legal Reasoning', 'Precedent Analysis', 'Statutory Interpretation', 'Argument Structure'] },
};

export const MAX_CRITERIA = 7;
export const MIN_CRITERIA = 3;