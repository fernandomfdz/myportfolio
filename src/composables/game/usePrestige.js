import { reactive, computed } from 'vue'
import { GAME_BALANCE } from '../../utils/game/gameConstants.js'

const prestigeState = reactive({
  prestigePoints: 0,
  totalPrestiges: 0,
  canPrestige: false
})

export function usePrestige(gameState, resetUpgrades = null) {
  
  const prestigePointsGain = computed(() => {
    if (gameState.fish < GAME_BALANCE.prestigeRequirement) return 0
    
    // Calculate prestige points based on total fish earned
    // Formula: sqrt(fish / 1M) to make it meaningful but not overpowered
    return Math.floor(Math.sqrt(gameState.fish / GAME_BALANCE.prestigeRequirement))
  })

  const prestigeRequirement = computed(() => GAME_BALANCE.prestigeRequirement)
  
  const canPrestigeNow = computed(() => {
    return gameState.fish >= GAME_BALANCE.prestigeRequirement && prestigePointsGain.value > 0
  })

  const prestigeMultiplier = computed(() => {
    // Each prestige point gives a small permanent bonus
    return 1 + (gameState.prestigePoints * 0.01) // 1% per prestige point
  })

  function performPrestige() {
    if (!canPrestigeNow.value) {
      console.warn('Cannot prestige yet')
      return false
    }

    const pointsGained = prestigePointsGain.value
    
    // Add prestige points to gameState
    gameState.prestigePoints += pointsGained
    prestigeState.totalPrestiges++
    
    // Reset game state but keep prestige bonuses
    resetForPrestige(gameState)
    
    // Reset upgrades if function is available
    if (resetUpgrades) {
      resetUpgrades()
    }
    
    console.log(`Prestiged! Gained ${pointsGained} prestige points`)
    return true
  }

  function resetForPrestige(gameState) {
    // Keep prestige points before reset
    const keepPrestigePoints = gameState.prestigePoints
    
    // Reset core game stats
    gameState.fish = 0
    gameState.clickPower = 1
    gameState.autoFishRate = 0
    gameState.totalClicks = 0
    gameState.gameTime = 0
    
    // Reset special effects
    gameState.paellaEndTime = null
    gameState.paellaRate = 0
    gameState.activeEvents = []
    gameState.lastAutoClick = 0
    gameState.offlineGains = 0
    
    // Clear upgrades (will be reset in upgrade system)
    gameState.upgrades = {}
    
    // Reset timestamps
    gameState.startTime = Date.now()
    gameState.lastOnlineTime = Date.now()
    gameState.lastSaveTime = Date.now()
    
    // Restore prestige points
    gameState.prestigePoints = keepPrestigePoints
  }

  function getPrestigeBonus(baseValue) {
    return Math.floor(baseValue * prestigeMultiplier.value)
  }

  function formatPrestigeRequirement() {
    const req = GAME_BALANCE.prestigeRequirement
    if (req >= 1000000) {
      return (req / 1000000).toFixed(1) + 'M'
    }
    if (req >= 1000) {
      return (req / 1000).toFixed(1) + 'K'
    }
    return req.toString()
  }

  return {
    prestigeState,
    prestigePointsGain,
    prestigeRequirement,
    canPrestigeNow,
    prestigeMultiplier,
    performPrestige,
    getPrestigeBonus,
    formatPrestigeRequirement
  }
}