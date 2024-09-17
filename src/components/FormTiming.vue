<template>
    <div class="container mt-5">
        <h2>Form Timing Data</h2>

        <!-- Tabla de Bootstrap -->
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>Pagina</th>
                    <th>Input</th>
                    <th>Tiempo (seconds)</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(timing, index) in paginatedData" :key="index">
                    <td>{{ timing.page }}</td>
                    <td>{{ timing.input }}</td>
                    <td>{{ timing.time }}</td>
                </tr>
            </tbody>
        </table>

        <!-- Paginación -->
        <nav aria-label="Page navigation">
            <ul class="pagination justify-content-center">
                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                    <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)">Anterior</a>
                </li>
                <li class="page-item" v-for="page in totalPages" :key="page" :class="{ active: currentPage === page }">
                    <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
                </li>
                <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                    <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)">Siguiente</a>
                </li>
            </ul>
        </nav>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { supabase } from "../utils/supabase";

export default defineComponent({
    data() {
        return {
            timings: [] as { page: string, input: string, time: number }[], // Los datos de form-timing
            currentPage: 1, // Página actual
            itemsPerPage: 12, // Elementos por página
        };
    },
    computed: {
        paginatedData() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = this.currentPage * this.itemsPerPage;
            return this.timings.slice(start, end);
        },
        totalPages() {
            return Math.ceil(this.timings.length / this.itemsPerPage);
        }
    },
    methods: {
        async fetchTimings() {
            // Consultar los datos desde Supabase
            const { data, error } = await supabase
                .from('form-timing')
                .select('*')
                .order('created_at', { ascending: false });
            if (!error && data) {
                this.timings = data;
            } else {
                console.error('Error fetching form-timing data:', error);
            }
        },
        changePage(page: number) {
            if (page > 0 && page <= this.totalPages) {
                this.currentPage = page;
            }
        },
        setupRealtimeSubscription() {
            // Configurar suscripción a la tabla form-timing para obtener datos en tiempo real
            supabase
                .channel('form-timing')
                .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'form-timing' }, (payload) => {
                    // Insertar el nuevo elemento al principio del array
                    const newTiming = payload.new as { page: string, input: string, time: number };
                    this.timings.unshift(newTiming);
                    if (this.timings.length > this.itemsPerPage * this.totalPages) {
                        this.timings.pop(); // Mantener el número máximo de elementos según la paginación
                    }
                })
                .subscribe();
        }
    },
    mounted() {
        this.fetchTimings();
        this.setupRealtimeSubscription();
    }
});
</script>

<style scoped>
.container {
    max-width: 900px;
}

.table {
    margin-bottom: 1rem;
}

.pagination {
    margin-top: 1rem;
}
</style>