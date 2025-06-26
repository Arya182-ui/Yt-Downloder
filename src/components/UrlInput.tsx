import { useState, useRef } from 'react';
import { Download, Link } from 'lucide-react';
import HCaptcha from "@hcaptcha/react-hcaptcha";

interface UrlInputProps {
  onSubmit: (url: string, captchaToken: string) => void;
  disabled: boolean;
}

export const UrlInput: React.FC<UrlInputProps> = ({ onSubmit, disabled }) => {
  const [url, setUrl] = useState('');
  const [captchaToken, setCaptchaToken] = useState('');
  const siteKey = import.meta.env.VITE_HCAPTCHA_SITEKEY;
  const captchaRef = useRef<HCaptcha | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedUrl = url.trim();

    if (!trimmedUrl) return;

    // Send the URL and (possibly empty) CAPTCHA token
    onSubmit(trimmedUrl, captchaToken);

    // Optional: reset CAPTCHA after submit
    captchaRef.current?.resetCaptcha();
    setCaptchaToken('');
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* URL Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Link className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste YouTube video URL here..."
            className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 text-lg"
            disabled={disabled}
          />
        </div>

        {/* hCaptcha */}
        <div className="flex justify-center">
          <HCaptcha
            sitekey={siteKey}
            onVerify={(token) => setCaptchaToken(token)}
            ref={captchaRef}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={disabled || !url.trim()} // ✅ No captchaToken check
          className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:transform-none disabled:cursor-not-allowed"
        >
          <Download className="h-5 w-5" />
          {disabled ? 'Processing...' : 'Get Download Options'}
        </button>
      </form>

      {/* Info Text */}
      <div className="mt-6 text-center text-sm text-gray-500">
        <p>Supports YouTube URLs like:</p>
        <p className="font-mono text-xs mt-1">
          youtube.com/watch?v=... or youtu.be/...
        </p>
      </div>
    </div>
  );
};
