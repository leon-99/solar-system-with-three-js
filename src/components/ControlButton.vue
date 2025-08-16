<template>
  <button 
    @click="$emit('click')" 
    class="control-btn"
    :class="buttonClasses"
    :title="title"
  >
    <slot>{{ icon }}</slot>
  </button>
</template>

<script>
export default {
  name: 'ControlButton',
  props: {
    buttonType: {
      type: String,
      default: 'default',
      validator: (value) => ['play', 'reset', 'default'].includes(value)
    },
    isPaused: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: ''
    }
  },
  emits: ['click'],
  computed: {
    buttonClasses() {
      const baseClasses = 'bg-white/10 text-white border border-white/20 rounded-lg p-3 text-lg cursor-pointer transition-all duration-200 backdrop-blur-xl min-w-12 h-12 flex items-center justify-center hover:bg-white/20 hover:border-white/40 hover:-translate-y-0.5 active:translate-y-0 sm:min-w-10 sm:h-10 sm:p-2 sm:text-base xs:min-w-9 xs:h-9 xs:p-1.5 xs:text-sm'
      
      if (this.buttonType === 'play') {
        if (this.isPaused) {
          return `${baseClasses} bg-orange-500/20 border-orange-500/40 hover:bg-orange-500/30 hover:border-orange-500/60`
        }
        return `${baseClasses} bg-green-500/20 border-green-500/40 hover:bg-green-500/30 hover:border-green-500/60`
      }
      
      if (this.buttonType === 'reset') {
        return `${baseClasses} bg-blue-500/20 border-blue-500/40 hover:bg-blue-500/30 hover:border-blue-500/60`
      }
      
      return baseClasses
    }
  }
}
</script>
