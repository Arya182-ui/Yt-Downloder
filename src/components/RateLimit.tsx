import React from 'react';
import { Shield, RotateCcw, Clock } from 'lucide-react';

interface RateLimitProps {
  onReset: () => void;
}

export const RateLimit: React.FC<RateLimitProps> = ({ onReset }) => {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-8 text-center">
      <div className="flex flex-col items-center space-y-6">
        <div className="bg-yellow-100 p-4 rounded-full">
          <Shield className="h-12 w-12 text-yellow-600" />
        </div>
        
        <div className="space-y-3">
          <h3 className="text-2xl font-bold text-yellow-800">
            Rate Limit Reached
          </h3>
          <p className="text-yellow-700 max-w-md text-lg">
            You've reached the maximum number of downloads (5) for this session. 
            This helps us maintain service quality for all users.
          </p>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-yellow-200">
          <div className="flex items-center gap-2 text-yellow-700">
            <Clock className="h-5 w-5" />
            <span className="font-medium">Session will reset automatically</span>
          </div>
        </div>
        
        <button
          onClick={onReset}
          className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 flex items-center gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Reset Session
        </button>
      </div>
    </div>
  );
};