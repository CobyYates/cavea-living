<template>
  <GridSection v-bind="section" />
</template>

<script>
import GridSection from "../components/GridSection.vue";
export default {
  components: {
    GridSection,
  },
  props: {
    section: {
      type: Object,
      default: () => {},
    },
  },
  mounted() {
    console.log("test", this.section);
  },
};
</script>
