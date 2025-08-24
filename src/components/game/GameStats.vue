<template>
  <div class="bg-gradient-to-br from-white via-blue-50 to-purple-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-700 rounded-xl shadow-2xl p-6 space-y-6 border border-blue-200/50 dark:border-purple-500/20">
    <div class="relative">
      <div class="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-600 rounded-xl blur opacity-20"></div>
      <h2 class="relative text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-center">
        🐟 Penguin Empire Stats
      </h2>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- Fish Counter with animation -->
      <div class="group bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40 rounded-xl p-4 text-center transition-all duration-300 hover:scale-105 hover:shadow-lg border border-blue-300/50 dark:border-blue-600/30">
        <div class="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-1 transition-all duration-300 group-hover:scale-110">
          {{ formatNumber(gameState.fish) }}
        </div>
        <div class="text-sm font-medium text-blue-700 dark:text-blue-300 flex items-center justify-center gap-1">
          <span class="animate-bounce">🐟</span> Total Fish
        </div>
        <div class="text-xs text-blue-600/70 dark:text-blue-400/70 mt-1">
          +{{ formatNumber(fishPerSecond) }}/sec
        </div>
      </div>
      
      <!-- Click Power -->
      <div class="group bg-gradient-to-br from-green-100 to-emerald-200 dark:from-green-900/40 dark:to-emerald-800/40 rounded-xl p-4 text-center transition-all duration-300 hover:scale-105 hover:shadow-lg border border-green-300/50 dark:border-green-600/30">
        <div class="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-1 transition-all duration-300 group-hover:scale-110">
          {{ formatNumber(gameState.clickPower) }}
        </div>
        <div class="text-sm font-medium text-green-700 dark:text-green-300 flex items-center justify-center gap-1">
          <span class="animate-pulse">🖱️</span> Click Power
        </div>
        <div class="text-xs text-green-600/70 dark:text-green-400/70 mt-1">
          {{ clicksPerSecond.toFixed(1) }} CPS
        </div>
      </div>
      
      <!-- Auto Production -->
      <div class="group bg-gradient-to-br from-purple-100 to-pink-200 dark:from-purple-900/40 dark:to-pink-800/40 rounded-xl p-4 text-center transition-all duration-300 hover:scale-105 hover:shadow-lg border border-purple-300/50 dark:border-purple-600/30">
        <div class="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-1 transition-all duration-300 group-hover:scale-110">
          {{ formatNumber(autoFishPerSecond) }}
        </div>
        <div class="text-sm font-medium text-purple-700 dark:text-purple-300 flex items-center justify-center gap-1">
          <span class="animate-spin">⚙️</span> Auto/sec
        </div>
        <div class="text-xs text-purple-600/70 dark:text-purple-400/70 mt-1">
          {{ autoFishPerSecond > 0 ? 'Active' : 'Inactive' }}
        </div>
      </div>
    </div>
    
    <!-- Achievement Progress -->
    <div class="bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl p-4 border border-yellow-300/50 dark:border-orange-500/30">
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-lg font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
          🏆 Progress
        </h3>
        <div class="text-sm text-yellow-700 dark:text-yellow-300 font-medium">
          {{ Math.floor(gameState.gameTime / 60) }}min played
        </div>
      </div>
      
      <div class="grid grid-cols-2 gap-4">
        <div class="text-center">
          <div class="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
            {{ formatNumber(gameState.totalClicks) }}
          </div>
          <div class="text-xs text-yellow-700 dark:text-yellow-300">
            Total Clicks
          </div>
        </div>
        
        <div class="text-center">
          <div class="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            {{ gameState.activeEvents?.length || 0 }}
          </div>
          <div class="text-xs text-orange-700 dark:text-orange-300">
            Active Events
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, computed } from 'vue'
import { formatNumber } from '../../utils/game/formatters.js'

const props = defineProps({
  gameState: {
    type: Object,
    required: true
  },
  clicksPerSecond: {
    type: Number,
    default: 0
  },
  autoFishPerSecond: {
    type: Number,
    default: 0
  }
})

const fishPerSecond = computed(() => {
  return props.clicksPerSecond * props.gameState.clickPower + props.autoFishPerSecond
})
</script>