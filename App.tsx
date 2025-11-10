import React, { useState, useEffect, useCallback } from 'react';
import { AppConfig, ProjectReport, UploadedFile } from './types';
import ConfigurationPanel from './components/ConfigurationPanel';
import AnalysisResult from './components/AnalysisResult';
import Welcome from './components/Welcome';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import ReportHistory from './components/ReportHistory';
import AboutModal from './components/AboutModal';
import * as geminiService from './services/geminiService';
import { CONFIG_STORAGE_KEY, LOCAL_STORAGE_KEY, DISCIPLINES } from './constants';
import { useTheme } from './hooks/useTheme';
import { PanelOpenIcon } from './components/icons';

const App: React.FC = () => {
    const [config, setConfig] = useState<AppConfig>(() => {
        const savedConfig = localStorage.getItem(CONFIG_STORAGE_KEY);
        return savedConfig ? JSON.parse(savedConfig) : {
            projectTitle: '',
            discipline: 'General',
            academicLevel: 'Undergraduate (Year 3-4)',
            evaluationContext: '',
            projectURL: '',
            evaluationCriteria: DISCIPLINES['General'].criteria,
            checkOriginality: true,
        };
    });
    const [files, setFiles] = useState<UploadedFile[]>([]);
    const [projectReport, setProjectReport] = useState<ProjectReport | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [savedReports, setSavedReports] = useState<ProjectReport[]>([]);
    const [isHistoryVisible, setIsHistoryVisible] = useState<boolean>(false);
    const [isAboutVisible, setIsAboutVisible] = useState<boolean>(false);
    const [isConfigPanelOpen, setIsConfigPanelOpen] = useState<boolean>(true);

    useTheme();

    useEffect(() => {
        localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
    }, [config]);
    
    useEffect(() => {
        const localReports = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (localReports) {
            setSavedReports(JSON.parse(localReports));
        }
    }, []);

    const handleAnalysisSubmit = useCallback(async () => {
        if (!config.projectTitle || !config.evaluationContext) {
            setError("Project Title and Evaluation Context are required.");
            return;
        }

        if (window.innerWidth < 1024) {
            setIsConfigPanelOpen(false);
        }

        setIsLoading(true);
        setError(null);
        setProjectReport(null);

        try {
            const report = await geminiService.analyzeProject(config, files);
            const newReport: ProjectReport = {
                ...report,
                id: new Date().toISOString(),
                savedDate: new Date().toISOString(),
            };
            setProjectReport(newReport);

            const updatedReports = [newReport, ...savedReports];
            setSavedReports(updatedReports);
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedReports));
        } catch (e) {
            console.error(e);
            setError(e instanceof Error ? e.message : 'An unknown error occurred during analysis.');
        } finally {
            setIsLoading(false);
        }
    }, [config, files, savedReports]);

    const handleReset = () => {
        setConfig({
            projectTitle: '',
            discipline: 'General',
            academicLevel: 'Undergraduate (Year 3-4)',
            evaluationContext: '',
            projectURL: '',
            evaluationCriteria: DISCIPLINES['General'].criteria,
            checkOriginality: true,
        });
        setFiles([]);
        setProjectReport(null);
        setError(null);
        localStorage.removeItem(CONFIG_STORAGE_KEY);
    };

    const handleLoadReport = (report: ProjectReport) => {
        setProjectReport(report);
        setIsHistoryVisible(false);
        setError(null);
        setIsLoading(false);
    };
    
    const handleDeleteReport = (reportId: string) => {
        const updatedReports = savedReports.filter(r => r.id !== reportId);
        setSavedReports(updatedReports);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedReports));
    };

    const handleClearHistory = () => {
        setSavedReports([]);
        localStorage.removeItem(LOCAL_STORAGE_KEY);
    };

    const renderMainContent = () => {
        if (isLoading) return <LoadingSpinner />;
        if (error) return <ErrorMessage message={error} />;
        if (projectReport) return <AnalysisResult report={projectReport} />;
        return <Welcome />;
    };

    return (
        <div className="min-h-screen text-[--foreground] bg-[--background]">
            <ConfigurationPanel
                config={config}
                setConfig={setConfig}
                files={files}
                setFiles={setFiles}
                isAnalyzing={isLoading}
                onSubmit={handleAnalysisSubmit}
                onReset={handleReset}
                savedReportsCount={savedReports.length}
                toggleHistory={() => setIsHistoryVisible(v => !v)}
                toggleAbout={() => setIsAboutVisible(v => !v)}
                isOpen={isConfigPanelOpen}
                setIsOpen={setIsConfigPanelOpen}
            />

            {isConfigPanelOpen && (
                <div
                    className="fixed inset-0 z-30 glass-backdrop lg:hidden"
                    onClick={() => setIsConfigPanelOpen(false)}
                    aria-hidden="true"
                />
            )}
            
            <main className={`w-full relative transition-all duration-500 ease-in-out ${isConfigPanelOpen ? 'lg:pl-[420px]' : 'lg:pl-0'}`}>
                {!isConfigPanelOpen && (
                    <button 
                        onClick={() => setIsConfigPanelOpen(true)}
                        className="fixed top-4 left-4 z-50 p-2 bg-[--background-secondary]/80 glass-backdrop rounded-full text-[--foreground-secondary] hover:text-[--accent] transition-all animate-fade-in"
                        aria-label="Open configuration panel"
                    >
                        <PanelOpenIcon className="w-6 h-6" />
                    </button>
                )}
                <div className="w-full min-h-screen">
                    {renderMainContent()}
                </div>
            </main>

            {isHistoryVisible && (
                <ReportHistory
                    reports={savedReports}
                    onLoad={handleLoadReport}
                    onDelete={handleDeleteReport}
                    onClear={handleClearHistory}
                    onClose={() => setIsHistoryVisible(false)}
                />
            )}
            {isAboutVisible && (
                <AboutModal onClose={() => setIsAboutVisible(false)} />
            )}
        </div>
    );
};

export default App;