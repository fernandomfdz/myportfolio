<template>
  <div :class="isModal ? 'bg-transparent p-0' : 'bg-gradient-to-br from-white via-green-50 to-blue-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-700 rounded-xl shadow-2xl border border-green-200/50 dark:border-blue-500/20 p-6'">
    <div v-if="!isModal" class="relative mb-6">
      <div class="absolute -inset-1 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 rounded-xl blur opacity-20"></div>
      <h2 class="relative text-3xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
        <span>🚀</span> Upgrade Shop
        <span class="text-lg font-normal bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
          ({{ totalUpgrades }} owned)
        </span>
      </h2>
    </div>
    
    <!-- Upgrades List -->
    <div class="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto pr-2 scroll-smooth custom-scrollbar">
      <TransitionGroup name="upgrade" tag="div" class="space-y-4">
      <div
        v-for="upgrade in availableUpgrades"
        :key="upgrade.id"
        class="group relative border-2 rounded-lg p-3 transition-all duration-300 hover:shadow-lg"
        :class="{
          'bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-800/30 border-green-400 dark:border-green-500 hover:shadow-green-200 dark:hover:shadow-green-900/50': upgrade.canAfford && !upgrade.isMaxLevel,
          'bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700/20 dark:to-gray-600/20 border-gray-300 dark:border-gray-600 opacity-60': !upgrade.canAfford || upgrade.isMaxLevel,
          'bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-800/30 border-blue-400 dark:border-blue-500 hover:shadow-blue-200 dark:hover:shadow-blue-900/50': upgrade.currentLevel > 0 && !upgrade.isMaxLevel,
          'special-upgrade': isSpecialUpgrade(upgrade.id) && upgrade.canAfford
        }"
      >
        <!-- Sparkle effect for affordable upgrades -->
        <div 
          v-if="upgrade.canAfford && !upgrade.isMaxLevel"
          class="absolute -inset-1 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"
        ></div>
        <!-- Upgrade Header -->
        <div class="relative flex items-center gap-3 mb-2">
          <span 
            class="text-2xl transition-all duration-300 group-hover:scale-110 flex-shrink-0"
            :class="{ 'animate-bounce': upgrade.canAfford && !upgrade.isMaxLevel }"
          >
            {{ upgrade.icon }}
          </span>
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between">
              <h3 class="font-bold text-base bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-200 dark:to-gray-400 bg-clip-text text-transparent truncate">
                {{ upgrade.name }}
              </h3>
              <div class="flex gap-1 flex-shrink-0 ml-2">
                <span 
                  v-if="upgrade.currentLevel > 0"
                  class="px-2 py-1 text-xs font-bold rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-sm"
                >
                  {{ upgrade.currentLevel }}/{{ upgrade.maxLevel }}
                </span>
                <span 
                  v-if="upgrade.isMaxLevel"
                  class="px-2 py-1 text-xs font-bold rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-sm"
                >
                  MAX
                </span>
              </div>
            </div>
            
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-1 line-clamp-2">
              {{ upgrade.description }}
            </p>
            
            <!-- Effect description -->
            <div class="text-xs text-gray-500 dark:text-gray-500">
              <span class="text-green-600 dark:text-green-400 font-medium">
                {{ formatUpgradeValue(upgrade) }}
              </span>
              <span class="mx-1">•</span>
              <span>{{ upgrade.effectDescription }}</span>
            </div>
          </div>
        </div>
        
        <!-- Purchase Section -->
        <div class="flex items-center justify-between mt-2 p-2 bg-white/50 dark:bg-black/20 rounded-lg">
          <div class="flex items-center gap-2">
            <span class="text-xs text-gray-500 dark:text-gray-400">Cost:</span>
            <span 
              class="text-sm font-bold flex items-center gap-1"
              :class="{
                'text-green-600 dark:text-green-400': upgrade.canAfford,
                'text-red-500 dark:text-red-400': !upgrade.canAfford
              }"
            >
              {{ formatNumber(upgrade.currentCost) }}
              🐟
            </span>
          </div>
          
          <button
            @click="handlePurchase(upgrade.id)"
            :disabled="!upgrade.canAfford || upgrade.isMaxLevel"
            class="relative px-3 py-2 rounded-lg font-bold text-xs transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md"
            :class="{
              'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white cursor-pointer': upgrade.canAfford && !upgrade.isMaxLevel,
              'bg-gradient-to-r from-gray-400 to-gray-500 text-gray-700 cursor-not-allowed opacity-60': !upgrade.canAfford || upgrade.isMaxLevel
            }"
          >
            <span v-if="upgrade.isMaxLevel">
              ✨ MAX
            </span>
            <span v-else-if="upgrade.canAfford">
              🛒 BUY
            </span>
            <span v-else>🔒</span>
          </button>
        </div>
        
        <!-- Level Progress -->
        <div v-if="upgrade.maxLevel > 1" class="mt-2">
          <div class="flex justify-between text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
            <span>{{ upgrade.currentLevel }}/{{ upgrade.maxLevel }}</span>
            <span class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-bold">
              {{ Math.round((upgrade.currentLevel / upgrade.maxLevel) * 100) }}%
            </span>
          </div>
          <div class="relative w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
            <div 
              class="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-500 ease-out"
              :style="{ width: `${(upgrade.currentLevel / upgrade.maxLevel) * 100}%` }"
            />
          </div>
        </div>
      </div>
      </TransitionGroup>
    </div>
    
    <!-- Empty state -->
    <div 
      v-if="availableUpgrades.length === 0" 
      class="text-center py-8 text-gray-500 dark:text-gray-400"
    >
      <div class="text-4xl mb-4">🔒</div>
      <p>¡Consigue más peces para desbloquear upgrades!</p>
      <p class="text-sm mt-2">Próximo unlock: {{ nextUnlockRequirement }} 🐟</p>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue'
