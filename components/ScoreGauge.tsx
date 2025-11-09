
import React, { useEffect, useState } from 'react';

interface ScoreGaugeProps {
    score: number;
    size?: number;
    strokeWidth?: number;
}

const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score, size = 100, strokeWidth = 10 }) => {
    const [displayScore, setDisplayScore] = useState(0);

    useEffect(() => {
        const animation = requestAnimationFrame(() => setDisplayScore(score));
        return () => cancelAnimationFrame(animation);
    }, [score]);

    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (displayScore / 100) * circumference;

    const getColor = (s: number) => {
        if (s >= 70) return 'var(--score-high)';
        if (s >= 40) return 'var(--score-medium)';
        return 'var(--score-low)';
    };

    const color = getColor(score);

    return (
        <div className="relative" style={{ width: size, height: size }}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="var(--border)"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={color}
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.65, 0, 0.35, 1)' }}
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold animate-score-pop-in" style={{ fontSize: size/5, color }}>
                    {score}%
                </span>
            </div>
        </div>
    );
};

export default ScoreGauge;
