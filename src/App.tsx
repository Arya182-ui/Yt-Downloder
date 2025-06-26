import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { UrlInput } from './components/UrlInput';
import { LoadingSpinner } from './components/LoadingSpinner';
import { VideoDetails } from './components/VideoDetails';
import { ErrorMessage } from './components/ErrorMessage';
import { RateLimit } from './components/RateLimit';
import { Footer } from './components/Footer';

export interface VideoInfo {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  channel: string;
  views: string;
  formats: {
    format: string;
    quality: string;
    size: string;
    type: 'video' | 'audio';
  }[];
}

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [downloadCount, setDownloadCount] = useState(0);
  const MAX_DOWNLOADS = 5;
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  if (!apiUrl) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
        <div className="text-center p-8 bg-white shadow-lg rounded-xl border border-red-200">
          <h1 className="text-2xl font-bold text-red-700">Configuration Error</h1>
          <p className="mt-2 text-gray-800">The backend API URL is not configured.</p>
          <p className="mt-4 text-sm text-gray-600">
            Please create a <code className="bg-gray-200 p-1 rounded font-mono">.env.local</code> file in the project root and add the following:
          </p>
          <pre className="mt-2 bg-gray-100 p-3 rounded text-left text-sm">
            <code>VITE_API_BASE_URL=https://yt-downloder-xkj6.onrender.com</code>
          </pre>
        </div>
      </div>
    );
  }
const handleUrlSubmit = async (url: string, captchaToken: string) => {
  setIsLoading(true);
  setError(null);
  setVideoInfo(null);
  setIsRateLimited(false);

  try {
    const response = await fetch(`${apiUrl}/api/video-info`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url, captcha_token: captchaToken }),
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 429) {
        setIsRateLimited(true);
        return;
      }
      throw new Error(data.error || 'Failed to fetch video information');
    }

    setVideoInfo(data);
  } catch (err) {
    setError(err instanceof Error ? err.message : 'An error occurred while processing the video');
  } finally {
    setIsLoading(false);
  }
};

  const handleDownloadInitiated = () => {
    if (downloadCount < MAX_DOWNLOADS) {
      setDownloadCount(prev => prev + 1);
    }
  };

  const handleReset = () => {
    setVideoInfo(null);
    setError(null);
    setIsRateLimited(false);
  };

  const handleResetRateLimit = () => {
    setIsRateLimited(false);
    setDownloadCount(0);
    handleReset();
  };

  useEffect(() => {
    if (downloadCount >= MAX_DOWNLOADS) {
      setIsRateLimited(true);
    }
  }, [downloadCount]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            YouTube Video Downloader
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Download your favorite YouTube videos in multiple formats and qualities. 
            Fast, secure, and completely free.
          </p>
        </div>

        {isRateLimited ? (
          <RateLimit onReset={handleResetRateLimit} />
        ) : (
          <div className="space-y-8">
            <UrlInput onSubmit={handleUrlSubmit} disabled={isLoading} />
            
            {isLoading && <LoadingSpinner />}
            
            {error && <ErrorMessage message={error} onReset={handleReset} />}
            
            {videoInfo && !isLoading && (
              <VideoDetails 
                videoInfo={videoInfo} 
                onReset={handleReset}
                downloadCount={downloadCount} 
                onDownloadInitiated={handleDownloadInitiated}
                apiUrl={apiUrl}
              />
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
