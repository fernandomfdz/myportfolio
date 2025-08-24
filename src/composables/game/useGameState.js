import { reactive, computed, ref } from 'vue'

// Global references to upgrade functions (will be set by the component)
let getAutoFishMultiplier = null
let getAutoClickerRate = null  
let getOfflineProductionRate = null
let prestigeMultiplier = null

export function setUpgradeFunctions(upgradeFunctions) {
  getAutoFishMultiplier = upgradeFunctions.getAutoFishMultiplier
  getAutoClickerRate = upgradeFunctions.getAutoClickerRate
  getOfflineProductionRate = upgradeFunctions.getOfflineProductionRate
  prestigeMultiplier = upgradeFunctions.prestigeMultiplier
}

const gameState = reactive({
  fish: 0,
  clickPower: 1,
  autoFishRate: 0,
  totalClicks: 0,
  gameTime: 0,
  isPlaying: false,
  startTime: null,
  lastSaveTime: Date.now(),
  
  // Advanced mechanics
  paellaEndTime: null,
  paellaRate: 0,
  activeEvents: [],
  lastAutoClick: 0,
  
  // Offline production
  lastOnlineTime: Date.now(),
  offlineGains: 0,
  
  // Prestige system
  prestigePoints: 0
})

const gameLoop = ref(null)

export function useGameState() {
  const clicksPerSecond = computed(() => {
    if (gameState.gameTime === 0) return 0
    return Math.round((gameState.totalClicks / gameState.gameTime) * 100) / 100
  })

  const autoFishPerSecond = computed(() => gameState.autoFishRate)

  function click(doubleClickChance = 0, clickBurstChance = 0) {
    let fishGained = gameState.clickPower
    
    // Check for double click chance (JS Seed)
    if (doubleClickChance > 0 && Math.random() < doubleClickChance) {
      fishGained *= 2
    }
    
    // Check for click burst (Analytics Dashboard)
    if (clickBurstChance > 0 && Math.random() < clickBurstChance) {
      fishGained += 100 // Burst bonus
    }
    
    // Apply active event multipliers
    gameState.activeEvents.forEach(event => {
      if (event.effects.clickMultiplier) {
        fishGained *= event.effects.clickMultiplier
      }
    })
    
    gameState.fish += fishGained
    gameState.totalClicks++
    
    return fishGained
  }

  function startGame() {
    if (gameState.isPlaying) return
    
    gameState.isPlaying = true
    gameState.startTime = Date.now()
    
    gameLoop.value = setInterval(() => {
      gameState.gameTime = Math.floor((Date.now() - gameState.startTime) / 1000)
      const now = Date.now()
      
      // Calculate auto fish production with multipliers
      if (gameState.autoFishRate > 0) {
        let autoFishGain = gameState.autoFishRate / 10 // Divided by 10 for 100ms interval
        
        // Apply auto fish multipliers from upgrades
        const autoFishMultiplier = getAutoFishMultiplier?.() || 1
        const prestigeBonus = prestigeMultiplier?.value || prestigeMultiplier || 1
        autoFishGain *= autoFishMultiplier * prestigeBonus
        
        // Apply active event multipliers
        gameState.activeEvents.forEach(event => {
          if (event.effects.autoFishMultiplier) {
            autoFishGain *= event.effects.autoFishMultiplier
          }
          if (event.effects.allProductionBonus) {
            autoFishGain *= event.effects.allProductionBonus
          }
        })
        
        gameState.fish += autoFishGain
      }
      
      // Paella production (temporary boost)
      if (gameState.paellaEndTime && now < gameState.paellaEndTime) {
        gameState.fish += (gameState.paellaRate || 0) / 10
      } else if (gameState.paellaEndTime && now >= gameState.paellaEndTime) {
        // Paella effect expired
        gameState.paellaEndTime = null
        gameState.paellaRate = 0
      }
      
      // Auto-clicker
      const autoClickerRate = getAutoClickerRate?.() || 0
      if (autoClickerRate > 0 && now - gameState.lastAutoClick >= autoClickerRate) {
        const autoClickGain = click(0, 0) // Auto-click doesn't trigger chance effects
        gameState.lastAutoClick = now
      }
      
      // Clean up expired events
      gameState.activeEvents = gameState.activeEvents.filter(event => 
        now < event.endTime
      )
      
      // Random events (Golden Fish, etc.)
      if (Math.random() < 0.0005) { // 0.05% chance per loop
        triggerRandomEvent()
      }
      
    }, 100)
  }

  function pauseGame() {
    gameState.isPlaying = false
    if (gameLoop.value) {
      clearInterval(gameLoop.value)
      gameLoop.value = null
    }
  }

  function resetGame() {
    pauseGame()
    Object.assign(gameState, {
      fish: 0,
      clickPower: 1,
      autoFishRate: 0,
      totalClicks: 0,
      gameTime: 0,
      isPlaying: false,
      startTime: null,
      lastSaveTime: Date.now(),
      paellaEndTime: null,
      paellaRate: 0,
      activeEvents: [],
      lastAutoClick: 0,
      lastOnlineTime: Date.now(),
      offlineGains: 0,
      prestigePoints: 0
    })
  }

  function triggerRandomEvent() {
    const eventTypes = ['goldenFish', 'hackathon', 'deploymentBonus']
    const randomEvent = eventTypes[Math.floor(Math.random() * eventTypes.length)]
    
    const eventData = {
      type: randomEvent,
      endTime: Date.now() + getEventDuration(randomEvent),
      effects: getEventEffects(randomEvent)
    }
    
    gameState.activeEvents.push(eventData)
    console.log(`Special event triggered: ${randomEvent}`)
  }

  function getEventDuration(eventType) {
    switch (eventType) {
      case 'goldenFish': return 10000 // 10 seconds
      case 'hackathon': return 30000 // 30 seconds
      case 'deploymentBonus': return 15000 // 15 seconds
      default: return 10000
    }
  }

  function getEventEffects(eventType) {
    switch (eventType) {
      case 'goldenFish':
        return {
          fishBonus: 1000,
          clickMultiplier: 10
        }
      case 'hackathon':
        return {
          autoFishMultiplier: 2,
          clickMultiplier: 5
        }
      case 'deploymentBonus':
        return {
          allProductionBonus: 1.5
        }
      default:
        return {}
    }
  }

  function calculateOfflineGains() {
    const now = Date.now()
    const offlineTime = now - gameState.lastOnlineTime
    const maxOfflineTime = 24 * 60 * 60 * 1000 // 24 hours
    const actualOfflineTime = Math.min(offlineTime, maxOfflineTime)
    
    if (actualOfflineTime < 60000) return 0 // Less than 1 minute, no offline gains
    
    const offlineRate = getOfflineProductionRate?.() || 0
    if (offlineRate === 0) return 0
    
    const baseProduction = gameState.autoFishRate * getAutoFishMultiplier?.() || 1
    const offlineProduction = baseProduction * offlineRate // percentage of normal production
    const offlineSeconds = actualOfflineTime / 1000
    
    return Math.floor(offlineProduction * offlineSeconds)
  }

  function applyOfflineGains() {
    const offlineGains = calculateOfflineGains()
    if (offlineGains > 0) {
      gameState.fish += offlineGains
      gameState.offlineGains = offlineGains
      console.log(`Offline gains applied: ${offlineGains} fish`)
    }
    gameState.lastOnlineTime = Date.now()
  }

  return {
    gameState,
    clicksPerSecond,
    autoFishPerSecond,
    click,
    startGame,
    pauseGame,
    resetGame,
    triggerRandomEvent,
    calculateOfflineGains,
    applyOfflineGains
  }
}