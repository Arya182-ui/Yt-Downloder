import React from 'react';
import { Heart, Github, Twitter } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-red-500" />
            <span>for content creators</span>
          </div>
          
          <div className="flex items-center justify-center gap-6">
            <a 
              href="#" 
              className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
            <a 
              href="#" 
              className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
              aria-label="Twitter"
            >
              <Twitter className="h-5 w-5" />
            </a>
          </div>
          
          <div className="text-sm text-gray-500 space-y-2">
            <p>© 2024 YouTube Downloader. All rights reserved.</p>
            <p className="text-xs">
              This tool is for personal use only. Please respect copyright laws and YouTube's terms of service.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};