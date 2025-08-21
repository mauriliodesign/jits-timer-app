import { useEffect, useState, useRef } from "react";
import { timeUtils } from "@/utils/timeUtils";
import { 
  playStartRoundSound, 
  playEndRoundSound, 
  playRestStartSound, 
  playTrainingCompleteSound,
  enableAudio 
} from "@/lib/sound-utils";
import { Building2, ArrowLeft } from "lucide-react";
import { SecondarySmallButton } from "@/components/ui/button-system";

interface TimerState {
  currentTime: number;
  currentRound: number;
  totalRounds: number;
  isRunning: boolean;
  isResting: boolean;
  isFinished: boolean;
}

const STORAGE_KEY = 'jits-timer-config';

export default function TVDisplaySimple() {
  const [timerState, setTimerState] = useState<TimerState>({
    currentTime: 0,
    currentRound: 1,
    totalRounds: 5,
    isRunning: false,
    isResting: false,
    isFinished: false,
  });

  const [currentTime, setCurrentTime] = useState(new Date());
  const [config, setConfig] = useState({ fightTime: 360, restTime: 60 });

  const previousStateRef = useRef<TimerState>(timerState);
  const audioInitializedRef = useRef(false);

  // Load config from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      setConfig({ fightTime: parsed.fightTime, restTime: parsed.restTime });
    }
  }, []);

  // Listen for timer state changes from localStorage
  useEffect(() => {
    const checkTimerState = () => {
      const saved = localStorage.getItem('jits-timer-state');
      if (saved) {
        const parsed = JSON.parse(saved);
        setTimerState(parsed);
      }
    };

    // Check immediately
    checkTimerState();

    // Set up interval to check for changes
    const interval = setInterval(checkTimerState, 100);

    return () => clearInterval(interval);
  }, []);

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
    if (prev.isRunning && !curr.isRunning && curr.isFinished) {
      playTrainingCompleteSound();
    }

    // Update previous state reference
    previousStateRef.current = curr;
  }, [timerState]);

  // Update current time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const totalTime = timerState.isResting ? config.restTime : config.fightTime;
  const progressPercentage = timeUtils.getProgressPercentage(timerState.currentTime, totalTime);

  const getStatusMessage = () => {
    if (timerState.isFinished) return "Treinamento Finalizado";
    if (!timerState.isRunning) return "Pronto para Iniciar";
    if (timerState.isResting) return "Descanso";
    return "Treinando";
  };

  const getStatusColor = () => {
    if (timerState.isFinished) return "text-gray-400 border-gray-600";
    if (!timerState.isRunning) return "text-[#3a3a3f] border-[#252529]";
    if (timerState.isResting) return "text-orange-400 border-orange-600";
    return "text-white border-[#59FF3A]";
  };

  return (
    <div className="min-h-screen bg-[#121214] text-white flex flex-col relative">
      {/* Header */}
      <div className="w-full bg-transparent px-3 sm:px-6 py-2 sm:py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="h-12 w-12 sm:h-16 sm:w-16 lg:h-[88px] lg:w-[88px] rounded-full bg-[#59FF3A] flex items-center justify-center">
              <Building2 className="h-4 w-4 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-white" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold text-white">JITS Timer</h1>
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center items-center px-2 sm:px-4 lg:px-6 xl:px-8">
        <div className="text-center w-full max-w-[90vw] mx-auto">
          {/* Status Message */}
          <div className="mb-4 sm:mb-6 lg:mb-8">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-[#5a5a60] mb-2">
              {getStatusMessage()}
            </h1>
          </div>

          {/* Main Timer Display */}
          <div className="mb-6 sm:mb-10 lg:mb-12">
            <div className="text-6xl sm:text-8xl md:text-[10rem] lg:text-[13rem] xl:text-[14rem] 2xl:text-[20rem] font-mono font-bold text-white mb-2 sm:mb-4 leading-none tracking-wider">
              {timeUtils.formatTime(timerState.currentTime)}
            </div>
            
            {/* Progress Bar */}
            <div className="w-full max-w-4xl mx-auto mb-4 sm:mb-6">
              <div className="h-2 sm:h-3 bg-[#2a2a2e] rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ease-linear ${
                    timerState.isFinished ? "bg-gray-500" :
                    timerState.isResting ? "bg-orange-500" : "bg-[#59FF3A]"
                  }`}
                  style={{ 
                    width: `${progressPercentage}%` 
                  }}
                ></div>
              </div>
              <div className="flex justify-between text-sm sm:text-base lg:text-lg text-[#5a5a60] mt-1 sm:mt-2">
                <span>Progresso da {timerState.isResting ? "pausa" : "luta"}</span>
                <span>{Math.round(progressPercentage)}%</span>
              </div>
            </div>
          </div>

          {/* Round Indicators */}
          <div className="flex justify-center space-x-4 sm:space-x-6 lg:space-x-8 mb-4 sm:mb-6">
            {Array.from({ length: timerState.totalRounds }).map((_, index) => (
              <div
                key={index}
                className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-13 lg:h-13 rounded-full transition-all duration-300 flex items-center justify-center font-bold text-base sm:text-lg lg:text-xl ${
                  timerState.isFinished
                    ? "bg-gray-500 text-white"
                    : index < timerState.currentRound - 1
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
