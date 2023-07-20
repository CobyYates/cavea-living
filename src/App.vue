<template>
  <v-app>
    <v-app-bar
      v-if="showNav"
      id="nav"
      flat
      :height="background ? '70' : '100'"
      dense
      absolute
      :color="background ? 'rgba(49, 49, 49, 0.69)' : 'rgba(49, 49, 49, 0.19)'"
    >
      <v-row class="py-2 px-6">
        <v-col cols="6">
          <v-img
            @click="$router.push('/')"
            width="250"
            min-width="200"
            contain
            class="px-4 clickable"
            src="./assets/ElementLogo.png"
          />
        </v-col>
        <v-col
          cols="6"
          class="d-flex align-center justify-end"
          v-if="$vuetify.breakpoint.mdAndUp"
        >
          <router-link to="/" class="mr-6 font-weight-light">
            HOME
          </router-link>
          <router-link to="/about" class="mr-6 font-weight-light">
            ABOUT
          </router-link>
          <router-link to="/plat" class="mr-6 font-weight-light">
            LOTS
          </router-link>
          <router-link
            v-if="!isAuthenticated"
            to="/login"
            class="font-weight-light"
          >
            LOGIN
          </router-link>
          <div v-if="isAuthenticated" class="d-flex align-center">
            <router-link to="/applications" class="font-weight-light">
              PORTAL
            </router-link>
            <p
              class="font-weight-light white--text mb-0 pl-6 clickable"
              text
              @click="logout"
            >
              LOGOUT
            </p>
          </div>
        </v-col>
        <v-col cols="6" class="text-end" v-else>
          <v-icon large dark @click="navDrawer = true">mdi-menu</v-icon>
        </v-col>
      </v-row>
    </v-app-bar>

    <v-bottom-sheet v-model="navDrawer">
      <v-sheet class="text-center" height="50vh">
        <v-list dense class="py-0">
          <v-list-item
            :to="item.to"
            @click="navDrawer = false"
            v-for="item in items"
            :key="item.title"
          >
            <v-list-item-content>
              <v-list-item-title class="font-weight-light py-3 text-center">
                <p>{{ item.title }}</p>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item
            to="/applications"
            v-if="isAuthenticated"
            @click="navDrawer = false"
          >
            <v-list-item-content>
              <v-list-item-title class="font-weight-light py-3 text-center">
                <p>Portal</p>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item
            v-if="!isAuthenticated"
            @click="navDrawer = false"
            to="/login"
          >
            <v-list-item-content>
              <v-list-item-title class="font-weight-light py-3 text-center">
                <p>Login</p>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item v-else @click="logout">
            <v-list-item-content>
              <v-list-item-title class="font-weight-light py-3 text-center">
                <p>Logout</p>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-sheet>
    </v-bottom-sheet>

    <v-main class="px-0">
      <router-view class="pt-3" />
    </v-main>

    <Footer />
  </v-app>
</template>

<script>
import { mapState } from "vuex";
import Footer from "./components/Home/Footer";

export default {
  // name: "primary-view",
  components: {
    Footer,
  },
  data() {
    return {
      items: [
        { title: "Home", to: "/" },
        { title: "About", to: "/about" },
        { title: "Lots", to: "/plat" },
      ],
      navDrawer: false,
      lastScrollPosition: 0,
      showTopButton: false,
    };
  },
  methods: {
    logout() {
      this.$store.dispatch("logout");
    },
  },
  computed: {
    ...mapState(["userProfile", "isAuthenticated"]),
    showNav() {
      let result = true;
      if (
        this.$route.path === "/applications" ||
        this.$route.path === "/available-lots" ||
        this.$route.path === "/account"
      )
        result = false;
      return result;
    },
    background() {
      let result;
      if (this.$route.path == "/plat") result = true;
      else result = false;
      return result;
    },
  },
  mounted() {
    window.addEventListener("scroll", this.onScroll);
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.onScroll);
  },
};
</script>

<style lang="scss">
#nav a {
  text-decoration: none;
  color: white !important;
}

.clickable {
  cursor: pointer;
}

.router-link-exact-active {
  border-bottom: 2px solid white !important;
}

* {
  scrollbar-width: thin;
  scrollbar-color: #fff #ccc;
}

/* Works on Chrome, Edge, and Safari */
*::-webkit-scrollbar {
  width: 10px;
}

*::-webkit-scrollbar-track {
  background: #fff;
}

*::-webkit-scrollbar-thumb {
  background-color: #ccc;
  border-radius: 20px;
}

h1,
h2 {
  font-family: "Tw Cen MT", sans-serif !important;
}
h2 {
  font-size: 1.6rem;
  font-weight: 600;
  color: rgb(110, 110, 113);
}
h3,
h4,
p,
a,
strong,
li,
tspan,
.v-btn {
  font-family: "Tw Cen MT", sans-serif !important;
}
h3 {
  font-size: 1.5rem;
  font-weight: 500;
  color: rgb(110, 110, 113);
}
h4 {
  font-size: 1.4rem;
  font-weight: 500;
  color: rgb(110, 110, 113);
}
tspan {
  font-size: 1.4rem;
}
.v-btn {
  font-size: 1.3rem !important;
}
li {
  font-size: 1.3rem;
}
p,
a {
  font-size: 1.4rem;
  font-weight: 100;
  color: #6e6e71;
}
</style>
