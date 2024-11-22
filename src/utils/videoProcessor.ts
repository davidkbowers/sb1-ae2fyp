import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

export interface ProcessedVideo {
  mp4Url: string;
  webmUrl: string;
  thumbnail: string;
  duration: number;
}

class VideoProcessor {
  private ffmpeg: FFmpeg;
  private loaded: boolean = false;

  constructor() {
    this.ffmpeg = new FFmpeg();
  }

  private async load() {
    if (this.loaded) return;

    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
    await this.ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });
    
    this.loaded = true;
  }

  async processVideo(
    videoFile: File,
    onProgress?: (progress: number) => void
  ): Promise<ProcessedVideo> {
    await this.load();

    try {
      // Write input file to memory
      const inputFileName = 'input.mp4';
      await this.ffmpeg.writeFile(inputFileName, await fetchFile(videoFile));

      // Get video duration
      await this.ffmpeg.exec(['-i', inputFileName]);
      const duration = await this.getVideoDuration();

      // Generate thumbnail
      const thumbnailName = 'thumbnail.jpg';
      await this.ffmpeg.exec([
        '-i', inputFileName,
        '-ss', '00:00:01',
        '-vframes', '1',
        '-vf', 'scale=480:-1',
        thumbnailName
      ]);

      // Process MP4 version (h264)
      const mp4Name = 'output.mp4';
      await this.ffmpeg.exec([
        '-i', inputFileName,
        '-c:v', 'libx264',
        '-preset', 'medium',
        '-crf', '23',
        '-c:a', 'aac',
        '-b:a', '128k',
        '-movflags', '+faststart',
        mp4Name
      ], { progress: onProgress });

      // Process WebM version (VP9)
      const webmName = 'output.webm';
      await this.ffmpeg.exec([
        '-i', inputFileName,
        '-c:v', 'libvpx-vp9',
        '-crf', '30',
        '-b:v', '0',
        '-c:a', 'libopus',
        '-b:a', '128k',
        webmName
      ], { progress: onProgress });

      // Read processed files
      const mp4Data = await this.ffmpeg.readFile(mp4Name);
      const webmData = await this.ffmpeg.readFile(webmName);
      const thumbnailData = await this.ffmpeg.readFile(thumbnailName);

      // Create URLs
      const mp4Url = URL.createObjectURL(new Blob([mp4Data], { type: 'video/mp4' }));
      const webmUrl = URL.createObjectURL(new Blob([webmData], { type: 'video/webm' }));
      const thumbnail = URL.createObjectURL(new Blob([thumbnailData], { type: 'image/jpeg' }));

      return { mp4Url, webmUrl, thumbnail, duration };
    } catch (error) {
      console.error('Video processing failed:', error);
      throw new Error('Failed to process video');
    }
  }

  private async getVideoDuration(): Promise<number> {
    const data = await this.ffmpeg.readFile('ffmpeg.txt');
    const text = new TextDecoder().decode(data);
    const durationMatch = text.match(/Duration: (\d{2}):(\d{2}):(\d{2})/);
    
    if (durationMatch) {
      const [, hours, minutes, seconds] = durationMatch;
      return parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds);
    }
    
    return 0;
  }
}

export const videoProcessor = new VideoProcessor();