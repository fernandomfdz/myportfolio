<template>
  <div 
    v-if="canPrestigeNow || prestigeState.totalPrestiges > 0"
    :class="isModal ? 'bg-transparent text-gray-800 dark:text-gray-200' : 'bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 text-white border border-purple-400/30 rounded-xl shadow-2xl'"
    class="p-6 relative overflow-hidden"
  >
    <!-- Background effect (only when not in modal) -->
    <div v-if="!isModal" class="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-indigo-500/10"></div>
    <div class="relative flex items-center space-x-3 mb-4 z-10">
      <div class="text-3xl">🌌</div>
      <div>
        <h2 class="text-2xl font-bold">Sistema de Ascensión</h2>
        <p class="text-sm opacity-90">Asciende para desbloquear bonos permanentes</p>
      </div>
    </div>

    <!-- Current Prestige Stats -->
    <div class="relative grid grid-cols-2 gap-4 mb-6 z-10">
      <div class="bg-white/10 rounded-lg p-3 text-center">
        <div class="text-2xl font-bold text-yellow-300">
          {{ prestigeState.prestigePoints }}
        </div>
        <div class="text-xs opacity-75">Puntos de Ascensión</div>
      </div>
      
      <div class="bg-white/10 rounded-lg p-3 text-center">
        <div class="text-2xl font-bold text-blue-300">
          {{ prestigeState.totalPrestiges }}
        </div>
        <div class="text-xs opacity-75">Total Ascensiones</div>
      </div>
    </div>

    <!-- Current Bonus -->
    <div class="relative bg-white/10 rounded-lg p-4 mb-6 z-10">
      <div class="text-sm opacity-75 mb-1">Bono Actual de Ascensión:</div>
      <div class="text-lg font-bold text-green-300">
        +{{ ((prestigeMultiplier - 1) * 100).toFixed(0) }}% producción
      </div>
      <div class="text-xs opacity-75 mt-1">
        ({{ prestigeMultiplier.toFixed(2) }}x multiplier)
      </div>
    </div>

    <!-- Prestige Action -->
    <div v-if="canPrestigeNow" class="relative space-y-4 z-10">
      <div class="bg-yellow-500/20 rounded-lg p-4 border border-yellow-400/30">
        <div class="flex items-center space-x-2 mb-2">
          <div class="text-xl">⭐</div>
          <div class="font-semibold">Ready to Prestige!</div>
        </div>
        <div class="text-sm opacity-90 mb-3">
          You'll gain <span class="font-bold text-yellow-300">{{ prestigePointsGain }}</span> prestige points
        </div>
        <div class="text-xs opacity-75 mb-4">
          ⚠️ This will reset your progress but you'll keep prestige bonuses
        </div>
      </div>
      
      <button
        @click="handlePrestige"
        class="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105 shadow-2xl relative overflow-hidden group"
      >
        <!-- Button glow effect -->
        <div class="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 opacity-0 group-hover:opacity-30 transition-opacity duration-300 blur"></div>
        
        <!-- Button content -->
        <div class="relative flex items-center justify-center space-x-2">
          <span class="text-xl animate-spin" style="animation-duration: 3s;">✨</span>
          <span class="text-lg">PRESTIGE NOW</span>
          <span class="text-xl animate-spin" style="animation-duration: 3s; animation-direction: reverse;">✨</span>
        </div>
        
        <!-- Sparkle effects -->
        <div class="absolute inset-0 overflow-hidden">
          <div class="absolute top-2 left-4 animate-ping">
            <span class="text-xs">⭐</span>
          </div>
          <div class="absolute bottom-2 right-4 animate-ping" style="animation-delay: 0.5s;">
            <span class="text-xs">⭐</span>
          </div>
        </div>
      </button>
    </div>

    <!-- Progress to Next Prestige -->
    <div v-else class="relative space-y-3 z-10">
      <div class="text-sm opacity-75">
        Progress to first prestige:
      </div>
      <div class="bg-gray-700 rounded-full h-3 overflow-hidden">
        <div 
          class="h-full bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-300"
          :style="{ width: `${Math.min(100, (gameState.fish / prestigeRequirement) * 100)}%` }"
        ></div>
      </div>
      <div class="flex justify-between text-xs opacity-75">
        <span>{{ formatNumber(gameState.fish) }} 🐟</span>
        <span>{{ formatPrestigeRequirement() }} 🐟 required</span>
      </div>
    </div>

    <!-- Prestige System Explanation -->
    <div v-if="prestigeState.totalPrestiges === 0 && canPrestigeNow" class="mt-6 pt-4 border-t border-white/20">
      <div class="bg-blue-500/20 rounded-lg p-4 border border-blue-400/30">
        <h3 class="font-bold mb-2 text-blue-300">🎓 ¿Qué es la Ascensión?</h3>
        <div class="text-sm opacity-90 space-y-2">
          <p>• Obtendrás <strong>puntos de ascensión</strong> permanentes</p>
          <p>• Estos puntos dan <strong>+1% producción</strong> cada uno</p>
          <p>• Desbloquearás <strong>mejoras especiales</strong> que solo se compran con puntos de ascensión</p>
          <p>• Las mejoras de ascensión son <strong>permanentes</strong> y no se pierden</p>
          <p>• Te permitirá progresar más rápido en futuras partidas</p>
        </div>
      </div>
    </div>

    <!-- Prestige Shop -->
    <div v-if="gameState.prestigePoints > 0 || prestigeState.totalPrestiges > 0" class="mt-6 pt-4 border-t border-white/20">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-bold text-yellow-300">✨ Tienda de Ascensión</h3>
        <div class="text-sm text-purple-300">
          {{ gameState.prestigePoints }} puntos disponibles
        </div>
      </div>
      
      <div v-if="availablePrestigeUpgrades && availablePrestigeUpgrades.length > 0" class="space-y-3">
        <div
          v-for="upgrade in availablePrestigeUpgrades"
          :key="upgrade.id"
          class="bg-white/10 rounded-lg p-3 border"
          :class="{
            'border-yellow-400/50 bg-yellow-500/10': upgrade.canAfford && !upgrade.isMaxLevel,
            'border-gray-500/30 opacity-60': !upgrade.canAfford || upgrade.isMaxLevel
          }"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-lg">{{ upgrade.icon }}</span>
                <h4 class="font-bold text-sm">{{ upgrade.name }}</h4>
                <span v-if="upgrade.currentLevel > 0" class="px-2 py-1 text-xs bg-purple-500 rounded-full">
                  {{ upgrade.currentLevel }}/{{ upgrade.maxLevel }}
                </span>
              </div>
              <p class="text-xs opacity-75 mb-2">{{ upgrade.description }}</p>
              <div class="flex items-center justify-between">
                <div class="text-xs">
                  <span class="text-yellow-300">Costo: {{ upgrade.currentCost }} ✨</span>
                </div>
                <button
                  @click="$emit('purchase-prestige-upgrade', upgrade.id)"
                  :disabled="!upgrade.canAfford || upgrade.isMaxLevel"
                  class="px-3 py-1 rounded text-xs font-bold transition-all"
                  :class="{
                    'bg-yellow-500 hover:bg-yellow-600 text-black': upgrade.canAfford && !upgrade.isMaxLevel,
                    'bg-gray-500 text-gray-300 cursor-not-allowed': !upgrade.canAfford || upgrade.isMaxLevel
                  }"
                >
                  {{ upgrade.isMaxLevel ? 'MAX' : 'Comprar' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div v-else-if="gameState.prestigePoints === 0" class="text-center text-sm opacity-75">
        Necesitas puntos de ascensión para comprar mejoras especiales
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, onMounted } from 'vue'

const props = defineProps({
  gameState: {
    type: Object,
    required: true
  },
  prestigeState: {
    type: Object,
    required: true
  },
  canPrestigeNow: {
    type: Boolean,
    default: false
  },
  prestigePointsGain: {
    type: Number,
    default: 0
  },
  prestigeRequirement: {
    type: Number,
    default: 1000000
  },
  prestigeMultiplier: {
    type: Number,
    default: 1
  },
  formatPrestigeRequirement: {
    type: Function,
    required: true
  },
  availablePrestigeUpgrades: {
    type: Array,
    default: () => []
  },
  isModal: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['prestige', 'purchase-prestige-upgrade'])

// Stars for background effect
const stars = ref([])

function handlePrestige() {
  if (confirm('Are you sure you want to prestige? This will reset your progress but grant permanent bonuses!')) {
    emit('prestige')
  }
}

function formatNumber(num) {
  if (num < 1000) return num.toString()
  if (num < 1000000) return (num / 1000).toFixed(1) + 'K'
  if (num < 1000000000) return (num / 1000000).toFixed(1) + 'M'
  return (num / 1000000000).toFixed(1) + 'B'
}

function generateStars() {
  stars.value = []
  for (let i = 0; i < 20; i++) {
    stars.value.push({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 2 + Math.random() * 4
    })
  }
}

onMounted(() => {
  generateStars()
})
</script>