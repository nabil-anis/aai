import React, { useState } from 'react';
import { VivaQuestion } from '../types';

interface VivaFlashcardProps {
    question: VivaQuestion;
}

const VivaFlashcard: React.FC<VivaFlashcardProps> = ({ question }) => {
    const [isFlipped, setIsFlipped] = useState(false);

    const handleFlip = () => setIsFlipped(!isFlipped);
    
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            handleFlip();
        }
    }

    return (
        <div
            className="perspective-1000 h-64"
            onClick={handleFlip}
            onKeyPress={handleKeyPress}
            tabIndex={0}
            role="button"
            aria-pressed={isFlipped}
        >
            <div
                className={`relative w-full h-full transform-style-3d transition-transform duration-700 card-interactive ${isFlipped ? 'is-flipped' : ''}`}
            >
                {/* Card Front */}
                <div className="card-front absolute w-full h-full backface-hidden bg-[--card] rounded-3xl p-6 flex flex-col justify-between border border-[--border]">
                    <div>
                        <p className="text-sm font-medium text-[--accent]">Question {question.question_number}</p>
                        <p className="mt-2 text-md text-[--foreground]">
                            {question.question}
                        </p>
                    </div>
                    <p className="text-xs text-[--foreground-tertiary] self-end">Click to reveal answer points</p>
                </div>

                {/* Card Back */}
                <div className="card-back absolute w-full h-full backface-hidden rotate-y-180 bg-[--card] rounded-3xl p-6 flex flex-col border border-[--border] overflow-y-auto">
                    <p className="text-sm font-medium text-[--accent]">Expected Answer Points</p>
                    <ul className="mt-2 space-y-2 text-sm text-[--foreground-secondary] list-disc list-inside">
                        {question.expected_answer_points.map((point, index) => (
                            <li key={index}>{point}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default VivaFlashcard;