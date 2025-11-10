import React, { useCallback, useRef } from 'react';
import { AppConfig, DisciplineKey, UploadedFile } from '../types';
import { ACADEMIC_LEVELS, DISCIPLINES, MAX_CRITERIA, MIN_CRITERIA } from '../constants';
import ThemeToggle from './ThemeToggle';
import { 
    MortarBoardIcon, XIcon, InfoIcon, HistoryIcon, 
    UploadCloudIcon, FileTextIcon, XCircleIcon, PlusCircleIcon, MinusCircleIcon
} from './icons';

interface ConfigurationPanelProps {
    config: AppConfig;
    setConfig: React.Dispatch<React.SetStateAction<AppConfig>>;
    files: UploadedFile[];
    setFiles: React.Dispatch<React.SetStateAction<UploadedFile[]>>;
    isAnalyzing: boolean;
    onSubmit: () => void;
    onReset: () => void;
    savedReportsCount: number;
    toggleHistory: () => void;
    toggleAbout: () => void;
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = error => reject(error);
    });
};

const ConfigurationPanel: React.FC<ConfigurationPanelProps> = ({
    config, setConfig, files, setFiles, isAnalyzing, onSubmit, onReset,
    savedReportsCount, toggleHistory, toggleAbout, isOpen, setIsOpen
}) => {

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleConfigChange = (field: keyof AppConfig, value: any) => {
        setConfig(prev => ({ ...prev, [field]: value }));
    };

    const handleDisciplineChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newDiscipline = e.target.value as DisciplineKey;
        setConfig(prev => ({
            ...prev,
            discipline: newDiscipline,
            evaluationCriteria: DISCIPLINES[newDiscipline].criteria,
        }));
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFilesPromises = Array.from(e.target.files).map(async (file: File) => ({
                name: file.name,
                type: file.type,
                content: await fileToBase64(file),
            }));
            const newFiles = await Promise.all(newFilesPromises);
            setFiles(prev => [...prev, ...newFiles]);
        }
    };

    const removeFile = (fileName: string) => {
        setFiles(prev => prev.filter(f => f.name !== fileName));
    };

    const handleCriteriaChange = (index: number, value: string) => {
        const newCriteria = [...config.evaluationCriteria];
        newCriteria[index] = value;
        handleConfigChange('evaluationCriteria', newCriteria);
    };

    const addCriteria = () => {
        if (config.evaluationCriteria.length < MAX_CRITERIA) {
            handleConfigChange('evaluationCriteria', [...config.evaluationCriteria, '']);
        }
    };
    
    const removeCriteria = (index: number) => {
        if (config.evaluationCriteria.length > MIN_CRITERIA) {
            const newCriteria = config.evaluationCriteria.filter((_, i) => i !== index);
            handleConfigChange('evaluationCriteria', newCriteria);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit();
    };

    const isSubmitDisabled = !config.projectTitle || !config.evaluationContext || isAnalyzing;

    const DisciplineIcon = DISCIPLINES[config.discipline as DisciplineKey]?.icon || MortarBoardIcon;

    return (
        <aside className={`fixed top-0 left-0 h-full bg-[--background-secondary]/80 backdrop-blur-xl transition-transform duration-500 ease-in-out z-40 w-full md:w-[420px] ${isOpen ? 'translate-x-0' : '-translate-x-full'
            } border-r border-[--border] flex flex-col`}>
            <div className="flex-1 flex flex-col h-full">
                <div className="p-6 border-b border-[--border] flex-shrink-0">
                    <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-3">
                            <div className="bg-[--accent] p-2 rounded-xl">
                                <MortarBoardIcon className="w-7 h-7 text-[--accent-foreground]" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-black tracking-tighter text-[--foreground]">ASAP AI</h1>
                                <p className="text-xs font-medium tracking-wider text-[--foreground-tertiary] mt-1">by nbl</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <button onClick={toggleAbout} className="p-2 rounded-xl text-[--foreground-secondary] hover:bg-[--background-tertiary] transition-colors"><InfoIcon className="w-5 h-5"/></button>
                            <ThemeToggle />
                            <button onClick={toggleHistory} className="p-2 rounded-xl relative text-[--foreground-secondary] hover:bg-[--background-tertiary] transition-colors">
                                <HistoryIcon className="w-5 h-5"/>
                                {savedReportsCount > 0 && (
                                    <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-[--accent] ring-2 ring-[--background-secondary]"></span>
                                )}
                            </button>
                             <button onClick={() => setIsOpen(false)} className="p-2 rounded-xl text-[--foreground-secondary] hover:bg-[--background-tertiary] transition-colors"><XIcon className="w-5 h-5"/></button>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-y-auto">
                    <div className="p-6 space-y-6">
                        <div>
                            <label htmlFor="projectTitle" className="block text-sm text-[--foreground-secondary] mb-1.5">Project Title</label>
                            <input type="text" id="projectTitle" value={config.projectTitle} onChange={e => handleConfigChange('projectTitle', e.target.value)}
                                className="w-full bg-[--input] border border-transparent rounded-2xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[--ring] focus:border-[--ring] outline-none transition-all"
                                placeholder="e.g., Analysis of Q3 Corporate Earnings" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="discipline" className="block text-sm text-[--foreground-secondary] mb-1.5">Discipline</label>
                                <div className="relative">
                                    <DisciplineIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[--foreground-secondary]" />
                                    <select id="discipline" value={config.discipline} onChange={handleDisciplineChange}
                                        className="w-full bg-[--input] border border-transparent rounded-2xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-[--ring] focus:border-[--ring] outline-none appearance-none transition-all">
                                        {Object.keys(DISCIPLINES).map(d => <option key={d}>{d}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="academicLevel" className="block text-sm text-[--foreground-secondary] mb-1.5">Academic Level</label>
                                <select id="academicLevel" value={config.academicLevel} onChange={e => handleConfigChange('academicLevel', e.target.value)}
                                    className="w-full bg-[--input] border border-transparent rounded-2xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[--ring] focus:border-[--ring] outline-none appearance-none transition-all">
                                    {ACADEMIC_LEVELS.map(l => <option key={l}>{l}</option>)}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="evaluationContext" className="block text-sm text-[--foreground-secondary] mb-1.5">Evaluation Context</label>
                            <textarea id="evaluationContext" value={config.evaluationContext} onChange={e => handleConfigChange('evaluationContext', e.target.value)}
                                className="w-full bg-[--input] border border-transparent rounded-2xl px-4 py-2.5 text-sm min-h-[120px] focus:ring-2 focus:ring-[--ring] focus:border-[--ring] outline-none transition-all"
                                placeholder="e.g., Final year submission for an MBA Finance course."></textarea>
                        </div>
                        <div>
                            <label htmlFor="projectURL" className="block text-sm text-[--foreground-secondary] mb-1.5">Project URL (Optional)</label>
                            <input type="url" id="projectURL" value={config.projectURL} onChange={e => handleConfigChange('projectURL', e.target.value)}
                                className="w-full bg-[--input] border border-transparent rounded-2xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[--ring] focus:border-[--ring] outline-none transition-all"
                                placeholder="Link to Google Doc, GitHub, etc." />
                        </div>

                        <div>
                            <label className="block text-sm text-[--foreground-secondary] mb-1.5">Evaluation Criteria</label>
                            <div className="space-y-2">
                                {config.evaluationCriteria.map((criterion, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <input type="text" value={criterion} onChange={e => handleCriteriaChange(index, e.target.value)}
                                            className="w-full bg-[--input] border border-transparent rounded-2xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[--ring] focus:border-[--ring] outline-none transition-all" />
                                        <button type="button" onClick={() => removeCriteria(index)} disabled={config.evaluationCriteria.length <= MIN_CRITERIA} className="p-1 text-[--foreground-secondary] hover:text-[--destructive] disabled:opacity-30 disabled:cursor-not-allowed">
                                            <MinusCircleIcon className="w-5 h-5"/>
                                        </button>
                                    </div>
                                ))}
                                <button type="button" onClick={addCriteria} disabled={config.evaluationCriteria.length >= MAX_CRITERIA} className="flex items-center gap-2 text-sm text-[--accent] disabled:opacity-30 disabled:cursor-not-allowed pt-1">
                                    <PlusCircleIcon className="w-5 h-5"/> Add Criterion
                                </button>
                            </div>
                        </div>

                        <div>
                            {files.length > 0 && (
                                <div className="space-y-2 mb-3">
                                    {files.map(file => (
                                        <div key={file.name} className="flex items-center gap-2 bg-[--input] p-2.5 rounded-2xl text-sm">
                                            <FileTextIcon className="w-4 h-4 text-[--foreground-secondary] flex-shrink-0" />
                                            <span className="truncate flex-1" title={file.name}>{file.name}</span>
                                            <button onClick={() => removeFile(file.name)} className="p-1 text-[--foreground-secondary] hover:text-[--destructive]">
                                                <XCircleIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div onClick={() => fileInputRef.current?.click()}
                                className="mt-1 flex justify-center p-6 border-2 border-[--border] border-dashed rounded-2xl cursor-pointer hover:border-[--accent] transition-colors">
                                <div className="space-y-1 text-center">
                                    <UploadCloudIcon className="mx-auto h-10 w-10 text-[--foreground-tertiary]" />
                                    <p className="text-sm text-[--foreground-secondary]">
                                        <span className="font-medium text-[--accent]">{files.length > 0 ? 'Add More Files' : 'Upload Project Files'}</span>
                                    </p>
                                </div>
                                <input ref={fileInputRef} id="file-upload" name="file-upload" type="file" className="sr-only" multiple onChange={handleFileChange} />
                            </div>
                        </div>

                        <div className="flex items-center justify-between bg-[--input] p-3 rounded-2xl">
                            <div>
                                <p className="font-medium">Originality Check</p>
                                <p className="text-sm text-[--foreground-secondary]">AI-powered conceptual check</p>
                            </div>
                            <button type="button" role="switch" aria-checked={config.checkOriginality} onClick={() => handleConfigChange('checkOriginality', !config.checkOriginality)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${config.checkOriginality ? 'bg-[--accent]' : 'bg-[--background-tertiary]'}`}>
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${config.checkOriginality ? 'translate-x-6' : 'translate-x-1'}`} />
                            </button>
                        </div>
                    </div>

                    <div className="p-6 border-t border-[--border] mt-auto flex-shrink-0">
                        <div className="space-y-2">
                            <button type="submit" disabled={isSubmitDisabled}
                                className="w-full bg-[--accent] text-[--accent-foreground] py-3 rounded-2xl transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed">
                                {isAnalyzing ? 'Analyzing...' : 'Analyze Project'}
                            </button>
                            <button type="button" onClick={onReset}
                                className="w-full text-[--foreground-secondary] py-2 rounded-2xl hover:bg-[--background-tertiary] active:bg-[--input]">
                                Reset
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </aside>
    );
};

export default ConfigurationPanel;