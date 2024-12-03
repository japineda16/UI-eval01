<template>
    <div class="container mt-5">
        <div class="row justify-content-center">
            <div class="col-md-12">
                <div class="card">
                    <div class="card-body">
                        <h2 class="card-title text-center">Inicio de sesión</h2>
                        <form @submit.prevent="handleLogin">
                            <div class="form-group mb-3">
                                <label for="email">Correo electrónico</label>
                                <input type="email" class="form-control" id="email" v-model="email"
                                    @focus="startTiming('email')" @blur="() => endTiming('email', times)"
                                    placeholder="Introduce tu direccion de correo electrónico" oninvalid="this.setCustomValidity('Introduce el E-mail')" required />
                            </div>
                            <div class="form-group mb-3">
                                <label for="password">Contraseña</label>
                                <input type="password" class="form-control" id="password" v-model="password"
                                    @focus="startTiming('password')" @blur="() => endTiming('password', times)"
                                    placeholder="Introduce tu contraseña" required oninvalid="this.setCustomValidity('Introduce la contraseña')" />
                            </div>
                            <button type="submit" class="btn btn-primary w-100">Iniciar sesión</button>
                        </form>
                        <div v-if="errorMessage" class="alert alert-danger mt-3">
                            {{ errorMessage }}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { supabase } from '../utils/supabase';
import { startTiming, endTiming } from '../utils/timingUtils';

export default defineComponent({
    name: 'LoginPage',
    setup() {
        const email = ref('');
        const password = ref('');
        const errorMessage = ref('');
        const times = ref<{ email: number; password: number }>({
            email: 0,
            password: 0,
        });

        const handleLogin = async () => {
            // Registrar los tiempos de cada campo
            await supabase.from('form-timing').insert([
                { page: 'Login', input: 'email', time: times.value.email },
                { page: 'Login', input: 'password', time: times.value.password },
            ]);

            // Procesar el login en Supabase
            const { error } = await supabase.auth.signInWithPassword({
                email: email.value,
                password: password.value,
            });

            if (error) {
                errorMessage.value = error.message;
            } else {
                window.location.href = '/login';
            }
        };

        return {
            email,
            password,
            handleLogin,
            errorMessage,
            startTiming,
            endTiming,
            times,
        };
    },
});
</script>

<style scoped>
.container {
    max-width: 500px;
}
</style>