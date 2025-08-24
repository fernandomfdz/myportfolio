<template>
  <div class="">
    <!-- Main Game Area (Full Size) -->
    <div class="relative w-full flex items-center justify-center">
      <!-- Penguin Game Canvas Container -->
      <div class="relative max-w-md w-full">

        <!-- Game Canvas Container -->
        <div class="relative w-full flex justify-center">
          <!-- Shop Button (top right of canvas) - Only show when upgrades can be purchased or are close -->
          <div v-if="shouldShowShopButton" class="absolute top-4 right-4 z-20">
            <div class="relative">
              <button
                @click="openShop"
                class="bg-blue-500 hover:bg-blue-600 text-white p-2 md:p-3 rounded-full shadow-lg transition-all transform hover:scale-110 border-2 border-blue-600"
                title="Tienda"
              >
                <svg class="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                </svg>
              </button>
              <span 
                v-if="affordableUpgradesCount > 0"
                class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 md:h-5 md:w-5 flex items-center justify-center font-bold text-[10px] md:text-xs"
              >
                {{ affordableUpgradesCount }}
              </span>
            </div>
          </div>
          
          <!-- Prestige Button (below shop button) - Only show when prestige is available or already done -->
          <div v-if="canPrestigeNow || prestigeState.totalPrestiges > 0" class="absolute top-20 right-4 z-20">
            <button
              @click="openPrestigeModal"
              class="bg-purple-500 hover:bg-purple-600 text-white p-2 md:p-3 rounded-full shadow-lg transition-all transform hover:scale-110 border-2 border-purple-600 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center"
              title="Ascensión"
            >
              <span class="text-lg">✨</span>
            </button>
          </div>

          <GameCanvas 
            :onPenguinClick="handlePenguinClick"
            :clickPowerValue="gameState.clickPower"
            :activeEvents="gameState.activeEvents"
            :gameState="gameState"
            :isFullsize="true"
          />
        </div>

        <!-- Stats above penguin (Cookie Clicker style) -->
        <div class="text-center z-20 relative">
          <!-- Fish Counter -->
          <div class="text-3xl md:text-4xl lg:text-5xl font-bold text-blue-600 dark:text-blue-400">
            {{ formatWithoutDecimals(gameState.fish) }} 🐟
          </div>
        </div>
      </div>


    </div>

    <!-- Prestige Modal -->
    <div 
      v-if="showPrestigeModal" 
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      @click.self="closePrestigeModal"
    >
      <div class="bg-white dark:bg-gray-800 rounded-lg max-w-3xl w-full max-h-[85vh] overflow-hidden">
        <div class="flex h-full">
          <div class="flex-1 flex flex-col">
            <!-- Header -->
            <div class="border-b dark:border-gray-700 p-3">
              <div class="flex items-center justify-between">
                <h2 class="text-lg font-bold text-gray-800 dark:text-gray-200">
                  ✨ Sistema de Ascensión
                </h2>
                <button
                  @click="closePrestigeModal"
                  class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-xl"
                >
                  ✕
                </button>
              </div>
            </div>

            <!-- Content Area -->
            <div class="flex-1 overflow-y-auto p-3">
              <PrestigePanel
                :gameState="gameState"
                :prestigeState="prestigeState"
                :canPrestigeNow="canPrestigeNow"
                :prestigePointsGain="prestigePointsGain"
                :prestigeRequirement="prestigeRequirement"
                :prestigeMultiplier="prestigeMultiplier"
                :formatPrestigeRequirement="formatPrestigeRequirement"
                :availablePrestigeUpgrades="availablePrestigeUpgrades"
                @prestige="handlePrestige"
                @purchase-prestige-upgrade="handleUpgradePurchase"
                :isModal="true"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Shop Modal -->
    <div 
      v-if="showShopModal" 
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      @click.self="closeShop"
    >
      <div class="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[85vh] overflow-hidden">
        <div class="flex h-full">
          <!-- Sidebar with wallet -->
          <div class="w-40 bg-gray-50 dark:bg-gray-900 border-r dark:border-gray-700">
            <!-- Wallet Section -->
            <div class="p-3 border-b dark:border-gray-700">
              <div class="text-center space-y-2" data-wallet>
                <div>
                  <div class="text-lg font-bold text-blue-600 dark:text-blue-400 transition-all duration-300" :key="gameState.fish">
                    {{ formatWithoutDecimals(gameState.fish) }}
                  </div>
                  <div class="text-xs text-gray-600 dark:text-gray-400">🐟 Fish</div>
                </div>
                <div v-if="gameState.prestigePoints > 0">
                  <div class="text-sm font-bold text-purple-600 dark:text-purple-400">
                    {{ gameState.prestigePoints }}
                  </div>
                  <div class="text-xs text-gray-600 dark:text-gray-400">✨ Prestige</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Content Area -->
          <div class="flex-1 flex flex-col">
            <!-- Header -->
            <div class="border-b dark:border-gray-700 p-3">
              <div class="flex items-center justify-between">
                <h2 class="text-lg font-bold text-gray-800 dark:text-gray-200">
                  🛒 Tienda de Mejoras
                </h2>
                <button
                  @click="closeShop"
                  class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-xl"
                >
                  ✕
                </button>
              </div>
            </div>

            <!-- Content -->
            <div class="flex-1 overflow-y-auto p-3">
              <UpgradesPanel
                :availableUpgrades="availableUpgrades"
                :totalUpgrades="totalUpgradesPurchased"
                :gameState="gameState"
                @purchase-upgrade="handleUpgradePurchase"
                :isModal="true"
              />
            </div>

            <!-- Footer with reset button -->
            <div class="border-t dark:border-gray-700 p-3">
              <button
                @click="confirmResetGame"
                class="w-full text-xs text-gray-400 hover:text-red-400 transition-colors py-2 opacity-50 hover:opacity-100"
                title="Borrar todo el progreso del juego"
              >
                🗑️ Resetear juego completamente
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Events Display -->
    <EventsDisplay
      :activeEvents="gameState.activeEvents"
      :offlineGains="gameState.offlineGains"
      @dismiss-offline-gains="dismissOfflineGains"
    />

    <!-- Purchase Toasters -->
    <div class="fixed top-4 right-4 z-[60] space-y-2">
      <div
        v-for="toast in purchaseToasts"
        :key="toast.id"
        class="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg transform transition-all duration-300"
        :class="{ 'translate-x-full opacity-0': toast.isLeaving }"
      >
        <div class="flex items-center gap-2">
          <span class="text-lg">{{ toast.icon }}</span>
          <div>
            <div class="font-semibold text-sm">{{ toast.name }}</div>
            <div class="text-xs opacity-90">¡Comprado!</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, watch, computed, ref } from 'vue'
