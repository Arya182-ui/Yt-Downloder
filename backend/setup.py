#!/usr/bin/env python3
"""
Setup script for YouTube Downloader backend
"""

import subprocess
import sys
import os

def install_requirements():
    """Install Python requirements"""
    try:
        subprocess.check_call([sys.executable, '-m', 'pip', 'install', '-r', 'requirements.txt'])
        print("✅ Python dependencies installed successfully!")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install Python dependencies: {e}")
        return False

def check_ffmpeg():
    """Check if FFmpeg is available"""
    try:
        subprocess.run(['ffmpeg', '-version'], capture_output=True, check=True)
        print("✅ FFmpeg is available!")
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        print("⚠️  FFmpeg not found. Audio conversion may not work properly.")
        print("   Please install FFmpeg:")
        print("   - Windows: Download from https://ffmpeg.org/download.html")
        print("   - macOS: brew install ffmpeg")
        print("   - Linux: sudo apt install ffmpeg (Ubuntu/Debian) or sudo yum install ffmpeg (CentOS/RHEL)")
        return False

def main():
    """Main setup function"""
    print("🚀 Setting up YouTube Downloader backend...")
    
    # Change to backend directory
    backend_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(backend_dir)
    
    # Install requirements
    if not install_requirements():
        sys.exit(1)
    
    # Check FFmpeg
    check_ffmpeg()
    
    print("\n✅ Setup complete!")
    print("To start the backend server, run: python app.py")

if __name__ == "__main__":
    main()