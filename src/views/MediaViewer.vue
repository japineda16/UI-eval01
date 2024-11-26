<template>
    <div class="media-viewer">
        <div class="file-list bg-light border-end">
            <!-- Formulario de subida -->
            <FormFileUpload :files="data => files.push(data)" />

            <!-- Lista de archivos -->
            <div class="file-list-content">
                <div v-for="file in files" :key="file.id" class="file-item p-3 border-bottom d-flex align-items-center"
                    :class="{ 'active bg-primary pdf-white': selectedFile?.id === file.id }" @click="selectFile(file)">
                    <div class="file-icon me-3">
                        <i :class="getFileIcon(file.type)"></i>
                    </div>
                    <div class="file-info">
                        <div class="file-name fw-bold">{{ file.name }}</div>
                        <div class="file-type small">{{ file.type }}</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Visor de contenido -->
        <div class="content-viewer p-3">
            <template v-if="selectedFile">
                <!-- Video Player -->
                <VideoPlayer v-if="selectedFile.type === 'video'" :url="selectedFile.url" class="w-100" />

                <!-- Audio Player -->
                <audio v-else-if="selectedFile.type === 'audio'" controls :src="selectedFile.url" class="w-100"></audio>

                <!-- PDF Viewer -->
                <PdfViewer v-else-if="selectedFile.type === 'pdf'" :url="selectedFile.url" class="h-100 w-100" />

                <!-- Mensaje de tipo no soportado -->
                <div v-else class="alert alert-warning">
                    Formato no soportado
                </div>
            </template>

            <!-- Mensaje cuando no hay archivo seleccionado -->
            <div v-else class="pdf-center pdf-muted">
                <i class="fas fa-file fa-3x mb-3"></i>
                <p>Selecciona un archivo para visualizar</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import VideoPlayer from '../components/VideoPlayer.vue'
import PdfViewer from '../components/PdfReader.vue'
import FormFileUpload from '../components/FormFileUpload.vue'

const selectedFile = ref(null)

// Datos de prueba
const files = ref([
    {
        id: 1,
        name: 'Video de prueba',
        type: 'video',
        url: 'https://www.w3schools.com/html/mov_bbb.mp4'
    },
    {
        id: 2,
        name: 'Audio de muestra',
        type: 'audio',
        url: 'https://example.com/audio.mp3'
    },
    {
        id: 3,
        name: 'Documento PDF',
        type: 'pdf',
        url: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf'
    },
    {
        id: 4,
        name: 'Documento PDF',
        type: 'pdf',
        url: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf'
    },
    {
        id: 5,
        name: 'Documento PDF',
        type: 'pdf',
        url: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf'
    },
    {
        id: 6,
        name: 'Documento PDF',
        type: 'pdf',
        url: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf'
    },
    {
        id: 7,
        name: 'Documento PDF',
        type: 'pdf',
        url: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf'
    },
    {
        id: 8,
        name: 'Documento PDF',
        type: 'pdf',
        url: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf'
    },
    {
        id: 9,
        name: 'Documento PDF',
        type: 'pdf',
        url: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf'
    },
    {
        id: 10,
        name: 'Documento PDF',
        type: 'pdf',
        url: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf'
    },
    {
        id: 11,
        name: 'Documento PDF',
        type: 'pdf',
        url: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf'
    },
    {
        id: 12,
        name: 'Documento PDF',
        type: 'pdf',
        url: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf'
    }
])

// Métodos
const selectFile = (file) => {
    selectedFile.value = file
}

const getFileIcon = (type) => {
    switch (type) {
        case 'video':
            return 'fas fa-video'
        case 'audio':
            return 'fas fa-volume-up'
        case 'pdf':
            return 'fas fa-file-pdf'
        default:
            return 'fas fa-file'
    }
}


</script>

<style scoped>
.media-viewer {
    display: flex;
    height: 100vh;
}

.file-list {
    width: 350px;
    overflow-y: auto;
}

.file-list-content {
    overflow-y: auto;
}

.file-item {
    cursor: pointer;
    transition: background-color 0.2s;
}

.file-item:hover:not(.active) {
    background-color: rgba(0, 0, 0, 0.05);
}

.content-viewer {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f8f9fa;
}

/* Asegurarse que el iframe del PDF ocupe todo el espacio disponible */
.content-viewer iframe {
    min-height: 80vh;
}

/* Estilos para el reproductor de audio */
audio {
    max-width: 500px;
}
</style>