// SIMPLE TIMER - Versão simplificada que funciona
class SimpleTimer {
  constructor() {
    this.interval = null;
    this.currentTime = 0;
    this.isRunning = false;
    this.isResting = false;
    this.currentRound = 1;
    this.totalRounds = 5;
    this.fightTime = 300; // 5 minutos
    this.restTime = 60; // 1 minuto
    this.onUpdate = null; // Callback para atualizações
  }

  start() {
    if (this.isRunning) return;
    
    console.log('Timer STARTED');
    this.isRunning = true;
    
    // Se é o início do treino, define o tempo inicial
    if (this.currentTime === 0) {
      this.currentTime = this.fightTime;
    }
    
    // Notificar sobre o início
    if (this.onUpdate) {
      this.onUpdate();
    }
    
    this.interval = setInterval(() => {
      this.tick();
    }, 1000); // Atualiza a cada 1 segundo
  }

  pause() {
    if (!this.isRunning) return;
    
    console.log('Timer PAUSED');
    this.isRunning = false;
    clearInterval(this.interval);
    
    // Notificar sobre a pausa
    if (this.onUpdate) {
      this.onUpdate();
    }
  }

  reset() {
    console.log('Timer RESET');
    this.isRunning = false;
    this.isResting = false;
    this.currentRound = 1;
    this.currentTime = 0;
    clearInterval(this.interval);
    
    // Notificar sobre o reset
    if (this.onUpdate) {
      this.onUpdate();
    }
  }

  tick() {
    if (!this.isRunning) return;

    this.currentTime--;

    console.log(`Round ${this.currentRound}/${this.totalRounds} - ${this.formatTime(this.currentTime)} - ${this.isResting ? 'REST' : 'FIGHT'}`);

    // Notificar clientes sobre a atualização
    if (this.onUpdate) {
      this.onUpdate();
    }

    if (this.currentTime <= 0) {
      this.handleTimeUp();
    }
  }

  handleTimeUp() {
    if (this.isResting) {
      // Descanso acabou, próximo round
      this.currentRound++;
      if (this.currentRound <= this.totalRounds) {
        this.currentTime = this.fightTime;
        this.isResting = false;
        console.log(`Round ${this.currentRound} started!`);
      } else {
        // Treino acabou
        this.isRunning = false;
        this.isResting = false;
        this.currentTime = 0;
        console.log('Training FINISHED!');
        clearInterval(this.interval);
      }
    } else {
      // Round acabou, descanso
      if (this.currentRound < this.totalRounds) {
        this.currentTime = this.restTime;
        this.isResting = true;
        console.log('Rest period started!');
      } else {
        // Último round acabou
        this.isRunning = false;
        this.isResting = false;
        this.currentTime = 0;
        console.log('Training FINISHED!');
        clearInterval(this.interval);
      }
    }
  }

  formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  getState() {
    return {
      currentTime: this.currentTime,
      currentRound: this.currentRound,
      totalRounds: this.totalRounds,
      isRunning: this.isRunning,
      isResting: this.isResting,
      isFinished: !this.isRunning && this.currentRound >= this.totalRounds
    };
  }

  setConfig(config) {
    this.totalRounds = config.rounds;
    this.fightTime = config.fightTime;
    this.restTime = config.restTime;
    console.log('Config updated:', config);
  }
}

// Export para uso
export const simpleTimer = new SimpleTimer();
