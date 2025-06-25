import base64
import os
import tempfile
import time
import json
import requests
from pathlib import Path
from urllib.parse import urlparse, parse_qs
import yt_dlp
from flask import Flask, request, jsonify, send_file, after_this_request
from flask_cors import CORS
from flask_cors import cross_origin
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import threading
from zipfile import ZipFile

app = Flask(__name__)
CORS(app, origins=["https://ytdownloader-sigma.vercel.app"], supports_credentials=True)

# Rate limiting setup
limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    default_limits=["50 per hour", "10 per minute"]
)

# Create downloads directory
DOWNLOADS_DIR = Path("downloads")
DOWNLOADS_DIR.mkdir(exist_ok=True)

@app.errorhandler(429)
@cross_origin()
def rate_limit_handler(e):
    return jsonify({'error': 'Rate limit exceeded. Please try again later.'}), 429

@app.errorhandler(404)
@cross_origin()
def not_found_handler(e):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
@cross_origin()
def internal_error_handler(e):
    return jsonify({'error': 'Internal server error'}), 500

def verify_hcaptcha(token):
    secret = os.getenv("HCAPTCHA_SECRET")
    response = requests.post(
        'https://hcaptcha.com/siteverify',
        data={
            'secret': secret,
            'response': token
        }
    )
    return response.json().get('success', False)

def cleanup_old_files():
    """Clean up files older than 1 hour"""
    try:
        current_time = time.time()
        for file_path in DOWNLOADS_DIR.glob("*"):
            if file_path.is_file():
                file_age = current_time - file_path.stat().st_mtime
                if file_age > 3600:  # 1 hour
                    file_path.unlink()
                    print(f"Cleaned up old file: {file_path}")
    except Exception as e:
        print(f"Error during cleanup: {e}")

# Schedule cleanup every 30 minutes
def schedule_cleanup():
    while True:
        time.sleep(1800)  # 30 minutes
        cleanup_old_files()

cleanup_thread = threading.Thread(target=schedule_cleanup, daemon=True)
cleanup_thread.start()

def extract_video_id(url):
    """Extract video ID from YouTube URL"""
    parsed_url = urlparse(url)
    
    if parsed_url.hostname in ['youtu.be']:
        return parsed_url.path[1:]
    elif parsed_url.hostname in ['www.youtube.com', 'youtube.com', 'm.youtube.com']:
        if parsed_url.path == '/watch':
            return parse_qs(parsed_url.query)['v'][0]
        elif parsed_url.path.startswith('/embed/'):
            return parsed_url.path.split('/')[2]
        elif parsed_url.path.startswith('/v/'):
            return parsed_url.path.split('/')[2]
    
    return None

secret_path = "/etc/secrets/YOUTUBE_COOKIE_B64"

# 🔐 Step 1: Read & decode the file
secret_path = "/etc/secrets/YOUTUBE_COOKIE_B64"

# 🔐 Step 1: Read base64-encoded cookie string from secret file
with open(secret_path, "rb") as f:
    cookie_b64 = f.read()

# ✅ Step 2: Decode base64 and write to cookies.txt
with open("cookies.txt", "wb") as f:
    f.write(base64.b64decode(cookie_b64))

print("✅ Decoded cookies.txt created from Secret File.")
        
def get_video_info(url):
    """Get video information using yt-dlp"""
    ydl_opts = {
        'quiet': True,
        'cookiefile': 'cookies.txt',
        'skip_download': True,
        'noplaylist': True,
    }
    
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            
            # Get duration in readable format
            duration = info.get('duration', 0)
            duration_str = f"{duration // 60}:{duration % 60:02d}" if duration else "Unknown"
            
            # Get view count
            view_count = info.get('view_count', 0)
            if view_count >= 1000000:
                views_str = f"{view_count / 1000000:.1f}M views"
            elif view_count >= 1000:
                views_str = f"{view_count / 1000:.1f}K views"
            else:
                views_str = f"{view_count} views"
            
            # Get available formats
            formats = []
            
            # Video formats
            video_formats = ['360', '720', '1080']
            for quality in video_formats:
                # Check if format is available
                available = any(
                    f.get('height') == int(quality) and f.get('vcodec') != 'none'
                    for f in info.get('formats', [])
                )
                if available:
                    # Estimate file size (rough calculation)
                    size_mb = duration * (int(quality) / 100) if duration else 50
                    formats.append({
                        'format': 'MP4',
                        'quality': f'{quality}p',
                        'size': f'{size_mb:.1f} MB',
                        'type': 'video'
                    })
            
            # Audio formats
            audio_formats = [
                {'quality': '320kbps', 'size_factor': 2.5},
                {'quality': '128kbps', 'size_factor': 1.0}
            ]
            for audio in audio_formats:
                size_mb = duration * audio['size_factor'] / 60 if duration else 5
                formats.append({
                    'format': 'MP3',
                    'quality': audio['quality'],
                    'size': f'{size_mb:.1f} MB',
                    'type': 'audio'
                })
            
            return {
                'id': info.get('id', ''),
                'title': info.get('title', 'Unknown Title'),
                'thumbnail': info.get('thumbnail', ''),
                'duration': duration_str,
                'channel': info.get('uploader', 'Unknown Channel'),
                'views': views_str,
                'formats': formats
            }
    
    except Exception as e:
        raise Exception(f"Failed to extract video info: {str(e)}")

