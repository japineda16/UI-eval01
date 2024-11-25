<template>
  <nav id="nav-color" class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">UI UJAP</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link to="/" class="nav-link active" aria-current="page">Inicio</router-link>
          </li>
          <li v-if="!user?.id" class="nav-item">
            <router-link to="/login" class="nav-link active" aria-current="page">Iniciar sesión</router-link>
          </li>
          <li v-if="!user?.id">
            <router-link to="/sign-up" class="nav-link active" aria-current="page">Registrarse</router-link>
          </li>
          <li>
            <router-link to="/about" class="nav-link active" aria-current="page">Acerca de</router-link>
          </li>
          <li v-if="user?.id">
            <router-link to="/edit-profile" class="nav-link active" aria-current="page">Editar perfil</router-link>
          </li>
          <li v-if="user?.id">
            <router-link to="/colors" class="nav-link active" aria-current="page">Personalización de
              colores</router-link>
          </li>
          <li>
            <router-link to="/terms" class="nav-link active" aria-current="page">Términos y Condiciones</router-link>
          </li>
        </ul>
      </div>
      <a v-if="user?.id" @click="logout" href="#">Cerrar sesión</a>
    </div>
  </nav>


  <router-view />


  <!-- Footer Start -->
  <div class="container-fluid footer py-5 wow fadeIn" data-wow-delay="0.2s" id="footer-color">
    <div class="container py-5 border-start-0 border-end-0"
      style="border: 1px solid; border-color: rgb(255, 255, 255, 0.08);">
      <div class="row g-5">
        <div class="col-md-6 col-lg-6 col-xl-4">
          <div class="footer-item">
            <a href="index.html" class="p-0">
              <h4 class="text-white"><i class="fas fa-search-dollar me-3"></i>Stocker</h4>
              <!-- <img src="img/logo.png" alt="Logo"> -->
            </a>
            <p class="mb-4">Dolor amet sit justo amet elitr clita ipsum elitr est.Lorem ipsum dolor sit
              amet, consectetur adipiscing...</p>
            <div class="d-flex">
              <a href="#" class="bg-primary d-flex rounded align-items-center py-2 px-3 me-2">
                <i class="fas fa-apple-alt text-white"></i>
                <div class="ms-3">
                  <small class="text-white">Download on the</small>
                  <h6 class="text-white">App Store</h6>
                </div>
              </a>
              <a href="#" class="bg-dark d-flex rounded align-items-center py-2 px-3 ms-2">
                <i class="fas fa-play text-primary"></i>
                <div class="ms-3">
                  <small class="text-white">Get it on</small>
                  <h6 class="text-white">Google Play</h6>
                </div>
              </a>
            </div>
          </div>
        </div>
        <div class="col-md-6 col-lg-6 col-xl-2">
          <div class="footer-item">
            <h4 class="text-white mb-4">Quick Links</h4>
            <a href="#"><i class="fas fa-angle-right me-2"></i> About Us</a>
            <a href="#"><i class="fas fa-angle-right me-2"></i> Feature</a>
            <a href="#"><i class="fas fa-angle-right me-2"></i> Attractions</a>
            <a href="#"><i class="fas fa-angle-right me-2"></i> Tickets</a>
            <a href="#"><i class="fas fa-angle-right me-2"></i> Blog</a>
            <a href="#"><i class="fas fa-angle-right me-2"></i> Contact us</a>
          </div>
        </div>
        <div class="col-md-6 col-lg-6 col-xl-3">
          <div class="footer-item">
            <h4 class="text-white mb-4">Support</h4>
            <a href="#"><i class="fas fa-angle-right me-2"></i> Privacy Policy</a>
            <a href="#"><i class="fas fa-angle-right me-2"></i> Terms & Conditions</a>
            <a href="#"><i class="fas fa-angle-right me-2"></i> Disclaimer</a>
            <a href="#"><i class="fas fa-angle-right me-2"></i> Support</a>
            <a href="#"><i class="fas fa-angle-right me-2"></i> FAQ</a>
            <a href="#"><i class="fas fa-angle-right me-2"></i> Help</a>
          </div>
        </div>
        <div class="col-md-6 col-lg-6 col-xl-3">
          <div class="footer-item">
            <h4 class="text-white mb-4">Contact Info</h4>
            <div class="d-flex align-items-center">
              <i class="fas fa-map-marker-alt text-primary me-3"></i>
              <p class="text-white mb-0">123 Street New York.USA</p>
            </div>
            <div class="d-flex align-items-center">
              <i class="fas fa-envelope text-primary me-3"></i>
              <p class="text-white mb-0">info@example.com</p>
            </div>
            <div class="d-flex align-items-center">
              <i class="fa fa-phone-alt text-primary me-3"></i>
              <p class="text-white mb-0">(+012) 3456 7890</p>
            </div>
            <div class="d-flex align-items-center mb-4">
              <i class="fab fa-firefox-browser text-primary me-3"></i>
              <p class="text-white mb-0">Yoursite@ex.com</p>
            </div>
            <div class="d-flex">
              <a class="btn btn-primary btn-sm-square rounded-circle me-3" href="#"><i
                  class="fab fa-facebook-f text-white"></i></a>
              <a class="btn btn-primary btn-sm-square rounded-circle me-3" href="#"><i
                  class="fab fa-twitter text-white"></i></a>
              <a class="btn btn-primary btn-sm-square rounded-circle me-3" href="#"><i
                  class="fab fa-instagram text-white"></i></a>
              <a class="btn btn-primary btn-sm-square rounded-circle me-0" href="#"><i
                  class="fab fa-linkedin-in text-white"></i></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- Footer End -->

  <!-- Copyright Start -->
  <div class="container-fluid copyright py-4" id="footer-color">
    <div class="container">
      <div class="row g-4 align-items-center">
        <div class="col-md-6 text-center text-md-start mb-md-0">
          <span class="text-body"><a href="#" class="border-bottom"><i class="fas fa-copyright text-light me-2"></i>Your
              Site Name</a>, All right
            reserved.</span>
        </div>
        <div class="col-md-6 text-center text-md-end text-body">
          <!--/*** This template is free as long as you keep the below author's credit link/attribution link/backlink. ***/-->
          <!--/*** If you'd like to use the template without the below author's credit link/attribution link/backlink, ***/-->
          <!--/*** you can purchase the Credit Removal License from "https://htmlcodex.com/credit-removal". ***/-->
          Hecho por <a class="border-bottom" href="https://htmlcodex.com">Jose Pineda</a>
          también por <a class="border-bottom" href="https://themewagon.com">Alejandro Placencia</a>
        </div>
      </div>
    </div>
  </div>
  <!-- Copyright End -->
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
        window.location.href = '/login';
      }
    }
  },
  computed: {
    user() {
      return this.user;
    }
  },
  data() {
    return {
      user: user
    }
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