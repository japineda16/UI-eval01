<template>
    <div class="container mt-5 mb-5">
        <h1 class="text-center mb-4">Términos y Condiciones</h1>

        <div class="card">
            <div class="card-body">
                <div class="card-body" v-html="terms" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from '../utils/supabase'

export default {
    name: 'Terms',
    setup() {
        const terms = ref(null)

        onMounted(async () => {
            try {
                const { data, error } = await supabase
                    .from('wysiwyg')
                    .select('content')
                    .order('created_at', { ascending: false })
                    .limit(1)
                    .single()

                if (error) throw error
                if (data) {
                    terms.value = data.content
                }
            } catch (error) {
                console.error('Error al cargar los términos:', error)
            }
        })

        return { terms }  // Return terms to make it available in template
    }
}
</script>

<style scoped>
h2 {
    color: var(--bs-primary);
    margin-top: 2rem;
    margin-bottom: 1rem;
    font-size: 1.5rem;
}

p {
    margin-bottom: 1.5rem;
    line-height: 1.6;
}

.card {
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
}
</style>