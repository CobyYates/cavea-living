<template>
  <v-row>
    <v-col>
      <v-row justify="center" class="mt-16">
        <v-col cols="12" md="3" class="text-center">
          <h1 :class="desktop ? 'py-10' : 'pt-8'">Contact Us</h1>
        </v-col>
      </v-row>
      <v-row justify="center" class="mb-10">
        <v-col cols="11" md="6" :class="desktop ? '' : 'text-center'">
          <v-form
            @submit.prevent="valid ? submit : validate"
            v-model="valid"
            ref="form"
          >
            <v-text-field
              v-model="fullName"
              label="Full Name *"
              name="fullName"
              outlined
              :rules="nameRules"
            />
            <div class="d-flex" :class="desktop ? 'flex-column' : ''">
              <v-text-field
                v-model="email"
                :rules="emailRules"
                label="Email *"
                name="email"
                :class="desktop ? '' : 'mr-2'"
                outlined
              />
              <v-text-field
                v-model="phone"
                label="Phone (optional)"
                name="phone"
                :class="desktop ? '' : 'ml-2'"
                rows="3"
                outlined
              />
            </div>
            <v-textarea
              :rules="messageRules"
              v-model="message"
              rows="7"
              label="Message *"
              name="message"
              outlined
            />
            <v-btn
              @click="validate"
              tile
              type="submit"
              color="#579099"
              outlined
              v-if="!sent"
            >
              Submit
            </v-btn>
            <v-btn color="#579099" outlined disabled v-if="sent">
              <v-icon left>mdi-check</v-icon>
              Sent
            </v-btn>
          </v-form>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import emailjs from "emailjs-com";
export default {
  name: "contact-form",
  data() {
    return {
      valid: false,
      sent: false,
      fullName: "",
      email: "",
      phone: "",
      message: "",
      nameRules: [(v) => !!v || "Name is required"],
      emailRules: [
        (v) => !!v || "E-mail is required",
        (v) => /.+@.+/.test(v) || "E-mail must be valid",
      ],
      messageRules: [(v) => !!v || "Message is required"],
    };
  },
  methods: {
    validate() {
      let result = this.$refs.form.validate();
      if (result) this.submit();
    },
    submit() {
      let data = document.querySelector("form");
      let serviceID = process.env.VUE_APP_EMAILJS_SERVICE_ID
      emailjs
        .sendForm(
          serviceID,
          "template_hrlgtjv",
          data,
          "user_NLbt6IypGmZIcL3nyfOql"
        )
        .then(
          (result) => {
            if (result.status == 200) this.sent = true;
          },
          (error) => {
            if (error) {
              this.error = "Message Failed to Send";
              console.warn("Message Failed to Send", error);
            }
          }
        );
    },
  },
  computed: {
    desktop() {
      return this.$vuetify.breakpoint.mdAndUp ? true : false;
    },
  },
};
</script>

<style lang="scss" scoped>
h1 {
  color: rgb(110, 110, 113);
}

h2 {
  font-weight: 600;
  font-size: 1.5rem;
}

p {
  margin-bottom: 0 !important;
  font-size: 1.3rem;
}

.telephone {
  color: #579099;
}

.company-info {
  &__desktop {
    padding-left: 100px;
  }
}
</style>
