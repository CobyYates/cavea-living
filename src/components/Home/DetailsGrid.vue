<template>
  <v-card
    max-width="250"
    flat
    :class="$vuetify.breakpoint.mdAndDown ? '' : 'px-3'"
    class="mx-auto my-10 d-flex flex-column align-center justify-center"
  >
    <v-avatar tile size="80">
      <span class="icon" v-html="icon" />
    </v-avatar>
    <h2 class="title">{{ title }}</h2>
    <h3 class="text-center font-weight-light">{{ text }}</h3>
  </v-card>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "",
    },
    icon: {
      type: String,
      default: "",
    },
  },
};
</script>

<style lang="scss" scoped>
.icon {
  height: 100% !important;
  width: 100% !important;
}
</style>
