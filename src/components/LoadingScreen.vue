<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-black via-black to-purple-950/30 overflow-hidden">
    <!-- Dark space overlay for depth -->
    <div class="absolute inset-0 bg-gradient-radial from-transparent via-black/20 to-black/40"></div>

    <!-- Shooting stars -->
    <div class="absolute inset-0">
      <div 
        v-for="i in 3" 
        :key="`star-${i}`"
        class="absolute w-0.5 h-0.5 bg-white rounded-full animate-shooting-star"
        :style="{
          left: `${20 + i * 25}%`,
          top: `${10 + i * 20}%`,
          animationDelay: `${i * 2}s`,
          animationDuration: '3s'
        }"
      ></div>
    </div>

    <!-- Nebula effect -->
    <div class="absolute inset-0 opacity-10">
      <div class="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-purple-900/30 to-pink-900/20 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-r from-blue-900/30 to-cyan-900/20 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s"></div>
    </div>

    <!-- Central loading content -->
    <div class="relative z-10 text-center">
      <!-- Animated solar system -->
      <div class="relative w-32 h-32 mx-auto mb-8">
        <!-- Sun in center -->
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse shadow-lg shadow-yellow-400/50"></div>
        </div>
        
        <!-- Orbiting planets -->
        <div 
          v-for="(planet, index) in loadingPlanets" 
          :key="planet.id"
          class="absolute inset-0 animate-spin"
          :style="{
            animationDuration: `${planet.speed}s`,
            animationDirection: planet.direction
          }"
        >
          <div 
            class="absolute w-3 h-3 rounded-full transform -translate-x-1/2 -translate-y-1/2"
            :class="planet.color"
            :style="{
              left: `${planet.orbit}%`,
              top: '50%'
            }"
          ></div>
        </div>
      </div>

      <!-- Loading text with typing effect -->
      <div class="mb-6">
        <h1 class="text-4xl font-bold text-white mb-2 tracking-wider">
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            Solar System
          </span>
        </h1>
        <div class="text-lg text-gray-300 font-mono">
          <span class="inline-block min-w-[120px] text-left">
            {{ loadingText }}<span class="animate-pulse">|</span>
          </span>
        </div>
      </div>

      <!-- Animated rocket -->
      <div class="relative mx-auto w-16 h-16 mb-6">
        <div class="absolute inset-0 animate-bounce" style="animation-delay: 0.5s">
          <div class="text-4xl">🚀</div>
        </div>
        <!-- Rocket trail -->
        <div class="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
          <div class="w-2 h-4 bg-gradient-to-t from-orange-500 to-transparent rounded-full animate-pulse"></div>
        </div>
      </div>

      <!-- Progress bar -->
      <div class="w-64 mx-auto bg-gray-800 rounded-full h-2 overflow-hidden">
        <div 
          class="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-300 ease-out"
          :style="{ width: `${progress}%` }"
        ></div>
      </div>
      
      <!-- Progress percentage -->
      <div class="mt-3 text-sm text-gray-400 font-mono">
        {{ Math.round(progress) }}%
      </div>
    </div>

    <!-- Floating cosmic elements -->
    <div class="absolute top-20 left-20 animate-float">
      <div class="text-2xl">⭐</div>
    </div>
    <div class="absolute top-32 right-32 animate-float" style="animation-delay: 1s">
      <div class="text-xl">🌙</div>
    </div>
    <div class="absolute bottom-32 left-32 animate-float" style="animation-delay: 2s">
      <div class="text-lg">✨</div>
    </div>
    <div class="absolute bottom-20 right-20 animate-float" style="animation-delay: 0.5s">
      <div class="text-xl">💫</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoadingScreen',
  props: {
    progress: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      loadingText: 'Initializing...',
      loadingTexts: [
        'Initializing...',
        'Loading textures...',
        'Creating planets...',
        'Setting up orbits...',
        'Preparing camera...',
        'Almost ready...'
      ],
      currentTextIndex: 0
    }
  },
  mounted() {
    this.startTextAnimation()
  },
  methods: {
    startTextAnimation() {
      setInterval(() => {
        this.currentTextIndex = (this.currentTextIndex + 1) % this.loadingTexts.length
        this.loadingText = this.loadingTexts[this.currentTextIndex]
      }, 800)
    }
  },
  computed: {
    loadingPlanets() {
      return [
        { id: 1, orbit: 25, speed: 3, direction: 'normal', color: 'bg-blue-400' },
        { id: 2, orbit: 40, speed: 4, direction: 'reverse', color: 'bg-green-400' },
        { id: 3, orbit: 55, speed: 5, direction: 'normal', color: 'bg-red-400' },
        { id: 4, orbit: 70, speed: 6, direction: 'reverse', color: 'bg-yellow-400' }
      ]
    }
  }
}
</script>

<style scoped>
@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
  }
}

@keyframes shooting-star {
  0% {
    transform: translateX(0) translateY(0) scale(0);
    opacity: 1;
  }
  50% {
    transform: translateX(100px) translateY(50px) scale(1);
    opacity: 0.8;
  }
  100% {
    transform: translateX(200px) translateY(100px) scale(0);
    opacity: 0;
  }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-shooting-star {
  animation: shooting-star 3s linear infinite;
}

/* Custom animation delays for different elements */
.animate-float:nth-child(1) { animation-delay: 0s; }
.animate-float:nth-child(2) { animation-delay: 1s; }
.animate-float:nth-child(3) { animation-delay: 2s; }
.animate-float:nth-child(4) { animation-delay: 0.5s; }
</style>
