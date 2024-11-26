<template>
    <div class="editor-page">
        <div class="editor-header">
            <div class="container">
                <h1>Editor de Contenido</h1>
                <p class="text-muted">Crea y edita tu contenido de forma visual</p>
            </div>
        </div>

        <div class="container mt-4">
            <div class="editor-wrapper">
                <div class="editor-sidebar">
                    <div class="document-info">
                        <i class="bi bi-file-text me-2"></i>
                        <span>Documento sin título</span>
                    </div>
                    <div class="status-info">
                        <span class="text-muted"><i class="bi bi-circle-fill me-1"></i> Guardado</span>
                    </div>
                </div>

                <div class="editor-content">
                    <WYSIWYG @save="onSave" @change="onChange" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import WYSIWYG from '../components/WYSIWYG.vue'

const onSave = (content) => {
    console.log('Contenido guardado:', content)
}

const onChange = (content) => {
    console.log('Contenido modificado:', content)
}
</script>

<style scoped>
.editor-page {
    min-height: 100vh;
    background-color: #f0f2f5;
}

.editor-header {
    background: white;
    padding: 2rem 0;
    border-bottom: 1px solid #e2e4e7;
}

.editor-header h1 {
    font-size: 1.8rem;
    margin-bottom: 0.5rem;
}

.editor-wrapper {
    display: grid;
    grid-template-columns: 250px 1fr;
    gap: 2rem;
    margin-bottom: 2rem;
}

.editor-sidebar {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.editor-content {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    padding: 1rem;
}

.document-info {
    font-size: 1.1rem;
    font-weight: 500;
    margin-bottom: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #e2e4e7;
}

.status-info {
    font-size: 0.9rem;
}

.status-info i {
    font-size: 0.6rem;
    color: #28a745;
}

@media (max-width: 768px) {
    .editor-wrapper {
        grid-template-columns: 1fr;
    }

    .editor-sidebar {
        margin-bottom: 1rem;
    }
}
</style>
