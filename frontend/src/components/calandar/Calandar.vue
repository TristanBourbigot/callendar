<script>
import { defineComponent, ref } from 'vue';
import { useDate } from 'vuetify/lib/framework.mjs';
import { VCalendar } from 'vuetify/labs/VCalendar';
import axios from 'axios';
import Cookie from 'js-cookie';
import AddEvent from './AddEvent.vue';
import { pl } from 'vuetify/locale';

export default defineComponent({
  components: {
    VCalendar,
    AddEvent
  },
  data() {
    return {
        drawerOpen: true,
        type: 'month',
        types: [
            { title: 'Mois', value: 'month' },
            { title: 'Semaine', value: 'week' },
            { title: 'Jour', value: 'day' }
        ],
        weekday: [0, 1, 2, 3, 4, 5, 6],
        value: [new Date()],
        events: [],
        category: ['Réunion', 'Vacances', 'Congé', 'Voyage', 'Événement', 'Anniversaire', 'Conférence', 'Fête'],
        colors: {
        Réunion: '#1E88E5', // blue
        Vacances: '#3949AB', // indigo
        Congé: '#5E35B1', // deep-purple
        Voyage: '#00ACC1', // cyan
        Événement: '#43A047', // green
        Anniversaire: '#FB8C00', // orange
        Conférence: '#757575', // grey darken-1
        Fête: '#D81B60' // pink
        },
        titles: ['Réunion', 'Vacances', 'Congé', 'Voyage', 'Événement', 'Anniversaire', 'Conférence', 'Fête'],
        newEventDialog: false,
        eventViewEditDialog: false,
        selectedEvent: null,
        adapter: useDate(),
    };
  },
  methods: {
    getEvents() {
        axios.get(import.meta.env.VITE_API_URL + '/event',{
            headers: {
                Authorization: `Bearer ${Cookie.get('jwt')}`
            }
        })
        .then(response => {
            console.log(response)
            const eventsList = response.data;
            this.events = eventsList.map((event, index) => ({
                ...event,
                id: index,
                color: this.colors[event.title]
            }));
        })
        .catch(error => {
            console.error('Error fetching events:', error);
        });
    },
    openCreateEventDialog() {
      this.newEventDialog = true;
    },

    addEvent(event) {
        console.log(event)
        axios.post(import.meta.env.VITE_API_URL + '/event/createEvent/', {
            title: event.title,
            description: 'event.description',
            start: event.start,
            end: event.end,
            place: 'event.place',
            category: event.category,
            allDay: event.allDay
        }, {
            headers: {
                Authorization: `Bearer ${Cookie.get('jwt')}`,
            }
        })
        .then(response => {
            console.log('Event successfully added:', response);
            const eventsList = response.data;
            this.events = eventsList.map((event, index) => ({
                ...event,
                id: index,
                color: this.colors[event.title] || 'defaultColor'
            }));
        })
        .catch(error => {
            console.error('Error adding event:', error);
        });
    //   this.events.push({
    //     id: this.events.length,
    //     ...event,
    //   });
    },

    viewEvent(event) {
      this.selectedEvent = { ...event };
      this.eventViewEditDialog = true;
    },

    updateEvent() {
      const index = this.events.findIndex(e => e.id === this.selectedEvent.id);
      if (index !== -1) {
        this.events[index] = { ...this.selectedEvent };
        this.eventViewEditDialog = false;
      }
    },

    deleteEvent() {
      const index = this.events.findIndex(e => e.id === this.selectedEvent.id);
      if (index !== -1) {
        this.events.splice(index, 1);
        this.eventViewEditDialog = false;
      }
    },
    updateDatePickerModel(newValue) {
      if (!Array.isArray(newValue)) {
        this.value = [newValue]; // Transforme en tableau
      } else {
        this.value = newValue; // Garde le tableau intact
      }
    }
  },

  mounted() {
    this.getEvents({
      start: this.adapter.startOfDay(this.adapter.startOfMonth(new Date())),
      end: this.adapter.endOfDay(this.adapter.endOfMonth(new Date()))
    });
  }
});
</script>



<template>
  <v-layout>
    <v-navigation-drawer
      v-model="drawerOpen"
      width="340"
      permanent
      class="pa-4 fixed"
    >
      <v-sheet class="mb-4">
        <v-date-picker
          v-model="value"
          :locale="'fr'"
          title="Sélectionner une date"
          @update:model-value="updateDatePickerModel"
        ></v-date-picker>
      </v-sheet>

      <v-btn 
        color="primary" 
        block 
        @click="openCreateEventDialog"
        class="mb-4"
        prepend-icon="mdi-plus"
      >
        Créer un événement
      </v-btn>
    </v-navigation-drawer>

    
    <v-main>
      <v-sheet>
        <v-calendar
          class="mb-4"
          ref="calendar"
          v-model="value"
          :events="events"
          :view-mode="type"
          :weekdays="weekday"
          :locale="'fr'"
        >
        <template #event="{ event }">
            <div @click="viewEvent(event)" class="cursor-pointer">
                <v-chip
                    :color="event.color"
                    dark
                    small
                    class="ma-0"
                >
                    <v-icon icon="mdi-label" start></v-icon>
                    {{ event.title }}
                </v-chip>
            </div>
        </template>
        </v-calendar>
      </v-sheet>
    </v-main>


    <AddEvent
      v-model:dialog="newEventDialog"
      @add-event="addEvent"
      :categories="category"
    />

    <!-- Visualisation/Édition d'événement -->
    <v-dialog v-model="eventViewEditDialog" max-width="500">
      <v-card v-if="selectedEvent">
        <v-card-title>Détails de l'événement</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="selectedEvent.title"
            label="Titre de l'événement"
            required
          ></v-text-field>
          
          <v-row>
            <v-col cols="6">
              <v-date-picker
                v-model="selectedEvent.start"
                label="Date de début"
              ></v-date-picker>
            </v-col>
            <v-col cols="6">
              <v-date-picker
                v-model="selectedEvent.end"
                label="Date de fin"
              ></v-date-picker>
            </v-col>
          </v-row>

          <v-switch
            v-model="selectedEvent.allDay"
            label="Événement de toute la journée"
          ></v-switch>

          <v-color-picker
            v-model="selectedEvent.color"
            hide-inputs
            class="mt-4"
          ></v-color-picker>
        </v-card-text>
        <v-card-actions>
          <v-btn color="error" @click="deleteEvent">Supprimer</v-btn>
          <v-spacer></v-spacer>
          <v-btn @click="eventViewEditDialog = false">Annuler</v-btn>
          <v-btn color="primary" @click="updateEvent">Enregistrer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>