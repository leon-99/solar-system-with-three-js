<template>
  <div class="fixed top-5 left-5 z-50 bg-black/90 rounded-xl backdrop-blur-xl border-2 border-white/20 max-w-72 text-white sm:top-3 sm:left-3 sm:max-w-64 xs:top-2 xs:left-2 xs:max-w-56">
    <!-- Header with planet info and close button -->
    <div class="flex items-center justify-between p-3 border-b border-white/10 sm:p-2.5 xs:p-2">
      <div class="flex items-center gap-2">
        <span class="text-2xl sm:text-xl xs:text-lg">{{ emoji }}</span>
        <h2 class="text-lg font-semibold tracking-wider m-0 sm:text-base xs:text-sm">{{ planetName }}</h2>
      </div>
      <button 
        @click="$emit('close')" 
        class="text-gray-400 hover:text-white transition-colors p-1 rounded hover:bg-white/10"
        title="Close"
      >
        ✕
      </button>
    </div>
    
    <!-- Compact info display -->
    <div class="p-3 sm:p-2.5 xs:p-2">
      <!-- Quick facts in a grid -->
      <div class="grid grid-cols-2 gap-2 mb-3 sm:mb-2.5 xs:mb-2">
        <div class="bg-white/5 rounded-lg p-2 text-center hover:bg-white/10 transition-colors">
          <div class="text-amber-400 text-xs font-medium mb-1">Diameter</div>
          <div class="text-white text-xs">{{ facts.diameter }}</div>
        </div>
        <div class="bg-white/5 rounded-lg p-2 text-center hover:bg-white/10 transition-colors">
          <div class="text-amber-400 text-xs font-medium mb-1">Distance</div>
          <div class="text-white text-xs">{{ facts.distance }}</div>
        </div>
        <div class="bg-white/5 rounded-lg p-2 text-center hover:bg-white/10 transition-colors">
          <div class="text-amber-400 text-xs font-medium mb-1">Orbital Period</div>
          <div class="text-white text-xs">{{ facts.orbitalPeriod }}</div>
        </div>
        <div class="bg-white/5 rounded-lg p-2 text-center hover:bg-white/10 transition-colors">
          <div class="text-amber-400 text-xs font-medium mb-1">Temperature</div>
          <div class="text-white text-xs">{{ facts.temperature }}</div>
        </div>
      </div>
      
      <!-- Description in a compact format -->
      <div class="bg-white/5 rounded-lg p-2 hover:bg-white/10 transition-colors mb-3">
        <div class="text-amber-400 text-xs font-medium mb-1">About {{ planetName }}</div>
        <p class="text-gray-300 text-xs leading-relaxed m-0">{{ facts.description }}</p>
      </div>
      
      <!-- Moon information if available -->
      <div v-if="moons && moons.length > 0" class="bg-white/5 rounded-lg p-2 hover:bg-white/10 transition-colors">
        <div class="text-amber-400 text-xs font-medium mb-2">🌙 Moons ({{ moons.length }})</div>
        <div class="space-y-2 max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
          <div v-for="moon in moons" :key="moon.name" class="bg-white/5 rounded p-2">
            <div class="flex items-center justify-between mb-1">
              <span class="text-white text-xs font-medium">{{ moon.name }}</span>
              <span class="text-gray-400 text-xs">{{ moon.distance }}</span>
            </div>
            <p class="text-gray-300 text-xs leading-relaxed m-0">{{ moon.description }}</p>
          </div>
        </div>
      </div>
      
      <!-- Satellite information if available -->
      <div v-if="satellites && satellites.length > 0" class="bg-white/5 rounded-lg p-2 hover:bg-white/10 transition-colors">
        <div class="text-amber-400 text-xs font-medium mb-2">🛰️ Satellites ({{ satellites.length }})</div>
        <div class="space-y-2 max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
          <div v-for="satellite in satellites" :key="satellite.name" class="bg-white/5 rounded p-2">
            <div class="flex items-center justify-between mb-1">
              <span class="text-white text-xs font-medium">{{ satellite.name }}</span>
              <span class="text-gray-400 text-xs">{{ satellite.altitude }}</span>
            </div>
            <div class="text-cyan-400 text-xs mb-1">{{ satellite.type }}</div>
            <p class="text-gray-300 text-xs leading-relaxed m-0">{{ satellite.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PlanetInfoCard',
  props: {
    planetName: {
      type: String,
      required: true
    },
    emoji: {
      type: String,
      required: true
    },
    facts: {
      type: Object,
      required: true,
      validator: (value) => {
        return value.diameter && value.distance && value.orbitalPeriod && 
               value.temperature && value.description
      }
    },
    moons: {
      type: Array,
      default: () => []
    },
    satellites: {
      type: Array,
      default: () => []
    }
  },
  emits: ['close']
}
</script>

<style scoped>
/* Custom scrollbar styling for webkit browsers */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* Firefox scrollbar styling */
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
}
</style>
