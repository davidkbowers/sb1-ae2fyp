import React, { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Upload, Play, Pause, X, Save, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { videoProcessor } from '../utils/videoProcessor';
import type { ProcessedVideo } from '../utils/videoProcessor';
import { ENDPOINTS, getApiUrl } from '../utils/api';

interface VideoUploadProps {
  lessonId?: string;
}

export default function VideoUpload({ lessonId }: VideoUploadProps) {
  const navigate = useNavigate();
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string>('');
  const [processedVideo, setProcessedVideo] = useState<ProcessedVideo | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 500 * 1024 * 1024) { // 500MB limit
        toast.error('Video file size must be less than 500MB');
        return;
      }

      if (!file.type.startsWith('video/')) {
        toast.error('Please select a valid video file');
        return;
      }

      setVideoFile(file);
      setVideoPreviewUrl(URL.createObjectURL(file));
      setProcessingProgress(0);
      setUploadProgress(0);

      try {
        setIsProcessing(true);
        const processed = await videoProcessor.processVideo(file, (progress) => {
          setProcessingProgress(Math.round(progress * 100));
        });
        setProcessedVideo(processed);
        setVideoPreviewUrl(processed.mp4Url);
        toast.success('Video processed successfully!');
      } catch (error) {
        toast.error('Failed to process video');
        clearVideo();
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleUpload = async () => {
    if (!videoFile || !processedVideo) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('mp4', await fetch(processedVideo.mp4Url).then(r => r.blob()));
      formData.append('webm', await fetch(processedVideo.webmUrl).then(r => r.blob()));
      formData.append('thumbnail', await fetch(processedVideo.thumbnail).then(r => r.blob()));
      formData.append('duration', processedVideo.duration.toString());
      formData.append('lessonId', lessonId || '');

      const response = await fetch(getApiUrl(ENDPOINTS.VIDEOS), {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Upload failed');

      toast.success('Video uploaded successfully!');
      navigate(`/lessons/${lessonId}`);
    } catch (error) {
      toast.error('Failed to upload video');
    } finally {
      setIsUploading(false);
    }
  };

  const handleVideoPlayPause = () => {
    const video = document.getElementById('videoPreview') as HTMLVideoElement;
    if (video) {
      if (video.paused) {
        video.play();
        setIsPlaying(true);
      } else {
        video.pause();
        setIsPlaying(false);
      }
    }
  };

  const clearVideo = () => {
    if (processedVideo) {
      URL.revokeObjectURL(processedVideo.mp4Url);
      URL.revokeObjectURL(processedVideo.webmUrl);
      URL.revokeObjectURL(processedVideo.thumbnail);
    }
    setVideoFile(null);
    setVideoPreviewUrl('');
    setProcessedVideo(null);
    setUploadProgress(0);
    setProcessingProgress(0);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Upload Video</h1>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="space-y-6">
          {!videoPreviewUrl ? (
            <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
              <div className="space-y-2 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                    <span>Upload a video</span>
                    <input
                      type="file"
                      className="sr-only"
                      accept="video/*"
                      onChange={handleFileSelect}
                      disabled={isProcessing}
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500">
                  MP4, WebM, Ogg up to 500MB
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                <video
                  id="videoPreview"
                  src={videoPreviewUrl}
                  className="w-full rounded-lg"
                  controls={false}
                  poster={processedVideo?.thumbnail}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    onClick={handleVideoPlayPause}
                    className="p-3 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-75 transition-opacity"
                  >
                    {isPlaying ? (
                      <Pause className="h-8 w-8" />
                    ) : (
                      <Play className="h-8 w-8" />
                    )}
                  </button>
                </div>
                <button
                  onClick={clearVideo}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {isProcessing && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Processing Video</span>
                    <span>{processingProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${processingProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {isUploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Upload Progress</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {processedVideo && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Processing Results</h3>
                  <dl className="grid grid-cols-2 gap-4">
                    <div>
                      <dt className="text-xs text-gray-500">Duration</dt>
                      <dd className="text-sm text-gray-900">
                        {new Date(processedVideo.duration * 1000).toISOString().substr(11, 8)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-gray-500">Formats</dt>
                      <dd className="text-sm text-gray-900">MP4, WebM</dd>
                    </div>
                  </dl>
                </div>
              )}

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={clearVideo}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  disabled={isProcessing || isUploading}
                >
                  Clear
                </button>
                <button
                  onClick={handleUpload}
                  disabled={isProcessing || isUploading || !processedVideo}
                  className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isUploading ? 'Uploading...' : isProcessing ? 'Processing...' : 'Upload Video'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}