import { createRouter, createWebHistory } from "vue-router";
import HomePage from "./views/HomePage.vue";
import AboutPage from "./views/AboutPage.vue";
import LoginPage from "./views/LoginPage.vue";

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
  { path: "/login", name: "Login", component: LoginPage },
  {
    path: "/sign-up",
    name: "Registro",
    component: () => import("./views/SignUpPage.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
