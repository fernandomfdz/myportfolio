<template>
  <div 
    v-if="isVisible"
    class="fixed inset-0 z-50 pointer-events-none"
  >
    <!-- Backdrop with sparkles -->
    <div class="absolute inset-0 bg-black/20 backdrop-blur-sm">
      <!-- Animated sparkles -->
      <div 
        v-for="sparkle in sparkles"
        :key="sparkle.id"
        class="absolute animate-ping"
        :style="{ 
          left: sparkle.x + '%', 
          top: sparkle.y + '%',
          animationDelay: sparkle.delay + 's',
          animationDuration: sparkle.duration + 's'
        }"
      >
        <span class="text-2xl">✨</span>
      </div>
    </div>
    
    <!-- Main celebration content -->
    <div class="absolute inset-0 flex items-center justify-center">
      <div 
        class="bg-gradient-to-br from-purple-500 via-pink-500 to-yellow-500 rounded-2xl p-8 shadow-2xl transform transition-all duration-500 scale-110 animate-bounce"
        :class="{ 'animate-pulse': isSpecialUpgrade }"
      >
        <div class="text-center text-white">
          <!-- Upgrade icon with extra effects -->
          <div class="text-6xl mb-4 animate-spin" style="animation-duration: 2s;">
            {{ upgradeIcon }}
          </div>
          
          <!-- Celebration message -->
          <h2 class="text-3xl font-bold mb-2 bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">
            ¡UPGRADE COMPRADO!
          </h2>
          
          <p class="text-xl font-semibold mb-4">
            {{ upgradeName }}
          </p>
          
          <!-- Special effects for milestone upgrades -->
          <div v-if="isSpecialUpgrade" class="mb-4">
            <div class="text-4xl animate-bounce">🎉</div>
            <p class="text-lg font-bold text-yellow-200">
              ¡UPGRADE ESPECIAL!
            </p>
          </div>
          
          <!-- Fireworks effect -->
          <div class="absolute inset-0 overflow-hidden rounded-2xl">
            <div 
              v-for="firework in fireworks"
              :key="firework.id"
              class="absolute animate-ping"
              :style="{ 
                left: firework.x + '%', 
                top: firework.y + '%',
                animationDelay: firework.delay + 's'
              }"
            >
              <span class="text-3xl">🎆</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'

const props = defineProps({
  upgrade: {
    type: Object,
    default: null
  },
  isVisible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['hide'])

// Animation elements
const sparkles = ref([])
const fireworks = ref([])
const nextSparkleId = ref(0)
const nextFireworkId = ref(0)

// Computed properties
const upgradeIcon = computed(() => props.upgrade?.icon || '🚀')
const upgradeName = computed(() => props.upgrade?.name || 'Unknown Upgrade')

const isSpecialUpgrade = computed(() => {
  if (!props.upgrade) return false
  // Special upgrades that deserve extra celebration
  const specialUpgrades = [
    'misterPaella', 'goldenCursor', 'pacosarabia', 'fishingBot',
    'deploymentPipeline', 'hackathonHustle', 'openSourceContrib'
  ]
  return specialUpgrades.includes(props.upgrade.id)
})

// Functions
function createSparkles() {
  sparkles.value = []
  for (let i = 0; i < 20; i++) {
    sparkles.value.push({
      id: nextSparkleId.value++,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 1 + Math.random() * 2
    })
  }
}

function createFireworks() {
  fireworks.value = []
  if (isSpecialUpgrade.value) {
    for (let i = 0; i < 10; i++) {
      fireworks.value.push({
        id: nextFireworkId.value++,
        x: 20 + Math.random() * 60,
        y: 20 + Math.random() * 60,
        delay: Math.random() * 1.5
      })
    }
  }
}

function startCelebration() {
  createSparkles()
  createFireworks()
  
  // Auto-hide after 3 seconds
  setTimeout(() => {
    emit('hide')
  }, 3000)
}

// Watchers
watch(() => props.isVisible, (newVal) => {
  if (newVal) {
    nextTick(() => {
      startCelebration()
    })
  }
})
</script>

<style scoped>
@keyframes sparkle {
  0%, 100% {
    opacity: 0;
    transform: scale(0);
  }
  50% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes firework {
  0% {
    opacity: 0;
    transform: scale(0) rotate(0deg);
  }
  50% {
    opacity: 1;
    transform: scale(1.5) rotate(180deg);
  }
  100% {
    opacity: 0;
    transform: scale(2) rotate(360deg);
  }
}

.animate-sparkle {
  animation: sparkle 2s ease-in-out infinite;
}

.animate-firework {
  animation: firework 1.5s ease-out infinite;
}
</style>