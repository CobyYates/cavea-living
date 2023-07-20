<template>
  <v-card :flat="flat" :class="textAlignment" color="transparent">
    <div
      :class="separator ? 'white px-2 mx-auto' : ''"
      :style="separator ? `max-width: ${+iconSize + 20}px;` : ''"
    >
      <v-img
        v-if="image"
        :class="url ? 'clickable' : ''"
        transition="slide-x-transition"
        class="mx-auto c-card__image"
        @click="openUrl()"
        :src="image"
        height="auto"
        :width="iconSize"
        contain
      />
    </div>
    <v-card-title :class="alignment">
      <h2 :style="{ color: titleColor }">{{ title }}</h2>
    </v-card-title>
    <p
      class="px-5"
      :style="{ textAlign: 'justify' } || textAlignment === 'justify'"
      :class="textAlignment"
      v-if="description"
    >
      {{ description }}
    </p>
    <p
      class="px-5"
      :style="{ textAlign: 'justify' } || textAlignment === 'justify'"
      :class="textAlignment"
      v-else
    >
      {{ longDescription }}
    </p>
  </v-card>
</template>

<script>
export default {
  name: "card-component",
  props: {
    title: {
      type: String,
      default: "",
    },
    titleColor: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    longDescription: {
      type: String,
      default: "",
    },
    textAlignment: {
      type: String,
      default: "",
    },
    url: {
      type: String,
      default: "",
    },
    externalLink: {
      type: Boolean,
      default: true,
    },
    flat: {
      type: Boolean,
      default: true,
    },
    image: {
      type: String,
      default: "",
    },
    mdiIcon: {
      type: String,
      default: "",
    },
    svg: {
      type: String,
      default: "",
    },
    iconSize: {
      type: String,
      default: "",
    },
    order: {
      type: String,
      default: "",
    },
    separator: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    alignment() {
      const textAlignment = this.textAlignment;
      let result = textAlignment;
      if (this.textAlignment === "justify") {
        result = "text-center";
      }
      return result;
    },
  },
  methods: {
    openUrl() {
      const externalLink = this.externalLink;
      const url = this.url;
      if (externalLink) {
        window.open(url, "_blank");
      } else {
        this.$router.push(url);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.v-card {
  &__title {
    display: block;
  }
}
svg {
  fill: red;
}
</style>
