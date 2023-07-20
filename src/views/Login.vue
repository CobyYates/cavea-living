<template>
  <v-img :src="require('../assets/18 3.jpg')" height="100vh" class="mt-n3">
    <v-overlay absolute :opacity="0.2" color="black">
      <v-card light class="pa-12" elevation="12" width="400">
        <v-form
          @submit.prevent="valid ? submit : validate"
          v-model="valid"
          ref="form"
        >
          <v-text-field
            label="Email*"
            v-model="email"
            :rules="emailRules"
            name="email"
            required
            hide-details="auto"
            class="my-6"
          />
          <v-text-field
            label="Password*"
            v-model="password"
            :rules="passwordRules"
            name="password"
            type="password"
            required
            hide-details="auto"
            class="my-6"
          />
          <v-btn @click="validate" type="submit" color="primary" width="100%">
            Login
          </v-btn>
        </v-form>
      </v-card>
    </v-overlay>
  </v-img>
</template>

<script>
export default {
  name: "login-view",
  data() {
    return {
      passwordRules: [(v) => !!v || "password is required"],
      emailRules: [
        (v) => !!v || "E-mail is required",
        (v) => /.+@.+/.test(v) || "E-mail must be valid",
      ],
      email: "",
      password: "",
      valid: false,
    };
  },
  methods: {
    validate() {
      let result = this.$refs.form.validate();
      if (result) this.submit();
    },
    submit() {
      this.$store.dispatch("login", {
        email: this.email,
        password: this.password,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.loginForm {
  height: 100vh;
}
</style>
