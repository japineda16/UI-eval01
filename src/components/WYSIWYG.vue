<template>
    <div class="wysiwyg-container">
        <!-- Toolbar -->
        <div id="toolbar">
            <!-- Texto -->
            <span class="ql-formats">
                <select class="ql-header">
                    <option value="1">Título 1</option>
                    <option value="2">Título 2</option>
                    <option value="3">Título 3</option>
                    <option selected>Normal</option>
                </select>
                <select class="ql-font">
                    <option selected>Default</option>
                    <option value="serif">Serif</option>
                    <option value="monospace">Monospace</option>
                </select>
                <select class="ql-size">
                    <option value="small">Pequeño</option>
                    <option selected>Normal</option>
                    <option value="large">Grande</option>
                    <option value="huge">Muy Grande</option>
                </select>
            </span>

            <!-- Formato -->
            <span class="ql-formats">
                <button class="ql-bold"></button>
                <button class="ql-italic"></button>
                <button class="ql-underline"></button>
                <button class="ql-strike"></button>
            </span>

            <!-- Color -->
            <span class="ql-formats">
                <select class="ql-color"></select>
                <select class="ql-background"></select>
            </span>

            <!-- Listas -->
            <span class="ql-formats">
                <button class="ql-list" value="ordered"></button>
                <button class="ql-list" value="bullet"></button>
                <select class="ql-align">
                    <option selected></option>
                    <option value="center"></option>
                    <option value="right"></option>
                    <option value="justify"></option>
                </select>
            </span>

            <!-- Enlaces e imágenes -->
            <span class="ql-formats">
                <button class="ql-link"></button>
                <button class="ql-image"></button>
            </span>

            <!-- Limpiar formato -->
            <span class="ql-formats">
                <button class="ql-clean"></button>
            </span>
        </div>

        <!-- Editor -->
        <div ref="editor"></div>

        <!-- Botones de acción -->
        <div class="action-buttons mt-3">
            <button class="btn btn-primary me-2" @click="saveContent">
                <i class="bi bi-save me-1"></i>
                Guardar
            </button>
            <button class="btn btn-outline-secondary" @click="clearContent">
                <i class="bi bi-trash me-1"></i>
                Limpiar
            </button>
        </div>
        <!-- Vista previa en tiempo real -->
        <div class="preview mt-3" v-if="editorContent.length > 0">
            <h3>Vista previa:</h3>
            <div v-html="editorContent"></div>
        </div>
        <div v-if="editorContent.length <= 0">
            <Terms />
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'
import { supabase } from '../utils/supabase'
import Terms from '../views/Terms.vue'

const props = defineProps({
    initialContent: {
        type: String,
        default: ''
    }
})

const emit = defineEmits(['save', 'change'])

const editor = ref(null)
let quill = null
const editorContent = ref('') // Propiedad reactiva para el contenido del editor

// Opciones del editor
const editorOptions = {
    theme: 'snow',
    modules: {
        toolbar: '#toolbar'
    },
    placeholder: 'Escribe algo asombroso...'
}

// Inicializar editor
onMounted(() => {
    quill = new Quill(editor.value, editorOptions)

    // Establecer contenido inicial si existe
    if (props.initialContent) {
        quill.root.innerHTML = props.initialContent
        editorContent.value = props.initialContent // Inicializar vista previa
    }

    // Escuchar cambios
    quill.on('text-change', () => {
        editorContent.value = quill.root.innerHTML // Actualizar vista previa
        emit('change', quill.root.innerHTML)
    })
})

// Limpiar al desmontar
onBeforeUnmount(() => {
    if (quill) {
        quill.off('text-change')
    }
})

// Guardar contenido
const saveContent = async () => {
    try {
        const content = quill.root.innerHTML
        const { data, error } = await supabase
            .from('wysiwyg')
            .insert([
                { content: content }
            ])

        if (error) throw error

        emit('save', content)
        clearContent()
        alert('Contenido guardado exitosamente')
    } catch (error) {
        console.error('Error al guardar:', error)
        alert('Error al guardar el contenido')
    }
}

// Limpiar contenido
const clearContent = () => {
    if (confirm('¿Estás seguro de que quieres limpiar todo el contenido?')) {
        quill.setText('')
        editorContent.value = '' // Limpiar vista previa
    }
}

// Exponer métodos para el componente padre
defineExpose({
    getContent: () => quill?.root.innerHTML || '',
    setContent: (content) => {
        if (quill) {
            quill.root.innerHTML = content
        }
    },
    clearContent
})
</script>

<style>
.wysiwyg-container {
    border: 1px solid #ccc;
    border-radius: 4px;
    background: white;
}

.ql-toolbar {
    border-top: none !important;
    border-left: none !important;
    border-right: none !important;
    border-bottom: 1px solid #ccc !important;
}

.ql-container {
    border: none !important;
    height: 300px !important;
}

.action-buttons {
    padding: 1rem;
    border-top: 1px solid #ccc;
}

/* Estilos responsivos */
@media (max-width: 768px) {
    .ql-toolbar {
        flex-wrap: wrap;
    }

    .ql-formats {
        margin-right: 0 !important;
        margin-bottom: 5px;
    }
}

.preview {
    border: 1px solid #ccc;
    padding: 1rem;
    border-radius: 4px;
    background: white;
}
</style>