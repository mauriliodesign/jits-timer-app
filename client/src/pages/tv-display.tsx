import { useEffect, useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useWebSocket } from "@/hooks/use-websocket";
import { formatTime, getProgressPercentage } from "@/lib/timer-utils";
import { 
  playStartRoundSound, 
  playEndRoundSound, 
  playRestStartSound, 
  playTrainingCompleteSound,
  enableAudio 
} from "@/lib/sound-utils";
import { Timer, Building2, ArrowLeft } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SecondarySmallButton } from "@/components/ui/button-system";
import type { TimerSession, AcademyProfile } from "@shared/schema";

interface TimerState {
  currentTime: number;
  currentRound: number;
  totalRounds: number;
  isRunning: boolean;
  isResting: boolean;
}

export default function TVDisplay() {
  const [timerState, setTimerState] = useState<TimerState>({
    currentTime: 0,
    currentRound: 1,
    totalRounds: 5,
    isRunning: false,
    isResting: false,
  });

  const [currentTime, setCurrentTime] = useState(new Date());

  const previousStateRef = useRef<TimerState>(timerState);
  const audioInitializedRef = useRef(false);

  const { isConnected, lastMessage } = useWebSocket();

  const { data: currentSession } = useQuery<TimerSession>({
    queryKey: ["/api/timer/current"],
    refetchInterval: 5000, // Fallback polling every 5 seconds
  });

  const { data: academyProfile } = useQuery<AcademyProfile>({
    queryKey: ["/api/profile/public"],
    refetchInterval: 30000, // Refresh academy info every 30 seconds
    retry: false, // Don't retry failed requests
  });

  // Update timer state from WebSocket messages
  useEffect(() => {
    if (lastMessage?.type === "timer_update") {
      const newState = {
        currentTime: lastMessage.data.currentTime,
        currentRound: lastMessage.data.currentRound,
        totalRounds: lastMessage.data.totalRounds,
        isRunning: lastMessage.data.isRunning,
        isResting: lastMessage.data.isResting,
      };
      
      setTimerState(newState);
    }
  }, [lastMessage]);

  // Sound effects based on timer state changes
  useEffect(() => {
    const prev = previousStateRef.current;
    const curr = timerState;

    // Initialize audio context on first user interaction
    if (!audioInitializedRef.current && curr.isRunning) {
      enableAudio();
      audioInitializedRef.current = true;
    }

    // Detect round start (not running -> running and not resting)
    if (!prev.isRunning && curr.isRunning && !curr.isResting) {
      playStartRoundSound();
    }

    // Detect round end (round counter increased or time reached max)
    if (prev.currentRound < curr.currentRound && curr.isResting) {
      playEndRoundSound();
    }

    // Detect rest period start (not resting -> resting)
    if (!prev.isResting && curr.isResting && curr.isRunning) {
      playRestStartSound();
    }

    // Detect training completion (was running and reached final round)
    if (prev.isRunning && !curr.isRunning && curr.currentRound >= curr.totalRounds) {
      playTrainingCompleteSound();
    }

    // Update previous state reference
    previousStateRef.current = curr;
  }, [timerState]);

  // Initialize from current session
  useEffect(() => {
    if (currentSession) {
      setTimerState({
        currentTime: currentSession.currentTime,
        currentRound: currentSession.currentRound,
        totalRounds: currentSession.rounds,
        isRunning: currentSession.isRunning,
        isResting: currentSession.isResting,
      });
    }
  }, [currentSession]);

  // Update current time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const totalTime = timerState.isResting ? 
    (currentSession?.restTime || 60) : 
    ((currentSession?.roundDuration || 6) * 60);
  
  const progressPercentage = getProgressPercentage(timerState.currentTime, totalTime);
  const circumference = 2 * Math.PI * 45; // radius = 45
  const strokeDashoffset = circumference - (progressPercentage / 100) * circumference;

  const getStatusMessage = () => {
    if (!timerState.isRunning) return "Pronto para Iniciar";
    if (timerState.isResting) return "Descanso";
    return "Treinando";
  };

  const getStatusColor = () => {
    if (!timerState.isRunning) return "text-[#3a3a3f] border-[#252529]";
    if (timerState.isResting) return "text-orange-400 border-orange-600";
    return "text-white border-[#59FF3A]";
  };

  return (
    <div className="min-h-screen bg-[#121214] text-white flex flex-col relative">
      {/* Academy Header */}
      {academyProfile && (
        <div className="w-full bg-transparent px-3 sm:px-6 py-2 sm:py-4">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center space-x-2 sm:space-x-4">
              {academyProfile.logoUrl ? (
                <Avatar className="h-12 w-12 sm:h-16 sm:w-16 lg:h-[88px] lg:w-[88px]">
                  <AvatarImage src={academyProfile.logoUrl} alt={academyProfile.academyName} />
                  <AvatarFallback className="bg-[#59FF3A] text-[#121214]">
                    <Building2 className="h-4 w-4 sm:h-6 sm:w-6 lg:h-8 lg:w-8" />
                  </AvatarFallback>
                </Avatar>
              ) : (
                <div className="h-12 w-12 sm:h-16 sm:w-16 lg:h-[88px] lg:w-[88px] rounded-full bg-[#59FF3A] flex items-center justify-center">
                  <Building2 className="h-4 w-4 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-white" />
                </div>
              )}
              <div>
                <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold text-white">{academyProfile.academyName}</h1>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-mono font-bold text-white">
                {currentTime.toLocaleTimeString("pt-BR", { 
                  hour: "2-digit", 
                  minute: "2-digit",
                  second: "2-digit"
                })}
              </p>
              <SecondarySmallButton
                onClick={() => window.open('/', '_blank')}
                icon={<ArrowLeft />}
                className="mt-2"
              >
                Voltar para Controle
              </SecondarySmallButton>
            </div>
          </div>
        </div>
      )}



      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-8">

        <div className="text-center max-w-4xl mx-auto w-full">


        {/* Status Message */}
        <div className="mb-4 sm:mb-8">
          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-[#5a5a60] mb-2">
            {getStatusMessage()}
          </h1>
        </div>

        {/* Main Timer Display */}
        <div className="mb-6 sm:mb-12">
          <div className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl xl:text-[10rem] 2xl:text-[14.4rem] font-mono font-bold text-white mb-2 sm:mb-4 leading-none tracking-wider">
            {formatTime(timerState.currentTime)}
          </div>
          
          {/* Progress Bar */}
          <div className="w-full max-w-2xl mx-auto mb-4 sm:mb-8">
            <div className="h-1 sm:h-2 bg-[#2a2a2e] rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-1000 ease-linear ${
                  timerState.isResting ? "bg-orange-500" : "bg-[#59FF3A]"
                }`}
                style={{ 
                  width: `${progressPercentage}%` 
                }}
              ></div>
            </div>
            <div className="flex justify-between text-xs sm:text-sm text-[#5a5a60] mt-1 sm:mt-2">
              <span>Progresso da {timerState.isResting ? "rola" : "rola"}</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
          </div>
        </div>

                {/* Round Indicators */}
        <div className="flex justify-center space-x-2 sm:space-x-4 mb-4 sm:mb-8">
          {Array.from({ length: timerState.totalRounds }).map((_, index) => (
            <div
              key={index}
              className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full transition-all duration-300 flex items-center justify-center font-bold text-xs sm:text-sm ${
                index < timerState.currentRound - 1
                  ? "bg-[#59FF3A] text-[#121214]"
                  : index === timerState.currentRound - 1
                  ? timerState.isRunning
                    ? "bg-[#59FF3A] text-[#121214] animate-pulse"
                    : "bg-[#59FF3A] text-[#121214]"
                : "bg-[#2a2a2e] text-white"
              }`}
            >
              {index + 1}
            </div>
          ))}
        </div>


        </div>
      </div>
    </div>
  );
}
