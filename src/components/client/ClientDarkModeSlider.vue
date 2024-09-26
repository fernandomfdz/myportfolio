<script setup>
  import { ref, watch } from "vue";

  import { useDark, useToggle } from '@vueuse/core'

  const isDark = useDark()
  const toggleDark = useToggle(isDark);


  const allHours = Array.from(Array(24));
  const hr = new Date().getHours();

  const selectedHour = ref(hr);
  const hoverHour = ref(null);

  watch(() => selectedHour.value, () => { 
    if ([7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,].includes(selectedHour.value)) {
      isDark.value = false;
    } else { 
      isDark.value = true;
    }
  })
  
</script>

<template>
  <div class="flex w-full">
    <div
      class="hour group h-16 w-2 grow shrink min-w-1 flex items-end justify-center relative cursor-pointer transition-all duration-300"
      role="button"
      tabindex="-1"
      v-for="(key,hour) in allHours"
      @click="selectedHour = hour"
      @mouseenter="hoverHour = hour"
      @mouseleave="hoverHour = null"
    >
      <Transition>
        <div
          v-if="hour === selectedHour"
          @click="toggleDark()"
          class="h-12 w-12 absolute left-1/2 top-0 fill-black bg-sky-500 rounded-full -translate-x-[50%] -translate-y-[100%] flex items-center justify-center"
        >
        <svg class="hidden dark:block size-7 " data-slot="icon" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"></path>
        </svg>
        <svg class="dark:hidden size-7" data-slot="icon" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"></path>
        </svg>
        </div>
      </Transition>
      <div
        class="w-full h-full flex items-center justify-center relative overflow-hidden"
      >
        <div
        class="w-[2px] transition-all group-hover:-translate-y-[10px]
        rounded-3xl"
        :class="{
            'bg-sky-500 -translate-y-[8px] h-5': hour  === selectedHour,
            'group-hover:bg-sky-500': hour !== selectedHour,
            '-translate-y-[4px] ': (hour-1) === hoverHour,
            '-translate-y-[4px]': (hour+1) === hoverHour,
            'bg-gray-400 h-8': [ 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,].includes(hour) && hour !== selectedHour,
            'bg-gray-400 dark:bg-gray-600 opacity-60 h-5': [ 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,].includes(hour) === false && hour !== selectedHour
        }"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>