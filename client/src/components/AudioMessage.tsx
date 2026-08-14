import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AudioMessageProps {
  audioUrl: string;
  duration?: number;
  isLoading?: boolean;
}

export function AudioMessage({ audioUrl, duration = 0, isLoading = false }: AudioMessageProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      if (audio.currentTime && !isNaN(audio.currentTime) && isFinite(audio.currentTime) && audio.currentTime >= 0) {
        setCurrentTime(audio.currentTime);
      }
    };
    const updateDuration = () => {
      if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration) && audio.duration > 0) {
        setAudioDuration(audio.duration);
      }
    };
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };
    const handleLoadedData = () => {
      if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration) && audio.duration > 0) {
        setAudioDuration(audio.duration);
      }
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('loadeddata', handleLoadedData);
    audio.addEventListener('canplaythrough', updateDuration);
    audio.addEventListener('ended', handleEnded);

    // Force load the audio to get duration
    if (audioUrl && audio.src !== audioUrl) {
      audio.load();
    }

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('loadeddata', handleLoadedData);
      audio.removeEventListener('canplaythrough', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [audioUrl]);

  // Não fazer auto-play - usuário deve clicar para reproduzir

  const handlePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (error) {
        console.error('Erro ao reproduzir áudio:', error);
      }
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    const progressBar = e.currentTarget;
    if (!audio || !progressBar) return;

    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const progressWidth = rect.width;
    const newTime = (clickX / progressWidth) * audioDuration;
    
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time: number) => {
    if (!time || isNaN(time) || !isFinite(time) || time < 0) return "0:00";

    const totalSeconds = Math.floor(time); // arredonda para baixo
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };


  const progressPercentage = audioDuration > 0 && currentTime >= 0 ? (currentTime / audioDuration) * 100 : 0;

  if (isLoading) {
    return (
      <div className="flex items-center space-x-3 bg-gray-50 rounded-xl p-3 max-w-xs">
        <div className="w-8 h-8 rounded-full bg-[#6a7d00] flex items-center justify-center">
          <Volume2 className="h-4 w-4 text-white animate-pulse" />
        </div>
        <div className="flex-1">
          <div className="h-1 bg-gray-200 rounded-full animate-pulse"></div>
          <p className="text-xs text-gray-500 mt-1">Gerando áudio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-3 bg-white border border-gray-200 rounded-xl p-3 max-w-xs shadow-sm">
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
      
      <Button
        variant="ghost"
        size="sm"
        className="w-8 h-8 rounded-full bg-[#6a7d00] hover:bg-[#5a6d00] p-0"
        onClick={handlePlay}
      >
        {isPlaying ? (
          <Pause className="h-4 w-4 text-white" />
        ) : (
          <Play className="h-4 w-4 text-white ml-0.5" />
        )}
      </Button>

      <div className="flex-1" style={{
      width: '2rem'
      }}>
        <div 
          className="h-1 bg-gray-200 rounded-full cursor-pointer relative"
          onClick={handleSeek}
        >
          <div 
            className="h-1 bg-[#6a7d00] rounded-full transition-all duration-100"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{formatTime(audioDuration)}</span>
        </div>
      </div>

      <Volume2 className="h-3 w-3 text-gray-400" />
    </div>
  );
}