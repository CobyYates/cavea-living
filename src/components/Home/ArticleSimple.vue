<template>
  <v-row
    justify="center"
    class="text-center d-flex grey lighten-2"
    :class="small ? '' : 'py-10'"
  >
    <v-col
      cols="12"
      :md="secondaryDetails ? '5' : '12'"
      class="d-flex justify-center flex-column"
    >
      <div id="article" class="mx-auto">
        <h2 v-if="title">{{ title }}</h2>
        <h1 v-if="heading" class="mt-6 font-weight-light">{{ heading }}</h1>
        <h3 v-if="details" class="font-weight-light" v-html="details"></h3>
      </div>
      <div v-if="list" class="d-flex mx-auto pt-2 flex-wrap list">
        <h3
          v-for="item in list"
          :key="item.i"
          label
          class="font-weight-light text-no-wrap mx-3 py-1 d-flex flex-column"
        >
          <v-icon large class="pb-1">
            {{ item.icon }}
          </v-icon>
          {{ item.text }}
        </h3>
      </div>
    </v-col>
    <v-col v-if="secondaryDetails" cols="12" md="5">
      <div id="article" class="mx-auto">
        <h3 class="font-weight-light mt-9">
          {{ secondaryDetails }}
        </h3>
      </div>
    </v-col>
    <v-col cols="12" md="5">
      <v-btn to="/plat" v-if="button" outlined color="primary">
        View Lots
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: {
    heading: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "",
    },
    details: {
      type: String,
      default: "",
    },
    list: {
      type: Array,
      default: () => [],
    },
    secondaryDetails: {
      type: String,
      default: "",
    },
    small: {
      type: Boolean,
      default: false,
    },
    button: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped>
#article {
  width: 60% !important;
}

@media only screen and (max-width: 960px) {
  #article {
    width: 80% !important;
  }
}
@media only screen and (max-width: 630px) {
  .list {
    flex-direction: column;
  }
}
</style>
