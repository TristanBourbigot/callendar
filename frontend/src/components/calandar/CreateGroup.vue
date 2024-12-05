<script>
import axios from "axios";
import Cookie from "js-cookie";

export default {
  data() {
    return {
      dialog: false, 
      groupName: "",
      errorMessage: "",
    };
  },
  methods: {
    async createGroup() {

      if (!this.groupName.trim()) {
        this.errorMessage = "Le nom du groupe est requis.";
        return;
      }

    const response = await axios.post(`${import.meta.env.VITE_API_URL}/groups`,{ 
        groupName: this.groupName 
    },{
        headers: {
            Authorization: `Bearer ${Cookie.get("jwt")}`,
        },
        }
    )
    .then((response) => {
        this.$emit("group-created"); 
        this.dialog = false;
    })
    .catch((error) => {
        console.error("Erreur lors de la création du groupe :", error);
    })
    },

    closeDialog() {
      this.dialog = false;
      this.resetForm();
    },

    resetForm() {
      this.groupName = "";
    },
  },
};
</script>

<template>
  <div>
    <v-btn color="primary" class="w-full" @click="dialog = true" prepend-icon="mdi-plus">
      Créer un groupe
    </v-btn>

    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>Créer un groupe</v-card-title>

        <v-card-text>
          <v-text-field
            v-model="groupName"
            label="Nom du groupe"
            outlined
            :error="!!errorMessage"
          ></v-text-field>

          <v-alert
            v-if="errorMessage"
            type="error"
            dense
            text
            class="mt-3"
          >
            {{ errorMessage }}
          </v-alert>

        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary" text @click="closeDialog">Annuler</v-btn>
          <v-btn color="primary" @click="createGroup">Créer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
</style>
