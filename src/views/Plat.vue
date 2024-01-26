<template>
  <div class="pb-16">
    <v-row id="form">
      <v-col cols="12" lg="9" class="text-center mx-auto pt-4 pb-0 px-0">
        <v-item-group v-model="selected" id="group" class="pt-16">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 1555 921"
            style="position: relative"
            id="platMap"
          >
            <image
              href="../assets/final_plat.png"
              width="100%"
              @click="selected = null"
            />
            <v-item
              v-for="lot in $store.state.lots"
              :key="lot.lotID"
              :value="lot.lotID"
              v-slot="{ active, toggle }"
            >
              <path
                @click="toggle"
                :d="lot.d"
                transform="translate(-9802 -3956)"
                :id="lot.lotID"
                :class="active ? 'selected' : 'not-locked'"
              ></path>
            </v-item>
            <text
              v-for="lot in $store.state.lots"
              :key="lot.i"
              :transform="lot.text"
              fill="#c55151"
              font-size="18"
              font-weight="800"
            >
              <tspan v-if="lot.locked">RESERVED</tspan>
              <tspan v-else-if="lot.lotID == 4 && !lot.locked">
                <tspan y="-23" x="-34" dy=".3em">SPEC HOME</tspan>
                <tspan y="-20" x="-20" dy="1em">FOR SALE</tspan>
              </tspan>
            </text>
          </svg>
        </v-item-group>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" lg="9" class="mx-auto pt-0 px-0">
        <div class="d-flex flex-column mx-3"></div>
      </v-col>
    </v-row>

    <v-card
      flat
      v-if="selected"
      width="100vw"
      height="auto"
      id="lotInfo"
      class="py-3"
      elevation="12"
      transition="slide-y-reverse-transition"
    >
      <div class="text-end">
        <v-btn class="mr-2" text @click="selected = false">
          <v-icon> mdi-close </v-icon>
          CLOSE
        </v-btn>
      </div>
      <v-row>
        <v-col cols="12" md="6" class="text-center px-0">
          <v-img
            @click="imageDialog = true"
            :src="selectedLot.image"
            :max-height="$vuetify.breakpoint.smAndDown ? 110 : 500"
            width="auto"
            contain
            style="cursor: pointer"
          />
          <div class="d-flex align-baseline justify-center">
            <v-icon>mdi-image-search-outline</v-icon>
            <p>Click to view larger image</p>
          </div>
        </v-col>
        <v-col
          cols="12"
          md="6"
          class="d-flex justify-center px-0"
          :class="$vuetify.breakpoint.smAndDown ? '' : 'align-center'"
        >
          <div>
            <div class="d-flex align-center">
              <label class="mr-4">Lot Number</label>
              <v-select
                v-model="selected"
                :rules="lotRules"
                :menu-props="{ bottom: true, offsetY: true }"
                :items="lotNumbers"
                item-value="lotID"
                item-text="lotID"
                label="Select Lot Number"
                required
                solo
                hide-details
                :dense="$vuetify.breakpoint.smAndDown"
              />
            </div>
            <v-card-title
              class="pb-2"
              :class="$vuetify.breakpoint.smAndDown ? 'title' : ''"
            >
              Lot Information
            </v-card-title>
            <div class="d-flex pl-2">
              <ul id="cardList">
                <li
                  class="font-weight-light"
                  :class="$vuetify.breakpoint.smAndDown ? 'title' : ''"
                  v-for="item in cardList"
                  :key="item.i"
                >
                  <strong>{{ item.text }}</strong>
                </li>
              </ul>
              <ul>
                <li class="font-weight-light">
                  {{ selectedLot.lotID }}
                </li>
                <li class="font-weight-light">
                  {{ (selectedLot.lotSize / 43560).toFixed(2) }} acres
                </li>
                <li
                  class="font-weight-light"
                  :class="selectedLot.locked ? 'red--text' : 'green--text'"
                >
                  {{ selectedLot.locked ? "Reserved" : "Available" }}
                </li>
                <!-- <li class=" font-weight-light">
                  {{
                    selectedLot.price > 0
                      ? `$${selectedLot.price.toLocaleString("en-US")}`
                      : "NA"
                  }}
                </li> -->
              </ul>
            </div>
            <v-card-actions>
              <v-btn
                class="mx-auto"
                :disabled="selectedLot.locked"
                @click="openDialog()"
                color="primary"
              >
                Request Info
              </v-btn>
              <v-btn @click="openPDF" color="primary"> Floodplain Map </v-btn>
            </v-card-actions>
            <v-card-actions>
              <v-btn
                v-if="selectedLot.lotID == 4"
                href="https://7421cavea.com/"
                target="_blank"
                block
              >
                Learn More
              </v-btn>
            </v-card-actions>
          </div>
        </v-col>
      </v-row>
    </v-card>

    <v-dialog width="90vw" v-model="imageDialog" v-if="selectedLot != null">
      <v-card height="90vh">
        <div class="text-end">
          <v-btn class="mt-2 mr-2" text @click="imageDialog = false">
            <v-icon> mdi-close </v-icon>
            CLOSE
          </v-btn>
        </div>
        <v-img class="pt-4" contain height="90%" :src="selectedLot.image" />
      </v-card>
    </v-dialog>

    <v-dialog max-width="1000px" v-model="dialog">
      <v-card tile height="auto" class="pa-3">
        <v-btn text absolute right @click="dialog = false">
          <v-icon> mdi-close </v-icon>
          CLOSE
        </v-btn>
        <v-row>
          <v-col
            v-if="$vuetify.breakpoint.mdAndUp"
            class="mx-0 pa-0"
            cols="0"
            md="4"
          >
            <v-img src="../assets/10 6.jpg" height="100%" />
          </v-col>
          <v-col class="px-5" cols="12" md="8">
            <v-form
              @submit.prevent="valid ? sendEmail : validate"
              ref="form"
              v-model="valid"
            >
              <v-container>
                <v-row justify="center">
                  <v-col cols="12" sm="9" class="mt-3">
                    <v-text-field
                      label="Full Name*"
                      v-model="name"
                      name="name"
                      :rules="nameRules"
                      required
                      hide-details="auto"
                      class="my-3"
                    />

                    <v-row>
                      <v-col cols="12" md="6">
                        <v-text-field
                          label="Email*"
                          v-model="email"
                          :rules="emailRules"
                          name="email"
                          type="email"
                          required
                          hide-details="auto"
                          class="my-3"
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          label="Phone*"
                          v-model="phone"
                          :rules="phoneRules"
                          name="phone"
                          type="tel"
                          required
                          hide-details="auto"
                          class="my-3"
                        />
                      </v-col>
                    </v-row>

                    <v-radio-group
                      class="my-3"
                      required
                      mandatory
                      v-model="contactPreference"
                      name="preference"
                      row
                      hide-details="auto"
                      label="Preference*"
                    >
                      <v-radio
                        v-for="radio in preference"
                        :key="radio.i"
                        :label="radio"
                        :value="radio"
                      ></v-radio>
                    </v-radio-group>

                    <v-row>
                      <v-col cols="12" md="6">
                        <v-select
                          v-model="selected"
                          label="Lot Number*"
                          :rules="lotRules"
                          name="lotNumber"
                          :menu-props="{ bottom: true, offsetY: true }"
                          :items="$store.state.lots"
                          item-value="lotID"
                          item-text="lotID"
                          required
                          hide-details="auto"
                          class="my-3"
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-select
                          label="Type of Lot*"
                          v-model="lotType"
                          :rules="lotTypeRules"
                          name="lotType"
                          :menu-props="{ bottom: true, offsetY: true }"
                          :items="lotTypes"
                          required
                          hide-details="auto"
                          class="my-3"
                        />
                      </v-col>
                    </v-row>

                    <v-textarea
                      label="Message* (summary of your dream home)"
                      v-model="comment"
                      :rules="commentRules"
                      name="message"
                      type="text"
                      required
                      rows="3"
                      hide-details="auto"
                      class="my-3"
                    />

                    <v-checkbox
                      v-model="agent"
                      label="Real Estate Agent"
                      name="agent"
                    />
                  </v-col>
                </v-row>
                <div class="d-flex justify-end">
                  <v-btn @click="resetForm" text color="primary" class="mr-2">
                    Reset
                  </v-btn>
                  <v-btn
                    @click="validate"
                    type="submit"
                    v-show="!sent"
                    color="primary"
                    :disabled="!valid"
                    :loading="loading"
                  >
                    Submit Request
                  </v-btn>
                  <v-slide-x-transition>
                    <v-btn v-show="sent" disabled text id="sentBtn">
                      Sent
                      <v-icon right> mdi-check </v-icon>
                    </v-btn>
                  </v-slide-x-transition>
                </div>
              </v-container>
            </v-form>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import {
  lotsCollection,
  requestsCollection,
  storage,
} from "@/firebase/credentials.js";
import emailjs from "emailjs-com";
import "animate.css";
export default {
  name: "plat-page",
  data() {
    return {
      imageDialog: false,
      cardList: [
        { text: "Lot Number", value: "lotID" },
        // { text: "Lot Dimensions", value: "" },
        { text: "Lot Size", value: "" },
        { text: "Availability", value: "" },
        // { text: "Price", value: "" },
      ],
      name: "",
      email: "",
      phone: "",
      contactPreference: "",
      comment: "",
      lotType: "",
      agent: "",
      captcha: null,
      recaptcha: {
        first: null,
        second: null,
      },
      loading: false,
      preference: ["Email", "Phone", "Text"],
      dialog: false,
      valid: true,
      sent: false,
      selected: null,
      submitBtn: "Submit Request",
      lotTypes: [
        "Hillside-Daylight",
        "Daylight Basement",
        "Temple View",
        "Flat",
      ],
      nameRules: [(v) => !!v || "Name is required"],
      lotTypeRules: [(v) => !!v || "Lot type is required"],
      phoneRules: [
        (v) => !isNaN(v) || "Phone must be number",
        (v) => !!v || "Phone is required",
      ],
      lotRules: [(v) => !!v || "Please select available lot"],
      prefRules: [(v) => !!v || "Please select preference"],
      emailRules: [
        (v) => !!v || "E-mail is required",
        (v) => /.+@.+/.test(v) || "E-mail must be valid",
      ],
      commentRules: [(v) => !!v || "Comment is required"],
      codeRules: [(v) => !!v || "Required"],
    };
  },
  computed: {
    selectedLot() {
      return this.$store.state.lots.filter((e) => e.lotID === this.selected)[0];
    },
    lotNumbers() {
      return this.$store.state.lots.map((e) => e.lotID).sort((a, b) => a - b);
    },
    checkCode() {
      let response = false;
      if (this.recaptcha.first + this.recaptcha.second == this.captcha)
        response = true;
      return response;
    },
    cardWidth() {
      let result;
      if (this.$vuetify.breakpoint.mdAndDown) result = "100%";
      else result = "350";
      return result;
    },
  },
  methods: {
    validate() {
      let result = this.$refs.form.validate();
      if (result) this.sendEmail();
    },
    resetForm() {
      this.$refs.form.reset();
    },
    openDialog() {
      this.sent = false;
      this.dialog = true;
    },
    lotColor(active, lot) {
      let result;
      if (lot.locked) result = "rgba(214, 143, 143, 0.459)";
      else if (active) result = "rgba(143, 214, 164, 0.459)";
      else result = "red";
      return result;
    },
    sendEmail() {
      let data = document.querySelector("form");
      this.loading = true;
      const request = {
        name: this.name,
        email: this.email,
        phone: this.phone,
        contactPreference: this.contactPreference,
        comment: this.comment,
        lotType: this.lotType,
        agent: this.agent,
        lotSelected: this.selected,
        time: new Date().toLocaleDateString(),
      };

      requestsCollection.add(request).then(() => {
        this.loading = false;
        this.submitBtn = "Submitted";
        this.sent = true;

        try {
          emailjs.sendForm(
            "service_t17d6yr",
            "template_3wdlsxk",
            data,
            "user_NLbt6IypGmZIcL3nyfOql"
          );
        } catch (error) {
          console.log(error);
        }
      });
    },
    openPDF() {
      window.open("https://cavealiving.com/img/icons/flood-map.pdf");
    },
  },
  created() {
    try {
      this.$ga.page("/plat");
      console.warn("[Plat] - gtag sent");
    } catch (error) {
      console.warn(`[gtag] - plat: ${error}`);
    }
    this.$store.state.lots = [];
    lotsCollection.orderBy("lotID").onSnapshot((res) => {
      const changes = res.docChanges();
      changes.forEach(async (change) => {
        let img = await storage
          .ref()
          .child(`/lots/${change.doc.data().lotID}.png`)
          .getDownloadURL();
        if (change.type === "added") {
          this.$store.state.lots.push({
            ...change.doc.data(),
            id: change.doc.id,
            image: img,
          });
        }
      });
    });
  },
};
</script>

<style lang="scss" scoped>
path {
  cursor: pointer;
  fill: transparent;
  &.not-locked:hover {
    fill: #56909971;
  }
  &.selected {
    fill: (#56909971);
  }
}
.locked:hover {
  fill: rgba(192, 106, 106, 0.445);
}

::v-deep #sentBtn .v-btn__content {
  color: green;
  .v-icon {
    color: green !important;
  }
}

ul {
  list-style: none;
  text-align: left;
}

#group {
  position: relative;
}

svg {
  max-height: 85vh !important;
}

::v-deep path {
  position: relative !important;
}

::v-deep .pathOverlay {
  position: absolute !important;
  top: 100px;
}

#platMap {
  image {
    z-index: -1 !important;
  }
}

#lotInfo {
  position: fixed;
  bottom: 0;
  z-index: 99;
}
</style>
