import React from 'react';
import { InfoIcon, XIcon } from './icons';

interface AboutModalProps {
    onClose: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ onClose }) => {
    return (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50 glass-backdrop" onClick={onClose}></div>
            <div className="relative bg-[--background-secondary] rounded-3xl shadow-2xl w-full max-w-lg border border-[--border] m-4">
                <div className="p-8 text-center border-b border-[--border]">
                    <div className="inline-block bg-[--background-tertiary] p-3 rounded-2xl mb-4">
                        <InfoIcon className="w-10 h-10 text-[--accent]" />
                    </div>
                    <h2 className="text-2xl">About ASAP AI</h2>
                    <p className="text-sm text-[--foreground-secondary]">A Tool for Thought.</p>
                    <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full text-[--foreground-secondary] hover:bg-[--background-tertiary]">
                        <XIcon className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-8 space-y-4 text-[--foreground-secondary] max-h-[60vh] overflow-y-auto text-left leading-relaxed">
                    <p className="text-[--foreground]">ASAP AI was created for a single purpose: to help you transform good work into exceptional work. We believe that true mastery comes not from simply completing a task, but from understanding it at the deepest level.</p>
                    <p>This is not just an evaluation tool; it is a dedicated partner in your intellectual journey. It challenges your assumptions, refines your arguments, and prepares you to defend your ideas with confidence and clarity.</p>
                    <p>By blending the precision of artificial intelligence with the rigor of academic mentorship, we provide the critical feedback necessary to elevate your thinking. Our commitment is to help you achieve not just a better grade, but a more profound understanding.</p>
                </div>
                <div className="p-4 bg-[--background-tertiary] rounded-b-3xl border-t border-[--border]">
                    <button onClick={onClose} className="w-full bg-[--accent] text-[--accent-foreground] py-2.5 rounded-2xl transition-opacity hover:opacity-90 active:scale-[0.99]">
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AboutModal;