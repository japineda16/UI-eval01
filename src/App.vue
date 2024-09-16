<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
  <div class="container-fluid">
    <a class="navbar-brand" href="#">UI UJAP</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item">
          <router-link to="/" class="nav-link active" aria-current="page">Home</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/login" class="nav-link active" aria-current="page">Iniciar sesión</router-link>
        </li>
        <li>
          <router-link to="/sign-up" class="nav-link active" aria-current="page">Registrarse</router-link>
        </li>
        <li>
          <router-link to="/about" class="nav-link active" aria-current="page">Acerca de</router-link>
        </li>
      </ul>
    </div>
  </div>
</nav>
<router-view />
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
