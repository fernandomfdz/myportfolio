<template>
  <div
    v-show="visible"
    ref="dot"
    class="cursor-dot"
    :class="{ hover: isHover }"
    :style="{
      transform: `translate3d(${pos.x}px, ${pos.y}px, 0) scale(${scale})`
    }"
    aria-hidden="true"
  />
</template>

<script setup>
import { onMounted, onBeforeUnmount, reactive, ref, computed } from 'vue';

const pos = reactive({ x: -100, y: -100 });   // posición suavizada (render)
const tgt = reactive({ x: -100, y: -100 });   // posición objetivo (ratón)
const isHover = ref(false);
const visible = ref(false);
const dot = ref(null);

const lerp = (a, b, n) => (1 - n) * a + n * b;
let raf;

const scale = computed(() => (isHover.value ? 1.9 : 1));

const onMove = (e) => {
  tgt.x = e.clientX;
  tgt.y = e.clientY;
  if (!visible.value) visible.value = true;
};

const isInteractive = (el) =>
  el?.closest?.('a, button, [role="button"], input, textarea, select, summary, .is-interactive');

const onOver = (e) => { isHover.value = !!isInteractive(e.target); };
const onOut  = (e) => { if (!isInteractive(e.relatedTarget)) isHover.value = false; };

const loop = () => {
  // Suavizado (delay)
  pos.x = lerp(pos.x, tgt.x, 0.18);
  pos.y = lerp(pos.y, tgt.y, 0.18);
  raf = requestAnimationFrame(loop);
};

onMounted(() => {
  // Respeta usuarios sin puntero fino o con reduced motion
  const mqCoarse = matchMedia('(pointer: coarse)');
  const mqReduced = matchMedia('(prefers-reduced-motion: reduce)');
  if (mqCoarse.matches || mqReduced.matches) return; // no activar en móvil o reduced motion

  document.documentElement.classList.add('has-custom-cursor');

  window.addEventListener('mousemove', onMove, { passive: true });
  window.addEventListener('mouseover', onOver, { passive: true });
  window.addEventListener('mouseout', onOut, { passive: true });

  raf = requestAnimationFrame(loop);
});

onBeforeUnmount(() => {
  document.documentElement.classList.remove('has-custom-cursor');
  window.removeEventListener('mousemove', onMove);
  window.removeEventListener('mouseover', onOver);
  window.removeEventListener('mouseout', onOut);
  cancelAnimationFrame(raf);
});
</script>

<style scoped>
.cursor-dot {
  position: fixed;
  top: 0; left: 0;
  width: var(--cursor-size, 14px);
  height: var(--cursor-size, 14px);
  margin-top: calc(var(--cursor-size, 14px) * -0.5);
  margin-left: calc(var(--cursor-size, 14px) * -0.5);
  border-radius: 9999px;
  pointer-events: none;
  z-index: 9999;
  background: var(--cursor-color, rgba(6, 6, 6, 0.85)); /* turquesa sutil */
  transition: background 100ms ease;
  will-change: transform;
  /* Suavizado visual */
  box-shadow: 0 0 24px rgba(0,0,0,0.08);
}

.cursor-dot.hover {
  background: var(--cursor-color-hover, rgba(99, 102, 241, 0.9)); /* indigo */
}

/* Accesibilidad: oculta el cursor nativo sólo en escritorio/puntero fino */
:global(html.has-custom-cursor) {
  cursor: none;
}
:global(html.has-custom-cursor) * {
  cursor: none !important;
}
</style>