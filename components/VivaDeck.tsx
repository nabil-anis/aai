
import React from 'react';
import { VivaQuestion } from '../types';
import VivaFlashcard from './VivaFlashcard';

interface VivaDeckProps {
    questions: VivaQuestion[];
}

const VivaDeck: React.FC<VivaDeckProps> = ({ questions }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {questions.map(q => (
                <VivaFlashcard key={q.question_number} question={q} />
            ))}
        </div>
    );
};

export default VivaDeck;
