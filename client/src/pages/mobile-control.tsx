import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, Square, Plus, Minus, Settings, Timer, Wifi, Users, RotateCcw, Monitor } from "lucide-react";
import { useWebSocket } from "@/hooks/use-websocket";
import { formatTime, calculateTotalTime } from "@/lib/timer-utils";
import { 
  playStartRoundSound, 
  playEndRoundSound, 
  playRestStartSound, 
  playTrainingCompleteSound,
  enableAudio 
} from "@/lib/sound-utils";
import { apiRequest } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import UserProfile from "@/components/user-profile";
import type { TimerSession } from "@shared/schema";

export default function MobileControl() {
  const [config, setConfig] = useState({
    rounds: 5,
    roundDuration: 6,
    restTime: 60,
  });

  const [configChanged, setConfigChanged] = useState({
    rounds: false,
    roundDuration: false,
    restTime: false,
  });

  // Função para garantir valores padrão e evitar valores vazios
  const getSafeValue = (value: any, defaultValue: number) => {
    if (value === null || value === undefined || value === '' || isNaN(value)) {
      return defaultValue;
    }
    return Math.max(1, parseInt(value) || defaultValue);
  };

  const [timerState, setTimerState] = useState({
    isRunning: false,
    isResting: false,
    currentRound: 1,
    totalRounds: 5,
  });

  const previousStateRef = useRef(timerState);
  const audioInitializedRef = useRef(false);

  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { isConnected, lastMessage } = useWebSocket();

  const { data: currentSession, isLoading } = useQuery<TimerSession>({
    queryKey: ["/api/timer/current"],
  });

  const configMutation = useMutation({
    mutationFn: (newConfig: typeof config) =>
      apiRequest("POST", "/api/timer/config", newConfig),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/timer/current"] });
      toast({
        title: "Configuração atualizada",
        description: "As novas configurações foram salvas com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao atualizar a configuração.",
        variant: "destructive",
      });
    },
  });

  const controlMutation = useMutation({
    mutationFn: (action: "start" | "pause" | "reset") =>
      apiRequest("POST", "/api/timer/control", { action }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/timer/current"] });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao controlar o timer.",
        variant: "destructive",
      });
    },
  });

  // Update config when WebSocket receives config updates
  useEffect(() => {
    if (lastMessage?.type === "config_update") {
      setConfig({
        rounds: lastMessage.data.rounds,
        roundDuration: lastMessage.data.roundDuration,
        restTime: lastMessage.data.restTime,
      });
    }
    
    // Update timer state from WebSocket messages
    if (lastMessage?.type === "timer_update") {
      const newState = {
        isRunning: lastMessage.data.isRunning,
        isResting: lastMessage.data.isResting,
        currentRound: lastMessage.data.currentRound,
        totalRounds: lastMessage.data.totalRounds,
      };
      
      setTimerState(newState);
    }
  }, [lastMessage]);

  // Initialize timer state from current session
  useEffect(() => {
    if (currentSession) {
      setTimerState({
        isRunning: currentSession.isRunning,
        isResting: currentSession.isResting,
        currentRound: getSafeValue(currentSession.currentRound, 1),
        totalRounds: getSafeValue(currentSession.rounds, 5),
      });
      
      // Garantir que os valores da sessão são seguros
      setConfig({
        rounds: getSafeValue(currentSession.rounds, 5),
        roundDuration: getSafeValue(currentSession.roundDuration, 6),
        restTime: getSafeValue(currentSession.restTime, 60),
      });
    }
  }, [currentSession]);

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

  const handleConfigChange = (field: keyof typeof config, delta: number) => {
    let newValue;
    if (field === "restTime") {
      // Rest time is in seconds, minimum 5 seconds
      newValue = Math.max(5, config.restTime + delta);
    } else {
      newValue = Math.max(1, config[field] + delta);
    }
    
    const newConfig = {
      ...config,
      [field]: newValue,
    };
    setConfig(newConfig);
    
    // Marcar que este campo foi alterado
    setConfigChanged(prev => ({
      ...prev,
      [field]: true,
    }));
  };

  const applyConfig = () => {
    configMutation.mutate(config);
  };

  const handleControl = (action: "start" | "pause" | "reset") => {
    controlMutation.mutate(action);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121214] text-white">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-4xl">
        {/* Header with User Profile */}
        <div className="flex flex-row items-center justify-between mb-4 sm:mb-6 gap-2 sm:gap-4">
          <div className="flex items-center">
            <svg width="138" height="15" viewBox="0 0 1381 149" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-7 sm:h-9 lg:h-11">
              <path d="M1178.18 145.6L1174.98 130.4H1174.58C1165.58 143.4 1150.98 149 1133.58 149C1114.38 149 1097.98 142.4 1086.38 130C1073.18 116 1066.58 96.8 1066.58 74.6C1066.58 32.4 1093.38 0 1137.58 0C1174.98 0 1198.58 19.4 1203.18 51.2H1162.78C1160.58 42 1151.98 34.4 1139.18 34.4C1119.18 34.4 1108.98 51.2 1108.98 74.6C1108.98 98 1120.58 115.4 1140.78 115.4C1155.98 115.4 1163.38 107.2 1165.98 97.6H1146.98V68H1205.98V145.6H1178.18Z" fill="#59FF3A"/>
              <path d="M925.497 145.6V2.6001H967.297L1014.1 83.0001H1014.5V2.6001H1054.9V145.6H1011.7L966.297 64.6001H965.897V145.6H925.497Z" fill="#59FF3A"/>
              <path d="M866.512 145.6V2.6001H908.312V145.6H866.512Z" fill="#59FF3A"/>
              <path d="M728.231 145.6V2.6001H799.231C828.431 2.6001 853.231 16.0001 853.231 45.2001C853.231 61.6001 844.831 73.2001 829.831 80.0001V80.6001C841.431 85.0001 847.431 93.0001 849.831 104.2C853.631 121.4 850.431 142 855.631 143.4V145.6H814.431C810.431 142.8 812.031 125.2 809.031 112.4C806.431 101.4 801.631 95.8001 789.431 95.8001H770.031V145.6H728.231ZM770.031 35.4001V66.0001H792.431C804.431 66.0001 811.031 60.8001 811.031 50.8001C811.031 41.4001 805.031 35.4001 793.031 35.4001H770.031Z" fill="#59FF3A"/>
              <path d="M571.956 145.6L624.756 2.6001H667.356L720.356 145.6H675.956L668.956 124.6H620.556L613.556 145.6H571.956ZM639.356 67.8001L629.956 95.8001H659.556L650.556 67.8001C648.356 60.8001 645.156 49.4001 645.156 49.4001H644.756C644.756 49.4001 641.756 60.8001 639.356 67.8001Z" fill="#59FF3A"/>
              <path d="M436.63 145.6V2.6001H478.43V55.0001H522.43V2.6001H564.23V145.6H522.43V89.6001H478.43V145.6H436.63Z" fill="#59FF3A"/>
              <path d="M363.589 149C326.389 149 298.189 133 297.589 100H340.389C341.789 111.4 350.589 116.8 364.389 116.8C372.589 116.8 382.589 113.6 382.589 105C382.589 96.4 372.989 94.2 355.389 89.8C331.389 83.8 302.389 75.6 302.389 45.2C302.389 12.4 329.189 0 361.389 0C390.989 0 418.189 12.4 418.789 43.6H377.389C376.189 35.8 370.589 30.8 359.189 30.8C349.989 30.8 343.589 35 343.589 40.8C343.589 49.2 355.789 50.4 377.189 55.6C401.189 61.4 425.189 70.8 425.189 101.2C425.189 132.4 397.389 149 363.589 149Z" fill="#59FF3A"/>
              <path d="M248.197 148.2C223.397 148.2 208.797 135.6 208.797 108.8V101.2H218.997V108.4C218.997 130.4 229.197 138.8 248.397 138.8C264.397 138.8 274.197 130.4 274.197 112V2.6001H284.597V112.8C284.597 132.6 272.997 148.2 248.197 148.2Z" fill="#59FF3A"/>
              <path d="M156.205 148.2C131.405 148.2 116.805 135.6 116.805 108.8V101.2H127.005V108.4C127.005 130.4 137.205 138.8 156.405 138.8C172.405 138.8 182.205 130.4 182.205 112V2.6001H192.605V112.8C192.605 132.6 181.005 148.2 156.205 148.2Z" fill="#59FF3A"/>
              <path d="M0 145.6V2.6001H58.6C70 2.6001 79.6 5.80009 86.4 11.8001C93.4 17.8001 97.4 26.8001 97.4 38.2001C97.4 54.4001 91.2 64.2001 76.4 69.8001V70.2001C93.2 75.4001 103.6 87.2001 103.6 106C103.6 118 100.2 127.4 93.4 134.2C86.2 141.2 75.2 145.6 60.8 145.6H0ZM10.4 136H60C71.4 136 80 132.6 85.4 127.2C90.4 122.2 93 115.2 93 105.6C93 87.0001 80.4 75.8001 60.8 75.8001H10.4V136ZM10.4 66.6001H59.6C77.2 66.6001 86.8 55.2001 86.8 39.0001C86.8 21.4001 75.8 12.0001 58.8 12.0001H10.4V66.6001Z" fill="#59FF3A"/>
              <path d="M1330.53 16.5V68.0556L1375.37 52.1593L1380.98 66.7667L1336.57 82.6629L1365.45 123.048L1352.09 132.5L1321.48 89.1074L1290.86 132.5L1277.5 123.048L1306.39 82.6629L1261.98 66.7667L1267.58 52.1593L1312.42 68.0556V16.5H1330.53Z" fill="#59FF3A"/>
            </svg>
          </div>
          <UserProfile />
        </div>
        

        {/* Current Status Display */}
        <div className="bg-[#17171a] border border-[#1e1e21] rounded-2xl p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6 lg:mb-8">
          <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
            <div>
              <div className="text-xs sm:text-sm text-[#4a4a4f] mb-1">Rola Atual</div>
              <div className="text-2xl sm:text-3xl lg:text-5xl font-bold text-white font-mono">
                {currentSession ? getSafeValue(currentSession.currentRound, 1) : 1}
              </div>
            </div>
            <div>
              <div className="text-xs sm:text-sm text-[#4a4a4f] mb-1">
                {currentSession?.isResting ? "Descanso" : "Tempo"}
              </div>
              <div className="text-2xl sm:text-3xl lg:text-5xl font-bold text-white font-mono">
                {currentSession ? formatTime(getSafeValue(currentSession.currentTime, 0)) : "00:00"}
              </div>
            </div>
            <div>
              <div className="text-xs sm:text-sm text-[#4a4a4f] mb-1">Total</div>
              <div className="text-2xl sm:text-3xl lg:text-5xl font-bold text-white font-mono">
                {currentSession ? getSafeValue(currentSession.rounds, 5) : 5}
              </div>
            </div>
          </div>
        </div>

        {/* Configuration Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6 lg:mb-8">
          <div className="bg-[#17171a] border border-[#1e1e21] rounded-2xl p-3 sm:p-4 lg:p-6">
            <div className="flex items-center mb-3 sm:mb-4 lg:mb-6">
              <Settings className="h-4 w-4 sm:h-5 sm:w-5 text-[#59FF3A] mr-2" />
              <h2 className="text-base sm:text-lg lg:text-xl font-semibold">Configurações</h2>
            </div>
            
            {/* Number of Rounds */}
            <div className="mb-3 sm:mb-4 lg:mb-6">
              <label className="block text-xs sm:text-sm font-medium mb-2 sm:mb-3 text-[#5a5a60]">Número de Rolas</label>
              <div className="flex items-center justify-center space-x-2 sm:space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full bg-[#1e1e21] border-[#252529] hover:bg-[#252529] text-white"
                  onClick={() => handleConfigChange("rounds", -1)}
                >
                  <Minus className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
                </Button>
                <div className="w-10 sm:w-12 lg:w-16 text-center">
                  <span className="text-xl sm:text-2xl lg:text-3xl font-bold font-mono">
                    {configChanged.rounds ? config.rounds : "—"}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full bg-[#1e1e21] border-[#252529] hover:bg-[#252529] text-white"
                  onClick={() => handleConfigChange("rounds", 1)}
                >
                  <Plus className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
                </Button>
              </div>
            </div>

            {/* Round Duration */}
            <div className="mb-4 lg:mb-6">
              <label className="block text-sm font-medium mb-3 text-[#52525a]">Duração da Rola (minutos)</label>
              <div className="flex items-center justify-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-[#1e1e21] border-[#252529] hover:bg-[#252529] text-white"
                  onClick={() => handleConfigChange("roundDuration", -1)}
                >
                  <Minus className="h-4 w-4 lg:h-5 lg:w-5" />
                </Button>
                <div className="w-12 lg:w-16 text-center">
                  <span className="text-2xl lg:text-3xl font-bold font-mono">
                    {configChanged.roundDuration ? config.roundDuration : "—"}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-[#1e1e21] border-[#252529] hover:bg-[#252529] text-white"
                  onClick={() => handleConfigChange("roundDuration", 1)}
                >
                  <Plus className="h-4 w-4 lg:h-5 lg:w-5" />
                </Button>
              </div>
            </div>

            {/* Rest Time */}
            <div className="mb-4 lg:mb-6">
              <label className="block text-sm font-medium mb-3 text-[#52525a]">Tempo de Descanso (segundos)</label>
              <div className="flex items-center justify-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-[#1e1e21] border-[#252529] hover:bg-[#252529] text-white"
                  onClick={() => handleConfigChange("restTime", -5)}
                >
                  <Minus className="h-4 w-4 lg:h-5 lg:w-5" />
                </Button>
                <div className="w-12 lg:w-16 text-center">
                  <span className="text-2xl lg:text-3xl font-bold font-mono">
                    {configChanged.restTime ? config.restTime : "—"}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-[#1e1e21] border-[#252529] hover:bg-[#252529] text-white"
                  onClick={() => handleConfigChange("restTime", 5)}
                >
                  <Plus className="h-4 w-4 lg:h-5 lg:w-5" />
                </Button>
              </div>
            </div>


          </div>

          {/* Total Time and Quick Actions */}
          <div className="bg-[#17171a] border border-[#1e1e21] rounded-2xl p-4 lg:p-6">
            <div className="text-center mb-6">
              <div className="text-sm text-[#5a5a60] mb-2">Tempo Total</div>
              <div className="text-3xl lg:text-4xl font-bold text-white font-mono">
                {calculateTotalTime(config.rounds, config.roundDuration, config.restTime)}
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="space-y-3">
              <Button
                onClick={() => window.open('/tv', '_blank')}
                className="w-full h-12 lg:h-14 bg-white/8 hover:bg-white/16 text-sm lg:text-base font-medium rounded-xl border border-white/20"
              >
                <Monitor className="mr-2 h-4 w-4 lg:h-5 lg:w-5" />
                Abrir Tela da TV
              </Button>
            </div>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6 lg:mb-8">
          {/* Main Control Button - Iniciar/Pausar/Continuar */}
          <Button
            onClick={() => {
              if (currentSession && !currentSession.isRunning) {
                // Se não está rodando, aplicar config e iniciar
                applyConfig();
                handleControl("start");
              } else if (currentSession && currentSession.isRunning) {
                // Se está rodando, pausar
                handleControl("pause");
              }
            }}
            disabled={!currentSession || configMutation.isPending || controlMutation.isPending}
            className="w-full h-14 lg:h-16 bg-[#59FF3A] hover:bg-[#4DEB2E] text-[#121214] text-base lg:text-lg font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {!currentSession ? (
              <>
                <Play className="mr-2 lg:mr-3 h-5 w-5 lg:h-6 lg:w-6" />
                Carregando...
              </>
            ) : currentSession.isRunning ? (
              <>
                <Pause className="mr-2 lg:mr-3 h-5 w-5 lg:h-6 lg:w-6" />
                Pausar o Treino
              </>
            ) : currentSession.currentTime > 0 ? (
              <>
                <Play className="mr-2 lg:mr-3 h-5 w-5 lg:h-6 lg:w-6" />
                Continuar
              </>
            ) : (
              <>
                <Play className="mr-2 lg:mr-3 h-5 w-5 lg:h-6 lg:w-6" />
                Iniciar Treino
              </>
            )}
          </Button>
          
          {/* Reset Button - sempre visível, desabilitado quando não há sessão */}
          <Button
            onClick={() => handleControl("reset")}
            disabled={!currentSession || controlMutation.isPending}
            className="h-14 lg:h-16 bg-white/8 hover:bg-white/16 text-white rounded-xl border border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RotateCcw className="mr-2 h-5 w-5" />
            Resetar
          </Button>
        </div>

        {/* Connection Status */}
        <div className="text-center">
                      <div className="inline-flex items-center text-sm text-[#5a5a60]">
            <div className={`w-2 h-2 rounded-full mr-2 ${isConnected ? "bg-[#59FF3A] animate-pulse" : "bg-red-500"}`}></div>
            {isConnected ? "Conectado" : "Desconectado"}
          </div>
        </div>
      </div>
    </div>
  );
}
