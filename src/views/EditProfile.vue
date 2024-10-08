<template>
    <div class="container mt-5">
        <h2>Edit Profile</h2>
        <form @submit.prevent="saveProfile">
            <!-- Name -->
            <div class="row">
                <div class="col">
                    <label for="firstName">Primer nombre</label>
                    <input @focus="startInputTiming('firstName')" @blur="endInputTiming('firstName')" type="text"
                        v-model="profile.name.first" class="form-control" id="firstName" required />
                </div>
                <div class="col">
                    <label for="lastName">Apellidos</label>
                    <input @focus="startInputTiming('lastName')" @blur="endInputTiming('lastName')" type="text"
                        v-model="profile.name.last" class="form-control" id="lastName" required />
                </div>
            </div>

            <!-- Address Autocomplete -->
            <div class="form-group">
                <label for="address">Dirección</label>
                <input @focus="startInputTiming('address')" @blur="endInputTiming('address')" type="text"
                    v-model="addressQuery" class="form-control" id="address" @input="fetchLocationSuggestions"
                    placeholder="Buscar dirección..." required />
                <!-- Sugerencias de dirección -->
                <ul class="list-group mt-2" v-if="suggestions.length > 0">
                    <li class="list-group-item" v-for="(suggestion, index) in suggestions" :key="index"
                        @click="selectAddress(suggestion)" style="cursor: pointer;">
                        {{ suggestion?.display_name }}
                    </li>
                </ul>
            </div>

            <!-- Mapa -->
            <div v-if="profile.location.coordinates.latitude && profile.location.coordinates.longitude" class="mt-3">
                <h4>Mapa</h4>
                <div id="map" style="height: 300px;"></div>
            </div>

            <!-- Email, Phone, etc. -->
            <div class="form-group mt-3">
                <label for="email">Email</label>
                <input @focus="startInputTiming('email')" @blur="endInputTiming('email')" type="email"
                    v-model="profile.email" class="form-control" id="email" required />
            </div>
            <div class="form-group">
                <label for="phone">Telefono</label>
                <input @focus="startInputTiming('phone')" @blur="endInputTiming('phone')" type="text"
                    v-model="profile.phone" class="form-control" id="phone" required />
            </div>

            <!-- Campo de carga de foto -->
            <div class="form-group">
                <label for="picture">Foto</label>
                <input type="file" class="form-control" id="picture" @change="handleFileChange"
                    @focus="startInputTiming('picture')" @blur="endInputTiming('picture')" />
                <img v-if="typeof profile.picture === 'string' && profile.picture" :src="profile.picture"
                    alt="Foto del perfil" class="mt-2" width="150" />
            </div>

            <div v-if="isSaved" class="mt-2 alert alert-success" role="alert">
                Se ha guardado correctamente.
            </div>
            <div v-if="isSaved != undefined && !isSaved" class="mt-2 alert alert-danger" role="alert">
                Hubo un error al guardar. Por favor, inténtelo de nuevo.
            </div>
            <button type="submit" class="mt-2 btn btn-primary">Guardar cambios</button>
        </form>
        <FormTimingTable />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { supabase } from "../utils/supabase"
import { LocationResponse, UserProfile } from '../types/interfaces';
import axios from 'axios';
import L from 'leaflet';
import { endTiming, startTiming } from '../utils/timingUtils';
import FormTimingTable from '../components/FormTiming.vue';

