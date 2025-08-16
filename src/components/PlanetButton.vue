<template>
  <button 
    @click="$emit('click')" 
    class="bg-white/5 text-white border border-white/10 rounded-md p-2 text-base cursor-pointer transition-all duration-200 backdrop-blur-md min-w-[50px] h-[60px] flex items-center justify-center hover:bg-white/15 hover:border-white/30 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30 active:translate-y-0 focus:outline-none focus:border-blue-500/60 focus:shadow-[0_0_0_2px_rgba(33,150,243,0.3)] sm:min-w-10 sm:h-[50px] sm:p-1.5 sm:text-sm xs:min-w-9 xs:h-[45px] xs:p-1"
    :title="planetName"
  >
    <div class="flex flex-col items-center justify-center text-center">
      <span class="text-2xl mb-1">{{ emoji }}</span>
      <span class="text-xs text-gray-300 uppercase tracking-wider">{{ planetName }}</span>
    </div>
  </button>
</template>

<script>
export default {
  name: 'PlanetButton',
  props: {
    planetName: {
      type: String,
      required: true
    },
    emoji: {
      type: String,
      required: true
    }
  },
  emits: ['click']
}
</script>
