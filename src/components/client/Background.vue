<template>
<div ref="el" class="background-test"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const el = ref(null)

// Variables para el giroscopio
let gyroX = 0
let gyroY = 0

// Función para actualizar las propiedades CSS
const updatePosition = (x, y) => {
  if (el.value) {
    el.value.style.setProperty('--posX', x);
    el.value.style.setProperty('--posY', y);
  }
}

// Manejador de movimiento del mouse/touch
const handlePointerMove = (e) => {
  const { clientX: x, clientY: y } = e;
  updatePosition(x, y);
}

// Manejador del giroscopio
const handleDeviceOrientation = (e) => {
  // Convertir los valores del giroscopio a coordenadas de pantalla
  // beta: inclinación frontal-trasera (-180 a 180)
  // gamma: inclinación izquierda-derecha (-90 a 90)
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  
  // Normalizar y mapear los valores del giroscopio
  gyroX = screenWidth / 2 + (e.gamma || 0) * (screenWidth / 90);
  gyroY = screenHeight / 2 + (e.beta || 0) * (screenHeight / 180);
  
  // Limitar a los bordes de la pantalla
  gyroX = Math.max(0, Math.min(screenWidth, gyroX));
  gyroY = Math.max(0, Math.min(screenHeight, gyroY));
  
  updatePosition(gyroX, gyroY);
}

// Detectar si es dispositivo móvil
const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Solicitar permisos para el giroscopio (iOS 13+)
const requestGyroscopePermission = async () => {
  if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
    try {
      const permission = await DeviceOrientationEvent.requestPermission();
      return permission === 'granted';
    } catch (error) {
      console.warn('Error requesting gyroscope permission:', error);
      return false;
    }
  }
  return true; // Asumir que está permitido en otros navegadores
}

onMounted(async () => {
  // Siempre escuchar eventos de puntero
  document.body.addEventListener("pointermove", handlePointerMove);
  
  // En móvil, también usar el giroscopio
  if (isMobile()) {
    const hasPermission = await requestGyroscopePermission();
    
    if (hasPermission) {
      window.addEventListener('deviceorientation', handleDeviceOrientation, true);
    }
  }
})

onUnmounted(() => {
  document.body.removeEventListener("pointermove", handlePointerMove);
  window.removeEventListener('deviceorientation', handleDeviceOrientation);
})
</script>

<style scoped>
.background-test{
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: -1;
  overflow: hidden;
  filter: blur(80px);
  margin: 0;
  --x: calc(var(--posX, 0) * 1px);
  --y: calc(var(--posY, 0) * 1px);
}

/* Light mode - colores suaves y pasteles */
:not(.dark) .background-test {
  background-image: 
    linear-gradient(115deg, rgba(165, 180, 252, 0.6), transparent), 
    radial-gradient( 90% 100% at calc( 50% + var(--x)) calc( 0% + var(--y)), rgba(251, 146, 60, 0.5), transparent), 
    radial-gradient(100% 100% at calc( 80% - var(--x)) calc( 0% - var(--y)), rgba(34, 197, 94, 0.4), transparent), 
    radial-gradient(150% 210% at calc(100% + var(--x)) calc( 0% + var(--y)), rgba(236, 72, 153, 0.5), rgba(147, 51, 234, 0.3)), 
    radial-gradient(100% 100% at calc(100% - var(--x)) calc(30% - var(--y)), rgba(59, 130, 246, 0.4), rgba(16, 185, 129, 0.4)), 
    linear-gradient(60deg, rgba(244, 114, 182, 0.4), rgba(139, 92, 246, 0.5));
  background-blend-mode: multiply, overlay, overlay, screen, screen, normal;
}

/* Dark mode - colores vibrantes y neón */
.dark .background-test {
  background-image: 
    linear-gradient(115deg, rgba(0, 255, 127, 0.7), transparent), 
    radial-gradient( 90% 100% at calc( 50% + var(--x)) calc( 0% + var(--y)), rgba(255, 20, 147, 0.6), transparent), 
    radial-gradient(100% 100% at calc( 80% - var(--x)) calc( 0% - var(--y)), rgba(255, 215, 0, 0.7), transparent), 
    radial-gradient(150% 210% at calc(100% + var(--x)) calc( 0% + var(--y)), rgba(0, 191, 255, 0.7), rgba(138, 43, 226, 0.5)), 
    radial-gradient(100% 100% at calc(100% - var(--x)) calc(30% - var(--y)), rgba(255, 69, 0, 0.6), rgba(30, 144, 255, 0.5)), 
    linear-gradient(60deg, rgba(255, 0, 128, 0.5), rgba(75, 0, 130, 0.6));
  background-blend-mode: overlay, overlay, difference, difference, difference, normal;
}
</style>