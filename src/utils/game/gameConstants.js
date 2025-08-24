// Game constants and upgrade definitions

export const UPGRADES = {
  // Fase 1: El despertar (0-15 min) - Primera auto-fish muy cara
  miniPenguin: {
    "id": "miniPenguin",
    "name": "Mini UI Kit",
    "description": "Un pequeño ayudante que genera peces automáticamente",
    "baseCost": 50,
    "effect": "autoFish",
    "value": 0.33,
    "maxLevel": 15,
    "costMultiplier": 2,
    "icon": "🐧",
    "unlockRequirement": 0
  },
  
  cssClipper: {
    "id": "cssClipper",
    "name": "TailwindCSS Army",
    "description": "Dobla el poder de tus clicks con CSS mágico",
    "baseCost": 200,
    "effect": "clickMultiplier",
    "value": 2,
    "maxLevel": 8,
    "costMultiplier": 3,
    "icon": "🎨",
    "unlockRequirement": 100
  },
  
  jsSeed: {
    "id": "jsSeed",
    "name": "JS Seed",
    "description": "Oportunidad de conseguir peces extra por click",
    "baseCost": 400,
    "effect": "doubleClickChance",
    "value": 0.1,
    "maxLevel": 6,
    "costMultiplier": 2.5,
    "icon": "⚡",
    "unlockRequirement": 300
  },

  // Fase 2: Escalando proyectos (15-30 min) - Mucho más caro
  dolphinHelper: {
    "id": "dolphinHelper",
    "name": "Design System",
    "description": "Un sistema de diseño completo que genera 2,5 peces por segundo",
    "baseCost": 6000,
    "effect": "autoFish",
    "value": 2.5,
    "maxLevel": 10,
    "costMultiplier": 2.8,
    "icon": "🐬",
    "unlockRequirement": 1000
  },
  
  reactHooks: {
    "id": "reactHooks",
    "name": "Vue Composables",
    "description": "Los composables de Vue triplican tu poder de click",
    "baseCost": 20000,
    "effect": "clickMultiplier",
    "value": 3,
    "maxLevel": 4,
    "costMultiplier": 5,
    "icon": "⚛️",
    "unlockRequirement": 3000
  },
  
  vueFlow: {
    "id": "vueFlow",
    "name": "Vue Flow",
    "description": "Cada Mini Penguin da +1 click power extra",
    "baseCost": 40000,
    "effect": "penguinBonus",
    "value": 1,
    "maxLevel": 4,
    "costMultiplier": 3.5,
    "icon": "💚",
    "unlockRequirement": 5000
  },

  // Fase 3: Portfolio Profesional (30-60 min) - Extremadamente caro
  insiteChrome: {
    "id": "insiteChrome",
    "name": "InSite Chrome Extension",
    "description": "Analiza la competencia automáticamente y genera peces por insights",
    "baseCost": 150000,
    "effect": "autoFish",
    "value": 10,
    "maxLevel": 6,
    "costMultiplier": 3.5,
    "icon": "🔍",
    "unlockRequirement": 20000
  },

  minderestWebsite: {
    "id": "minderestWebsite",
    "name": "Minderest Website",
    "description": "El sitio corporativo multiplica todos los auto-generators",
    "baseCost": 500000,
    "effect": "autoFishMultiplier",
    "value": 1.5,
    "maxLevel": 3,
    "costMultiplier": 6,
    "icon": "🌐",
    "unlockRequirement": 50000
  },

  msInvsApp: {
    "id": "msInvsApp",
    "name": "MsInvs Mobile App",
    "description": "App multiplataforma que genera peces incluso offline",
    "baseCost": 400000,
    "effect": "offlineProduction",
    "value": 0.15,
    "maxLevel": 8,
    "costMultiplier": 2.8,
    "icon": "📱",
    "unlockRequirement": 30000
  },

  minderestDashboard: {
    "id": "minderestDashboard",
    "name": "Analytics Dashboard",
    "description": "Cada click tiene chance de generar un burst de peces",
    "baseCost": 900000,
    "effect": "clickBurst",
    "value": 0.05,
    "maxLevel": 5,
    "costMultiplier": 4,
    "icon": "📊",
    "unlockRequirement": 75000
  },

  aiCompetitive: {
    "id": "aiCompetitive",
    "name": "AI Competitive Engine",
    "description": "IA que optimiza automáticamente tu producción de peces",
    "baseCost": 2500000,
    "effect": "aiOptimization",
    "value": 1.25,
    "maxLevel": 3,
    "costMultiplier": 6,
    "icon": "🤖",
    "unlockRequirement": 150000
  },

  // Fase 4: Side Projects & Personal (60-120 min) - Súper caro
  clubTrecera: {
    "id": "clubTrecera",
    "name": "Club Trecera Platform",
    "description": "Plataforma social que genera peces por interacciones",
    "baseCost": 5000000,
    "effect": "socialBonus",
    "value": 2,
    "maxLevel": 6,
    "costMultiplier": 5,
    "icon": "⚽",
    "unlockRequirement": 300000
  },

  pacosarabia: {
    "id": "pacosarabia",
    "name": "pacosarabia.com",
    "description": "Web personal que inspira a otros desarrolladores",
    "baseCost": 1500000,
    "effect": "inspirationBonus",
    "value": 0.02,
    "maxLevel": 5,
    "costMultiplier": 5,
    "icon": "✨",
    "unlockRequirement": 200000
  },

  misterPaella: {
    "id": "misterPaella",
    "name": "MisterPaella.es",
    "description": "La web de papá cocina peces automáticamente",
    "baseCost": 4000000,
    "effect": "paellaProduction",
    "value": 50,
    "maxLevel": 3,
    "costMultiplier": 12,
    "icon": "🥘",
    "unlockRequirement": 500000
  },

  // Fase 5: Upgrades de Cookie Clicker Style (120+ min) - Requiere mucho tiempo
  goldenCursor: {
   "id": "goldenCursor",
   "name": "Golden Cursor",
   "description": "Clicks automáticos cada 5 segundos",
   "baseCost": 10000000,
   "effect": "autoclicker",
   "value": 5,
   "maxLevel": 10,
   "costMultiplier": 6,
   "icon": "👆",
   "unlockRequirement": 1000000
  },

  fishFactory: {
    "id": "fishFactory",
    "name": "Fish Factory",
    "description": "Factoría industrial de peces",
    "baseCost": 25000000,
    "effect": "autoFish",
    "value": 200,
    "maxLevel": 15,
    "costMultiplier": 2.5,
    "icon": "🏭",
    "unlockRequirement": 5000000
  },

  timeWarp: {
    "id": "timeWarp",
    "name": "Time Warp Engine",
    "description": "Acelera toda la producción temporalmente",
    "baseCost": 100000000,
    "effect": "timeAcceleration",
    "value": 2,
    "maxLevel": 3,
    "costMultiplier": 25,
    "icon": "⏰",
    "unlockRequirement": 25000000
  },

  quantumPenguin: {
    "id": "quantumPenguin",
    "name": "Quantum Penguin",
    "description": "Pingüino cuántico que existe en múltiples realidades",
    "baseCost": 2000000000,
    "effect": "quantumMultiplier",
    "value": 2,
    "maxLevel": 1,
    "costMultiplier": 1,
    "icon": "🌌",
    "unlockRequirement": 500000000
  },

  // Prestige/Ascension Upgrades
  ancientKnowledge: {
    "id": "ancientKnowledge",
    "name": "Coding Knowledge",
    "description": "Comienza a acumular puntos de prestigio gracias a tus proyectos anteriores",
    "baseCost": 100,
    "effect": "prestigeMultiplier",
    "value": 0.05,
    "maxLevel": 100,
    "costMultiplier": 1,
    "icon": "📜",
    "unlockRequirement": 0,
    "currency": "prestige"
  },

  portfolioDiversity: {
    "id": "portfolioDiversity",
    "name": "Portfolio Diversity",
    "description": "Cuantos más proyectos, más eficiencia",
    "baseCost": 5,
    "effect": "diversityBonus",
    "value": 0.1,
    "maxLevel": 20,
    "costMultiplier": 1.3,
    "icon": "🎯",
    "unlockRequirement": 0,
    "currency": "prestige"
  }
}

