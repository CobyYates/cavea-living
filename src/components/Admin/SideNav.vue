<template>
  <div class="d-flex flex-column">
    <v-btn
      :x-large="$vuetify.breakpoint.mdAndUp"
      :medium="$vuetify.breakpoint.smAndDown"
      text
      dark
      v-for="btn in items"
      :key="btn.i"
      :to="btn.to"
    >
      {{ btn.title }}
    </v-btn>
  </div>
</template>

<script>
export default {
  data() {
    return {
      mini: false,
      nav: true,
      items: [
        { title: "Home", icon: "mdi-home", to: "/" },
        { title: "Plat Map", icon: "mdi-map-outline", to: "/plat" },
        {
          title: "Applications",
          icon: "mdi-note-text-outline",
          to: "/applications",
        },
        {
          title: "Lots",
          icon: "mdi-map-marker-check-outline",
          to: "/available-lots",
        },
        { title: "Users", icon: "mdi-account", to: "/account" },
      ],
      right: null,
    };
  },
};
</script>

<style lang="scss" scoped>
#navBtn {
  z-index: 120;
  position: absolute;
  left: 20px;
}
</style>
