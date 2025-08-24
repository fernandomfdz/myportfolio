<template>
  <div class="fixed top-20 right-4 z-50 space-y-2">
    <TransitionGroup 
      name="event" 
      tag="div" 
      class="space-y-2"
    >
      <div
        v-for="event in activeEvents"
        :key="event.id || event.type"
        class="bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg p-4 shadow-lg animate-bounce"
        :class="getEventStyles(event.type)"
      >
        <div class="flex items-center space-x-2">
          <span class="text-2xl">{{ getEventIcon(event.type) }}</span>
          <div class="flex-1">
            <div class="font-bold text-sm">{{ getEventName(event.type) }}</div>
            <div class="text-xs opacity-90">
              {{ getEventDescription(event.type) }}
            </div>
          </div>
          <div class="text-xs font-mono bg-black/20 px-2 py-1 rounded">
            {{ formatTimeLeft(event.endTime) }}
          </div>
        </div>
        
        <!-- Event effects preview -->
        <div class="mt-2 text-xs opacity-75">
          <div v-if="event.effects.clickMultiplier">
            🖱️ Clicks x{{ event.effects.clickMultiplier }}
          </div>
          <div v-if="event.effects.autoFishMultiplier">
            🐟 Auto x{{ event.effects.autoFishMultiplier }}
          </div>
          <div v-if="event.effects.fishBonus">
            ✨ +{{ event.effects.fishBonus }} bonus
          </div>
          <div v-if="event.effects.allProductionBonus">
            🚀 All production x{{ event.effects.allProductionBonus }}
          </div>
        </div>
      </div>
    </TransitionGroup>
    
    <!-- Offline gains notification -->
    <div
      v-if="offlineGains > 0"
      class="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-4 shadow-lg"
    >
      <div class="flex items-center space-x-2">
        <span class="text-2xl">💤</span>
        <div class="flex-1">
          <div class="font-bold text-sm">Welcome Back!</div>
          <div class="text-xs">You earned {{ formatNumber(offlineGains) }} 🐟 while away</div>
        </div>
        <button
          @click="dismissOfflineGains"
          class="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded transition-colors"
        >
          ✕
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue'
import { formatNumber } from '../../utils/game/formatters.js'

const props = defineProps({
  activeEvents: {
    type: Array,
    default: () => []
  },
  offlineGains: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['dismiss-offline-gains'])

function getEventIcon(eventType) {
  switch (eventType) {
    case 'goldenFish': return '🌟🐟'
    case 'hackathon': return '💻🚀'
    case 'deploymentBonus': return '🚀✨'
    default: return '⭐'
  }
}

function getEventName(eventType) {
  switch (eventType) {
    case 'goldenFish': return 'Golden Fish!'
    case 'hackathon': return 'T3chfest!'
    case 'deploymentBonus': return 'Product Fest!'
    case 'jsconf': return 'JSConf!'
    default: return 'Special Event!'
  }
}

function getEventDescription(eventType) {
  switch (eventType) {
    case 'goldenFish': return 'Super clicks & bonus fish!'
    case 'hackathon': return 'T3ch conference boost!'
    case 'deploymentBonus': return 'Product conference boost!'
    case 'jsconf': return 'JavaScript conference boost!'
    default: return 'Something awesome is happening!'
  }
}

function getEventStyles(eventType) {
  switch (eventType) {
    case 'goldenFish': 
      return 'from-yellow-400 to-orange-500'
    case 'hackathon': 
      return 'from-purple-500 to-pink-500'
    case 'deploymentBonus': 
      return 'from-green-500 to-blue-500'
    case 'jsconf': 
      return 'from-yellow-500 to-red-500'
    default: 
      return 'from-gray-500 to-gray-600'
  }
}

function formatTimeLeft(endTime) {
  const timeLeft = Math.max(0, Math.ceil((endTime - Date.now()) / 1000))
  return `${timeLeft}s`
}


function dismissOfflineGains() {
  emit('dismiss-offline-gains')
}
</script>

<style scoped>
.event-enter-active,
.event-leave-active {
  transition: all 0.5s ease;
}

.event-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.event-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

@keyframes bounce {
  0%, 20%, 53%, 80%, 100% {
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    transform: translate3d(0, 0, 0);
  }
  40%, 43% {
    animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
    transform: translate3d(0, -8px, 0);
  }
  70% {
    animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
    transform: translate3d(0, -4px, 0);
  }
  90% {
    transform: translate3d(0, -2px, 0);
  }
}
</style>