export const UPGRADE_EFFECTS = {
  autoFish: 'Genera peces automáticamente',
  clickMultiplier: 'Multiplica el poder de click',
  doubleClickChance: 'Probabilidad de peces extra',
  penguinBonus: 'Bonus por Mini Penguins',
  autoFishMultiplier: 'Multiplica auto-generadores',
  offlineProduction: 'Genera peces offline',
  clickBurst: 'Chance de burst de peces',
  aiOptimization: 'Optimiza toda la producción',
  socialBonus: 'Bonus por interacciones',
  inspirationBonus: 'Bonus por upgrades totales',
  paellaProduction: 'Cocina peces temporalmente',
  autoclicker: 'Clicks automáticos',
  timeAcceleration: 'Acelera tiempo',
  quantumMultiplier: 'Dobla toda la producción',
  prestigeMultiplier: 'Multiplica por prestigio',
  diversityBonus: 'Bonus por diversidad'
}

export const ACHIEVEMENT_REQUIREMENTS = {
  frontendPioneer: 1000,
  designSystemArchitect: 5000,
  fullstackMindset: 25000,
  chefSupremo: 100000,
  portfolioMaster: 500000,
  quantumDeveloper: 10000000
}

export const GAME_BALANCE = {
  baseClickPower: 1,
  autoSaveInterval: 10000, // 10 seconds
  gameLoopInterval: 100, // 100ms
  maxClickEffects: 20,
  prestigeRequirement: 1000000, // 1M fish to prestige
  goldenCookieChance: 0.001, // 0.1% chance per game loop
  goldenCookieValue: 1000, // Base golden cookie value
  offlineTimeLimit: 86400000 // 24 hours max offline time
}

export const SPECIAL_EVENTS = {
  goldenFish: {
    name: 'Nuevo framework de Javascript',
    icon: '🌟🐟',
    chance: 0.0005,
    duration: 10000, // 10 seconds
    effects: {
      fishBonus: 1000,
      clickMultiplier: 10
    }
  },
  
  hackathon: {
    name: 'Nuevo modelo de IA',
    icon: '💻🚀',
    chance: 0.0002,
    duration: 30000, // 30 seconds
    effects: {
      autoFishMultiplier: 2,
      clickMultiplier: 5
    }
  },
  
  deploymentBonus: {
    name: 'Nuevo framework de CSS',
    icon: '🚀✨',
    chance: 0.0003,
    duration: 15000, // 15 seconds
    effects: {
      allProductionBonus: 1.5
    }
  }
}