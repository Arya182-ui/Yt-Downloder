import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onReset: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onReset }) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="bg-red-100 p-3 rounded-full">
          <AlertTriangle className="h-8 w-8 text-red-600" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-red-800">
            Oops! Something went wrong
          </h3>
          <p className="text-red-700 max-w-md">
            {message}
          </p>
        </div>
        
        <button
          onClick={onReset}
          className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200 flex items-center gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Try Again
        </button>
      </div>
    </div>
  );
};