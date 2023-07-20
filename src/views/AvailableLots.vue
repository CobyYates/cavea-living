<template>
  <div class="accent pb-8" id="full">
    <div
      class="d-flex"
      :class="$vuetify.breakpoint.smAndDown ? 'flex-column' : ''"
    >
      <admin-nav />
      <v-row justify="center" class="pt-4">
        <v-col cols="12" class="px-10">
          <v-data-table
            v-if="lots != []"
            :loading="loading"
            :headers="headers"
            :items="lots"
            class="mt-10 elevation-5"
            :items-per-page="14"
            sort-by="lotID"
            hide-default-footer
          >
            <template v-slot:[`item.locked`]="{ item }">
              <v-tooltip left>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon v-if="item.locked" v-bind="attrs" v-on="on">
                    mdi-lock
                  </v-icon>
                </template>
                <span>Reserved</span>
              </v-tooltip>
            </template>

            <template v-slot:[`item.owner`]="{ item }">
              <v-select
                :value="item.owner"
                solo
                :loading="loading"
                :menu-props="{ bottom: true, offsetY: true }"
                :items="applicants"
                item-value="applicantID"
                item-text="name"
                class="py-0"
                @change="updateApplicant(item, $event)"
                hide-details
                flat
                background-color="transparent"
              >
                <template v-slot:item="{ item }">
                  {{ item.name }}
                  <span class="pl-2 font-weight-light">({{ item.email }})</span>
                </template>
              </v-select>
            </template>

            <template v-slot:[`item.contact`]="{ item }">
              {{ applicants != [] ? getContact(item) : "" }}
            </template>

            <template v-slot:[`item.lotSize`]="{ item }">
              {{ (item.lotSize / 43560).toFixed(2) }} acres
            </template>

            <template v-slot:[`item.actions`]="{ item }">
              <v-icon color="primary" @click="editLot(item)">
                mdi-pencil
              </v-icon>
            </template>
          </v-data-table>
          <v-btn color="primary" class="mt-3" @click="openPlatDialog = true">
            View Plat Map
          </v-btn>
        </v-col>
      </v-row>
    </div>

    <v-dialog v-model="openPlatDialog" height="95vh">
      <v-card>
        <v-card-actions>
          <v-btn @click="openPlatDialog = false" text class="ml-auto">
            <v-icon>mdi-close</v-icon>
            Close
          </v-btn>
        </v-card-actions>
        <v-img src="../../public/img/icons/map.png" height="80vh" contain />
      </v-card>
    </v-dialog>

    <v-dialog
      @click:outside="
        selectedLot = null;
        selectedAppID = null;
      "
      v-if="selectedLot != null"
      v-model="editLotDialog"
      width="600"
    >
      <v-card>
        <v-card-title> Lot {{ selectedLot.lotID }} Information </v-card-title>
        <v-card-text class="d-flex" v-if="!add">
          <v-select
            :value="
              selectedLot.clientID
                ? applicants.filter((e) => e.id == selectedLot.clientID)[0]
                : ''
            "
            :menu-props="{ bottom: true, offsetY: true }"
            label="Owner"
            hide-details="auto"
            :items="applicants"
            item-text="name"
            item-value="id"
            @change="updateSelect"
          >
            <template v-slot:item="{ item }">
              {{ item.name }} <span class="ml-auto">({{ item.email }})</span>
            </template>
          </v-select>
          <v-icon @click="add = true" class="mx-6 py-0">mdi-plus</v-icon>
        </v-card-text>

        <v-card-text v-else>
          <v-row>
            <v-col>
              <v-text-field
                label="Name"
                hide-details="auto"
                v-model="newApplicant.name"
                :rules="nameRules"
              />
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    label="Email"
                    hide-details="auto"
                    v-model="newApplicant.email"
                    :rules="emailRules"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    label="Phone"
                    hide-details="auto"
                    v-model="newApplicant.phone"
                    :rules="phoneRules"
                  />
                </v-col>
              </v-row>
              <v-radio-group
                class="my-3"
                required
                mandatory
                v-model="newApplicant.contactPreference"
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
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn color="error" text v-if="selectedLot.clientID" @click="remove">
            Remove
          </v-btn>
          <v-btn
            @click="
              editLotDialog = false;
              selectedAppID = null;
              selectedLot = null;
            "
            text
          >
            Close
          </v-btn>
          <v-btn v-show="!sent" color="primary" @click="setOwner()">
            Award
          </v-btn>
          <v-slide-x-transition>
            <v-btn v-show="sent" disabled text id="sentBtn">
              Sent
              <v-icon right> mdi-check </v-icon>
            </v-btn>
          </v-slide-x-transition>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar" light timeout="3000">
      Records Updated
      <template v-slot:action="{ attrs }">
        <v-btn color="primary" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import { lotsCollection, requestsCollection } from "@/firebase/credentials.js";
