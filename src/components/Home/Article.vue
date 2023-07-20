<template>
  <div>
    <v-row
      v-for="item in orderedSections"
      :key="item.i"
      class="py-6"
      justify="center"
    >
      <v-col cols="12" md="5" class="d-flex justify-end px-0">
        <v-img :src="item.image" min-width="100%" />
      </v-col>
      <v-col cols="12" md="4" lg="3" class="d-flex justify-center flex-column">
        <div id="article" class="px-3">
          <h2>{{ item.title }}</h2>
          <h3 class="font-weight-light">
            {{ item.details }}
          </h3>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { sectionsCollection, storage } from "../../firebase/credentials";
import _ from "lodash";
export default {
  name: "article-component",
  data() {
    return {
      sections: [],
    };
  },
  computed: {
    orderedSections() {
      return _.orderBy(this.sections, "order");
    },
  },
  async created() {
    let result = await sectionsCollection;
    result.onSnapshot((a) => {
      this.sections = [];
      a.forEach(async (p) => {
        let img;
        if (p.data().image) {
          img = await storage.ref().child(p.data().image).getDownloadURL();
        }
        let obj = p.data();
        obj.id = p.id;
        obj.image = img;
        this.sections.push(obj);
      });
    });
  },
};
</script>

<style lang="scss" scoped></style>
