<script>
import { defineComponent, ref } from 'vue';
import axios from 'axios';
import Cookie from 'js-cookie';

export default defineComponent({
  props: {
    groupId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      dialog: false,
      group: null,
      users: [],
      newUserEmail: '',
      newGroupName: '',
      errorMessage: false
    };
  },
  methods: {
    openDialog() {
      this.dialog = true;
      this.fetchGroupDetails();
    },
    fetchGroupDetails() {
      axios.get(`${import.meta.env.VITE_API_URL}/groups/${this.groupId}`, {
          headers: {
            Authorization: `Bearer ${Cookie.get('jwt')}`,
          },
        })
        .then((response) => {
          this.group = response.data;
          this.users = response.data.users || [];
          this.newGroupName = response.data.name;
        })
        .catch((error) => {
          console.error('Error fetching group details:', error);
        });
    },
    addUser() {
      if (!this.newUserEmail) return;
      axios.post(`${import.meta.env.VITE_API_URL}/groups/${this.groupId}/users`, {
          userEmail: this.newUserEmail,
        }, {
          headers: {
            Authorization: `Bearer ${Cookie.get('jwt')}`,
          },
        })
        .then(() => {
          this.fetchGroupDetails();
          this.newUserEmail = '';
          this.errorMessage = false;
        })
        .catch((error) => {
          console.error('Error adding user:', error);
          this.errorMessage = true;
        });
    },
    removeUser(userEmail) {
      axios.delete(`${import.meta.env.VITE_API_URL}/groups/${this.groupId}/users`, {
          data: { userEmail },
          headers: {
            Authorization: `Bearer ${Cookie.get('jwt')}`,
          },
        })
        .then(() => {
          this.fetchGroupDetails();
        })
        .catch((error) => {
          console.error('Error removing user:', error);
        });
    },
    editGroupName() {
      axios.patch(`${import.meta.env.VITE_API_URL}/groups/${this.groupId}`, {
      name: this.newGroupName,
      }, {
          headers: {
            Authorization: `Bearer ${Cookie.get('jwt')}`,
          }
      })
      .then(response => {
          console.log('Groupe mis à jour :', response.data);
          this.$emit('get-groups');
      })
      .catch(error => {
          console.error('Erreur lors de la mise à jour du groupe :', error);
      });

    },
  },
});
</script>

<template>
  <div>
    <v-btn
      color="secondary"
      density="comfortable"
      icon="mdi-cog"
      @click="openDialog"
    ></v-btn>

    <v-dialog v-model="dialog" max-width="600">
      <v-card>
        <v-card-title>Gestion du groupe</v-card-title>
        <v-card-text>
          <v-text-field
            label="Nom du groupe"
            v-model="newGroupName"
            outlined
            dense
          ></v-text-field>
          <v-btn color="primary" @click="editGroupName">Modifier</v-btn>
          <v-divider class="my-4"></v-divider>
          <div>
            <h4>Membres du groupe</h4>
            <v-list dense>
              <v-list-item
                v-for="user in users"
                :key="user.email"
                class="d-flex justify-space-between"
              >
                <span>{{ user.email }}</span>
                <v-btn
                  color="error"
                  class="ml-4"
                  small
                  @click="removeUser(user.email)"
                >
                  <v-icon
                    icon="mdi-delete-forever"
                    start
                  ></v-icon>
                  Supprimer
                </v-btn>
              </v-list-item>
            </v-list>
          </div>
          <v-alert
            v-if="errorMessage"
            type="error"
            dismissible
            class="my-3"
          >
            L'utilisateur n'existe pas
          </v-alert>
          <v-text-field
            label="Ajouter un utilisateur par email"
            v-model="newUserEmail"
            outlined
            dense
          ></v-text-field>
          <v-btn color="primary" @click="addUser">Ajouter</v-btn>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary" @click="dialog = false">Fermer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
