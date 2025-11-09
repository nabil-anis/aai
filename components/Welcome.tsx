import React from 'react';
import { MortarBoardIcon } from './icons';

const Welcome: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in p-8 max-w-3xl mx-auto">
            <div className="w-20 h-20 bg-[--background-secondary] border border-[--border] rounded-2xl flex items-center justify-center mb-8 shadow-md">
                <MortarBoardIcon className="w-10 h-10 text-[--accent]" />
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter text-[--foreground] mb-4">
                Welcome to ASAP AI
            </h1>
            <p className="text-xl md:text-2xl text-[--foreground-secondary] leading-relaxed">
                An intelligent partner for academic evaluation, crafted with precision.
            </p>
            <p className="mt-10 text-base text-[--foreground-secondary]">
                Provide the project details in the side panel to begin your analysis.
            </p>
        </div>
    );
};

export default Welcome;
