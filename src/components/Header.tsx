import React from 'react';
import { Youtube, Shield, Zap } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Youtube className="h-8 w-8 text-red-600" />
            <span className="text-xl font-bold text-gray-900">YT Downloader</span>
          </div>
          
          <div className="hidden md:flex items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-green-600" />
              <span>Fast Downloads</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-blue-600" />
              <span>100% Safe</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};