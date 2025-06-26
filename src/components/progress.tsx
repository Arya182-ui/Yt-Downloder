import React, { useState } from "react";
import { Download } from "lucide-react";

interface Format {
  format: string;
  quality: string;
}

interface VideoInfo {
  id: string;
  title: string;
  thumbnail: string;
  formats: Format[];
  audioFormats: Format[];
}

interface DownloaderProps {
  videoInfo: VideoInfo;
}

const Downloader: React.FC<DownloaderProps> = ({ videoInfo }) => {
  const [downloadingFormat, setDownloadingFormat] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);

  const apiUrl = import.meta.env.VITE_API_URL;

  const handleDownload = (format: string, quality: string) => {
    setDownloadingFormat(`${format}-${quality}`);
    setDownloadProgress(0);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${apiUrl}/api/download`, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.responseType = "blob";

    xhr.onload = function () {
      if (xhr.status === 200) {
        const blob = xhr.response;
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${videoInfo.title}.${format.toLowerCase()}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert("Download failed");
      }
      setDownloadingFormat(null);
      setDownloadProgress(0);
    };

    xhr.onerror = function () {
      alert("Download failed. Please try again.");
      setDownloadingFormat(null);
      setDownloadProgress(0);
    };

    xhr.upload.onprogress = function (event) {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        setDownloadProgress(percent);
      }
    };

    xhr.send(JSON.stringify({
      video_id: videoInfo.id,
      format: format.toLowerCase(),
      quality: quality,
    }));
  };

  return (
    <div className="w-full p-4">
      <div className="flex flex-col items-center">
        <img
          src={videoInfo.thumbnail}
          alt={videoInfo.title}
          className="rounded-xl shadow-lg w-64 mb-4"
        />
        <h2 className="text-xl font-bold text-center mb-4">{videoInfo.title}</h2>
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Video Formats</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {videoInfo.formats.map((format, index) => {
            const id = `${format.format}-${format.quality}`;
            return (
              <div key={index} className="bg-white p-3 rounded-xl shadow flex flex-col items-center">
                <span className="text-sm font-medium mb-2">{format.format} - {format.quality}</span>
                {downloadingFormat === id ? (
                  <>
                    <div className="w-full bg-gray-200 rounded-full h-3 mb-1">
                      <div
                        className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${downloadProgress}%` }}
                      ></div>
                    </div>
                    <div className="text-sm text-gray-600">{downloadProgress}%</div>
                  </>
                ) : (
                  <button
                    onClick={() => handleDownload(format.format, format.quality)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 mt-2 rounded-lg transition duration-200 flex items-center gap-2 text-sm"
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

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Audio Formats</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {videoInfo.audioFormats.map((format, index) => {
            const id = `${format.format}-${format.quality}`;
            return (
              <div key={index} className="bg-white p-3 rounded-xl shadow flex flex-col items-center">
                <span className="text-sm font-medium mb-2">{format.format} - {format.quality}</span>
                {downloadingFormat === id ? (
                  <>
                    <div className="w-full bg-gray-200 rounded-full h-3 mb-1">
                      <div
                        className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${downloadProgress}%` }}
                      ></div>
                    </div>
                    <div className="text-sm text-gray-600">{downloadProgress}%</div>
                  </>
                ) : (
                  <button
                    onClick={() => handleDownload(format.format, format.quality)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 mt-2 rounded-lg transition duration-200 flex items-center gap-2 text-sm"
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
  );
};

export default Downloader;
