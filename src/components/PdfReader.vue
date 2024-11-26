<template>
    <div class="pdf-viewer">
        <!-- Toolbar -->
        <div class="toolbar bg-light border-bottom p-2 d-flex align-items-center gap-3">
            <!-- Navegación -->
            <div class="btn-group">
                <button class="btn btn-outline-primary" @click="previousPage" :disabled="currentPage <= 1">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <button class="btn btn-outline-primary" @click="nextPage" :disabled="currentPage >= totalPages">
                    <i class="fas fa-chevron-right"></i>
                </button>
            </div>

            <!-- Información de página -->
            <div class="page-info d-flex align-items-center">
                <span class="me-2">Página</span>
                <input type="number" class="form-control form-control-sm" style="width: 70px"
                    v-model.number="currentPage" :min="1" :max="totalPages" @change="handlePageChange">
                <span class="ms-2">de {{ totalPages }}</span>
            </div>

            <!-- Zoom -->
            <div class="btn-group ms-auto">
                <button class="btn btn-outline-secondary" @click="zoomOut" :disabled="scale <= 0.5">
                    <i class="fas fa-search-minus"></i>
                </button>
                <button class="btn btn-outline-secondary" @click="resetZoom">
                    {{ Math.round(scale * 100) }}%
                </button>
                <button class="btn btn-outline-secondary" @click="zoomIn" :disabled="scale >= 3">
                    <i class="fas fa-search-plus"></i>
                </button>
            </div>
        </div>

        <!-- Contenedor del PDF -->
        <div class="pdf-container p-3" ref="containerRef">
            <!-- Loading -->
            <div v-if="loading" class="text-center p-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Cargando...</span>
                </div>
                <p class="mt-2">Cargando PDF...</p>
            </div>

            <!-- Error -->
            <div v-if="error" class="alert alert-danger" role="alert">
                <i class="fas fa-exclamation-triangle me-2"></i>
                {{ error }}
            </div>

            <!-- Canvas -->
            <canvas v-show="!loading && !error" ref="pdfCanvas" class="shadow-sm"></canvas>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import * as pdfjsLib from 'pdfjs-dist'

// Configurar worker de PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.8.69/pdf.min.mjs`

const props = defineProps({
    fileUrl: {
        type: String,
        required: true
    }
})

// Referencias y estado
const pdfCanvas = ref(null)
const containerRef = ref(null)
const loading = ref(true)
const error = ref(null)
const pdfDoc = ref(null)
const currentPage = ref(1)
const totalPages = ref(0)
const scale = ref(1)

// Cargar PDF
const loadPDF = async () => {
    try {
        if (!props.fileUrl) {
            error.value = 'URL del PDF no proporcionada'
            return
        }

        loading.value = true
        error.value = null
        currentPage.value = 1
        scale.value = 1

        // Limpiar el canvas anterior si existe
        if (pdfDoc.value) {
            pdfDoc.value = null
            if (pdfCanvas.value) {
                const context = pdfCanvas.value.getContext('2d')
                context.clearRect(0, 0, pdfCanvas.value.width, pdfCanvas.value.height)
            }
        }

        const loadingTask = pdfjsLib.getDocument(props.fileUrl)
        pdfDoc.value = await loadingTask.promise
        totalPages.value = pdfDoc.value.numPages

        await renderPage()
    } catch (err) {
        error.value = `Error al cargar el PDF: ${err.message}`
        console.error('Error loading PDF:', err)
    } finally {
        loading.value = false
    }
}

// Renderizar página
const renderPage = async () => {
    if (!pdfDoc.value || !pdfCanvas.value) return

    try {
        const page = await pdfDoc.value.getPage(currentPage.value)
        const canvas = pdfCanvas.value
        const context = canvas.getContext('2d')

        const viewport = page.getViewport({ scale: scale.value })
        canvas.height = viewport.height
        canvas.width = viewport.width

        // Limpiar el canvas antes de renderizar
        context.clearRect(0, 0, canvas.width, canvas.height)

        await page.render({
            canvasContext: context,
            viewport: viewport
        }).promise
    } catch (err) {
        error.value = `Error al renderizar la página: ${err.message}`
        console.error('Error rendering page:', err)
    }
}

// Navegación
const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        currentPage.value++
    }
}

const previousPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--
    }
}

const handlePageChange = () => {
    if (currentPage.value < 1) currentPage.value = 1
    if (currentPage.value > totalPages.value) currentPage.value = totalPages.value
    renderPage()
}

// Zoom
const zoomIn = () => {
    scale.value = Math.min(scale.value + 0.25, 3)
}

const zoomOut = () => {
    scale.value = Math.max(scale.value - 0.25, 0.5)
}

const resetZoom = () => {
    scale.value = 1
}

// Watchers
watch(() => props.fileUrl, async (newUrl, oldUrl) => {
    if (newUrl !== oldUrl) {
        await loadPDF()
    }
})

watch(currentPage, renderPage)
watch(scale, renderPage)

// Inicialización
onMounted(async () => {
    await loadPDF()
})
</script>

<style scoped>
.pdf-viewer {
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: #f8f9fa;
}

.pdf-container {
    flex: 1;
    overflow: auto;
    display: flex;
    justify-content: center;
    align-items: flex-start;
}

canvas {
    background-color: white;
    margin: auto;
    max-width: 100%;
}

.toolbar {
    position: sticky;
    top: 0;
    z-index: 1000;
}

@media (max-width: 768px) {
    .toolbar {
        flex-wrap: wrap;
        gap: 1rem !important;
    }

    .page-info {
        width: 100%;
        justify-content: center;
    }
}
</style>