export default defineComponent({
    components: {
        FormTimingTable
    },
    data() {
        return {
            isSaved: undefined as boolean | undefined,
            profile: {
                gender: '',
                name: {
                    title: '',
                    first: '',
                    last: ''
                },
                location: {
                    street: '',
                    city: '',
                    state: '',
                    country: '',
                    postcode: 0,
                    coordinates: {
                        latitude: '',
                        longitude: ''
                    },
                    timezone: ''
                },
                email: '',
                phone: '',
                id: 0,
                picture: '',
                nat: '',
                dob: {
                    date: '',
                    age: 0
                }
            } as UserProfile,
            addressQuery: '',
            suggestions: [] as LocationResponse[],
            map: null as L.Map | null,
            formTimes: {} as { [key: string]: number }, // Almacena los tiempos de cada campo
            selectedFile: null as File | null // Almacena el archivo seleccionado
        };
    },
    mounted() {
        this.loadProfile();
    },
    beforeMount() {
        (async () => {
            await this.loadProfile();
        })();
    },
    methods: {
        async loadProfile() {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                // Fetch profile from Supabase
                const { data, error: _error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('user_id', user.id)
                    .single();
                if (data) {
                    this.profile = data;
                    // Inicializar el mapa después de cargar el perfil
                    if (this.profile.location.coordinates.latitude && this.profile.location.coordinates.longitude) {
                        this.initializeMap();
                    }
                }
            }
        },
        async saveProfile() {
            if (this.selectedFile) {
                const fileUrl = await this.uploadFile(this.selectedFile);
                this.profile.picture = fileUrl; // Almacena la URL del archivo subido
            }

            const { error } = await supabase
                .from('profiles')
                .update(this.profile)
                .eq('id', this.profile.id);

            await this.saveFormTimings(); // Guardar los tiempos de los campos
            if (error) {
                this.isSaved = false;
                console.error('Error saving profile:', error);
            } else {
                this.isSaved = true;
            }
        },
        async handleFileChange(event: Event) {
            const input = event.target as HTMLInputElement;
            if (input.files && input.files.length > 0) {
                this.selectedFile = input.files[0]; // Almacenar el archivo seleccionado
            }
        },
        async uploadFile(file: File): Promise<string> {
            const name = self.crypto.randomUUID()
            const { error } = await supabase.storage
                .from('uploads') // Asegúrate de que el bucket 'uploads' exista
                .upload(`public/${name}`, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (error) {
                console.error('Error uploading file:', error);
                return '';
            }

            const { data: { publicUrl } } = supabase.storage.from('uploads').getPublicUrl(`public/${name}`);
            return publicUrl || '';
        },
        async fetchLocationSuggestions() {
            if (this.addressQuery.length > 2) {
                try {
                    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
                        params: {
                            q: this.addressQuery,
                            format: 'json',
                            addressdetails: 1,
                            limit: 5
                        }
                    });
                    this.suggestions = response.data as LocationResponse[];
                } catch (error) {
                    console.error('Error fetching location suggestions:', error);
                }
            }
        },
        selectAddress(suggestion: any) {
            this.addressQuery = suggestion.display_name;
            // Llenamos los campos de location con los datos del API
            this.profile.location = {
                street: suggestion.address.road || '',
                city: suggestion.address.city || '',
                state: suggestion.address.state || '',
                country: suggestion.address.country || '',
                postcode: suggestion.address.postcode || 0,
                coordinates: {
                    latitude: suggestion.lat,
                    longitude: suggestion.lon
                },
                timezone: '' // Aquí podrías agregar una API adicional para la zona horaria
            };
            if (this.map) {
                this.map.remove();
                this.map = L.map('map').setView(
                    [Number(suggestion.lat), Number(suggestion.lon)],
                    13
                );
                // Cargar las capas de OpenStreetMap
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; OpenStreetMap contributors'
                }).addTo(this.map);

                // Agregar un marcador en las coordenadas
                L.marker([Number(suggestion.lat), Number(suggestion.lon)]).addTo(this.map);
            }

            this.suggestions = []; // Limpiar las sugerencias después de seleccionar
        },
        initializeMap() {
            if (this.map) {
                this.map.remove();
            }
            // Crear el mapa centrado en las coordenadas de la ubicación seleccionada
            this.map = L.map('map').setView(
                [Number(this.profile.location.coordinates.latitude), Number(this.profile.location.coordinates.longitude)],
                13
            );

            // Cargar las capas de OpenStreetMap
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(this.map);

            // Agregar un marcador en las coordenadas
            L.marker([Number(this.profile.location.coordinates.latitude), Number(this.profile.location.coordinates.longitude)]).addTo(this.map);
        },

        startInputTiming(input: string) {
            startTiming(input); // Inicia el tiempo
        },
        endInputTiming(input: string) {
            endTiming(input, this.formTimes); // Finaliza el tiempo y lo guarda en formTimes
        },
        async saveFormTimings() {
            const pageName = 'EditProfile'; // Página actual

            for (const input in this.formTimes) {
                const time = this.formTimes[input];

                // Insertar los tiempos en la tabla form-timing
                const { error } = await supabase
                    .from('form-timing')
                    .insert({ page: pageName, input, time });

                if (error) {
                    console.error(`Error saving timing for ${input}:`, error);
                }
                if (!error) {
                    this.formTimes = {} as { [key: string]: number }; // Limpiar los tiempos después de guardar
                }
            }
        }
    }
});

"https://nvsvcgomyyahwxlbream.supabase.co/storage/v1/object/public/uploads/public/5f046a78-edd4-4503-a1c1-215a21735e6f"
"https://nvsvcgomyyahwxlbream.supabase.co/storage/v1/object/public/uploads/profile_pictures/5f046a78-edd4-4503-a1c1-215a21735e6f"
</script>

<style scoped>
.container {
    max-width: 900px;
}

.list-group-item:hover {
    background-color: #f8f9fa;
}

#map {
    height: 300px;
}
</style>