import { formatNumber } from '../../utils/game/formatters.js'

const props = defineProps({
  availableUpgrades: {
    type: Array,
    default: () => []
  },
  totalUpgrades: {
    type: Number,
    default: 0
  },
  gameState: {
    type: Object,
    required: true
  },
  isModal: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['purchase-upgrade'])

const nextUnlockRequirement = computed(() => {
  // Find the next upgrade that could be unlocked
  const allUpgradeRequirements = [10, 25, 75, 150, 300, 500]
  const currentFish = props.gameState.fish
  
  const nextRequirement = allUpgradeRequirements.find(req => req > currentFish)
  return nextRequirement || 1000
})

function handlePurchase(upgradeId) {
  emit('purchase-upgrade', upgradeId)
}

function formatUpgradeValue(upgrade) {
  switch (upgrade.effect) {
    case 'autoFish':
      return `+${upgrade.value}/s`
    case 'clickMultiplier':
      return `x${upgrade.value}`
    case 'doubleClickChance':
      return `${(upgrade.value * 100)}% chance`
    case 'penguinBonus':
      return `+${upgrade.value} per Mini Penguin`
    default:
      return upgrade.value.toString()
  }
}

function isSpecialUpgrade(upgradeId) {
  const specialUpgrades = [
    'misterPaella', 'goldenCursor', 'pacosarabia', 'fishingBot',
    'deploymentPipeline', 'hackathonHustle', 'openSourceContrib',
    'quantumPenguin'
  ]
  return specialUpgrades.includes(upgradeId)
}
</script>

<style scoped>
/* Upgrade transitions */
.upgrade-enter-active,
.upgrade-leave-active {
  transition: all 0.5s ease;
}

.upgrade-enter-from {
  opacity: 0;
  transform: translateY(30px) scale(0.8);
}

.upgrade-leave-to {
  opacity: 0;
  transform: translateY(-30px) scale(0.8);
}

.upgrade-move {
  transition: transform 0.5s ease;
}

/* Purchase animation */
@keyframes purchase-success {
  0% {
    transform: scale(1);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }
}

.purchase-success {
  animation: purchase-success 0.6s ease-out;
}

/* Glow effect for special upgrades */
@keyframes special-glow {
  0%, 100% {
    box-shadow: 0 0 5px rgba(168, 85, 247, 0.4);
  }
  50% {
    box-shadow: 0 0 20px rgba(168, 85, 247, 0.8), 0 0 30px rgba(168, 85, 247, 0.6);
  }
}

.special-upgrade {
  animation: special-glow 2s ease-in-out infinite;
}

/* Custom scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #2563eb, #7c3aed);
}

/* Line clamp utility */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>