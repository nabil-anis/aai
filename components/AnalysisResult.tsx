import React, { useState } from 'react';
import { ProjectReport, ScoredCategory } from '../types';
import ScoreGauge from './ScoreGauge';
import VivaDeck from './VivaDeck';
import { CheckCircleIcon, TargetIcon } from './icons';

interface AnalysisResultProps {
    report: ProjectReport;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ report }) => {
    const [activeTab, setActiveTab] = useState<'analysis' | 'defense'>('analysis');

    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 md:px-12 pb-16 md:pb-24">
            <header className="pt-16 md:pt-24 mb-8 text-center">
                <h1 className="text-3xl md:text-5xl tracking-tight text-[--foreground]">{report.projectTitle}</h1>
                <p className="text-md text-[--foreground-secondary] mt-2">{report.submissionType}</p>
            </header>

            <div className="sticky top-5 z-20 mb-8">
                <div className="w-max mx-auto bg-black/40 glass-backdrop rounded-full border border-[--border] shadow-lg p-1 flex items-center gap-1">
                    <FloatingTabButton name="Analysis" isActive={activeTab === 'analysis'} onClick={() => setActiveTab('analysis')} />
                    <FloatingTabButton name="Defense Prep" isActive={activeTab === 'defense'} onClick={() => setActiveTab('defense')} />
                </div>
            </div>

            <div key={activeTab} className="animate-fade-in">
                {activeTab === 'analysis' && <AnalysisView report={report} />}
                {activeTab === 'defense' && <VivaDeck questions={report.vivaQuestions} />}
            </div>

            <div className="text-center mt-16">
                <p className="text-xs font-medium tracking-widest uppercase text-[--foreground-tertiary]">
                    by nbl.
                </p>
            </div>
        </div>
    );
};

const FloatingTabButton: React.FC<{ name: string; isActive: boolean; onClick: () => void }> = ({ name, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`px-5 py-2 text-sm rounded-full transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-[--ring] focus-visible:ring-offset-2 focus-visible:ring-offset-[--background] ${
            isActive 
            ? 'bg-[--accent] text-[--accent-foreground] shadow-sm' 
            : 'bg-transparent text-[--foreground-secondary] hover:bg-[--background-tertiary] hover:text-[--foreground]'
        }`}
    >
        {name}
    </button>
);

const AnalysisView: React.FC<{ report: ProjectReport }> = ({ report }) => (
    <div className="space-y-12">
        <OverallScoreDisplay report={report} />
        <ScoreGrid categories={report.scoredCategories} />
        {report.originalityReport && <OriginalityReportDisplay report={report.originalityReport} />}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <AnalysisCard title="Overall Analysis" content={report.overallAnalysis} />
            <ActionsCard title="Suggested Actions" actions={report.suggestedActions} />
        </div>
    </div>
);


const OverallScoreDisplay: React.FC<{ report: ProjectReport }> = ({ report }) => (
    <div className="bg-[--card] rounded-3xl p-8 flex flex-col items-center text-center shadow-lg border border-[--border] card-interactive">
        <ScoreGauge score={report.overallScore} size={200} strokeWidth={16} />
        <h2 className="text-2xl md:text-3xl mt-6 animate-score-pop-in animation-delay-300">{report.summaryTitle}</h2>
        <p className="text-[--foreground-secondary] mt-1">{report.discipline} &middot; {report.academicLevel}</p>
    </div>
);

const ScoreGrid: React.FC<{ categories: ScoredCategory[] }> = ({ categories }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {categories.map((cat, index) => (
            <div key={index} className="bg-[--card] rounded-3xl p-6 shadow-md border border-[--border] card-interactive">
                <div className="flex items-start justify-between gap-4">
                    <h3 className="text-lg">{cat.category}</h3>
                    <ScoreGauge score={cat.score} size={80} strokeWidth={8} />
                </div>
                <ul className="mt-4 space-y-2 text-sm text-[--foreground-secondary] list-disc list-inside">
                    {cat.justification.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
            </div>
        ))}
    </div>
);

const OriginalityReportDisplay: React.FC<{ report: NonNullable<ProjectReport['originalityReport']> }> = ({ report }) => (
    <div className="bg-[--card] rounded-3xl p-8 shadow-md border border-[--border] card-interactive">
        <div className="flex items-center gap-3 mb-4">
            <TargetIcon className="w-6 h-6 text-[--accent]" />
            <h3 className="text-xl">Originality Report</h3>
        </div>
        <div className="flex flex-col md:flex-row items-start gap-8">
            <div className="flex-shrink-0">
                <ScoreGauge score={report.originalityScore} size={100} strokeWidth={10} />
            </div>
            <div className="flex-1">
                <h4>Summary</h4>
                <p className="text-sm text-[--foreground-secondary] mt-1 leading-relaxed">{report.summary}</p>
                {report.findings && report.findings.length > 0 && (
                    <div className="mt-4">
                        <h4>Potential Findings</h4>
                        <div className="mt-2 space-y-3 text-sm">
                            {report.findings.map((finding, i) => (
                                <div key={i}>
                                    <p className="font-medium text-[--foreground]">{finding.finding}</p>
                                    <p className="text-[--foreground-secondary]">{finding.explanation}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
);

const AnalysisCard: React.FC<{ title: string; content: string }> = ({ title, content }) => (
    <div className="bg-[--card] rounded-3xl p-8 shadow-md border border-[--border] card-interactive">
        <h3 className="text-xl mb-3">{title}</h3>
        <p className="text-[--foreground-secondary] leading-relaxed">{content}</p>
    </div>
);

const ActionsCard: React.FC<{ title: string; actions: string[] }> = ({ title, actions }) => (
    <div className="bg-[--card] rounded-3xl p-8 shadow-md border border-[--border] card-interactive">
        <h3 className="text-xl mb-3">{title}</h3>
        <ul className="space-y-4">
            {actions.map((action, i) => (
                <li key={i} className="flex items-start gap-3">
                    <CheckCircleIcon className="w-5 h-5 text-[--score-high] mt-0.5 flex-shrink-0" />
                    <span className="text-[--foreground-secondary]">{action}</span>
                </li>
            ))}
        </ul>
    </div>
);

export default AnalysisResult;