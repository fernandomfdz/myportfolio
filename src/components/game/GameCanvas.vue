<template>
  <div class="relative w-full  flex justify-center">
    <canvas
      ref="canvas"
      :width="canvasWidth"
      :height="canvasHeight"
      class="cursor-pointer rounded-lg max-w-full touch-none"
      @click="handleClick"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
      @touchcancel="handleTouchEnd"
      :style="{ 
        width: '100%', 
        maxWidth: canvasWidth + 'px',
        height: 'auto',
        aspectRatio: canvasWidth + '/' + canvasHeight
      }"
    />
    
    <!-- Click effects container with enhanced positioning -->
    <div 
      ref="effectsContainer"
      class="absolute inset-0 pointer-events-none overflow-hidden rounded-xl"
    />
    
    <!-- Multiplier indicator -->
    <div 
      v-if="activeMultipliers.length > 0"
      class="absolute top-2 left-2 flex flex-wrap gap-1"
    >
      <div 
        v-for="multiplier in activeMultipliers"
        :key="multiplier.type"
        class="px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full"
      >
        {{ multiplier.text }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { formatClickGain } from '../../utils/game/formatters.js'

const props = defineProps({
  onPenguinClick: {
    type: Function,
    default: () => {}
  },
  clickPowerValue: {
    type: Number,
    default: 1
  },
  activeEvents: {
    type: Array,
    default: () => []
  },
  gameState: {
    type: Object,
    default: () => ({})
  },
  isFullsize: {
    type: Boolean,
    default: false
  }
})

const canvas = ref(null)
const effectsContainer = ref(null)
const ctx = ref(null)
const animationId = ref(null)

// Canvas dimensions
const canvasWidth = props.isFullsize ? 600 : 400
const canvasHeight = props.isFullsize ? 450 : 300

// Penguin state with enhanced properties
const penguin = ref({
  x: 0,
  y: 0,
  radius: 100, // Made penguin much larger
  isClicked: false,
  clickTimer: 0,
  scale: 1,
  rotation: 0,
  glowIntensity: 0.3
})

// Enhanced click effects
const clickEffects = ref([])
const nextEffectId = ref(0)

// Background particles
const backgroundParticles = ref([])
const nextParticleId = ref(0)

// Stats display and animations
const statsEffects = ref({
  fishCountGlow: 0,
  fishPerSecondGlow: 0,
  lastFishCount: 0,
  lastFishPerSecond: 0
})

// Computed properties
const isClickPowerHigh = computed(() => props.clickPowerValue > 100)

const activeMultipliers = computed(() => {
  const multipliers = []
  
  props.activeEvents.forEach(event => {
    if (event.effects.clickMultiplier) {
      multipliers.push({
        type: 'click',
        text: `${event.effects.clickMultiplier}x Clicks`
      })
    }
    if (event.effects.autoFishMultiplier) {
      multipliers.push({
        type: 'auto',
        text: `${event.effects.autoFishMultiplier}x Auto`
      })
    }
  })
  
  return multipliers
})

function drawStats() {
  if (!ctx.value) return
  
  // Update glow effects based on value changes
  const currentFish = props.gameState?.fish || 0
  const currentFishPerSecond = calculateRealFishPerSecond()
  
  // Fish count glow effect with intensity based on change magnitude
  if (currentFish > statsEffects.value.lastFishCount) {
    const fishIncrease = currentFish - statsEffects.value.lastFishCount
    statsEffects.value.fishCountGlow = Math.min(1, 0.3 + (fishIncrease / 100))
    statsEffects.value.lastFishCount = currentFish
  }
  
  // Fish per second glow effect
  if (currentFishPerSecond > statsEffects.value.lastFishPerSecond) {
    statsEffects.value.fishPerSecondGlow = 1
    statsEffects.value.lastFishPerSecond = currentFishPerSecond
  }
  
  // Smooth fade glow effects
  statsEffects.value.fishCountGlow *= 0.92
  statsEffects.value.fishPerSecondGlow *= 0.95
  
  // Minimum glow threshold
  if (statsEffects.value.fishCountGlow < 0.05) statsEffects.value.fishCountGlow = 0
  if (statsEffects.value.fishPerSecondGlow < 0.05) statsEffects.value.fishPerSecondGlow = 0
  
  ctx.value.save()
  
  // Draw fish counter
  const fishCountY = 60
  const fishCountGlow = statsEffects.value.fishCountGlow
  
  ctx.value.textAlign = 'center'
  ctx.value.textBaseline = 'middle'
  
  // Glow effect for fish counter
  if (fishCountGlow > 0.1) {
    ctx.value.shadowColor = '#3b82f6'
    ctx.value.shadowBlur = 20 * fishCountGlow
    ctx.value.shadowOffsetX = 0
    ctx.value.shadowOffsetY = 0
  }
  
  // Fish counter background
  ctx.value.fillStyle = `rgba(59, 130, 246, ${0.1 + fishCountGlow * 0.2})`
  ctx.value.beginPath()
  ctx.value.roundRect(canvasWidth/2 - 120, fishCountY - 25, 240, 50, 25)
  ctx.value.fill()
  
  // Fish counter text
  ctx.value.font = 'bold 28px Arial'
  const gradient1 = ctx.value.createLinearGradient(0, fishCountY - 20, 0, fishCountY + 20)
  gradient1.addColorStop(0, `rgba(59, 130, 246, ${1 + fishCountGlow})`)
  gradient1.addColorStop(1, `rgba(29, 78, 216, ${1 + fishCountGlow})`)
  ctx.value.fillStyle = gradient1
  ctx.value.fillText(formatNumber(currentFish) + ' 🐟', canvasWidth/2, fishCountY)
  
  // Fish per second counter
  const fpsCountY = 120
  const fpsCountGlow = statsEffects.value.fishPerSecondGlow
  
  if (fpsCountGlow > 0.1) {
    ctx.value.shadowColor = '#10b981'
    ctx.value.shadowBlur = 15 * fpsCountGlow
  }
  
  // Fish per second background
  ctx.value.fillStyle = `rgba(16, 185, 129, ${0.1 + fpsCountGlow * 0.2})`
  ctx.value.beginPath()
  ctx.value.roundRect(canvasWidth/2 - 100, fpsCountY - 20, 200, 40, 20)
  ctx.value.fill()
  
  // Fish per second text
  ctx.value.font = 'bold 18px Arial'
  const gradient2 = ctx.value.createLinearGradient(0, fpsCountY - 10, 0, fpsCountY + 10)
  gradient2.addColorStop(0, `rgba(16, 185, 129, ${1 + fpsCountGlow})`)
  gradient2.addColorStop(1, `rgba(5, 150, 105, ${1 + fpsCountGlow})`)
  ctx.value.fillStyle = gradient2
  ctx.value.fillText('per second: ' + formatNumber(currentFishPerSecond), canvasWidth/2, fpsCountY)
  
  ctx.value.restore()
}

function calculateRealFishPerSecond() {
  // Calculate based on current auto fish rate and other multipliers
  const baseRate = props.gameState?.autoFishRate || 0
  // Note: This is a simplified calculation - the actual multipliers are applied in the game loop
  return baseRate
}

function formatNumber(num) {
  if (num < 1000) return Math.floor(num).toString()
  if (num < 1000000) return (num / 1000).toFixed(1) + 'K'
  if (num < 1000000000) return (num / 1000000).toFixed(1) + 'M'
  if (num < 1000000000000) return (num / 1000000000).toFixed(1) + 'B'
  return (num / 1000000000000).toFixed(1) + 'T'
}

function drawPenguin() {
  if (!ctx.value) return

  const p = penguin.value
  const baseScale = 1.8 // Made penguin much bigger overall
  const clickScale = p.isClicked ? 1.2 : 1
  const powerScale = Math.min(1 + props.clickPowerValue / 1000, 2) // Scales with click power
  const finalScale = baseScale * clickScale * powerScale * p.scale
  
  ctx.value.save()
  ctx.value.translate(p.x, p.y)
  ctx.value.scale(finalScale, finalScale)
  ctx.value.rotate(p.rotation)
  
  // Glow effect for high click power
  if (props.clickPowerValue > 50) {
    ctx.value.shadowColor = '#60A5FA'
    ctx.value.shadowBlur = p.glowIntensity * (props.clickPowerValue / 100)
    ctx.value.shadowOffsetX = 0
    ctx.value.shadowOffsetY = 0
  }
  
  // Penguin body with gradient - made larger
  const bodyGradient = ctx.value.createRadialGradient(-15, -15, 0, 0, 0, 50)
  bodyGradient.addColorStop(0, '#1F2937') // Darker center
  bodyGradient.addColorStop(1, '#374151') // Lighter edge
  ctx.value.fillStyle = bodyGradient
  ctx.value.beginPath()
  ctx.value.ellipse(0, 0, 45, 60, 0, 0, Math.PI * 2)
  ctx.value.fill()
  
  // Penguin belly with gradient - made larger
  const bellyGradient = ctx.value.createRadialGradient(0, 0, 0, 0, 8, 40)
  bellyGradient.addColorStop(0, '#FFFFFF')
  bellyGradient.addColorStop(1, '#F3F4F6')
  ctx.value.fillStyle = bellyGradient
  ctx.value.beginPath()
  ctx.value.ellipse(0, 8, 30, 45, 0, 0, Math.PI * 2)
  ctx.value.fill()
  
  // Penguin beak with shine - made larger
  const beakGradient = ctx.value.createRadialGradient(-3, -18, 0, 0, -15, 12)
  beakGradient.addColorStop(0, '#F59E0B')
  beakGradient.addColorStop(1, '#D97706')
  ctx.value.fillStyle = beakGradient
  ctx.value.beginPath()
  ctx.value.ellipse(0, -15, 12, 8, 0, 0, Math.PI * 2)
  ctx.value.fill()
  
  // Penguin eyes with shine - made larger
  ctx.value.fillStyle = '#000000'
  ctx.value.beginPath()
  ctx.value.arc(-12, -22, 6, 0, Math.PI * 2)
  ctx.value.arc(12, -22, 6, 0, Math.PI * 2)
  ctx.value.fill()
  
  // Eye shine - made larger
  ctx.value.fillStyle = '#FFFFFF'
  ctx.value.beginPath()
  ctx.value.arc(-9, -25, 2.5, 0, Math.PI * 2)
  ctx.value.arc(15, -25, 2.5, 0, Math.PI * 2)
  ctx.value.fill()
  
  // Special effects based on click power
  if (props.clickPowerValue > 1000) {
    // Crown for high click power
    ctx.value.fillStyle = '#EAB308'
    ctx.value.beginPath()
    ctx.value.moveTo(-15, -25)
    ctx.value.lineTo(-5, -35)
    ctx.value.lineTo(0, -30)
    ctx.value.lineTo(5, -35)
    ctx.value.lineTo(15, -25)
    ctx.value.closePath()
    ctx.value.fill()
    
    // Crown gems
    ctx.value.fillStyle = '#DC2626'
    ctx.value.beginPath()
    ctx.value.arc(-10, -28, 2, 0, Math.PI * 2)
    ctx.value.arc(0, -32, 2, 0, Math.PI * 2)
    ctx.value.arc(10, -28, 2, 0, Math.PI * 2)
    ctx.value.fill()
  }
  
  ctx.value.restore()
}

function drawClickEffects() {
  if (!ctx.value) return
  
  clickEffects.value = clickEffects.value.filter(effect => {
    effect.y -= effect.velocity
    effect.scale += effect.scaleGrowth
    effect.opacity -= effect.fadeRate
    effect.rotation += effect.rotationSpeed
    
    if (effect.opacity <= 0) return false
    
    ctx.value.save()
    ctx.value.globalAlpha = effect.opacity
    ctx.value.translate(effect.x, effect.y)
    ctx.value.scale(effect.scale, effect.scale)
    ctx.value.rotate(effect.rotation)
    
    // Shadow for dramatic effect
    ctx.value.shadowColor = effect.color
    ctx.value.shadowBlur = 10 * effect.opacity
    ctx.value.shadowOffsetX = 0
    ctx.value.shadowOffsetY = 0
    
    ctx.value.fillStyle = effect.color
    ctx.value.strokeStyle = '#FFFFFF'
    ctx.value.lineWidth = 2
    ctx.value.font = `bold ${effect.fontSize}px Arial`
    ctx.value.textAlign = 'center'
    ctx.value.textBaseline = 'middle'
    
    // Text with outline
    ctx.value.strokeText(effect.text, 0, 0)
    ctx.value.fillText(effect.text, 0, 0)
    
    ctx.value.restore()
    
    return true
  })
}

function animate() {
  if (!ctx.value) return
  
  // Clear canvas with subtle background effect
  ctx.value.clearRect(0, 0, canvasWidth, canvasHeight)
  
  // Draw animated background
  drawBackground()
  
  // Update penguin animations
  updatePenguinAnimation()
  
  // Draw everything
  //drawStats()
  drawPenguin()
  drawClickEffects()
  
  animationId.value = requestAnimationFrame(animate)
}

function drawBackground() {
  // Subtle animated background based on click power
  const intensity = Math.min(props.clickPowerValue / 1000, 1)
  if (intensity > 0.1) {
    const time = Date.now() / 1000
    const wave1 = Math.sin(time) * 0.1 * intensity
    const wave2 = Math.cos(time * 1.5) * 0.1 * intensity
    
    const gradient = ctx.value.createRadialGradient(
      canvasWidth/2 + wave1 * 50, canvasHeight/2 + wave2 * 50, 0,
      canvasWidth/2, canvasHeight/2, Math.max(canvasWidth, canvasHeight)
    )
    
    gradient.addColorStop(0, `rgba(96, 165, 250, ${intensity * 0.1})`)
    gradient.addColorStop(1, `rgba(96, 165, 250, 0)`)
    
    ctx.value.fillStyle = gradient
    ctx.value.fillRect(0, 0, canvasWidth, canvasHeight)
  }
}

function updatePenguinAnimation() {
  const p = penguin.value
  
  // Click animation
  if (p.isClicked) {
    p.clickTimer++
    if (p.clickTimer > 15) {
      p.isClicked = false
      p.clickTimer = 0
      p.scale = 1
    } else {
      // Smooth scale animation
      const progress = p.clickTimer / 15
      p.scale = 1 + Math.sin(progress * Math.PI) * 0.2
    }
  }
  
  // Idle breathing animation
  if (!p.isClicked) {
    const time = Date.now() / 1000
    p.scale = 1 + Math.sin(time * 2) * 0.02 // Gentle breathing
    p.rotation = Math.sin(time * 0.5) * 0.02 // Slight sway
  }
  
  // Glow animation
  p.glowIntensity = 0.3 + Math.sin(Date.now() / 500) * 0.2
}

// Variables para gestión de touch
let touchStartTime = 0
let hasTouchMoved = false

function getEventCoordinates(event) {
  const rect = canvas.value.getBoundingClientRect()
  let clientX, clientY
  
  if (event.touches && event.touches.length > 0) {
    // Touch event
    clientX = event.touches[0].clientX
    clientY = event.touches[0].clientY
  } else if (event.changedTouches && event.changedTouches.length > 0) {
    // Touch end event
    clientX = event.changedTouches[0].clientX
    clientY = event.changedTouches[0].clientY
  } else {
    // Mouse event
    clientX = event.clientX
    clientY = event.clientY
  }
  
  const x = (clientX - rect.left) * (canvasWidth / rect.width)
  const y = (clientY - rect.top) * (canvasHeight / rect.height)
  
  return { x, y }
}

function handleTouchStart(event) {
  event.preventDefault()
  touchStartTime = Date.now()
  hasTouchMoved = false
  
  const { x, y } = getEventCoordinates(event)
  
  // Check if touch is on penguin immediately for visual feedback
  const p = penguin.value
  const distance = Math.sqrt((x - p.x) ** 2 + (y - p.y) ** 2)
  
  if (distance <= p.radius * 2) {
    // Start visual feedback immediately
    penguin.value.isClicked = true
    penguin.value.clickTimer = 0
  }
}

function handleTouchMove(event) {
  // Mark that touch has moved to prevent accidental clicks
  hasTouchMoved = true
}

function handleTouchEnd(event) {
  event.preventDefault()
  
  const touchDuration = Date.now() - touchStartTime
  
  // Only trigger click if it was a short touch (< 500ms) and no significant movement
  if (touchDuration < 500 && !hasTouchMoved) {
    const { x, y } = getEventCoordinates(event)
    processClick(x, y)
  }
}

function handleClick(event) {
  const { x, y } = getEventCoordinates(event)
  processClick(x, y)
}

function processClick(x, y) {
  // Check if click is on penguin
  const p = penguin.value
  const distance = Math.sqrt((x - p.x) ** 2 + (y - p.y) ** 2)
  
  if (distance <= p.radius * 2) { // Larger hit area for bigger penguin
    // Trigger click animation
    penguin.value.isClicked = true
    penguin.value.clickTimer = 0
    
    // Call parent click handler and get actual fish gained
    const fishGained = props.onPenguinClick()
    
    // Create spectacular click effect
    createClickEffect(p.x, p.y - 30, fishGained || props.clickPowerValue)
    
    // Create particle burst for high values
    if (props.clickPowerValue > 100) {
      createParticleBurst(p.x, p.y)
    }
  }
}

function createClickEffect(x, y, value) {
  const effect = {
    id: nextEffectId.value++,
    x,
    y,
    text: formatClickGain(value),
    fontSize: Math.min(20 + Math.log10(value) * 5, 40),
    color: getClickEffectColor(value),
    opacity: 1,
    scale: 0.5,
    scaleGrowth: 0.02,
    velocity: 1.5 + Math.random() * 1,
    fadeRate: 0.015,
    rotation: 0,
    rotationSpeed: (Math.random() - 0.5) * 0.1
  }
  
  clickEffects.value.push(effect)
}

function getClickEffectColor(value) {
  if (value >= 10000) return '#DC2626' // Red for massive values
  if (value >= 1000) return '#7C3AED' // Purple for high values
  if (value >= 100) return '#2563EB' // Blue for good values
  if (value >= 10) return '#059669' // Green for decent values
  return '#48BB78' // Light green for small values
}

function createParticleBurst(x, y) {
  const particleCount = Math.min(Math.floor(props.clickPowerValue / 100), 12)
  
  for (let i = 0; i < particleCount; i++) {
    const angle = (Math.PI * 2 * i) / particleCount
    const velocity = 2 + Math.random() * 3
    
    clickEffects.value.push({
      id: nextEffectId.value++,
      x: x + Math.cos(angle) * 20,
      y: y + Math.sin(angle) * 20,
      text: '✨',
      fontSize: 16,
      color: '#F59E0B',
      opacity: 1,
      scale: 1,
      scaleGrowth: -0.01,
      velocity: velocity,
      fadeRate: 0.03,
      rotation: 0,
      rotationSpeed: (Math.random() - 0.5) * 0.3
    })
  }
}

function initBackgroundParticles() {
  backgroundParticles.value = []
  for (let i = 0; i < 15; i++) {
    backgroundParticles.value.push({
      id: nextParticleId.value++,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 3 + Math.random() * 4
    })
  }
}

onMounted(() => {
  if (canvas.value) {
    ctx.value = canvas.value.getContext('2d')
    // Initialize penguin position based on canvas size - moved down to accommodate stats
    penguin.value.x = canvasWidth / 2
    penguin.value.y = canvasHeight / 2 + 60  // Moved down to make room for stats above
    initBackgroundParticles()
    animate()
  }
})

onUnmounted(() => {
  if (animationId.value) {
    cancelAnimationFrame(animationId.value)
  }
})
</script>

<style scoped>
@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
    opacity: 0;
  }
  10%, 90% {
    opacity: 1;
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
  }
}

.animate-float {
  animation: float linear infinite;
}

@keyframes glow {
  0%, 100% {
    box-shadow: 0 0 5px rgba(59, 130, 246, 0.3);
  }
  50% {
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.8);
  }
}

.animate-glow {
  animation: glow 2s ease-in-out infinite;
}
</style>