<template>
  <v-row>
    <v-col class="py-7">
      <carousel
        :perPage="perPage"
        v-if="desktop"
        class="carousel mx-10"
        v-bind="carousel"
      >
        <slide v-for="image in images" :key="image.i">
          <v-img width="550" height="350" :src="image" class="mx-2" />
        </slide>
      </carousel>
      <div v-else class="carousel__mobile">
        <v-img
          v-for="image in images"
          :key="image.i"
          :src="image"
          class="mx-2"
          width="400"
          height="300"
        />
      </div>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "carousel-component",
  data() {
    return {
      int: 0,
      carousel: {
        perPage: 3,
        navigationEnabled: true,
        scrollPerPage: false,
        paginationActiveColor: "#579099",
        paginationEnabled: false,
        autoplay: true,
        autoplayTimeout: 3000,
        autoplayHoverPause: true,
      },
      images: [
        require("../../assets/carousel/01 Main Level Entry Bridge-min.png"),
        require("../../assets/carousel/02 Main Level Entry Bridge 02-min.png"),
        require("../../assets/carousel/03 Main Level Entry-min.png"),
        require("../../assets/carousel/04 Main Level Great Room-min.png"),
        require("../../assets/carousel/05 Main Level Great Room & Kitchen-min.png"),
        require("../../assets/carousel/06 Main Level Kitchen & Dining-min.png"),
        require("../../assets/carousel/10 Main Level Great Room Patio 2-min.png"),
        require("../../assets/carousel/2022-11-09 Master Bath-min.png"),
        require("../../assets/carousel/Lot 2_11 (1)-min.png"),
        require("../../assets/carousel/Lower Level Media Room-min.png"),
        require("../../assets/carousel/VIP Bath-min.png"),
        require("../../assets/carousel/Wellness-1-min.png"),
      ],
    };
  },
  computed: {
    perPage() {
      const size = this.$vuetify.breakpoint;
      let result = 3;
      if (size.md) {
        result = 2;
      } else if (size.lg || size.xl) {
        result = 3;
      }
      return result;
    },
    desktop() {
      return this.$vuetify.breakpoint.mdAndUp;
    },
  },
};
</script>

<style lang="scss" scoped>
.carousel {
  cursor: grab;
  &__mobile {
    display: flex;
    overflow-x: scroll;
  }
}
</style>
