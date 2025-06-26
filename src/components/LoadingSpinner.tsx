import React from 'react';
import { Youtube } from 'lucide-react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-12 border border-gray-100">
      <div className="flex flex-col items-center justify-center space-y-6">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-red-600"></div>
          <Youtube className="h-8 w-8 text-red-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>
        
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Processing Video
          </h3>
          <p className="text-gray-600">
            Fetching video information and available formats...
          </p>
        </div>
        
        <div className="flex space-x-1">
          <div className="h-2 w-2 bg-red-600 rounded-full animate-bounce"></div>
          <div className="h-2 w-2 bg-red-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
          <div className="h-2 w-2 bg-red-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
        </div>
      </div>
    </div>
  );
};