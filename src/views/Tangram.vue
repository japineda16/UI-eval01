<template>
    <div class="container">
        <div class="row">
            <div class="col-md-6 d-flex flex-column justify-content-center align-items-center">
                <h1>Bienvenido a la animación de Tangram</h1>
                <p>Disfruta de la siguiente animación interactiva de Tangram.</p>
            </div>
            <div class="col-md-6">
                <TangramRender />
            </div>
        </div>
    </div>
</template>

<script>
import TangramRender from "../components/RenderTangram.vue";

export default {
    name: 'Tangram',
    components: {
        TangramRender
    }
};
</script>

<style scoped>
.container {
    margin-top: 20px;
}
</style>