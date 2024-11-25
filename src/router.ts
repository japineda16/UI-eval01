import { createRouter, createWebHistory } from "vue-router";
import HomePage from "./views/HomePage.vue";
import AboutPage from "./views/AboutPage.vue";
import LoginPage from "./views/LoginPage.vue";
import Colors from "./views/Colors.vue";
import Tangram from "./views/Tangram.vue";
import { supabase } from "./utils/supabase";

const routes = [
  {
    path: "/",
    name: "Home",
    component: HomePage,
  },
  {
    path: "/about",
    name: "About",
    component: AboutPage,
  },
  {
    path: "/login",
    name: "Login",
    component: LoginPage,

    beforeEnter: async (_to: any, _from: any, next: any) => {
      // Verifica si el usuario tiene sesión abierta
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        next("/edit-profile");
      } else {
        next();
      }
    },
  },
  {
    path: "/sign-up",
    name: "Registro",
    component: () => import("./views/SignUpPage.vue"),
    beforeEnter: async (_to: any, _from: any, next: any) => {
      // Verifica si el usuario tiene sesión abierta
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        next("/edit-profile");
      } else {
        next();
      }
    },
  },
  {
    path: "/edit-profile",
    component: () => import("./views/EditProfile.vue"),
    beforeEnter: async (_to: any, _from: any, next: any) => {
      // Verifica si el usuario tiene sesión abierta
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        next("/login");
      } else {
        next();
      }
    },
  },
  {
    path: "/colors",
    name: "Colores",
    component: Colors,

    beforeEnter: async (_to: any, _from: any, next: any) => {
      // Verifica si el usuario tiene sesión abierta
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        next();
      } else {
        next("/login");
      }
    },
  },
  {
    path: "/tangram",
    name: "Tangram",
    component: Tangram,

    beforeEnter: async (_to: any, _from: any, next: any) => {
      // Verifica si el usuario tiene sesión abierta
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        next();
      } else {
        next("/login");
      }
    },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
