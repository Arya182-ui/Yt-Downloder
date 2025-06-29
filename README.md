# YouTube Video Downloader

A beautiful, full-stack web application for downloading YouTube videos in multiple formats and qualities.

## Features

- 🎥 Download YouTube videos in MP4 format (360p, 720p, 1080p)
- 🎵 Extract audio in MP3 format (128kbps, 320kbps)
- 📱 Responsive, mobile-friendly design
- ⚡ Fast processing with real-time feedback
- 🛡️ Rate limiting and error handling
- 🎨 Beautiful, modern UI with Tailwind CSS

## Tech Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- Lucide React for icons
- Vite for development and building

### Backend
- Python Flask
- yt-dlp for YouTube video processing
- Flask-CORS for cross-origin requests
- Flask-Limiter for rate limiting

## Setup Instructions

### Prerequisites
- Node.js 16+ and npm
- Python 3.8+
- FFmpeg (for audio conversion)

### Installation

1. **Clone the repository and navigate into it**
   ```bash
   git clone https://github.com/Arya182-ui/Yt-Downloder
   cd Yt-Downloder
   ```

2. **Configure Environment Variables**
   Create a `.env.local` file by copying the example template. This file is used for your secret keys and local configuration.
   ```bash
   # On macOS/Linux
   cp .env.example .env.local

   # On Windows
   copy .env.example .env.local
   ```
   Now, open the new `.env.local` file and add your hCaptcha keys, which you can get for free from hcaptcha.com.

3. **Install frontend dependencies**
   ```bash
   npm install
   ```

4. **Setup backend**
   ```bash
   cd backend
   python setup.py
   ```

5. **Install FFmpeg** (required for audio conversion)
   - **Windows**: Download from https://ffmpeg.org/download.html
   - **macOS**: `brew install ffmpeg`
   - **Linux**: `sudo apt install ffmpeg` (Ubuntu/Debian)

### Development

1. **Start both frontend and backend**
   ```bash
   npm run dev
   ```

   This will start:
   - Frontend on http://localhost:5173
   - Backend on http://localhost:5000

2. **Or start them separately**
   ```bash
   # Frontend only
   npm run dev:frontend
   
   # Backend only
   npm run dev:backend
   ```

### Production Build

```bash
npm run build
```

## API Endpoints

### POST /api/video-info
Get video information from YouTube URL.

**Request:**
```json
{
  "url": "https://www.youtube.com/watch?v=VIDEO_ID"
}
```

**Response:**
```json
{
  "id": "VIDEO_ID",
  "title": "Video Title",
  "thumbnail": "thumbnail_url",
  "duration": "3:45",
  "channel": "Channel Name",
  "views": "1.2M views",
  "formats": [
    {
      "format": "MP4",
      "quality": "720p",
      "size": "28.7 MB",
      "type": "video"
    }
  ]
}
```

### POST /api/download
Download video in specified format.

**Request:**
```json
{
  "video_id": "VIDEO_ID",
  "format": "mp4",
  "quality": "720p"
}
```

**Response:** File download

## Rate Limiting

- Video info requests: 5 per minute
- Download requests: 3 per minute
- Overall limit: 50 per hour

## File Management

- Downloaded files are automatically cleaned up after 1 hour
- Cleanup runs every 30 minutes
- Files are served once and then immediately deleted

## Error Handling

The application handles various error scenarios:
- Invalid YouTube URLs
- Unavailable videos
- Network errors
- Rate limit exceeded
- Server errors

## Security Features

- CORS protection
- Rate limiting
- Input validation
- Automatic file cleanup
- No permanent file storage

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Error Facing : Cookie Expiry & Manual Refresh
To support region-restricted or age-gated YouTube content, I integrated browser-exported cookies into the backend.
But here's the reality of production:

📉 These cookies expire fast, often within hours.
🔁 There's no built-in refresh — requiring manual re-export & deployment.
💥 This leads to frontend errors like this:
 ![YouTube Cookie Error](Screenshot%202025-06-26%20082722.png)



🧠 Lesson learned: Authentication is not just about passing headers — it’s about session lifecycle management. A “working” cookie today might break your app tomorrow.

## License

⚠️ This public instance is for demo purposes only. Video download features are subject to rate limits and may break due to expired authentication cookies. Please use responsibly.


## 🙌 Author

Built with ❤️ by Arya (Ayush Gangwar)


## Contact
If you have any questions, feel free to reach out:

- GitHub: [Arya182-ui](https://github.com/Arya182-ui)
- Email: [arya119000@gmail.com]


## ☕ Support Me

Do you like My projects? You can show your support by buying me a coffee! Your contributions motivate me to keep improving and building more awesome projects. 💻❤  
[![Buy Me a Coffee](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](http://buymeacoffee.com/Arya182)
