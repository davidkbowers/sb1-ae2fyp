import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Settings } from 'lucide-react';
import { usePlayer } from '../contexts/PlayerContext';
import { useAnalytics } from '../contexts/AnalyticsContext';
import { useAuthStore } from '../store/authStore';

interface CustomVideoPlayerProps {
  src: string;
  poster?: string;
  title?: string;
  videoId?: string;
}

export default function CustomVideoPlayer({ src, poster, title, videoId = 'sample' }: CustomVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [lastProgressTrack, setLastProgressTrack] = useState(0);
  const { theme } = usePlayer();
  const { trackEvent } = useAnalytics();
  const { user } = useAuthStore();

  const userId = user?.id || 'anonymous';

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const trackProgress = () => {
      const currentPosition = video.currentTime;
      const currentDuration = video.duration;
      
      // Track progress every 10 seconds
      if (currentPosition - lastProgressTrack >= 10) {
        trackEvent({
          videoId,
          userId,
          eventType: 'progress',
          timestamp: Date.now(),
          position: currentPosition,
          duration: currentDuration,
          data: {
            percentageComplete: (currentPosition / currentDuration) * 100,
          },
        });
        setLastProgressTrack(currentPosition);
      }
    };

    const updateTime = () => {
      setCurrentTime(video.currentTime);
      trackProgress();
    };

    const updateDuration = () => setDuration(video.duration);

    const handlePlay = () => {
      setIsPlaying(true);
      trackEvent({
        videoId,
        userId,
        eventType: 'play',
        timestamp: Date.now(),
        position: video.currentTime,
        duration: video.duration,
      });
    };

    const handlePause = () => {
      setIsPlaying(false);
      trackEvent({
        videoId,
        userId,
        eventType: 'pause',
        timestamp: Date.now(),
        position: video.currentTime,
        duration: video.duration,
      });
    };

    const handleEnded = () => {
      trackEvent({
        videoId,
        userId,
        eventType: 'complete',
        timestamp: Date.now(),
        position: video.duration,
        duration: video.duration,
      });
    };

    const handleSeeked = () => {
      trackEvent({
        videoId,
        userId,
        eventType: 'seek',
        timestamp: Date.now(),
        position: video.currentTime,
        duration: video.duration,
        data: {
          previousPosition: currentTime,
        },
      });
    };

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('seeked', handleSeeked);

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('seeked', handleSeeked);
    };
  }, [videoId, userId, trackEvent, lastProgressTrack]);

  // Rest of the component remains the same...
  // (Previous implementation of togglePlay, toggleMute, handleVolumeChange, etc.)
}