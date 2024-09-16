<template>
    <div class="container mt-5">
        <div class="row justify-content-center">
            <div class="col-md-12">
                <div class="card">
                    <div class="card-body">
                        <h2 class="card-title text-center">Registrarse</h2>
                        <form @submit.prevent="handleSignUp">
                            <div class="form-group mb-3">
                                <label for="email">Correo electrónico</label>
                                <input type="email" class="form-control" id="email" v-model="email"
                                    @focus="startTiming('email')" @blur="() => endTiming('email', times)"
                                    placeholder="Introduce tu direccion de correo electrónico" required />
                                <div v-if="errors.email" class="text-danger">{{ errors.email }}</div>
                            </div>
                            <div class="form-group mb-3">
                                <label for="password">Contraseña</label>
                                <input type="password" class="form-control" id="password" v-model="password"
                                    @focus="startTiming('password')" @blur="() => endTiming('password', times)"
                                    placeholder="Introduce tu contraseña" required />
                                <div v-if="errors.password" class="text-danger">{{ errors.password }}</div>
                            </div>
                            <div class="form-group mb-3">
                                <label for="confirmPassword">Confirmar contraseña</label>
                                <input @focus="startTiming('confirmPassword')"
                                    @blur="() => endTiming('confirmPassword', times)" type="password"
                                    class="form-control" id="confirmPassword" v-model="confirmPassword"
                                    placeholder="Vuelve a introducir tu contraseña" required />
                                <div v-if="errors.confirmPassword" class="text-danger">{{ errors.confirmPassword }}
                                </div>
                            </div>
                            <button type="submit" class="btn btn-primary w-100">Registrarse</button>
                            <div v-if="message" class="mt-3 alert" :class="alertClass">
                                {{ message }}
                            </div>
                        </form>
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
    name: 'SignUpPage',
    setup() {
        const email = ref('');
        const password = ref('');
        const confirmPassword = ref('');
        const errors = ref<{ [key: string]: string }>({});
        const message = ref<string | null>(null);
        const alertClass = ref('alert-success');
        const times = ref<{ email: number; password: number, confirmPassword: number }>({
            email: 0,
            password: 0,
            confirmPassword: 0
        });

        const validateForm = () => {
            errors.value = {};
            if (!email.value) errors.value.email = 'Email is required';
            if (!password.value) errors.value.password = 'Password is required';
            if (password.value !== confirmPassword.value) errors.value.confirmPassword = 'Passwords do not match';
            return Object.keys(errors.value).length === 0;
        };

        const handleSignUp = async () => {
            if (!validateForm()) return;

            const { error } = await supabase.auth.signUp({
                email: email.value,
                password: password.value,
            });
            // Registrar los tiempos de cada campo
            await supabase.from('form-timing').insert([
                { page: 'Sign Up', input: 'email', time: times.value.email },
                { page: 'Sign Up', input: 'password', time: times.value.password },
                { page: 'Sign Up', input: 'confirmPassword', time: times.value.confirmPassword },
            ]);

            if (error) {
                message.value = `Error: ${error.message}`;
                alertClass.value = 'alert-danger';
            } else {
                message.value = 'Registration successful!';
                alertClass.value = 'alert-success';
            }
        };

        return {
            email,
            password,
            confirmPassword,
            handleSignUp,
            errors,
            startTiming,
            endTiming,
            times,
            message,
            alertClass,
        };
    },
});
</script>

<style scoped>
.container {
    max-width: 500px;
}

.alert {
    display: none;
}

.alert.alert-success {
    background-color: #d4edda;
    color: #155724;
}

.alert.alert-danger {
    background-color: #f8d7da;
    color: #721c24;
}
</style>