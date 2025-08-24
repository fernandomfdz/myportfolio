import { watch } from 'vue'

const SAVE_KEY = 'penguin-clicker-save'
const SAVE_VERSION = 1

export function usePersistence(gameState, prestigeState = null) {
  
  function saveGame() {
    try {
      const saveData = {
        version: SAVE_VERSION,
        timestamp: Date.now(),
        data: {
          fish: gameState.fish,
          clickPower: gameState.clickPower,
          autoFishRate: gameState.autoFishRate,
          totalClicks: gameState.totalClicks,
          gameTime: gameState.gameTime,
          upgrades: gameState.upgrades || {},
          lastOnlineTime: gameState.lastOnlineTime || Date.now(),
          paellaEndTime: gameState.paellaEndTime,
          paellaRate: gameState.paellaRate,
          prestige: prestigeState ? {
            prestigePoints: prestigeState.prestigePoints,
            totalPrestiges: prestigeState.totalPrestiges
          } : null
        }
      }
      
      localStorage.setItem(SAVE_KEY, JSON.stringify(saveData))
      return true
    } catch (error) {
      console.error('Error saving game:', error)
      return false
    }
  }

  function loadGame() {
    try {
      const savedData = localStorage.getItem(SAVE_KEY)
      if (!savedData) return false
      
      const parsedData = JSON.parse(savedData)
      
      // Version check
      if (parsedData.version !== SAVE_VERSION) {
        console.warn('Save version mismatch, starting fresh')
        return false
      }
      
      // Load data into game state
      Object.assign(gameState, parsedData.data)
      
      // Load prestige data if available
      if (prestigeState && parsedData.data.prestige) {
        Object.assign(prestigeState, parsedData.data.prestige)
      }
      
      console.log('Game loaded successfully')
      return parsedData.data
    } catch (error) {
      console.error('Error loading game:', error)
      return false
    }
  }

  function deleteSave() {
    try {
      localStorage.removeItem(SAVE_KEY)
      return true
    } catch (error) {
      console.error('Error deleting save:', error)
      return false
    }
  }

  function hasSave() {
    try {
      return localStorage.getItem(SAVE_KEY) !== null
    } catch (error) {
      return false
    }
  }

  function exportSave() {
    try {
      const saveData = localStorage.getItem(SAVE_KEY)
      if (!saveData) return null
      
      return btoa(saveData) // Base64 encode for easy sharing
    } catch (error) {
      console.error('Error exporting save:', error)
      return null
    }
  }

  function importSave(encodedSave) {
    try {
      const decodedSave = atob(encodedSave) // Base64 decode
      const parsedData = JSON.parse(decodedSave)
      
      // Validate structure
      if (!parsedData.version || !parsedData.data) {
        throw new Error('Invalid save format')
      }
      
      localStorage.setItem(SAVE_KEY, decodedSave)
      return loadGame()
    } catch (error) {
      console.error('Error importing save:', error)
      return false
    }
  }

  // Auto-save setup
  function setupAutoSave() {
    // Save every 10 seconds when game state changes
    let saveTimeout = null
    
    const saveProperties = ['fish', 'clickPower', 'autoFishRate', 'totalClicks', 'gameTime', 'upgrades', 'lastOnlineTime', 'paellaEndTime', 'paellaRate']
    
    saveProperties.forEach(prop => {
      watch(() => gameState[prop], () => {
        if (saveTimeout) clearTimeout(saveTimeout)
        saveTimeout = setTimeout(saveGame, 10000) // 10 second delay
      })
    })
    
    // Save immediately when leaving page
    window.addEventListener('beforeunload', saveGame)
    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        saveGame()
      }
    })
  }

  return {
    saveGame,
    loadGame,
    deleteSave,
    hasSave,
    exportSave,
    importSave,
    setupAutoSave
  }
}