import React  from 'react';
import { useState } from 'react';
import { Play, Download, FileVideo, Music, User, Eye, Clock, RotateCcw } from 'lucide-react';
import { VideoInfo } from '../App';

interface VideoDetailsProps {
  videoInfo: VideoInfo;
  onReset: () => void;
  downloadCount: number;
  onDownloadInitiated: () => void;
  apiUrl: string;
}


export const VideoDetails: React.FC<VideoDetailsProps> = ({ videoInfo, onReset, downloadCount, onDownloadInitiated, apiUrl }) => {
  const [downloadingFormat, setDownloadingFormat] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const MAX_DOWNLOADS = 5;

  const handleDownload = (format: string, quality: string) => {
    onDownloadInitiated();
    const formatId = `${format}-${quality}`;
    setDownloadingFormat(formatId);
    setDownloadProgress(0);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${apiUrl}/api/download`, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.responseType = 'blob';

    xhr.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        setDownloadProgress(percentComplete);
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        const blob = xhr.response;
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${videoInfo.title}.${format.toLowerCase()}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        console.error('Download failed with status:', xhr.status);
        alert('Download failed. Please try again.');
      }
      setDownloadingFormat(null);
    };

    xhr.onerror = () => {
      console.error('Download error:', xhr.statusText);
      alert('Download failed. Please check your connection and try again.');
      setDownloadingFormat(null);
    };

    xhr.send(JSON.stringify({
      video_id: videoInfo.id,
      format: format.toLowerCase(),
      quality: quality,
    }));
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 space-y-6">
      {/* Video Preview */}
      <div className="relative">
        <div className="aspect-video bg-gray-900 rounded-xl overflow-hidden relative group">
          <img 
            src={videoInfo.thumbnail} 
            alt={videoInfo.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Play className="h-16 w-16 text-white" />
          </div>
        </div>
      </div>

      {/* Video Info */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 leading-tight">
          {videoInfo.title}
        </h2>
        
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span>{videoInfo.channel}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            <span>{videoInfo.views}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{videoInfo.duration}</span>
          </div>
        </div>
      </div>

      {/* Download Options */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Download Options</h3>
          <span className="text-sm text-gray-500">
            {downloadCount}/5 downloads used
          </span>
        </div>

        {/* Video Formats */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-700 flex items-center gap-2">
            <FileVideo className="h-4 w-4" />
            Video Formats
          </h4>
          <div className="grid gap-3">
            {videoInfo.formats
              .filter(format => format.type === 'video')
              .map((format, index) => {
                const formatId = `${format.format}-${format.quality}`;
                const isDownloading = downloadingFormat === formatId;
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{format.format}</span>
                        <span className="text-sm text-gray-600">{format.quality}</span>
                      </div>
                      <span className="text-sm text-gray-500">{format.size}</span>
                    </div>
                    {isDownloading ? (
                      <div className="w-32 text-center">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-red-600 h-2.5 rounded-full transition-all duration-150" style={{ width: `${downloadProgress}%` }}></div>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">{downloadProgress}%</p>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleDownload(format.format, format.quality)}
                        disabled={!!downloadingFormat || downloadCount >= MAX_DOWNLOADS}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2 text-sm font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        <Download className="h-4 w-4" />
                        Download
                      </button>
                    )}
                  </div>
                );
              })}
          </div>
        </div>

        {/* Audio Formats */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-700 flex items-center gap-2">
            <Music className="h-4 w-4" />
            Audio Formats
          </h4>
          <div className="grid gap-3">
            {videoInfo.formats
              .filter(format => format.type === 'audio')
              .map((format, index) => {
                const formatId = `${format.format}-${format.quality}`;
                const isDownloading = downloadingFormat === formatId;
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{format.format}</span>
                        <span className="text-sm text-gray-600">{format.quality}</span>
                      </div>
                      <span className="text-sm text-gray-500">{format.size}</span>
                    </div>
                    {isDownloading ? (
                      <div className="w-32 text-center">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-green-600 h-2.5 rounded-full transition-all duration-150" style={{ width: `${downloadProgress}%` }}></div>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">{downloadProgress}%</p>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleDownload(format.format, format.quality)}
                        disabled={!!downloadingFormat || downloadCount >= MAX_DOWNLOADS}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2 text-sm font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        <Download className="h-4 w-4" />
                        Download
                      </button>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* Reset Button */}
      <div className="pt-4 border-t border-gray-200">
        <button
          onClick={onReset}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Download Another Video
        </button>
      </div>
    </div>
  );
};