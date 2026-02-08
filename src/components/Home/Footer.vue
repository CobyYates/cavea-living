<template>
  <v-row class="grey darken-4 white--text">
    <v-col cols="11" md="8" class="mx-auto py-10 my-6">
      <v-row>
        <v-col cols="12" sm="8" md="6" lg="5">
          <CaveaLogo :width="150" />
        </v-col>
        <v-col cols="12" md="4" class="ml-auto text-end">
          <h3 class="font-weight-light title">GET IN TOUCH</h3>
          <div class="pt-8 font-weight-light">
            <p class="mb-1">208-274-8000</p>
            <p class="mb-1">info@designmyelement.com</p>
            <p class="mb-1">
              1500 W. Cayuse Creek Drive #100-B, Meridian, ID 83646
            </p>
          </div>
        </v-col>
      </v-row>
      <v-divider dark />
      <v-row class="pt-10">
        <v-col cols="12" md="5">
          <p>ELEMENT DESIGN BUILD (C) {{ date }} ALL RIGHTS RESERVED</p>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import CaveaLogo from "../SVG/CaveaLogo.vue";
export default {
  name: "footer-component",
  components: {
    CaveaLogo,
  },
  data() {
    return {
      date: new Date().getFullYear(),
      icons: [
        {
          icon: "mdi-facebook",
          to: "https://www.facebook.com/designmyelement",
        },
        {
          icon: "mdi-linkedin",
          to: "https://www.linkedin.com/company/element-building-company-llc/about/",
        },
        {
          icon: "mdi-instagram",
          to: "",
        },
        // {
        //   icon: "mdi-houz",
        //   to: "",
        // },
      ],
    };
  },
  props: {
    links: {
      type: Object,
      default: () => {},
    },
    description: {
      type: String,
      default: "",
    },
  },
};
</script>

<style lang="scss" scoped></style>
