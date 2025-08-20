// Audio context for generating sounds
let audioContext: AudioContext | null = null;

const initAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
};

// Generate a sharp, aggressive beep sound with specific frequency and duration
const createAggressiveBeep = (frequency: number, duration: number, volume: number = 0.6) => {
  const ctx = initAudioContext();
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);
  
  oscillator.frequency.value = frequency;
  oscillator.type = 'square'; // Square wave for more aggressive, harsh sound
  
  // Sharp attack and release for aggressive gym timer effect
  gainNode.gain.setValueAtTime(0, ctx.currentTime);
  gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.005); // Very fast attack
  gainNode.gain.linearRampToValueAtTime(volume * 0.8, ctx.currentTime + duration * 0.3);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  
  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + duration);
};

// Create a buzzer-like alarm sound (like academy buzzers)
const createBuzzer = (frequency: number, duration: number, pulses: number = 1, volume: number = 0.7) => {
  const ctx = initAudioContext();
  const pulseDuration = duration / pulses;
  const pauseDuration = pulseDuration * 0.2;
  
  for (let i = 0; i < pulses; i++) {
    const startTime = ctx.currentTime + (i * (pulseDuration + pauseDuration));
    
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = 'square'; // Harsh, aggressive square wave
    
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.003);
    gainNode.gain.linearRampToValueAtTime(volume, startTime + pulseDuration * 0.8);
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + pulseDuration);
    
    oscillator.start(startTime);
    oscillator.stop(startTime + pulseDuration);
  }
};

// Start round sound - aggressive gym buzzer style (like academy timer start)
export const playStartRoundSound = () => {
  try {
    // Sharp triple buzz - aggressive start signal
    createBuzzer(1200, 0.6, 3, 0.8); // High frequency buzzer, 3 sharp pulses
  } catch (error) {
    console.warn('Could not play start round sound:', error);
  }
};

// End round sound - long aggressive buzzer (like academy end signal)
export const playEndRoundSound = () => {
  try {
    // Long, loud, aggressive buzzer - unmistakable end signal
    createBuzzer(800, 1.2, 1, 0.9); // Single long aggressive buzz
  } catch (error) {
    console.warn('Could not play end round sound:', error);
  }
};

// Rest period sound - softer but still aggressive notification
export const playRestStartSound = () => {
  try {
    // Double pulse at medium frequency - rest time signal
    createBuzzer(600, 0.8, 2, 0.7);
  } catch (error) {
    console.warn('Could not play rest start sound:', error);
  }
};

// Final training sound - multiple aggressive blasts (celebratory but intense)
export const playTrainingCompleteSound = () => {
  try {
    // Series of aggressive celebratory buzzes
    createBuzzer(900, 0.4, 1, 0.8); // First blast
    setTimeout(() => createBuzzer(1100, 0.4, 1, 0.8), 500); // Second blast
    setTimeout(() => createBuzzer(1300, 0.8, 1, 0.9), 1000); // Final long blast
  } catch (error) {
    console.warn('Could not play training complete sound:', error);
  }
};

// Initialize audio context on user interaction (required by browsers)
export const enableAudio = () => {
  const ctx = initAudioContext();
  if (ctx.state === 'suspended') {
    ctx.resume();
  }
};