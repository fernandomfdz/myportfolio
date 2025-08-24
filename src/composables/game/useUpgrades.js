import { reactive, computed } from 'vue'
import { UPGRADES, UPGRADE_EFFECTS } from '../../utils/game/gameConstants.js'

const upgradeStates = reactive({})

// Initialize all upgrades
Object.keys(UPGRADES).forEach(id => {
  upgradeStates[id] = {
    level: 0,
    totalPurchased: 0
  }
})

export function useUpgrades(gameState) {
  
  const availableUpgrades = computed(() => {
    return Object.entries(UPGRADES)
      .filter(([id, upgrade]) => {
        // Only show non-prestige upgrades (regular upgrades)
        return !upgrade.currency && gameState.fish >= upgrade.unlockRequirement
      })
      .map(([id, upgrade]) => {
        const currentLevel = upgradeStates[id].level
        const currentCost = calculateUpgradeCost(id, currentLevel)
        const canAfford = gameState.fish >= currentCost
        const isMaxLevel = currentLevel >= upgrade.maxLevel
        
        return {
          ...upgrade,
          currentLevel,
          currentCost,
          canAfford,
          isMaxLevel,
          effectDescription: UPGRADE_EFFECTS[upgrade.effect]
        }
      })
      .sort((a, b) => a.unlockRequirement - b.unlockRequirement)
  })

  const availablePrestigeUpgrades = computed(() => {
    return Object.entries(UPGRADES)
      .filter(([id, upgrade]) => {
        // Only show prestige upgrades and only after first prestige
        return upgrade.currency === 'prestige' && gameState.prestigePoints !== undefined
      })
      .map(([id, upgrade]) => {
        const currentLevel = upgradeStates[id].level
        const currentCost = calculateUpgradeCost(id, currentLevel)
        const canAfford = gameState.prestigePoints >= currentCost
        const isMaxLevel = currentLevel >= upgrade.maxLevel
        
        return {
          ...upgrade,
          currentLevel,
          currentCost,
          canAfford,
          isMaxLevel,
          effectDescription: UPGRADE_EFFECTS[upgrade.effect],
          currency: 'prestige'
        }
      })
      .sort((a, b) => a.unlockRequirement - b.unlockRequirement)
  })

  function calculateUpgradeCost(upgradeId, level) {
    const upgrade = UPGRADES[upgradeId]
    return Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, level))
  }

  function purchaseUpgrade(upgradeId) {
    const upgrade = UPGRADES[upgradeId]
    const currentLevel = upgradeStates[upgradeId].level
    const cost = calculateUpgradeCost(upgradeId, currentLevel)
    const isPrestigeUpgrade = upgrade.currency === 'prestige'
    
    // Validation checks
    if (currentLevel >= upgrade.maxLevel) {
      console.warn(`Upgrade ${upgradeId} is already at max level`)
      return false
    }
    
    // Check currency availability
    if (isPrestigeUpgrade) {
      if (!gameState.prestigePoints || gameState.prestigePoints < cost) {
        console.warn(`Not enough prestige points to purchase ${upgradeId}`)
        return false
      }
    } else {
      if (gameState.fish < cost) {
        console.warn(`Not enough fish to purchase ${upgradeId}`)
        return false
      }
      
      if (gameState.fish < upgrade.unlockRequirement) {
        console.warn(`Upgrade ${upgradeId} is not unlocked yet`)
        return false
      }
    }
    
    // Purchase the upgrade
    if (isPrestigeUpgrade) {
      gameState.prestigePoints -= cost
    } else {
      gameState.fish -= cost
    }
    
    upgradeStates[upgradeId].level++
    upgradeStates[upgradeId].totalPurchased++
    
    // Apply the upgrade effect
    applyUpgradeEffect(upgradeId, upgrade)
    
    console.log(`Purchased ${upgrade.name} level ${upgradeStates[upgradeId].level}`)
    return true
  }

  function applyUpgradeEffect(upgradeId, upgrade) {
    const level = upgradeStates[upgradeId].level
    
    switch (upgrade.effect) {
      case 'autoFish':
        gameState.autoFishRate += upgrade.value
        break
        
      case 'clickMultiplier':
        recalculateClickPower()
        break
        
      case 'doubleClickChance':
        // Handled in click function
        break
        
      case 'penguinBonus':
        recalculateClickPower()
        break
        
      case 'autoFishMultiplier':
        // Applied in game loop calculation
        break
        
      case 'offlineProduction':
        // Applied when calculating offline gains
        break
        
      case 'clickBurst':
        // Applied in click function
        break
        
      case 'aiOptimization':
        // Applied globally to all production
        break
        
      case 'socialBonus':
        recalculateClickPower()
        break
        
      case 'inspirationBonus':
        // Applied as global multiplier
        break
        
      case 'paellaProduction':
        // Handled as special timed effect
        break
        
      case 'autoclicker':
        // Handled in game loop
        break
        
      case 'timeAcceleration':
        // Special effect handled separately
        break
        
      case 'quantumMultiplier':
        // Global production doubler
        break
        
      case 'prestigeMultiplier':
        // Applied from prestige points
        break
        
      case 'diversityBonus':
        // Applied based on upgrade diversity
        break
    }
  }

  function recalculateClickPower() {
    let clickPower = 1 // Base click power
    
    // Apply click multipliers
    const cssClipperLevel = upgradeStates.cssClipper?.level || 0
    const reactHooksLevel = upgradeStates.reactHooks?.level || 0
    
    if (cssClipperLevel > 0) {
      clickPower *= Math.pow(UPGRADES.cssClipper.value, cssClipperLevel)
    }
    
    if (reactHooksLevel > 0) {
      clickPower *= Math.pow(UPGRADES.reactHooks.value, reactHooksLevel)
    }
    
    // Apply penguin bonus
    const vueFlowLevel = upgradeStates.vueFlow?.level || 0
    const miniPenguinLevel = upgradeStates.miniPenguin?.level || 0
    
    if (vueFlowLevel > 0 && miniPenguinLevel > 0) {
      clickPower += vueFlowLevel * UPGRADES.vueFlow.value * miniPenguinLevel
    }
    
    // Apply social bonus (Club Trecera)
    const clubTreceraLevel = upgradeStates.clubTrecera?.level || 0
    if (clubTreceraLevel > 0) {
      clickPower += clubTreceraLevel * UPGRADES.clubTrecera.value
    }
    
    // Apply inspiration bonus (pacosarabia.com)
    const pacosarabiaLevel = upgradeStates.pacosarabia?.level || 0
    if (pacosarabiaLevel > 0) {
      const totalUpgrades = getTotalUpgradesPurchased()
      clickPower *= (1 + (pacosarabiaLevel * UPGRADES.pacosarabia.value * totalUpgrades))
    }
    
    // Apply quantum multiplier
    const quantumLevel = upgradeStates.quantumPenguin?.level || 0
    if (quantumLevel > 0) {
      clickPower *= Math.pow(UPGRADES.quantumPenguin.value, quantumLevel)
    }
    
    gameState.clickPower = Math.floor(clickPower)
  }

  function getDoubleClickChance() {
    const jsSeedLevel = upgradeStates.jsSeed?.level || 0
    return jsSeedLevel * UPGRADES.jsSeed.value
  }

  function getClickBurstChance() {
    const dashboardLevel = upgradeStates.minderestDashboard?.level || 0
    return dashboardLevel * UPGRADES.minderestDashboard.value
  }

  function getAutoFishMultiplier() {
    let multiplier = 1
    
    // Minderest Website multiplier
    const websiteLevel = upgradeStates.minderestWebsite?.level || 0
    if (websiteLevel > 0) {
      multiplier *= Math.pow(UPGRADES.minderestWebsite.value, websiteLevel)
    }
    
    // AI Optimization
    const aiLevel = upgradeStates.aiCompetitive?.level || 0
    if (aiLevel > 0) {
      multiplier *= Math.pow(UPGRADES.aiCompetitive.value, aiLevel)
    }
    
    // Quantum multiplier
    const quantumLevel = upgradeStates.quantumPenguin?.level || 0
    if (quantumLevel > 0) {
      multiplier *= Math.pow(UPGRADES.quantumPenguin.value, quantumLevel)
    }
    
    return multiplier
  }

  function getOfflineProductionRate() {
    const msInvsLevel = upgradeStates.msInvsApp?.level || 0
    return msInvsLevel * UPGRADES.msInvsApp.value // 10% per level
  }

  function getAutoClickerRate() {
    const goldenCursorLevel = upgradeStates.goldenCursor?.level || 0
    if (goldenCursorLevel === 0) return 0
    
    // Base: click every 5 seconds, improves with level
    return 5000 / goldenCursorLevel // milliseconds between clicks
  }

  function isPaellaActive() {
    // Check if paella effect is currently active (implemented in game state)
    return gameState.paellaEndTime && Date.now() < gameState.paellaEndTime
  }

  function activatePaellaEffect() {
    const paellaLevel = upgradeStates.misterPaella?.level || 0
    if (paellaLevel > 0) {
      // 5 minutes of +50/s per level
      const duration = 5 * 60 * 1000 // 5 minutes
      gameState.paellaEndTime = Date.now() + duration
      gameState.paellaRate = paellaLevel * UPGRADES.misterPaella.value
      
      // Create special paella event
      createSpecialEvent('paellaBonus', {
        name: '🥘 Paella Power!',
        description: `+${gameState.paellaRate}/s for 5 minutes!`,
        duration: duration,
        effects: {
          autoFishMultiplier: 2,
          fishBonus: gameState.paellaRate
        }
      })
    }
  }

  function createSpecialEvent(type, config) {
    const event = {
      id: 'special_' + Date.now(),
      type: type,
      name: config.name,
      description: config.description,
      startTime: Date.now(),
      endTime: Date.now() + config.duration,
      effects: config.effects
    }
    
    if (!gameState.activeEvents) {
      gameState.activeEvents = []
    }
    
    gameState.activeEvents.push(event)
  }

  function activateSpecialUpgradeEffect(upgradeId) {
    switch (upgradeId) {
      case 'goldenCursor':
        createSpecialEvent('goldenCursor', {
          name: '✨ Golden Cursor!',
          description: 'Super clicks activated!',
          duration: 30 * 1000, // 30 seconds
          effects: {
            clickMultiplier: 5,
            doubleClickChance: 0.5
          }
        })
        break
        
      case 'fishingBot':
        createSpecialEvent('fishingBot', {
          name: '🤖 Fishing Bot Online!',
          description: 'Autonomous fishing enabled!',
          duration: 2 * 60 * 1000, // 2 minutes
          effects: {
            autoFishMultiplier: 3,
            allProductionBonus: 1.5
          }
        })
        break
        
      case 'deploymentPipeline':
        createSpecialEvent('deployment', {
          name: '🚀 Deployment Success!',
          description: 'CI/CD pipeline working perfectly!',
          duration: 60 * 1000, // 1 minute
          effects: {
            allProductionBonus: 2,
            fishBonus: 100
          }
        })
        break
        
      case 'hackathonHustle':
        createSpecialEvent('hackathon', {
          name: '💻 Hackathon Mode!',
          description: 'Coding at light speed!',
          duration: 90 * 1000, // 1.5 minutes
          effects: {
            clickMultiplier: 3,
            autoFishMultiplier: 2
          }
        })
        break
    }
  }

  function getUpgradeLevel(upgradeId) {
    return upgradeStates[upgradeId]?.level || 0
  }

  function getTotalUpgradesPurchased() {
    return Object.values(upgradeStates).reduce((total, state) => total + state.totalPurchased, 0)
  }

  function getUpgradeDiversity() {
    // Count different types of upgrades owned
    const ownedTypes = new Set()
    Object.entries(upgradeStates).forEach(([id, state]) => {
      if (state.level > 0) {
        ownedTypes.add(UPGRADES[id].effect)
      }
    })
    return ownedTypes.size
  }

  // Load upgrade states from save data
  function loadUpgradeStates(savedUpgrades) {
    if (!savedUpgrades) return
    
    Object.keys(savedUpgrades).forEach(id => {
      if (upgradeStates[id]) {
        upgradeStates[id] = { ...savedUpgrades[id] }
        
        // Reapply effects
        const upgrade = UPGRADES[id]
        for (let i = 0; i < upgradeStates[id].level; i++) {
          applyUpgradeEffect(id, upgrade)
        }
      }
    })
    
    // Recalculate click power after loading
    recalculateClickPower()
  }

  // Get upgrade states for saving
  function getUpgradeStates() {
    return { ...upgradeStates }
  }

  // Reset all upgrades (for prestige)
  function resetUpgrades() {
    Object.keys(upgradeStates).forEach(id => {
      upgradeStates[id] = { level: 0, totalPurchased: 0 }
    })
    // Reset game state upgrades
    gameState.autoFishRate = 0
    gameState.clickPower = 1
  }

  return {
    availableUpgrades,
    availablePrestigeUpgrades,
    upgradeStates,
    purchaseUpgrade,
    getDoubleClickChance,
    getClickBurstChance,
    getAutoFishMultiplier,
    getOfflineProductionRate,
    getAutoClickerRate,
    isPaellaActive,
    activatePaellaEffect,
    activateSpecialUpgradeEffect,
    getUpgradeLevel,
    getTotalUpgradesPurchased,
    getUpgradeDiversity,
    loadUpgradeStates,
    getUpgradeStates,
    resetUpgrades,
    recalculateClickPower
  }
}