import GameCanvas from './GameCanvas.vue'
import GameStats from './GameStats.vue'
import UpgradesPanel from './UpgradesPanel.vue'
import PrestigePanel from './PrestigePanel.vue'
import EventsDisplay from './EventsDisplay.vue'
import UpgradeCelebration from './UpgradeCelebration.vue'
import { useGameState, setUpgradeFunctions } from '../../composables/game/useGameState.js'
import { usePersistence } from '../../composables/game/usePersistence.js'
import { useUpgrades } from '../../composables/game/useUpgrades.js'
import { usePrestige } from '../../composables/game/usePrestige.js'
import { formatNumber,formatWithoutDecimals } from '../../utils/game/formatters.js'

// Composables
const {
  gameState,
  clicksPerSecond,
  autoFishPerSecond,
  click,
  startGame,
  pauseGame,
  resetGame,
  applyOfflineGains
} = useGameState()

const {
  availableUpgrades,
  availablePrestigeUpgrades,
  upgradeStates,
  purchaseUpgrade,
  getDoubleClickChance,
  getClickBurstChance,
  getAutoFishMultiplier,
  getAutoClickerRate,
  getOfflineProductionRate,
  getTotalUpgradesPurchased,
  loadUpgradeStates,
  getUpgradeStates,
  resetUpgrades,
  activatePaellaEffect,
  activateSpecialUpgradeEffect
} = useUpgrades(gameState)

const {
  prestigeState,
  prestigePointsGain,
  prestigeRequirement,
  canPrestigeNow,
  prestigeMultiplier,
  performPrestige,
  formatPrestigeRequirement
} = usePrestige(gameState, resetUpgrades)

const {
  saveGame,
  loadGame,
  hasSave,
  setupAutoSave,
  deleteSave
} = usePersistence(gameState, prestigeState)

// Computed values
const doubleClickChance = computed(() => getDoubleClickChance())
const clickBurstChance = computed(() => getClickBurstChance())
const totalUpgradesPurchased = computed(() => getTotalUpgradesPurchased())
const fishPerSecond = computed(() => {
  return clicksPerSecond.value * gameState.clickPower + autoFishPerSecond.value
})

const realFishPerSecond = computed(() => {
  return autoFishPerSecond.value
})

// UI State
const showShopModal = ref(false)
const showPrestigeModal = ref(false)
const purchaseToasts = ref([])
let nextToastId = 0

// Shop functionality
const affordableUpgradesCount = computed(() => {
  return availableUpgrades.value.filter(upgrade => upgrade.canAfford && !upgrade.isMaxLevel).length
})

