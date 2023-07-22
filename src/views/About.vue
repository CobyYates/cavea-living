<template>
  <div>
    <v-row class="grey lighten-2">
      <v-col class="pa-0">
        <v-img
          :src="require(`../assets/Element Office.png`)"
          min-width="100vw"
          max-height="100vh"
        >
        </v-img>
      </v-col>
    </v-row>
    <v-row class="my-0">
      <v-col class="mt-2">
        <ArticleSimple v-bind="subHero">
          <v-btn
            outlined
            color="primary"
            href="https://designmyelement.com"
            target="_blank"
          >
            About Element Design Build
          </v-btn>
        </ArticleSimple>
      </v-col>
    </v-row>
    <GridSectionScreen class="pt-7 pb-10" :section="grid" />
  </div>
</template>

<script>
import ArticleSimple from "../components/Home/ArticleSimple";
import GridSectionScreen from "../screens/GridSectionScreen.vue";
export default {
  name: "about-view",
  components: {
    ArticleSimple,
    GridSectionScreen,
  },
  data() {
    return {
      subHero: {
        heading: "WHO WE ARE",
        title: "CREATE | BUILD | INSPIRE",
        details: `We're a passionate design-build company who specializes in ultra-high-end
         custom homes and upscale commercial spaces. Focusing on the customer experience from
          design through construction, we pride ourselves on doing what not many can and
          deliver a truly one-of-a-kind home for our clients.`,
        layout: false,
      },
      grid: {
        subtitle:
          "Our passion is in designing and building a custom space that is elevated above the rest. We create with you and build for you, so you can inspire the world around you.",
        copyColor: "#579099",
        imageSeparator: true,
        gridClass: "mt-4",
        gridItems: [
          {
            title: "CREATE",
            longDescription: `You are at the center of the project, and it’s designed that way – taking into account the way you live and desire to live. Through innovative 3D modeling
             and a virtual reality walkthrough at the end of the design process, you receive a customized experience that is unparalleled in the high-end design-build industry.`,
            textAlignment: "justify",
            flat: true,
            image:
              "https://images.ctfassets.net/hyq1onms4p35/1KosZyairiSiWbAolanUfk/62e58a667bb7380a12334eab574c6ea3/Create_Icon.png?h=250",
            iconSize: "80",
            order: "1",
          },
          {
            title: "BUILD",
            longDescription: `We think differently about the design-build process – always striving to build a better, more sustainable future with your well-being and future generations
             in mind. Your project is optimized in a way to ensure it withstands the test of time by employing purposeful site orientation, green building methods, and passive solar techniques.`,
            textAlignment: "justify",
            flat: true,
            image:
              "https://images.ctfassets.net/hyq1onms4p35/3q3qaH8Z4uijYdssGOsfFA/3a05aae00eeeb3d75d1e6d3063daf11a/Build_Icon.png?h=250",
            iconSize: "80",
            order: "2",
          },
          {
            title: "INSPIRE",
            longDescription: `We want to inspire the way you live and work, and give you something that feels like so much more than just four walls and a roof – something that you can be proud 
            of and showcase for years to come; something that is timeless and truly custom to you. `,
            textAlignment: "justify",
            flat: true,
            image:
              "https://images.ctfassets.net/hyq1onms4p35/1KosZyairiSiWbAolanUfk/62e58a667bb7380a12334eab574c6ea3/Create_Icon.png?h=250",
            iconSize: "80",
            order: "3",
          },
        ],
        orderCards: true,
      },
    };
  },
  created() {
    try {
      this.$ga.page("/about");
      console.warn("[About] - gtag sent");
    } catch (error) {
      console.warn(`[gtag] - plat: ${error}`);
    }
  },
};
</script>

<style lang="scss" scoped></style>