@app.route('/api/video-info', methods=['POST'])
@limiter.limit("5 per minute")
def get_video_info_endpoint():
    """Get video information"""
    try:
        data = request.get_json()
        url = data.get('url', '').strip()
        captcha_token = data.get('captcha_token')
        
        if not captcha_token or not verify_hcaptcha(captcha_token):
            return jsonify({'error': 'hCaptcha verification failed'}), 403
        
        if not url:
            return jsonify({'error': 'URL is required'}), 400
        
        # Validate YouTube URL
        video_id = extract_video_id(url)
        if not video_id:
            return jsonify({'error': 'Invalid YouTube URL'}), 400
        
        video_info = get_video_info(url)
        return jsonify(video_info)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/download', methods=['POST'])
@limiter.limit("3 per minute")
def download_video():
    """Download video in specified format"""
    try:
        data = request.get_json()
        video_id = data.get('video_id', '').strip()
        format_type = data.get('format', '').lower()
        quality = data.get('quality', '').strip()
        captcha_token = data.get('captcha_token')
        
        if not captcha_token or not verify_hcaptcha(captcha_token):
           return jsonify({'error': 'hCaptcha verification failed'}), 403

        if not all([video_id, format_type, quality]):
            return jsonify({'error': 'Missing required parameters'}), 400
        
        url = f"https://www.youtube.com/watch?v={video_id}"
        
        # Create unique filename
        timestamp = int(time.time())
        
        if format_type == 'mp4':
            # Video download
            quality_num = quality.replace('p', '')
            output_filename = f"{video_id}_{quality_num}p_{timestamp}.%(ext)s"
            
            ydl_opts = {
                'format': f'best[height<={quality_num}][ext=mp4]/best[height<={quality_num}]',
                'outtmpl': str(DOWNLOADS_DIR / output_filename),
                'quiet': True,
                'no_warnings': True,
            }
        
        elif format_type == 'mp3':
            # Audio download
            output_filename = f"{video_id}_{quality}_{timestamp}.%(ext)s"
            
            if quality == '320kbps':
                audio_quality = '320'
            else:
                audio_quality = '128'
            
            ydl_opts = {
                'format': 'bestaudio/best',
                'outtmpl': str(DOWNLOADS_DIR / output_filename),
                'postprocessors': [{
                    'key': 'FFmpegExtractAudio',
                    'preferredcodec': 'mp3',
                    'preferredquality': audio_quality,
                }],
                'quiet': True,
                'no_warnings': True,
            }
        else:
            return jsonify({'error': 'Unsupported format'}), 400
        
        # Download the file
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([url])
        
        # Find the downloaded file
        downloaded_files = list(DOWNLOADS_DIR.glob(f"{video_id}*{timestamp}*"))
        if not downloaded_files:
            return jsonify({'error': 'Download failed'}), 500
        
        file_path = downloaded_files[0]
        
        # Get video title for filename
        try:
            info = get_video_info(url)
            safe_title = "".join(c for c in info['title'] if c.isalnum() or c in (' ', '-', '_')).rstrip()
            safe_title = safe_title[:50]  # Limit filename length
        except:
            safe_title = f"video_{video_id}"
        
        # Determine file extension and download name
        file_ext = file_path.suffix.lstrip(".")
        download_name = f"{safe_title}.{file_ext}"

        
        @after_this_request
        def remove_file(response):
            try:
                file_path.unlink()
            except Exception as e:
                print(f"Error removing file {file_path}: {e}")
            return response
        
        return send_file(
            file_path,
            as_attachment=True,
            download_name=download_name,
            mimetype='application/octet-stream'
        )
    
    except Exception as e:
        return jsonify({'error': f'Download failed: {str(e)}'}), 500


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'ok', 'message': 'YouTube Downloader API is running'})

@app.errorhandler(429)
def rate_limit_handler(e):
    return jsonify({'error': 'Rate limit exceeded. Please try again later.'}), 429

@app.errorhandler(404)
def not_found_handler(e):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error_handler(e):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
