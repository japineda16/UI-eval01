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
import { ref, onMounted, onUnmounted } from 'vue'
import { supabase } from '../utils/supabase';
import VideoPlayer from '../components/VideoPlayer.vue'
import PdfViewer from '../components/PdfReader.vue'
import FormFileUpload from '../components/FormFileUpload.vue'

const selectedFile = ref(null)
const files = ref([])

// Función para obtener la URL pública del archivo
const getPublicUrl = (path) => {
    const { data: { publicUrl } } = supabase.storage
        .from('uploads')
        .getPublicUrl(path)
    return publicUrl
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

// Función para cargar archivos iniciales
const loadInitialFiles = async () => {
    try {
        const { data, error } = await supabase
            .from('files')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) throw error

        // Agregar URL pública a cada archivo
        files.value = data.map(file => ({
            ...file,
            url: getPublicUrl(file.path)
        }))

        console.log(files.value)

    } catch (error) {
        console.error('Error al cargar archivos:', error)
    }
}

// Función para suscribirse a cambios en tiempo real
const subscribeToFiles = () => {
    const subscription = supabase
        .channel('files_channel')
        .on('postgres_changes',
            {
                event: '*', // Escucha todos los eventos (INSERT, UPDATE, DELETE)
                schema: 'public',
                table: 'files'
            },
            async (payload) => {
                console.log('Cambio detectado:', payload)

                // Manejar inserción de nuevo archivo
                if (payload.eventType === 'INSERT') {
                    const newFile = {
                        ...payload.new,
                        url: getPublicUrl(payload.new.path)
                    }
                    files.value = [newFile, ...files.value]
                }

                // Manejar actualización de archivo
                else if (payload.eventType === 'UPDATE') {
                    const index = files.value.findIndex(f => f.id === payload.new.id)
                    if (index !== -1) {
                        files.value[index] = {
                            ...payload.new,
                            url: getPublicUrl(payload.new.path)
                        }
                    }
                }

                // Manejar eliminación de archivo
                else if (payload.eventType === 'DELETE') {
                    files.value = files.value.filter(f => f.id !== payload.old.id)
                }
            }
        )
        .subscribe()

    return subscription
}

// Variable para almacenar la suscripción
let subscription

// Inicializar al montar el componente
onMounted(async () => {
    // Cargar archivos existentes
    await loadInitialFiles()

    // Suscribirse a cambios
    subscription = subscribeToFiles()
})

// Limpiar suscripción al desmontar
onUnmounted(() => {
    if (subscription) {
        supabase.removeChannel(subscription)
    }
})

// Función para seleccionar archivo
const selectFile = (file) => {
    selectedFile.value = file
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