const shouldShowShopButton = computed(() => {
  // Show shop button when:
  // 1. There are upgrades you can afford, OR
  // 2. There are upgrades visible and you're close to affording the cheapest one (within 50% of the cost)
  
  const hasAffordableUpgrades = affordableUpgradesCount.value > 0
  
  if (hasAffordableUpgrades) return true
  
  // Check if close to affording any upgrade
  const currentFish = gameState.fish
  const cheapestUpgrade = availableUpgrades.value
    .filter(upgrade => !upgrade.isMaxLevel)
    .sort((a, b) => a.currentCost - b.currentCost)[0]
  
  if (cheapestUpgrade && currentFish >= cheapestUpgrade.currentCost * 0.5) {
    return true
  }
  
  return false
})

function openShop() {
  showShopModal.value = true
}

function closeShop() {
  showShopModal.value = false
}

function openPrestigeModal() {
  showPrestigeModal.value = true
}

function closePrestigeModal() {
  showPrestigeModal.value = false
}

// Event handlers
function handlePenguinClick() {
  click(doubleClickChance.value, clickBurstChance.value)
}

function handleUpgradePurchase(upgradeId) {
  // Get upgrade cost before purchase for animation
  const upgrade = availableUpgrades.value.find(u => u.id === upgradeId)
  const cost = upgrade ? upgrade.currentCost : 0
  
  const success = purchaseUpgrade(upgradeId)
  if (success) {
    console.log(`Purchased upgrade: ${upgradeId}`)
    
    // Trigger wallet animation
    triggerWalletAnimation(cost)
    
    // Find the upgrade for toast notification
    if (upgrade) {
      showPurchaseToast(upgrade)
    }
    
    // Special effects for certain upgrades
    if (upgradeId === 'misterPaella') {
      activatePaellaEffect()
    }
    
    // Activate special upgrade effects for key upgrades
    const specialUpgrades = ['goldenCursor', 'fishingBot', 'deploymentPipeline', 'hackathonHustle']
    if (specialUpgrades.includes(upgradeId)) {
      activateSpecialUpgradeEffect(upgradeId)
    }
  }
}

function triggerWalletAnimation(cost) {
  // Force Vue to re-render the wallet display with key change
  const walletElement = document.querySelector('[data-wallet]')
  if (walletElement) {
    walletElement.classList.add('animate-pulse')
    setTimeout(() => {
      walletElement.classList.remove('animate-pulse')
    }, 500)
  }
}

function showPurchaseToast(upgrade) {
  const toast = {
    id: nextToastId++,
    name: upgrade.name,
    icon: upgrade.icon,
    isLeaving: false
  }
  
  purchaseToasts.value.push(toast)
  
  // Auto-remove after 3 seconds
  setTimeout(() => {
    toast.isLeaving = true
    setTimeout(() => {
      const index = purchaseToasts.value.findIndex(t => t.id === toast.id)
      if (index > -1) {
        purchaseToasts.value.splice(index, 1)
      }
    }, 300)
  }, 3000)
}

function dismissOfflineGains() {
  gameState.offlineGains = 0
}

function handlePrestige() {
  const success = performPrestige()
  if (success) {
    console.log('Prestige completed successfully!')
    closePrestigeModal()
  }
}

function confirmResetGame() {
  const confirmation = confirm(
    '¿Estás seguro de que quieres borrar TODO el progreso del juego?\n\n' +
    'Esto eliminará:\n' +
    '• Todos los peces\n' +
    '• Todas las mejoras\n' +
    '• Todo el progreso de ascensión\n' +
    '• Los datos guardados\n\n' +
    'Esta acción NO se puede deshacer.'
  )
  
  if (confirmation) {
    // Reset game state
    resetGame()
    
    // Reset upgrades
    resetUpgrades()
    
    // Reset prestige state completely
    Object.assign(prestigeState, {
      prestigePoints: 0,
      totalPrestiges: 0,
      canPrestige: false
    })
    
    // Delete saved data
    deleteSave()
    
    // Restart game
    startGame()
    
    console.log('Game completely reset!')
  }
}

// Lifecycle
onMounted(() => {
  // Set up upgrade functions for game state
  setUpgradeFunctions({
    getAutoFishMultiplier,
    getAutoClickerRate,
    getOfflineProductionRate,
    prestigeMultiplier
  })
  
  // Auto-load saved game
  if (hasSave()) {
    const savedData = loadGame()
    // Load upgrade states if available
    if (savedData && savedData.upgrades) {
      loadUpgradeStates(savedData.upgrades)
    }
  }
  
  // Apply offline gains if any
  applyOfflineGains()
  
  // Auto-start game
  startGame()
  
  // Setup auto-save with upgrades
  setupAutoSave()
  
  // Watch for upgrade changes to update save data
  watch(() => getUpgradeStates(), (newUpgrades) => {
    gameState.upgrades = newUpgrades
  }, { deep: true })
})

// Cleanup
onUnmounted(() => {
  pauseGame()
})
</script>