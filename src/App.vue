<template>
  <div>
    <nav>
      <router-link to="/">Home</router-link>
      <router-link to="/about">About</router-link>
      <router-link to="/login">Login</router-link>
      <router-link to="/sign-up">Registro</router-link>
    </nav>
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
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
