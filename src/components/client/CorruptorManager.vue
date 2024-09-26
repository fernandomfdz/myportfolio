<template>

<div class="flex flex-col gap-12 items-center justify-center w-full">
    <label v-if="currentFiles.length === 0" ref="dropZoneRef" for="dropzone-file" class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
        <div class="flex flex-col items-center justify-center pt-5 pb-6">
            <svg class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
            </svg>
            <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Click para subir</span> o arrastra y suelta</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">Cualquier fichero</p>
        </div>
        <input id="dropzone-file" ref="fileInput" type="file" @change="onChange" class="hidden" />
    </label>




    <div v-if="currentFiles.length > 0" class="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <div class="flex justify-end px-4 pt-4">
            <button id="dropdownButton" data-dropdown-toggle="dropdown" class="opacity-0 inline-block text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-1.5" type="button">
                <span class="sr-only">Open dropdown</span>
                <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 3">
                    <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z"/>
                </svg>
            </button>
        </div>
        <div class="flex flex-col items-center pb-10">
            <svg class="w-24 h-24 mb-3 text-gray-900 dark:text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 0 1 9 9v.375M10.125 2.25A3.375 3.375 0 0 1 13.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 0 1 3.375 3.375M9 15l2.25 2.25L15 12" />
            </svg>
            <h5 class="mb-1 text-center text-xl font-medium text-gray-900 dark:text-white">{{ currentFiles[0].name }}</h5>
            <span class="text-sm text-center text-gray-500 dark:text-gray-400">{{ currentFiles[0].type }}</span>
            <span class="text-sm text-center text-gray-500 dark:text-gray-400">{{ currentFiles[0].size }} bytes</span>
            <div class="flex mt-4 md:mt-6">
                <button @click="onDownloadCorrupted(currentFiles[0])" class="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Corromper y descargar</button>
                <button @click="onRemoveFile(currentFiles[0])" class="py-2 px-4 ms-2 text-sm font-medium text-gray-900 border-none focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Descartar</button>
            </div>
        </div>
    </div>

</div> 

</template>

<script setup lang="ts">
import {ref} from 'vue'
import { useDropZone } from '@vueuse/core'

    const dropZoneRef = ref<HTMLDivElement>()
    const fileInput = ref<HTMLInputElement>()

    const currentFiles = ref([]);

    function onClick() { 
        console.log('Hola!!')
    }
    function onDrop(files: File[] | null) {
        currentFiles.value = files;
        console.log('Hay ficheros!!!', files);
        fileInput.value.value = null;
    }

    function onRemoveFile(file) {
        console.log(currentFiles.value, file);
        currentFiles.value.splice(currentFiles.value.indexOf(file), 1);
        fileInput.value.value = null;
    }

    function onChange(e) {
        let files = e.target.files || e.dataTransfer.files;
        currentFiles.value = [];
        Array.from(files).forEach(file => {
            currentFiles.value.push(file);
        });
        fileInput.value.value = null;
    }

    function onDownloadCorrupted(file) { 
        let fileReader = new FileReader();
        fileReader.readAsArrayBuffer(file);
        fileReader.onload = function(ev) {
            const result = ev.target.result;
            let byteArray = new Uint8Array(result);

            for (let i = 0; i < byteArray.length; i += Math.floor(Math.random() * 1000)) {
                byteArray[i] = byteArray[i] ^ 0xFF;
             }
            saveByteArray(file, byteArray );
        }
    }

    function saveByteArray(file: File, byte) {
        var blob = new Blob([byte,12212], {type: file.type});
        var link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        var fileName = file.name;
        link.download = fileName;
        link.click();
    };
const { isOverDropZone } = useDropZone(dropZoneRef, {
  onDrop
})

</script>