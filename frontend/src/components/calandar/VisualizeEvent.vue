<template>
    <v-dialog v-model="this.dialog" max-width="500" @keydown.esc="closeDialog()">
      <v-card v-if="event">
        <v-card-title>
          Détails de l'événement
          <v-spacer></v-spacer>
        </v-card-title>
        
        <v-card-text>
          <v-list>
            <v-list-item>
              <v-list-item-title class="font-weight-bold">Titre</v-list-item-title>
              <v-list-item-subtitle>{{ event.title }}</v-list-item-subtitle>
            </v-list-item>
  
            <v-list-item v-if="event.description">
              <v-list-item-title class="font-weight-bold">Description</v-list-item-title>
              <v-list-item-subtitle>{{ event.description }}</v-list-item-subtitle>
            </v-list-item>
  
            <v-list-item>
              <v-list-item-title class="font-weight-bold">Date de début</v-list-item-title>
              <v-list-item-subtitle>
                {{ formatDate(event.start) }}
                <span v-if="event.allDay">(Toute la journée)</span>
              </v-list-item-subtitle>
            </v-list-item>
  
            <v-list-item>
              <v-list-item-title class="font-weight-bold">Date de fin</v-list-item-title>
              <v-list-item-subtitle>
                {{ formatDate(event.end) }}
                <span v-if="event.allDay">(Toute la journée)</span>
              </v-list-item-subtitle>
            </v-list-item>
  
            <v-list-item>
              <v-list-item-title class="font-weight-bold">Catégorie</v-list-item-title>
              <v-list-item-subtitle>
                <v-chip 
                  :color="getColorForCategory(event.category)"
                  small
                  dark
                >
                  {{ event.category }}
                </v-chip>
              </v-list-item-subtitle>
            </v-list-item>
  
            <v-list-item v-if="event.place">
              <v-list-item-title class="font-weight-bold">Lieu</v-list-item-title>
              <v-list-item-subtitle>{{ event.place }}</v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card-text>
        
        <v-card-actions class="justify-space-between">
            <v-btn  
                color="warning" 
                @click="confirmDelete = true"
                title="Supprimer l'événement"
            >
                Supprimer l'événement
            </v-btn>
            <v-btn @click="closeDialog">Fermer</v-btn>
        </v-card-actions>

      </v-card>
    </v-dialog>
  
    <!-- Dialogue de confirmation de suppression -->
    <v-dialog v-model="confirmDelete" max-width="400">
      <v-card>
        <v-card-title class="text-h5">Confirmer la suppression</v-card-title>
        <v-card-text>
          Êtes-vous sûr de vouloir supprimer cet événement ?
          <br>
          <strong>{{ event.title }}</strong>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="confirmDelete = false">Annuler</v-btn>
          <v-btn 
            color="error" 
            @click="deleteEvent"
          >
            Supprimer
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script>
  import { defineComponent } from 'vue';
  
  export default defineComponent({
    props: {
      event: {
        type: Object,
        default: null
      },
      dialog: {
        type: Boolean,
        default: false
      },
      categories: {
        type: Array,
        default: () => []
      }
    },
    emits: ['update:dialog', 'delete-event'],
    data() {
      return {
        confirmDelete: false
      };
    },
    methods: {
      closeDialog() {
        this.$emit('update:dialog', false);
      },
      deleteEvent() {
        this.$emit('delete-event', this.event);
        this.confirmDelete = false;
        this.closeDialog();
      },
      formatDate(date) {
        return new Date(date).toLocaleString('fr-FR', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      },
      getColorForCategory(category) {
        const colorMap = {
          'Call': '#FFFFFF',
          'Réunion': '#1E88E5',
          'Vacances': '#3949AB',
          'Congé': '#5E35B1',
          'Voyage': '#00ACC1',
          'Événement': '#43A047',
          'Anniversaire': '#FB8C00',
          'Conférence': '#757575',
          'Fête': '#D81B60'
        };
        return colorMap[category] || '#000000';
      }
    }
  });
  </script>