<template>
  <div id="hero">
    <v-img
      :src="require(`../../assets/00 Rear Perspective.jpg`)"
      max-height="100vh"
      height="100vh"
    >
      <v-overlay absolute opacity=".2" class="text-center" color="black">
        <CaveaLogo v-if="logo == 'cavea'" :width="600" />
        <h1 v-html="heroTitle" class="font-weight-light mb-6 pt-5 px-4" />
        <v-btn v-if="cta" color="white" outlined large to="/plat">
          View Lots
        </v-btn>
      </v-overlay>
    </v-img>
  </div>
</template>

<script>
import CaveaLogo from "../SVG/CaveaLogo";
export default {
  name: "hero-component",
  components: {
    CaveaLogo,
  },
  props: {
    heroTitle: {
      type: String,
      default: "",
    },
    heroSubtitle: {
      type: String,
      default: "",
    },
    logo: {
      type: String,
      default: "",
    },
    cta: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped>
@media only screen and (max-width: 600px) {
  h1 {
    line-height: 3.2rem !important;
    font-size: 2.2rem;
    font-weight: bold !important;
  }
}

@media only screen and (max-width: 900px) and (min-width: 600px) {
  h1 {
    line-height: 4.5rem !important;
    font-size: 3.2rem;
    font-weight: bold !important;
  }
}

@media only screen and (min-width: 900px) {
  h1 {
    line-height: 4.5rem !important;
    font-size: 4.2rem;
    font-weight: bold !important;
  }
}

#hero {
  position: relative;
  #nav {
    position: absolute;
    top: 0;
    z-index: 1000;
  }
}
</style>
