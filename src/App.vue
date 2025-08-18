<template>
  <div id="app">
    <LoadingScreen v-if="loading" :progress="loadingProgress" />
    <canvas ref="canvas" id="bg" :style="{ visibility: loading ? 'hidden' : 'visible' }"></canvas>
    
    <!-- Control Panel -->
    <div v-if="!loading" class="fixed top-5 right-5 z-50 flex flex-col gap-3 max-w-72 md:top-5 md:right-5 md:max-w-72 sm:top-auto sm:bottom-3 sm:right-3 sm:max-w-52 xs:top-auto xs:bottom-2 xs:right-2 xs:max-w-44">
      <!-- Main Controls -->
      <div class="flex gap-2 justify-center sm:gap-1.5 xs:gap-1">
        <ControlButton 
          button-type="play" 
          :is-paused="!isPlaying"
          title="Play/Pause Animation"
          @click="toggleAnimation"
        >
          {{ isPlaying ? '⏸️' : '▶️' }}
        </ControlButton>
        <ControlButton 
          button-type="reset" 
          title="Reset Camera"
          @click="resetCamera"
        >
          ☀️
        </ControlButton>
      </div>
      
      <!-- Planet Selection Menu -->
      <div class="bg-black/70 rounded-xl p-4 backdrop-blur-xl border border-white/10 sm:p-3 xs:p-2.5">
        <div class="flex items-center gap-2 mb-3 pb-2 border-b border-white/10 sm:mb-2.5 sm:pb-1.5 xs:mb-2 xs:pb-1">
          <span class="text-base sm:text-sm xs:text-xs">🌍</span>
          <span class="text-white text-sm font-medium tracking-wider sm:text-xs xs:text-xs">Planets</span>
        </div>
        <div class="grid grid-cols-4 gap-1.5 sm:gap-1 xs:gap-0.5">
          <PlanetButton
            v-for="planet in planets"
            :key="planet.id"
            :planet-name="planet.name"
            :emoji="planet.emoji"
            @click="focusOnPlanet(planet.id)"
          />
        </div>
      </div>
    </div>

    <!-- Planet Info Panel -->
    <PlanetInfoCard
      v-if="!loading && showInfoCard && followingPlanet"
      :planet-name="getPlanetDisplayName(followingPlanet.userData.planetName)"
      :emoji="getPlanetEmoji(followingPlanet.userData.planetName)"
      :facts="getPlanetFacts(followingPlanet.userData.planetName)"
      :moons="getPlanetMoons(followingPlanet.userData.planetName)"
      :satellites="getPlanetSatellites(followingPlanet.userData.planetName)"
      @close="showInfoCard = false"
    />
    
    <!-- First Person Controls -->
    <FirstPersonControls
      v-if="!loading"
      :is-first-person-mode="isFirstPersonMode"
      :current-planet="currentPlanet"
      :following-planet="followingPlanet"
      :player-info="getPlayerInfo()"
      @enter-first-person="handleEnterFirstPerson"
      @exit-first-person="handleExitFirstPerson"
    />
    

  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { usePlanetSystem } from './composables/usePlanetSystem'
import { usePlanetInfo } from './composables/usePlanetInfo'
import { ControlButton, PlanetButton, PlanetInfoCard, LoadingScreen, FirstPersonControls } from './components'

export default {
  name: 'App',
  components: {
    ControlButton,
    PlanetButton,
    PlanetInfoCard,
    LoadingScreen,
    FirstPersonControls
  },
  setup() {
    const canvas = ref(null)
    const loading = ref(true)
    const loadingProgress = ref(0)
    const isPlaying = ref(true)
    const showInfoCard = ref(false)
    
    // Use composables
    const {
      followingPlanet,
      isFollowing,
      isAnimating,
      isFirstPersonMode,
      currentPlanet,
      initThreeJS,
      focusOnPlanet,
      enterFirstPersonMode,
      resetCamera,
      startAnimation,
      handleResize,
      cleanup,
      getPlayerInfo
    } = usePlanetSystem()
    
    const {
      getPlanetEmoji,
      getPlanetDisplayName,
      getPlanetFacts,
      getPlanetMoons,
      getPlanetSatellites,
      planets
    } = usePlanetInfo()

    const toggleAnimation = () => {
      isPlaying.value = !isPlaying.value
    }

    const handlePlanetFocus = (planetName) => {
      focusOnPlanet(planetName)
      showInfoCard.value = true
    }

    const handleCameraReset = () => {
      resetCamera()
      showInfoCard.value = false
    }
    
    const handleEnterFirstPerson = () => {
      if (followingPlanet.value && followingPlanet.value.userData) {
        enterFirstPersonMode(followingPlanet.value.userData.planetName)
      }
    }
    
    const handleExitFirstPerson = () => {
      resetCamera()
    }
    


    // Watch for changes in isPlaying and restart animation
    watch(isPlaying, (newValue) => {
      startAnimation(newValue)
    })

    onMounted(() => {
      // Simulate loading progress
      const simulateLoading = () => {
        const interval = setInterval(() => {
          loadingProgress.value += Math.random() * 15 + 5
          if (loadingProgress.value >= 100) {
            loadingProgress.value = 100
            clearInterval(interval)
            
            // Small delay to show 100% before hiding
            setTimeout(() => {
              loading.value = false
            }, 500)
          }
        }, 200)
      }
      
      simulateLoading()
      
      initThreeJS(canvas.value)
      startAnimation(isPlaying.value)
      window.addEventListener('resize', handleResize)
    })

    onUnmounted(() => {
      cleanup()
      window.removeEventListener('resize', handleResize)
    })

    return {
      canvas,
      loading,
      loadingProgress,
      isPlaying,
      followingPlanet,
      isFollowing,
      isFirstPersonMode,
      currentPlanet,
      showInfoCard,
      planets,
      toggleAnimation,
      resetCamera: handleCameraReset,
      focusOnPlanet: handlePlanetFocus,
             getPlanetEmoji,
       getPlanetDisplayName,
       getPlanetFacts,
       getPlanetMoons,
       getPlanetSatellites,
       getPlayerInfo,
       handleEnterFirstPerson
    }
  }
}
</script>

<style>
body {
  padding: 0;
  margin: 0;
}

#bg {
  display: block;
  width: 100vw;
  height: 100vh;
  cursor: pointer;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
}


</style>
