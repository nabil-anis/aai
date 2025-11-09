
import React from 'react';
import { XCircleIcon } from './icons';

interface ErrorMessageProps {
    message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
    return (
        <div className="flex items-center justify-center h-full p-4">
            <div className="max-w-lg w-full bg-red-500/10 border border-red-500/50 text-red-300 rounded-lg p-6 flex items-start gap-4" role="alert">
                <XCircleIcon className="h-6 w-6 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                    <h3 className="text-red-200">Analysis Failed</h3>
                    <p className="mt-1 text-sm">{message}</p>

                </div>
            </div>
        </div>
    );
};

export default ErrorMessage;