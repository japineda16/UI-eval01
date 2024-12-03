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
                class="form-control" ref="fileInput">
        </div>

        <div class="mb-3" v-if="selectedFileType === 'video'">
            <label class="form-label">Subtítulos (opcional)</label>
            <input type="file" accept=".vtt,.srt" @change="handleSubtitleUpload" class="form-control"
                ref="subtitleInput">
        </div>

        <div class="upload-form p-3 border-bottom">
            <!-- ... otros elementos ... -->

            <!-- Mensaje de error -->
            <div v-if="error" class="alert alert-danger mt-3">
                {{ error }}
            </div>

            <!-- Botón de guardar -->
            <div class="d-grid">
                <button class="btn btn-primary" @click="handleSave" :disabled="!isFormValid || loading">
                    <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
                    <i v-else class="bi bi-save me-2"></i>
                    {{ loading ? 'Guardando...' : 'Guardar' }}
                </button>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, computed } from 'vue'
import { supabase } from '../utils/supabase';

const selectedFileType = ref('')
const selectedFile = ref(null)
const fileInput = ref(null)
const subtitleInput = ref(null)
const loading = ref(false)
const error = ref(null)
const selectedSubtitle = ref(null)

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

// Computed property para validar el formulario
const isFormValid = computed(() => {
    return selectedFileType.value && selectedFile.value
})

const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
        selectedFile.value = {
            id: Date.now(),
            name: file.name,
            type: selectedFileType.value,
            file: file,
            url: URL.createObjectURL(file)
        }
    }
}

const handleSubtitleUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
        selectedSubtitle.value = {
            name: file.name,
            file: file
        }
    }
}

const handleSave = async () => {
    if (!isFormValid.value) return

    loading.value = true
    error.value = null

    try {
        const file = selectedFile.value.file
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}.${fileExt}`
        const filePath = `${selectedFileType.value}/${fileName}`

        // 1. Subir archivo al bucket
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('uploads') // Nombre de tu bucket
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
            })

        if (uploadError) throw uploadError

        // 2. Obtener la URL pública del archivo
        const { data: { publicUrl } } = supabase.storage
            .from('files')
            .getPublicUrl(filePath)

        // Si hay subtítulos, subirlos también
        let subtitlePath = null
        if (selectedSubtitle.value) {
            const subtitleFile = selectedSubtitle.value.file
            const subtitleExt = subtitleFile.name.split('.').pop()
            const subtitleName = `${Date.now()}_subtitle.${subtitleExt}`
            const subtitleFilePath = `subtitles/${subtitleName}`

            const { error: subtitleUploadError } = await supabase.storage
                .from('uploads')
                .upload(subtitleFilePath, subtitleFile, {
                    cacheControl: '3600',
                    upsert: false
                })

            if (subtitleUploadError) throw subtitleUploadError
            subtitlePath = subtitleFilePath
        }

        // 3. Crear registro en la tabla files
        const { data: fileData, error: dbError } = await supabase
            .from('files')
            .insert([
                {
                    type: selectedFileType.value,
                    file_name: file.name,
                    path: filePath,
                    subtitle_path: subtitlePath
                }
            ])
            .select()
            .single()

        if (dbError) throw dbError

        // 4. Emitir evento con la información completa
        emit('save', {
            ...fileData,
            url: publicUrl
        })

        // 5. Limpiar el formulario
        selectedFileType.value = ''
        selectedFile.value = null
        if (fileInput.value) {
            fileInput.value.value = ''
        }
        selectedSubtitle.value = null
        if (subtitleInput.value) {
            subtitleInput.value.value = ''
        }

    } catch (err) {
        console.error('Error al guardar:', err)
        error.value = err.message
    } finally {
        loading.value = false
    }
}

// Definir los eventos que emitirá el componente
const emit = defineEmits(['save'])
</script>

<style scoped>
.upload-form {
    max-width: 500px;
    margin: 0 auto;
}
</style>