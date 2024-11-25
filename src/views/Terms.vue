<template>
    <div class="container mt-5 mb-5">
        <h1 class="text-center mb-4">Términos y Condiciones</h1>

        <div class="card">
            <div class="card-body">
                <h2>1. Términos de Uso</h2>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore
                    et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                    aliquip ex ea commodo consequat.</p>

                <h2>2. Política de Privacidad</h2>
                <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                    pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit
                    anim id est laborum.</p>

                <h2>3. Uso del Servicio</h2>
                <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium,
                    totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae
                    dicta sunt explicabo.</p>

                <h2>4. Derechos de Propiedad</h2>
                <p>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur
                    magni dolores eos qui ratione voluptatem sequi nesciunt.</p>

                <h2>5. Limitación de Responsabilidad</h2>
                <p>Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed
                    quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.
                </p>

                <h2>6. Modificaciones del Servicio</h2>
                <p>At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum
                    deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non
                    provident.</p>

                <h2>7. Ley Aplicable</h2>
                <p>Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum
                    quidem rerum facilis est et expedita distinctio.</p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
export default {
    name: 'Terms'
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