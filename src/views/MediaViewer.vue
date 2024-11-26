<template>
    <div class="media-viewer">
        <!-- Lista de archivos (panel izquierdo) -->
        <div class="file-list">
            <div v-for="file in files" :key="file.id" class="file-item"
                :class="{ active: selectedFile?.id === file.id }" @click="selectFile(file)">
                <div class="file-icon">
                    <i :class="getFileIcon(file.type)"></i>
                </div>
                <div class="file-info">
                    <div class="file-name">{{ file.name }}</div>
                    <div class="file-type">{{ file.type }}</div>
                </div>
            </div>
        </div>

        <!-- Visor de contenido (panel derecho) -->
        <div class="content-viewer">
            <template v-if="selectedFile">
                <!-- Video Player -->
                <video ref="videoPlayer" class="video-js vjs-default-skin" controls preload="auto" width="640"
                    height="360" v-if="selectedFile.type === 'video'">
                    <source :src="'https://www.w3schools.com/html/mov_bbb.mp4'" type="video/mp4">
                    <track v-if="selectedFile.subtitles" kind="subtitles" :src="selectedFile.subtitles" srclang="es"
                        label="Español">
                    <p class="vjs-no-js">
                        Para ver este video, por favor habilite JavaScript y considere actualizar a un
                        navegador web que soporte video HTML5
                    </p>
                </video>

                <!-- Audio Player -->
                <audio v-else-if="selectedFile.type === 'audio'" controls :src="selectedFile.url"></audio>

                <!-- PDF Viewer -->
                <iframe v-else-if="selectedFile.type === 'pdf'" :src="selectedFile.url" width="100%"
                    height="100%"></iframe>

                <!-- Mensaje de tipo no soportado -->
                <div v-else class="unsupported">
                    Formato no soportado
                </div>
            </template>

            <!-- Mensaje cuando no hay archivo seleccionado -->
            <div v-else class="no-selection">
                Selecciona un archivo para visualizar
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'



const selectedFile = ref(null)
const videoPlayer = ref(null)
let player = null

// Inicializar Video.js
const initializePlayer = () => {
    if (videoPlayer.value) {
        player = videojs(videoPlayer.value, {
            controls: true,
            fluid: true,
            playbackRates: [0.5, 1, 1.5, 2],
            controlBar: {
                children: [
                    'playToggle',
                    'volumePanel',
                    'currentTimeDisplay',
                    'timeDivider',
                    'durationDisplay',
                    'progressControl',
                    'playbackRateMenuButton',
                    'subtitlesButton',
                    'fullscreenToggle',
                ],
            },
        })
    }
}

// Limpiar el reproductor cuando el componente se desmonte
onBeforeUnmount(() => {
    if (player) {
        player.dispose()
    }
})

// Observar cambios en el archivo seleccionado
watch(selectedFile, (newFile) => {
    if (player) {
        player.dispose()
    }
    if (newFile?.type === 'video') {
        nextTick(() => {
            initializePlayer()
        })
    }
})




// Datos de prueba
const files = ref([
    {
        id: 1,
        name: 'Video de prueba',
        type: 'video',
        url: 'https://example.com/video.mp4'
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
        url: 'https://example.com/document.pdf'
    },
    {
        id: 4,
        name: 'Imagen de prueba',
        type: 'image',
        url: 'https://example.com/image.jpg'
    },
    {
        id: 5,
        name: 'Documento de texto',
        type: 'text',
        url: 'https://example.com/text.txt'
    },
    {
        id: 6,
        name: 'Documento de Excel',
        type: 'excel',
        url: 'https://example.com/excel.xlsx'
    },
    {
        id: 7,
        name: 'Documento de Word',
        type: 'word',
        url: 'https://example.com/word.docx'
    },
    {
        id: 8,
        name: 'Documento de PowerPoint',
        type: 'powerpoint',
        url: 'https://example.com/powerpoint.pptx'
    },
    {
        id: 9,
        name: 'Documento de Excel',
        type: 'excel',
        url: 'https://example.com/excel.xlsx'
    },
    {
        id: 10,
        name: 'Documento de Word',
        type: 'word',
        url: 'https://example.com/word.docx'
    },
    {
        id: 11,
        name: 'Documento de PowerPoint',
        type: 'powerpoint',
        url: 'https://example.com/powerpoint.pptx'
    },
    {
        id: 12,
        name: 'Documento de Excel',
        type: 'excel',
        url: 'https://example.com/excel.xlsx'
    },
    {
        id: 13,
        name: 'Documento de Word',
        type: 'word',
        url: 'https://example.com/word.docx'
    },
    {
        id: 14,
        name: 'Documento de PowerPoint',
        type: 'powerpoint',
        url: 'https://example.com/powerpoint.pptx'
    },
    {
        id: 15,
        name: 'Documento de Excel',
        type: 'excel',
        url: 'https://example.com/excel.xlsx'
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
.video-container {
    width: 100%;
    max-width: 1000px;
    margin: 0 auto;
}

:deep(.video-js) {
    width: 100%;
    height: 0;
    padding-top: 56.25%;
    /* Aspect ratio 16:9 */
}

:deep(.video-js.vjs-fluid) {
    padding-top: 56.25%;
    width: 100%;
    max-width: 100%;
    height: auto;
}

.media-viewer {
    display: flex;
    height: 100vh;
}

.file-list {
    width: 300px;
    border-right: 1px solid #ddd;
    overflow-y: auto;
}

.file-item {
    display: flex;
    padding: 1rem;
    cursor: pointer;
    border-bottom: 1px solid #eee;
}

.file-item:hover {
    background-color: #f5f5f5;
}

.file-item.active {
    background-color: #e3f2fd;
}

.file-icon {
    margin-right: 1rem;
}

.content-viewer {
    flex: 1;
    padding: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
}

video,
audio {
    max-width: 100%;
}

.no-selection,
.unsupported {
    color: #666;
    font-size: 1.2rem;
}
</style>
