// Teste do Timer Simples
import { simpleTimer } from './server/simple-timer.js';

console.log('=== TESTE DO TIMER SIMPLES ===');

// Teste 1: Configuração
console.log('\n1. Configurando timer...');
simpleTimer.setConfig({
  rounds: 3,
  fightTime: 60, // 1 minuto para teste rápido
  restTime: 30   // 30 segundos para teste rápido
});

console.log('Estado inicial:', simpleTimer.getState());

// Teste 2: Iniciar timer
console.log('\n2. Iniciando timer...');
simpleTimer.start();

console.log('Estado após start:', simpleTimer.getState());

// Teste 3: Simular alguns ticks
console.log('\n3. Simulando ticks...');
for (let i = 0; i < 5; i++) {
  simpleTimer.tick();
  console.log(`Tick ${i + 1}:`, simpleTimer.getState());
}

// Teste 4: Pausar
console.log('\n4. Pausando timer...');
simpleTimer.pause();
console.log('Estado após pause:', simpleTimer.getState());

// Teste 5: Reset
console.log('\n5. Resetando timer...');
simpleTimer.reset();
console.log('Estado após reset:', simpleTimer.getState());

console.log('\n=== TESTE CONCLUÍDO ===');
