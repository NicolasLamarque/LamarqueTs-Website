<template>
  <div class="relative w-full h-full">
    <canvas ref="canvasRef" class="absolute inset-0 w-full h-full" />
    
    <!-- Bouton de contrôles (optionnel) -->
    <button
      v-if="showControlsButton"
      @click="showControls = !showControls"
      class="fixed bottom-6 right-6 z-20 bg-teal-600 hover:bg-teal-700 text-white p-4 rounded-full shadow-lg transition-all"
      aria-label="Paramètres"
    >
      ⚙️
    </button>

    <!-- Panneau de contrôles -->
    <div
      v-if="showControls"
      class="fixed bottom-24 right-6 z-20 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 w-80 border border-gray-200 dark:border-gray-700"
    >
      <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">
        Contrôles des vagues
      </h3>
      
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Vitesse: {{ config.speed.toFixed(2) }}
          </label>
          <input
            v-model.number="config.speed"
            type="range"
            min="0.05"
            max="1"
            step="0.05"
            class="w-full"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Amplitude: {{ config.amplitude.toFixed(0) }}
          </label>
          <input
            v-model.number="config.amplitude"
            type="range"
            min="10"
            max="80"
            step="5"
            class="w-full"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Fréquence: {{ config.frequency.toFixed(3) }}
          </label>
          <input
            v-model.number="config.frequency"
            type="range"
            min="0.005"
            max="0.03"
            step="0.001"
            class="w-full"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Nombre de vagues: {{ config.waveCount }}
          </label>
          <input
            v-model.number="config.waveCount"
            type="range"
            min="2"
            max="6"
            step="1"
            class="w-full"
          />
        </div>

        <button
          @click="resetConfig"
          class="w-full mt-4 bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
        >
          Réinitialiser
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, watch } from 'vue';

// Props
const props = defineProps({
  showControlsButton: {
    type: Boolean,
    default: true
  }
});

// Refs
const canvasRef = ref<HTMLCanvasElement | null>(null);
const animationRef = ref<number | null>(null);
const showControls = ref(false);

// Configuration réactive
const config = reactive({
  speed: 0.02,
  amplitude: 30,
  frequency: 0.015,
  waveCount: 2,
  colors: [
    'rgba(20, 184, 166, 0.15)',  // teal-500
    'rgba(45, 212, 191, 0.12)',  // teal-400
    'rgba(94, 234, 212, 0.1)',   // teal-300
    'rgba(204, 251, 241, 0.08)', // teal-100
  ],
  goldAccent: 'rgba(251, 191, 36, 0.08)', // doré
});

let time = 0;

const drawWave = (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  offset: number,
  amplitude: number,
  frequency: number,
  color: string,
  yPosition: number
) => {
  ctx.beginPath();
  ctx.moveTo(0, canvas.height);

  for (let x = 0; x < canvas.width; x++) {
    const y = yPosition + 
      Math.sin(x * frequency + offset) * amplitude +
      Math.sin(x * frequency * 0.5 + offset * 0.7) * (amplitude * 0.5);
    
    ctx.lineTo(x, y);
  }

  ctx.lineTo(canvas.width, canvas.height);
  ctx.lineTo(0, canvas.height);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
};

const animate = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  const baseY = canvas.height * 0.5;
  const spacing = canvas.height / (config.waveCount + 1);

  // Dessiner les vagues teal
  for (let i = 0; i < config.waveCount; i++) {
    const waveOffset = (i / config.waveCount) * Math.PI * 2;
    const yPos = baseY + (i - config.waveCount / 2) * spacing * 0.3;
    
    drawWave(
      ctx,
      canvas,
      time * config.speed + waveOffset,
      config.amplitude * (1 + i * 0.1),
      config.frequency * (1 - i * 0.05),
      config.colors[i % config.colors.length],
      yPos
    );
  }

  // Vague dorée subtile
  drawWave(
    ctx,
    canvas,
    time * config.speed * 0.2,
    config.amplitude * 0.8,
    config.frequency * 1.2,
    config.goldAccent,
    baseY - spacing * 0.5
  );

  time += 0.5;
  animationRef.value = requestAnimationFrame(animate);
};

const resizeCanvas = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;

  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
};

const resetConfig = () => {
  config.speed = 0.3;
  config.amplitude = 30;
  config.frequency = 0.015;
  config.waveCount = 4;
};

onMounted(() => {
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  animate();
});

onUnmounted(() => {
  window.removeEventListener('resize', resizeCanvas);
  if (animationRef.value) {
    cancelAnimationFrame(animationRef.value);
  }
});

// Réanimer quand la config change
watch(config, () => {
  if (animationRef.value) {
    cancelAnimationFrame(animationRef.value);
  }
  time = 0;
  animate();
});
</script>

<style scoped>
/* Styles pour les input range si nécessaire */
input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  cursor: pointer;
}

input[type="range"]::-webkit-slider-track {
  background: #e5e7eb;
  height: 0.5rem;
  border-radius: 0.25rem;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  background: #0f766e;
  height: 1.25rem;
  width: 1.25rem;
  border-radius: 50%;
  margin-top: -0.375rem;
}

input[type="range"]::-moz-range-track {
  background: #e5e7eb;
  height: 0.5rem;
  border-radius: 0.25rem;
}

input[type="range"]::-moz-range-thumb {
  background: #0f766e;
  height: 1.25rem;
  width: 1.25rem;
  border-radius: 50%;
  border: none;
}

.dark input[type="range"]::-webkit-slider-track {
  background: #374151;
}

.dark input[type="range"]::-moz-range-track {
  background: #374151;
}
</style>