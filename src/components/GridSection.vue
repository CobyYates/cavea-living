<template>
  <v-row
    :style="{ background: backgroundColor }"
    :class="gridClass ? gridClass : ''"
  >
    <v-col>
      <v-row v-if="title" class="text-center">
        <v-col>
          <h2 class="grid__title" :style="`color:${copyColor}!important;`">
            {{ title }}
          </h2>
        </v-col>
      </v-row>
      <v-row justify="center" v-if="subtitle" class="text-center">
        <v-col cols="12" md="8" lg="6">
          <h3
            class="mb-0 grid__subtitle"
            :style="`color:${copyColor}!important;`"
          >
            {{ subtitle }}
          </h3>
        </v-col>
      </v-row>
      <div v-if="imageSeparator && desktop" class="grid__connection-line" />
      <v-row :class="gridClass">
        <v-col
          cols="12"
          sm="12"
          :md="columnCount"
          class="mx-auto"
          v-for="card in gridItemArray"
          :key="card.i"
        >
          <card :separator="imageSeparator" v-bind="card" />
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import Card from "./Card.vue";
export default {
  components: { Card },
  data() {
    return {
      gridItemsFetch: null,
    };
  },
  props: {
    title: {
      type: String,
      default: "",
    },
    subtitle: {
      type: String,
      default: "",
    },
    copyColor: {
      type: String,
      default: "",
    },
    backgroundColor: {
      type: String,
      default: "",
    },
    imageSeparator: {
      type: Boolean,
      default: false,
    },
    orderCards: {
      type: Boolean,
      default: false,
    },
    gridClass: {
      type: String,
      default: "",
    },
    gridItems: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    gridIds() {
      const gridItems = this.gridItems.map((e) => e.sys.id);
      return gridItems;
    },
    gridItemArray() {
      let results;
      const gridItems = this.gridItems;
      //   const gridItemsFetch = this.gridItemsFetch;
      const orderCards = this.orderCards;
      if (gridItems && orderCards) {
        results = gridItems.sort((a, b) => a.order - b.order);
      } else if (gridItems) {
        results = gridItems;
      } else {
        results = gridItems;
      }
      return results;
    },
    columnCount() {
      const count = this.gridItemArray.length;
      let result = 12 / count;
      return result;
    },
    desktop() {
      return this.$vuetify.breakpoint.mdAndUp ? true : false;
    },
  },
};
</script>

<style lang="scss" scoped>
.grid {
  &__title {
    font-size: 2.8rem;
    font-weight: 100;
  }
  &__subtitle {
    font-weight: 100 !important;
  }
  &__connection-line {
    position: absolute;
    display: inline-block;
    transform: translate(-50%, -50%);
    margin-left: 50%;
    margin-top: 95px;
    width: 60%;
    border-bottom: 2px solid #579099;
  }
}
</style>
