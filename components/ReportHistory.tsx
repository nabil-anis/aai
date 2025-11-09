import React from 'react';
import { ProjectReport } from '../types';
import { HistoryIcon, TrashIcon, XIcon } from './icons';

interface ReportHistoryProps {
    reports: ProjectReport[];
    onLoad: (report: ProjectReport) => void;
    onDelete: (reportId: string) => void;
    onClear: () => void;
    onClose: () => void;
}

const ReportHistory: React.FC<ReportHistoryProps> = ({ reports, onLoad, onDelete, onClear, onClose }) => {
    return (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50 glass-backdrop" onClick={onClose}></div>
            <div className="relative bg-[--background-secondary] rounded-3xl shadow-2xl w-full max-w-lg border border-[--border] m-4 flex flex-col max-h-[80vh]">
                <div className="p-5 flex justify-between items-center border-b border-[--border] flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <HistoryIcon className="w-6 h-6 text-[--accent]" />
                        <h2 className="text-xl">Report History</h2>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full text-[--foreground-secondary] hover:bg-[--background-tertiary]">
                        <XIcon className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-4 flex-1 overflow-y-auto">
                    {reports.length === 0 ? (
                        <p className="text-center text-[--foreground-secondary] py-16">No reports saved yet.</p>
                    ) : (
                        <ul className="space-y-2">
                            {reports.map(report => (
                                <li key={report.id} className="group flex justify-between items-center p-3 bg-transparent rounded-xl hover:bg-[--background-tertiary] transition-colors">
                                    <div>
                                        <p className="font-medium truncate max-w-xs">{report.projectTitle}</p>
                                        <p className="text-xs text-[--foreground-secondary]">
                                            {new Date(report.savedDate).toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity focus-within:opacity-100">
                                        <button onClick={() => onLoad(report)} className="px-3 py-1 text-sm bg-[--accent] text-[--accent-foreground] rounded-xl">Load</button>
                                        <button onClick={() => onDelete(report.id)} className="p-2 text-[--foreground-secondary] hover:text-[--destructive] rounded-xl">
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                {reports.length > 0 && (
                     <div className="p-4 border-t border-[--border] flex-shrink-0">
                        <button onClick={onClear} className="w-full text-sm text-[--destructive] py-2 rounded-xl hover:bg-[--destructive]/10">
                            Clear All History
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReportHistory;