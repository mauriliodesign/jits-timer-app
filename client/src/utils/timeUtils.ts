// Time Utilities
export const timeUtils = {
  /**
   * Format seconds to MM:SS format
   */
  formatTime: (seconds: number): string => {
    if (seconds < 0) return '00:00';
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  },

  /**
   * Parse time string (MM:SS) to seconds
   */
  parseTime: (timeString: string): number => {
    const [minutes, seconds] = timeString.split(':').map(Number);
    return (minutes * 60) + (seconds || 0);
  },

  /**
   * Calculate total training time in seconds
   */
  calculateTotalTime: (config: { rounds: number; roundDuration: number; restTime: number }): number => {
    const roundTime = config.rounds * config.roundDuration * 60; // Convert minutes to seconds
    const restTime = (config.rounds - 1) * config.restTime; // Rest between rounds
    return roundTime + restTime;
  },

  /**
   * Calculate progress percentage
   */
  getProgressPercentage: (currentTime: number, totalTime: number): number => {
    if (totalTime <= 0) return 0;
    return Math.max(0, Math.min(100, ((totalTime - currentTime) / totalTime) * 100));
  },

  /**
   * Validate time value
   */
  isTimeValid: (time: number): boolean => {
    return typeof time === 'number' && time >= 0 && isFinite(time);
  },

  /**
   * Format time for display with custom labels
   */
  formatTimeWithLabels: (
    seconds: number, 
    labels: { hours?: string; minutes?: string; seconds?: string } = {}
  ): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}${labels.hours || 'h'} ${minutes}${labels.minutes || 'm'} ${remainingSeconds}${labels.seconds || 's'}`;
    }
    
    return `${minutes}${labels.minutes || 'm'} ${remainingSeconds}${labels.seconds || 's'}`;
  },

  /**
   * Get current time as formatted string
   */
  getCurrentTime: (): string => {
    return new Date().toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }
};
