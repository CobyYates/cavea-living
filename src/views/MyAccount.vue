<template>
  <div class="accent pb-8" id="full">
    <div
      class="d-flex"
      :class="$vuetify.breakpoint.smAndDown ? 'flex-column' : ''"
    >
      <admin-nav />
      <v-row class="px-6">
        <v-col cols="12" lg="5" class="mt-8">
          <v-card class="mb-4">
            <v-card-title>My Account Information</v-card-title>
            <v-divider />
            <v-card-text>
              <p class="body-1">Email: {{ $store.state.userProfile.email }}</p>
              <v-text-field
                v-if="resetPass"
                label="Password"
                v-model="password"
                name="password"
                type="password"
                required
                hide-details="auto"
                class="my-3"
              />
              <v-text-field
                v-if="resetPass"
                label="Retype Password"
                v-model="password2"
                name="password"
                type="password"
                required
                hide-details="auto"
                class="my-3"
              />
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <div v-if="resetPass">
                <v-btn
                  text
                  color="error"
                  @click="
                    resetPass = false;
                    password = password2 = '';
                  "
                >
                  Cancel
                </v-btn>
                <v-btn
                  text
                  color="success"
                  :disabled="passGood"
                  v-if="resetPass"
                  @click="updatePassword"
                >
                  Update Password
                </v-btn>
              </div>
              <v-btn
                text
                color="success"
                v-if="!resetPass"
                @click="resetPass = true"
              >
                Change Password
              </v-btn>
            </v-card-actions>
          </v-card>
          <v-card>
            <v-card-title> Add New User </v-card-title>
            <v-divider />
            <v-card-text>
              <v-form
                @submit.prevent="valid ? submit : validate"
                v-model="valid"
                ref="form"
              >
                <v-text-field
                  label="Full Name"
                  v-model="newUser.name"
                  :rules="nameRules"
                  name="name"
                  type="text"
                  required
                  hide-details="auto"
                  class="my-3"
                />
                <v-text-field
                  label="Email"
                  v-model="newUser.email"
                  :rules="emailRules"
                  name="email"
                  type="email"
                  required
                  hide-details="auto"
                  class="my-3"
                />
                <v-text-field
                  label="Password"
                  v-model="newUser.password"
                  :rules="passwordRules"
                  name="password"
                  type="password"
                  required
                  hide-details="auto"
                  class="my-3"
                />
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn @click="validate" type="submit" color="success" text>
                Add User
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
        <v-col
          cols="12"
          lg="7"
          :class="$vuetify.breakpoint.mdAndDown ? '' : 'mt-8'"
        >
          <v-card>
            <v-card-title>Users</v-card-title>
            <v-divider />
            <v-data-table
              :headers="headers"
              :items="users"
              mobile-breakpoint="0"
              sort-by="name"
              :items-per-page="5"
              class="elevation-1"
            >
            </v-data-table>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <v-snackbar v-model="snackbar">
      Password Updated

      <template v-slot:action="{ attrs }">
        <v-btn color="primary" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import { usersCollection, auth } from "../firebase/credentials.js";
import AdminNav from "@/components/Admin/SideNav";
export default {
  components: {
    AdminNav,
  },
  data() {
    return {
      password: "",
      password2: "",
      loading: false,
      snackbar: false,
      valid: false,
      newUser: {
        name: null,
        password: null,
        email: null,
      },
      nameRules: [(v) => !!v || "Name is required"],
      passwordRules: [(v) => !!v || "Password is required"],
      emailRules: [
        (v) => !!v || "E-mail is required",
        (v) => /.+@.+/.test(v) || "E-mail must be valid",
      ],
      resetPass: false,
      users: [],
      headers: [
        { text: "Name", value: "name" },
        { text: "Email", value: "email" },
        { text: "", value: "actions", align: "end" },
      ],
    };
  },
  methods: {
    updatePassword() {
      let user = auth.currentUser;
      user.updatePassword(this.password).then(() => {
        this.snackbar = true;
      });
    },
    validate() {
      let result = this.$refs.form.validate();
      if (result) this.register();
    },
    register() {
      this.$store.dispatch("register", {
        name: this.newUser.name,
        email: this.newUser.email,
        password: this.newUser.password,
      });
    },
  },
  computed: {
    passGood() {
      let result = true;
      if (
        this.password != "" &&
        this.password != null &&
        this.password == this.password2
      )
        result = false;
      return result;
    },
    addBtn() {
      let result = true;
      if (this.newUser.name != null && this.newUser.password != null)
        result = false;
      return result;
    },
  },
  async created() {
    this.$ga.disable();
    let result = await usersCollection;
    result.onSnapshot((pos) => {
      this.users = [];
      pos.forEach((e) => {
        let p = e.data();
        p.id = e.id;
        p.show = false;
        this.users.push(p);
      });
    });
  },
};
</script>

<style lang="scss" scoped>
#full {
  min-height: 100vh;
  width: 100%;
}

::v-deep .v-input__control {
  max-width: 300px !important;
}
</style>
