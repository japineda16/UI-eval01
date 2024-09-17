<template>
    <div class="container mt-5">
        <h2>Edit Profile</h2>
        <form @submit.prevent="saveProfile">
            <!-- Name -->
            <div class="form-row">
                <div class="col">
                    <label for="title">Nombre</label>
                    <input type="text" v-model="profile.name.title" class="form-control" id="title" required />
                </div>
                <div class="col">
                    <label for="firstName">First Name</label>
                    <input type="text" v-model="profile.name.first" class="form-control" id="firstName" required />
                </div>
                <div class="col">
                    <label for="lastName">Last Name</label>
                    <input type="text" v-model="profile.name.last" class="form-control" id="lastName" required />
                </div>
            </div>

            <!-- Address Autocomplete -->
            <div class="form-group">
                <label for="address">Address</label>
                <input type="text" v-model="addressQuery" class="form-control" id="address"
                    @input="fetchLocationSuggestions" placeholder="Start typing your address" required />
                <!-- Sugerencias de dirección -->
                <ul class="list-group mt-2" v-if="suggestions.length > 0">
                    <li class="list-group-item" v-for="(suggestion, index) in suggestions" :key="index"
                        @click="selectAddress(suggestion)" style="cursor: pointer;">
                        {{ suggestion?.display_name }}
                    </li>
                </ul>
            </div>

            <!-- Email, Phone, etc. -->
            <div class="form-group mt-3">
                <label for="email">Email</label>
                <input type="email" v-model="profile.email" class="form-control" id="email" required />
            </div>
            <div class="form-group">
                <label for="phone">Phone</label>
                <input type="text" v-model="profile.phone" class="form-control" id="phone" required />
            </div>

            <div class="form-group">
                <label for="picture">Profile Picture URL</label>
                <input type="text" v-model="profile.picture" class="form-control" id="picture" />
            </div>

            <button type="submit" class="btn btn-primary">Save Changes</button>
        </form>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { supabase } from "../utils/supabase"
import { LocationResponse, UserProfile } from '../types/interfaces';
import axios from 'axios';

export default defineComponent({
    data() {
        return {
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
            suggestions: [] as LocationResponse[]
        };
    },
    mounted() {
        this.loadProfile();
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
                }
            }
        },
        async saveProfile() {
            // Save the updated profile to Supabase
            const { error } = await supabase
                .from('profiles')
                .update(this.profile)
                .eq('id', this.profile.id);

            if (error) {
                console.error('Error saving profile:', error);
            } else {
                alert('Profile updated successfully');
            }
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
            this.suggestions = []; // Limpiar las sugerencias después de seleccionar
        }
    }
});
</script>

<style scoped>
.container {
    max-width: 600px;
}
</style>