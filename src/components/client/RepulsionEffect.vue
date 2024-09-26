<script setup>
    import { computed } from "vue";
import { PCFSoftShadowMap, SRGBColorSpace } from 'three'
import { TresCanvas } from '@tresjs/core';
    import { Sphere, OrbitControls, Stars } from '@tresjs/cientos'
    import Planet from './Planet.vue'
    import { useDark, useToggle } from '@vueuse/core'

    const isDark = useDark();

      
    const gl = computed(() => { 
        return {
          clearColor: isDark.value ? '#11101B' : '#000000',
          shadows: true,
          alpha: false,
          outputColorSpace: SRGBColorSpace,
          shadowMapType: PCFSoftShadowMap,
        }

    })

</script>

<template>
<TresCanvas window-size class="w-full h-screen" v-bind="gl">
  <TresPerspectiveCamera
    :position="[58.37415437855355, 84.60157467553438, 97.134091147284]"
    :fov="50"
    :near="1"
    :far="1000"
  />
  <OrbitControls :enable-zoom="false" :auto-rotate="true" :autoRotateSpeed="0.1" />

  <TresAmbientLight
    color="#484068"
    :intensity="3"
  />
  <Suspense>
    <Planet transition:persist/>
  </Suspense>
  <Stars />
  <TresPointLight
    color="#1BFFEF"
    :position="[0, 0, -8]"
    :intensity="80"
    cast-shadow
  />
  <TresDirectionalLight
    :position="[0, 2, 4]"
    :intensity="3"
    cast-shadow
    :shadow-mapSize-width="2048"
    :shadow-mapSize-height="2048"
  />
</TresCanvas>
</template>