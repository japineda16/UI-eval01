<template>
    <div class="container mt-5">
        <h2>Edit Profile</h2>
        <form @submit.prevent="saveProfile">
            <!-- Name -->
            <div class="form-row">
                <div class="col">
                    <label for="title">Title</label>
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

            <!-- Location -->
            <h4 class="mt-3">Location</h4>
            <div class="form-row">
                <div class="col">
                    <label for="street">Street</label>
                    <input type="text" v-model="profile.location.street" class="form-control" id="street" required />
                </div>
                <div class="col">
                    <label for="city">City</label>
                    <input type="text" v-model="profile.location.city" class="form-control" id="city" required />
                </div>
            </div>

            <div class="form-row">
                <div class="col">
                    <label for="state">State</label>
                    <input type="text" v-model="profile.location.state" class="form-control" id="state" required />
                </div>
                <div class="col">
                    <label for="country">Country</label>
                    <input type="text" v-model="profile.location.country" class="form-control" id="country" required />
                </div>
                <div class="col">
                    <label for="postcode">Postcode</label>
                    <input type="number" v-model="profile.location.postcode" class="form-control" id="postcode"
                        required />
                </div>
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
import { UserProfile } from '../types/interfaces';

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
            } as UserProfile
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
                    .eq('id', user.id)
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
        }
    }
});
</script>

<style scoped>
.container {
    max-width: 600px;
}
</style>