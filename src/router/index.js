import Vue from "vue";
import VueRouter from "vue-router";
import { auth } from "../firebase/credentials.js";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home-view",
    component: () => import(/* webpackChunkName: "home" */ "../views/Home.vue"),
  },
  {
    path: "/about",
    name: "About",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
  {
    path: "/plat",
    name: "Plat",
    component: () => import(/* webpackChunkName: "plat" */ "../views/Plat.vue"),
  },
  {
    path: "/login",
    name: "Login",
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/Login.vue"),
  },
  {
    path: "/available-lots",
    name: "AvailableLots",
    component: () =>
      import(
        /* webpackChunkName: "availableLots" */ "../views/AvailableLots.vue"
      ),
    meta: { auth: true },
  },
  {
    path: "/applications",
    name: "Applications",
    component: () =>
      import(
        /* webpackChunkName: "applications" */ "../views/Applications.vue"
      ),
    meta: { auth: true },
  },
  {
    path: "/account",
    name: "MyAccount",
    component: () =>
      import(/* webpackChunkName: "myaccount" */ "../views/MyAccount.vue"),
    meta: { auth: true },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
  scrollBehavior(to) {
    if (to == null) console.log("");
    return { x: 0, y: 0 };
  },
  // scrollBehavior(to, from, savedPosition) {
  //   console.log(to, from, savedPosition);
  //   return { x: 0, y: 0 };
  // },
});

router.beforeEach((to, from, next) => {
  const requiredAuth = to.matched.some((x) => x.meta.auth);

  if (requiredAuth && !auth.currentUser) {
    next("/login");
  } else {
    next();
  }
});

export default router;