import AdminNav from "@/components/Admin/SideNav";
export default {
  components: {
    AdminNav,
  },
  data() {
    return {
      loading: true,
      add: false,
      openPlatDialog: false,
      editLotDialog: true,
      applicants: [],
      newApplicant: [],
      selectedLot: null,
      selectedApplicant: null,
      selectedAppID: null,
      snackbar: false,
      preference: ["Email", "Phone", "Text"],
      sent: false,
      lots: [],
      headers: [
        {
          text: "Lot Number",
          align: "start",
          value: "lotID",
        },
        { text: "Status", value: "locked" },
        { text: "Owner", value: "clientName" },
        { text: "Contact", value: "contact" },
        { text: "Lot Size", value: "lotSize" },
        { text: "", value: "actions", align: "end" },
      ],
      nameRules: [(v) => !!v || "Name is required"],
      phoneRules: [
        (v) => !isNaN(v) || "Phone must be number",
        (v) => !!v || "Phone is required",
      ],
      emailRules: [
        (v) => !!v || "E-mail is required",
        (v) => /.+@.+/.test(v) || "E-mail must be valid",
      ],
    };
  },
  methods: {
    getColor(status) {
      let result = status ? "red" : "green";
      return result;
    },
    updateApplicant(item, event) {
      if (this.lots != [] && this.applicants != []) {
        this.lots.filter((e) => e.lot == item.lot).owner =
          this.applicants.filter((e) => e.applicantID == event);
      }
    },
    editLot(item) {
      this.selectedLot = item;
      this.editLotDialog = true;
    },
    getContact(lot) {
      let result = null;
      if (lot.clientID) {
        let client = this.applicants.filter((e) => e.id == lot.clientID);
        if (client.length > 0) {
          switch (client[0].contactPreference) {
            case "Text":
              result = `Text: ${client[0].phone}`;
              break;
            case "Email":
              result = `Email: ${client[0].email}`;
              break;
            case "Phone":
              result = `Phone: ${client[0].phone}`;
              break;
            default:
              result = `Email: ${client[0].email}`;
              break;
          }
        } else {
          result = "Application Deleted";
        }
      }
      return result;
    },
    updateSelect(val) {
      this.selectedAppID = val;
    },
    setOwner() {
      let exist = this.selectedAppID ? true : false;
      let app = exist
        ? this.applicants.filter((e) => e.id == this.selectedAppID)[0]
        : this.newApplicant;
      const request = {
        name: app.name,
        email: app.email,
        phone: app.phone,
        lotAwarded: this.selectedLot.lotID,
        lotID: this.selectedLot.id,
        contactPreference: app.contactPreference,
      };

      if (exist) {
        lotsCollection.doc(this.selectedLot.id).update({
          clientID: this.selectedAppID,
          clientName: request.name,
          locked: true,
        });

        requestsCollection
          .doc(this.selectedAppID)
          .update({
            lotAwarded: this.selectedLot.lotID,
            lotID: this.selectedLot.id,
          })
          .then(() => {
            this.snackbar = true;
            this.editLotDialog = false;
            this.getData();
          });
      } else {
        request.time = new Date().toLocaleDateString();
        requestsCollection.add(request).then((docRef) => {
          this.sent = true;
          lotsCollection
            .doc(this.selectedLot.id)
            .update({
              clientID: docRef.id,
              clientName: request.name,
              locked: true,
            })
            .then(() => {
              this.snackbar = true;
              this.editLotDialog = false;
              this.getData();
            });
        });
      }
    },
    remove() {
      requestsCollection.doc(this.selectedLot.clientID).update({
        lotAwarded: "",
        lotID: "",
      });

      lotsCollection.doc(this.selectedLot.id).update({
        clientID: "",
        clientName: "",
        locked: false,
      });
      this.editLotDialog = false;
      this.snackbar = true;
      this.getData();
    },
    getData() {
      requestsCollection.onSnapshot((res) => {
        const changes = res.docChanges();
        if (changes.length > 1) this.applicants = [];
        changes.forEach((change) => {
          if (change.type === "added") {
            this.applicants.push({
              ...change.doc.data(),
              id: change.doc.id,
            });
          }
        });
      });

      lotsCollection.onSnapshot((res) => {
        const changes = res.docChanges();
        if (changes.length > 1) this.lots = [];
        changes.forEach((change) => {
          if (change.type === "added") {
            this.lots.push({
              ...change.doc.data(),
              id: change.doc.id,
            });
          }
        });
      });
      this.loading = false;
    },
  },
  created() {
    this.$ga.disable();
    this.applicants = [];
    this.lots = [];
    this.getData();
  },
};
</script>

<style lang="scss" scoped>
#full {
  min-height: 100vh;
}
</style>
