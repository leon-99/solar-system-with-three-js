<template>

  
  <div v-if="isFirstPersonMode" class="fixed bottom-5 left-5 z-50 bg-black/70 rounded-xl p-4 backdrop-blur-xl border border-white/10 max-w-80">
    <div class="flex items-center gap-2 mb-3 pb-2 border-b border-white/10">
      <span class="text-lg">👤</span>
      <span class="text-white text-sm font-medium tracking-wider">First-Person Mode</span>
    </div>
    
    <!-- Current Planet Info -->
    <div class="mb-3">
      <div class="text-white/80 text-xs mb-1">Currently on:</div>
      <div class="text-white font-medium">{{ currentPlanet && currentPlanet.userData ? currentPlanet.userData.name : 'Unknown Planet' }}</div>
    </div>
    
    <!-- Player Stats -->
    <div class="grid grid-cols-2 gap-3 mb-3">
      <div class="bg-white/10 rounded-lg p-2">
        <div class="text-white/60 text-xs">Height</div>
        <div class="text-white text-sm">{{ playerInfo?.height || 0 }}m</div>
      </div>
      <div class="bg-white/10 rounded-lg p-2">
        <div class="text-white/60 text-xs">Status</div>
        <div class="text-white text-sm">{{ playerInfo?.onGround ? 'On Ground' : 'Falling' }}</div>
      </div>
    </div>
    
    <!-- Controls Info -->
    <div class="bg-white/5 rounded-lg p-3 mb-3">
      <div class="text-white/60 text-xs mb-2">Controls:</div>
      <div class="grid grid-cols-2 gap-2 text-xs text-white/80">
        <div>WASD / Arrows - Move</div>
        <div>Mouse - Look around</div>
        <div>Space - Jump</div>
        <div>Shift - Sprint</div>
      </div>
    </div>
    
    <!-- Exit Button -->
    <button 
      @click="exitFirstPersonMode"
      class="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-colors duration-200 text-sm font-medium"
    >
      Exit First-Person Mode
    </button>
  </div>
  
  <!-- Enter First-Person Button (when not in first-person mode) -->
  <div v-else-if="followingPlanet && followingPlanet.userData" class="fixed bottom-5 left-5 z-50">
    <button 
      @click="enterFirstPersonMode"
      class="bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-xl transition-colors duration-200 text-sm font-medium shadow-lg cursor-pointer"
    >
      👤 Walk on {{ followingPlanet.userData.name || 'Planet' }} Surface
    </button>
  </div>
  

  

</template>

<script>
import { computed } from 'vue'

export default {
  name: 'FirstPersonControls',
  props: {
    isFirstPersonMode: {
      type: Boolean,
      default: false
    },
    currentPlanet: {
      type: Object,
      default: null
    },
    followingPlanet: {
      type: Object,
      default: null
    },
    playerInfo: {
      type: Object,
      default: null
    }
  },
  emits: ['enter-first-person', 'exit-first-person'],
  setup(props, { emit }) {
    const enterFirstPersonMode = () => {
      emit('enter-first-person')
    }
    
    const exitFirstPersonMode = () => {
      emit('exit-first-person')
    }
    
    return {
      enterFirstPersonMode,
      exitFirstPersonMode
    }
  }
}
</script>


