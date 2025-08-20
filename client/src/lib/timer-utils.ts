export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export function calculateTotalTime(rounds: number, roundDuration: number, restTime: number): string {
  const totalMinutes = rounds * roundDuration + Math.floor(((rounds - 1) * restTime) / 60);
  return `${totalMinutes} min`;
}

export function getProgressPercentage(currentTime: number, totalTime: number): number {
  return ((totalTime - currentTime) / totalTime) * 100;
}
