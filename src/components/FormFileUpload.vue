<template>
    <div class="upload-form p-3 border-bottom">
        <div class="mb-3">
            <select v-model="selectedFileType" class="form-select" aria-label="Selecciona tipo de archivo">
                <option value="">Selecciona tipo de archivo</option>
                <option value="video">Video</option>
                <option value="audio">Audio</option>
                <option value="pdf">PDF</option>
            </select>
        </div>

        <div class="mb-3">
            <input type="file" :accept="acceptedFileTypes" :disabled="!selectedFileType" @change="handleFileUpload"
                class="form-control">
        </div>
    </div>
</template>
<script setup>
import { ref, computed } from 'vue'
const selectedFileType = ref('')

// Computed property para tipos de archivo aceptados
const acceptedFileTypes = computed(() => {
    switch (selectedFileType.value) {
        case 'video':
            return 'video/*'
        case 'audio':
            return 'audio/*'
        case 'pdf':
            return 'application/pdf'
        default:
            return ''
    }
})

const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
        const newFile = {
            id: Date.now(), // Usar timestamp como ID temporal
            name: file.name,
            type: selectedFileType.value,
            url: URL.createObjectURL(file)
        }
        files.value.unshift(newFile)
        selectedFile.value = newFile // Seleccionar automáticamente el nuevo archivo
        event.target.value = '' // Limpiar el input
    }
}


</script>