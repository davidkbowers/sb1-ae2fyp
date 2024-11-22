import React, { createContext, useContext, useState } from 'react';

interface PlayerTheme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  skin: 'modern' | 'classic' | 'minimal';
  controls: {
    showPlaybackSpeed: boolean;
    showQualitySelector: boolean;
    showFullscreen: boolean;
    showVolume: boolean;
    showCaptions: boolean;
  };
  layout: {
    controlsPosition: 'bottom' | 'overlay';
    titlePosition: 'top' | 'none';
  };
}

interface PlayerContextType {
  theme: PlayerTheme;
  updateTheme: (theme: Partial<PlayerTheme>) => void;
}

const defaultTheme: PlayerTheme = {
  primaryColor: '#4f46e5',
  secondaryColor: '#ffffff',
  accentColor: '#ef4444',
  skin: 'modern',
  controls: {
    showPlaybackSpeed: true,
    showQualitySelector: true,
    showFullscreen: true,
    showVolume: true,
    showCaptions: true,
  },
  layout: {
    controlsPosition: 'bottom',
    titlePosition: 'top',
  },
};

const PlayerContext = createContext<PlayerContextType>({
  theme: defaultTheme,
  updateTheme: () => {},
});

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<PlayerTheme>(defaultTheme);

  const updateTheme = (newTheme: Partial<PlayerTheme>) => {
    setTheme((prev) => ({
      ...prev,
      ...newTheme,
      controls: { ...prev.controls, ...newTheme.controls },
      layout: { ...prev.layout, ...newTheme.layout },
    }));
  };

  return (
    <PlayerContext.Provider value={{ theme, updateTheme }}>
      {children}
    </PlayerContext.Provider>
  );
}

export const usePlayer = () => useContext(PlayerContext);