<template>
  <div class="accent" id="full">
    <div
      class="d-flex"
      :class="$vuetify.breakpoint.smAndDown ? 'flex-column' : ''"
    >
      <admin-nav />
      <v-row class="pt-4">
        <v-col cols="12" class="d-flex flex-column px-10 pt-10">
          <v-row>
            <v-col cols="12" md="4">
              <v-select
                :menu-props="{ bottom: true, offsetY: true }"
                item-value="lotSelected"
                placeholder="Lot Number"
                item-text="lotSelected"
                v-model="searchNumber"
                hide-details="auto"
                :items="applicants.filter((e) => e.lotSelected)"
                clearable
                @change="
                  searchType = null;
                  getApplicants();
                "
                solo
              >
                <template v-slot:item="{ item }">
                  Lot Number: {{ item.lotSelected }}
                  <div class="ml-auto">
                    Applications:
                    <v-chip dark label>
                      {{ getApplicationCount(item.lotSelected, "lotSelected") }}
                    </v-chip>
                  </div>
                </template>
              </v-select>
            </v-col>
            <v-col cols="12" md="4">
              <v-select
                v-model="searchType"
                :menu-props="{ bottom: true, offsetY: true }"
                :items="applicants.filter((e) => e.lotSelected)"
                item-text="lotType"
                item-value="lotType"
                hide-details="auto"
                placeholder="Lot Type"
                solo
                clearable
                @change="
                  searchNumber = null;
                  getApplicants();
                "
              >
                <template v-slot:item="{ item }">
                  {{ item.lotType }}
                  <div class="ml-auto">
                    Applications:
                    <v-chip dark label>
                      {{ getApplicationCount(item.lotType, "lotType") }}
                    </v-chip>
                  </div>
                </template>
              </v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-data-table
                :loading="loading"
                :headers="headers"
                :items="filteredApps"
                class="elevation-5"
                :items-per-page="12"
                :item-class="rowColor"
                no-data-text="No Applications"
              >
                <template v-slot:[`item.agent`]="{ item }">
                  <v-icon v-if="item.agent" color="green"> mdi-check </v-icon>
                </template>

                <!-- <template v-slot:item.phone="{ item }">
                {{ formatPhoneNumber(item.phone) }}
              </template> -->

                <template v-slot:[`item.timestamp`]="{ item }">
                  {{ item.time }}
                </template>

                <template v-slot:[`item.actions`]="{ item }">
                  <div class="d-flex">
                    <v-tooltip left>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn fab small text class="mr-3">
                          <v-icon
                            color="red"
                            v-bind="attrs"
                            v-on="on"
                            @click.native="openRemoveDialog(item)"
                          >
                            mdi-delete-outline
                          </v-icon>
                        </v-btn>
                      </template>
                      <span>Delete Application</span>
                    </v-tooltip>
                    <v-btn
                      small
                      color="secondary"
                      class="mr-3"
                      @click="openApplicant(item)"
                    >
                      View
                    </v-btn>
                    <v-btn
                      small
                      color="primary"
                      @click="
                        selectedApplicant = item;
                        awardDialog = true;
                      "
                    >
                      Award
                    </v-btn>
                  </div>
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </div>
    <v-dialog
      v-if="selectedApplicant"
      @click:outside="closeDialog()"
      v-model="dialog"
      max-width="500"
    >
      <v-card width="auto">
        <v-card-title> Applicant Information </v-card-title>
        <v-card-text>
          <ul class="d-flex pl-2">
            <div class="pr-10">
              <li class="body-1"><strong>Applicant:</strong></li>
              <li class="body-1"><strong>Email:</strong></li>
              <li class="body-1"><strong>Phone:</strong></li>
              <li class="body-1"><strong>Message:</strong></li>
            </div>
            <div>
              <li class="body-1">{{ selectedApplicant.name }}</li>
              <li class="body-1">{{ selectedApplicant.email }}</li>
              <li class="body-1">{{ selectedApplicant.phone }}</li>
              <li class="body-1">{{ selectedApplicant.comment }}</li>
            </div>
          </ul>
        </v-card-text>

        <v-card-actions class="d-flex justify-end">
          <v-btn text @click="closeDialog()"> Close </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog @click:outside="closeDialog()" width="500" v-model="removeDialog">
      <v-card>
        <v-card-title> Delete Application? </v-card-title>
        <v-card-text>
          <p v-if="selectedApplicant != null">{{ selectedApplicant.name }}</p>
        </v-card-text>
        <v-card-actions class="d-flex justify-end">
          <v-btn text @click="closeDialog()">Cancel</v-btn>
          <v-btn color="error" @click="removeApplication(selectedApplicant)">
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog @click:outside="closeDialog()" width="500" v-model="awardDialog">
      <v-card width="auto" v-if="selectedApplicant != null">
        <v-card-title> Award Lot </v-card-title>
        <v-card-text>
          <ul class="d-flex pl-2">
            <div class="pr-10">
              <li class="body-1"><strong>Applicant:</strong></li>
              <li class="body-1"><strong>Email:</strong></li>
              <li class="body-1"><strong>Phone:</strong></li>
              <li class="body-1"><strong>Message:</strong></li>
            </div>
            <div>
              <li class="body-1">{{ selectedApplicant.name }}</li>
              <li class="body-1">{{ selectedApplicant.email }}</li>
              <li class="body-1">{{ selectedApplicant.phone }}</li>
              <li class="body-1">{{ selectedApplicant.comment }}</li>
            </div>
          </ul>
          <ul class="d-flex pl-2">
            <li class="body-1 pr-16"><strong>Lot:</strong></li>
            <li>
              <div v-if="selectedApplicant.lotAwarded">
                <v-select
                  :menu-props="{ bottom: true, offsetY: true }"
                  :items="$store.state.lots"
                  :value="active"
                  placeholder="Lot Number"
                  item-text="lotID"
                  item-value="id"
                  hide-details="auto"
                  class="pl-6 pt-0"
                  @change="updateLotNumber"
                  :item-disabled="
                    (e) => {
                      return e.locked ? true : false;
                    }
                  "
                />
                <v-slide-x-transition>
                  <v-btn v-show="removed" disabled text id="removedBtn">
                    Removed
                    <v-icon right> mdi-check </v-icon>
                  </v-btn>
                </v-slide-x-transition>
              </div>
              <v-select
                v-else
                :menu-props="{ bottom: true, offsetY: true }"
                :items="$store.state.lots"
                v-model="awardID"
                placeholder="Lot Number"
                item-text="lotID"
                item-value="id"
                hide-details="auto"
                class="pl-6 pt-0"
                :item-disabled="
                  (e) => {
                    return e.locked ? true : false;
                  }
                "
              />
            </li>
          </ul>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="closeDialog()">Cancel</v-btn>
          <v-btn
            color="error"
            v-if="
              selectedApplicant.lotAwarded &&
              active.id == selectedApplicant.lotID &&
              (awardID == selectedApplicant.lotID || awardID == null)
            "
            text
            @click="updateLotNumber()"
            >Remove</v-btn
          >
          <v-btn
            v-else
            color="primary"
            @click="awardLot(selectedApplicant, awardID)"
            :disabled="awardID == null"
          >
            Award
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar" light timeout="3000">
      {{ snackbarText ? snackbarText : "Records Updated" }}
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
  name: "applications-view",
  components: {
    AdminNav,
  },
  data() {
    return {
      awardID: null,
      searchNumber: null,
      searchType: null,
      dialog: false,
      removeDialog: false,
      awardDialog: false,
      selectedApplicant: null,
      snackbarText: null,
      snackbar: false,
      loading: true,
      removed: false,
      applicants: [],
      filteredApps: [],
      headers: [
        { text: "Name", value: "name" },
        { text: "Lot Awarded", value: "lotAwarded" },
        { text: "Lot Preference", value: "lotType" },
        { text: "Lot Interest", value: "lotSelected" },
        // { text: "Email", value: "email" },
        // { text: "Phone", value: "phone" },
        { text: "Contact Preference", value: "contactPreference" },
        { text: "Agent", value: "agent" },
        { text: "Submitted", value: "timestamp" },
        { text: "", value: "actions", align: "right" },
      ],
    };
  },
  computed: {
    active() {
      return this.$store.state.lots.filter(
        (e) => e.lotID == this.selectedApplicant.lotAwarded
      )[0];
    },
  },
  methods: {
    updateLotNumber(value) {
      if (value == null || value == undefined) {
        requestsCollection.doc(this.selectedApplicant.id).update({
          lotAwarded: null,
          lotID: null,
        });
        lotsCollection.doc(this.selectedApplicant.lotID).update({
          clientID: "",
          clientName: "",
          locked: false,
        });
        this.removed = true;
        this.getData();
        this.snackbar = true;
      } else this.awardID = value;
    },
    rowColor(item) {
      return this.selectedApplicant != null &&
        item.id == this.selectedApplicant.id
        ? "grey lighten-2"
        : "";
    },
    getApplicants() {
      if (this.searchNumber != null)
        this.filteredApps = this.applicants.filter(
          (e) => e.lotSelected == this.searchNumber
        );
      else if (this.searchType != null)
        this.filteredApps = this.applicants.filter(
          (e) => e.lotType == this.searchType
        );
      else this.filteredApps = this.applicants;
    },
    getApplicationCount(id, type) {
      return this.applicants.filter((e) => e[type] == id).length;
    },
    openApplicant(applicant) {
      this.selectedApplicant = applicant;
      this.dialog = true;
    },
    formatPhoneNumber(phoneNumberString) {
      let number = phoneNumberString;
      if (phoneNumberString.length > 10) {
        number = number.slice(1);
      }
      var cleaned = ("" + number).replace(/\D/g, "");
      var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
      if (match) {
        return "(" + match[1] + ") " + match[2] + "-" + match[3];
      }
      return null;
    },
    openRemoveDialog(item) {
      this.selectedApplicant = null;
      this.removeDialog = true;
      this.selectedApplicant = item;
    },
    closeDialog() {
      this.dialog = false;
      this.show = false;
      this.removeDialog = false;
      this.awardDialog = false;
      this.awardID = null;
      this.selectedApplicant = null;
    },
    removeApplication(item) {
      requestsCollection.doc(item.id).delete();
      if (
        item.lotAwareded != null &&
        item.lotAwareded != undefined &&
        item.lotAwareded != ""
      ) {
        lotsCollection.doc(item.lotID).update({
          clientID: "",
          clientName: "",
          locked: false,
        });
      }
      this.snackbarText = "Application Deleted";
      this.snackbar = true;
      this.getData();
    },
    getData() {
      this.closeDialog();
      requestsCollection.onSnapshot((res) => {
        const changes = res.docChanges();
        if (changes.length >= 1) {
          this.applicants = [];
          this.filteredApps = [];
        }
        changes.forEach((change) => {
          if (change.type === "added") {
            this.applicants.push({
              ...change.doc.data(),
              id: change.doc.id,
            });
            this.filteredApps.push({
              ...change.doc.data(),
              id: change.doc.id,
            });
          }
        });
        setTimeout(() => {
          this.snackbarText = null;
        }, 3000);
      });
      this.filteredApps = this.applicants;

      if (this.$store.state.lots.length < 1) {
        lotsCollection.orderBy("lotID").onSnapshot((res) => {
          const changes = res.docChanges();
          changes.forEach((change) => {
            if (change.type === "added") {
              this.$store.state.lots.push({
                ...change.doc.data(),
                id: change.doc.id,
              });
            }
          });
        });
      }
      this.loading = false;
    },
    awardLot(client, lot) {
      if (client.lotID) {
        lotsCollection.doc(client.lotID).update({
          clientID: "",
          clientName: "",
          locked: false,
        });
      }

      lotsCollection.doc(lot).update({
        clientID: client.id,
        clientName: client.name,
        locked: true,
      });

      let lotObj = this.$store.state.lots.filter((e) => e.id == lot);

      requestsCollection.doc(client.id).update({
        lotAwarded: lotObj[0].lotID,
        lotID: lotObj[0].id,
      });

      this.snackbar = true;
      this.getData();
    },
  },
  created() {
    this.$store.state.showNav = false;
    this.getData();
    this.$ga.disable();
  },
};
</script>

<style lang="scss" scoped>
#full {
  min-height: 100vh;
}

ul {
  list-style: none;
  text-align: left;

  li {
    padding: 5px 0;
  }
}

::v-deep #removedBtn .v-btn__content {
  color: green;
  .v-icon {
    color: green !important;
  }
}
</style>
