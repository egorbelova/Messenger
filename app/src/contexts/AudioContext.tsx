import { createContext, useContext, useRef, useState } from 'react';

interface AudioContextType {
  currentAudioId: string | null;
  playAudio: (id: string, src: string) => void;
  pauseAudio: () => void;
  isPlaying: boolean;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) throw new Error('useAudio must be used within AudioProvider');
  return context;
};

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const audioRef = useRef<HTMLAudioElement>(new Audio());
  const [currentAudioId, setCurrentAudioId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const playAudio = (id: string, src: string) => {
    if (currentAudioId !== id) {
      audioRef.current.src = src;
      audioRef.current.play();
      setCurrentAudioId(id);
      setIsPlaying(true);
    } else if (audioRef.current.paused) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }

    audioRef.current.onended = () => {
      setCurrentAudioId(null);
      setIsPlaying(false);
    };
  };

  const pauseAudio = () => {
    audioRef.current.pause();
    setIsPlaying(false);
  };

  return (
    <AudioContext.Provider
      value={{ currentAudioId, playAudio, pauseAudio, isPlaying }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudioContext = (): AudioContextType => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudioContext must be used within an AudioProvider');
  }
  return context;
};
