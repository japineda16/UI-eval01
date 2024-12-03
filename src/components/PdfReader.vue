<template>
    <div class="pdf-container">
        <!-- Barra de herramientas -->
        <div class="toolbar bg-light border-bottom p-3 sticky-top">
            <div class="d-flex justify-content-between align-items-center flex-wrap gap-3">
                <!-- Navegación -->
                <div class="d-flex align-items-center gap-2">
                    <button class="btn btn-outline-primary" @click="prevPage" :disabled="currentPage <= 1">
                        <i class="bi bi-chevron-left"></i>
                    </button>

                    <div class="input-group" style="width: auto;">
                        <input type="number" class="form-control" style="width: 70px;" v-model.number="currentPage"
                            :min="1" :max="totalPages" @change="goToPage">
                        <span class="input-group-text">de {{ totalPages }}</span>
                    </div>

                    <button class="btn btn-outline-primary" @click="nextPage" :disabled="currentPage >= totalPages">
                        <i class="bi bi-chevron-right"></i>
                    </button>
                </div>

                <!-- Zoom -->
                <div class="btn-group">
                    <button class="btn btn-outline-secondary" @click="zoomOut" :disabled="scale <= 0.5">
                        <i class="bi bi-zoom-out"></i>
                    </button>
                    <button class="btn btn-outline-secondary" @click="resetZoom">
                        {{ Math.round(scale * 100) }}%
                    </button>
                    <button class="btn btn-outline-secondary" @click="zoomIn" :disabled="scale >= 2">
                        <i class="bi bi-zoom-in"></i>
                    </button>
                </div>
            </div>
        </div>

        <!-- Área de visualización -->
        <div class="pdf-content p-3 bg-light">
            <!-- Loader -->
            <div v-if="loading" class="text-center py-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Cargando...</span>
                </div>
                <p class="mt-3 text-muted">Cargando PDF...</p>
            </div>

            <!-- Error -->
            <div v-if="error" class="alert alert-danger mx-auto" style="max-width: 500px;">
                <i class="bi bi-exclamation-triangle me-2"></i>
                {{ error }}
            </div>

            <!-- PDF Canvas -->
            <canvas ref="pdfCanvas" v-show="!loading && !error" class="mx-auto d-block shadow-sm bg-white"></canvas>
        </div>
    </div>
</template>

<script setup>
import { onMounted, watch, shallowRef } from 'vue';
import * as pdfjsLib from 'pdfjs-dist';

// Configurar worker usando CDN
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@4.8.69/build/pdf.worker.min.mjs`;

const props = defineProps({
    url: {
        type: String,
        required: true
    }
});

// Referencias y estado
const pdfCanvas = shallowRef(null);
const pdfDoc = shallowRef(null);
const currentPage = shallowRef(1);
const totalPages = shallowRef(0);
const scale = shallowRef(1);
const loading = shallowRef(true);
const error = shallowRef(null);

// Cargar documento PDF
const loadDocument = async () => {
    console.log('Iniciando carga del PDF:', props.url);
    try {
        loading.value = true;
        error.value = null;

        // Cargar el documento
        const loadingTask = pdfjsLib.getDocument({
            url: props.url,
            disableFontFace: true
        });

        console.log('Esperando carga del documento...');
        pdfDoc.value = await loadingTask.promise;
        console.log('Documento cargado');

        totalPages.value = pdfDoc.value.numPages;
        currentPage.value = 1;

        await renderPage();
    } catch (err) {
        console.error('Error al cargar el PDF:', err);
        error.value = `Error al cargar el PDF: ${err.message}`;
    } finally {
        loading.value = false;
    }
};

// Renderizar página
const renderPage = async () => {
    if (!pdfDoc.value || !pdfCanvas.value) return;

    try {
        console.log('Renderizando página:', currentPage.value);
        const page = await pdfDoc.value.getPage(currentPage.value);
        const canvas = pdfCanvas.value;
        const context = canvas.getContext('2d');

        const viewport = page.getViewport({ scale: scale.value });
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // Limpiar el canvas antes de renderizar
        context.clearRect(0, 0, canvas.width, canvas.height);

        const renderContext = {
            canvasContext: context,
            viewport: viewport
        };

        await page.render(renderContext).promise;
        console.log('Página renderizada');
    } catch (err) {
        console.error('Error al renderizar página:', err);
        error.value = `Error al mostrar la página: ${err.message}`;
    }
};

// Navegación
const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        currentPage.value++;
    }
};

const prevPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--;
    }
};

const goToPage = () => {
    if (currentPage.value < 1) currentPage.value = 1;
    if (currentPage.value > totalPages.value) currentPage.value = totalPages.value;
};

// Zoom
const zoomIn = () => {
    scale.value = Math.min(scale.value + 0.25, 2);
};

const zoomOut = () => {
    scale.value = Math.max(scale.value - 0.25, 0.5);
};

const resetZoom = () => {
    scale.value = 1;
};

// Watchers
watch(() => props.url, loadDocument);
watch(currentPage, renderPage);
watch(scale, renderPage);

// Inicialización
onMounted(loadDocument);
</script>

<style scoped>
.pdf-container {
    height: 100%;
    display: flex;
    flex-direction: column;
}

.pdf-content {
    flex: 1;
    overflow-y: auto;
    min-height: 0;
}

canvas {
    max-width: 100%;
    height: auto !important;
}

.toolbar {
    z-index: 1000;
}

@media (max-width: 576px) {
    .toolbar .d-flex {
        justify-content: center !important;
    }
}
</style>