import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import { auth } from "./firebase/credentials.js";
import VueAnalytics from "vue-analytics";
import VueCarousel from "vue-carousel";

Vue.use(VueAnalytics, {
  id: "G-VNDHXM40CB",
});

Vue.use(VueCarousel);

Vue.config.productionTip = false;

let app;

auth.onAuthStateChanged((user) => {
  if (user && !store.state.isAuthenticated) {
    store.state.isAuthenticated = true;
    store.state.userProfile.email = user.email;
  }
  if (!app) {
    new Vue({
      router,
      store,
      vuetify,
      render: (h) => h(App),
    }).$mount("#app");
  }
});
