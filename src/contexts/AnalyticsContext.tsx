import React, { createContext, useContext } from 'react';

interface VideoEvent {
  videoId: string;
  userId: string;
  eventType: 'play' | 'pause' | 'seek' | 'complete' | 'progress';
  timestamp: number;
  position: number;
  duration: number;
  data?: Record<string, any>;
}

interface AnalyticsContextType {
  trackEvent: (event: VideoEvent) => Promise<void>;
}

const AnalyticsContext = createContext<AnalyticsContextType>({
  trackEvent: async () => {},
});

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const trackEvent = async (event: VideoEvent) => {
    try {
      await fetch('/api/analytics/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...event,
          clientTimestamp: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error('Failed to track analytics event:', error);
    }
  };

  return (
    <AnalyticsContext.Provider value={{ trackEvent }}>
      {children}
    </AnalyticsContext.Provider>
  );
}

export const useAnalytics = () => useContext(AnalyticsContext);