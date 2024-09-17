<template>
  <div>
    <nav>
      <router-link to="/">Home</router-link>
      <router-link to="/about">About</router-link>
      <router-link v-if="!user" to="/login">Login</router-link>
      <router-link v-if="!user" to="/sign-up">Registro</router-link>
      <a @click="logout" v-if="user?.id" href="#">Cerrar sesión</a>
    </nav>
    <router-view />
  </div>
</template>

<script>
import { supabase } from "./utils/supabase";
const {
  data: { user },
} = await supabase.auth.getUser();
export default {
  name: 'App',
  methods: {
    async logout() {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error logging out:', error.message);
      } else {
        // Redirect to login page or perform any other action
        this.$router.push('/login');
      }
    }
  },
  data() {
    return {
      user
    };
  },
};
</script>


<style>
nav {
  margin-bottom: 1rem;
}

nav a {
  margin-right: 10px;
}
</style>
