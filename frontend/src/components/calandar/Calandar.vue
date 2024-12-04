<script>
import { defineComponent, ref } from 'vue';
import { useDate } from 'vuetify/lib/framework.mjs';
import { VCalendar } from 'vuetify/labs/VCalendar';
import axios from 'axios';
import Cookie from 'js-cookie';
import AddEvent from './AddEvent.vue';
import VisualizeEvent from './VisualizeEvent.vue';

export default defineComponent({
  components: {
    VCalendar,
    AddEvent,
    VisualizeEvent
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
        category: ['Call','Réunion', 'Vacances', 'Congé', 'Voyage', 'Événement', 'Anniversaire', 'Conférence', 'Fête'],
        colors: {
          Call: '#FFFFFF',  // white
          Réunion: '#1E88E5', // blue
          Vacances: '#3949AB', // indigo
          Congé: '#5E35B1', // deep-purple
          Voyage: '#00ACC1', // cyan
          Événement: '#43A047', // green
          Anniversaire: '#FB8C00', // orange
          Conférence: '#757575', // grey darken-1
          Fête: '#D81B60' // pink
        },
        newEventDialog: false,
        visualizeEventDialog: false,
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
            this.events = eventsList.map((event) => ({
                ...event,
                end: new Date(event.end),
                start: new Date(event.start),
                color: this.colors[event.category]
            }));
            console.log(this.events)
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
            description: event.description,
            start: event.start,
            end: event.end,
            place: event.place,
            category: event.category,
            allDay: event.allDay
        }, {
            headers: {
                Authorization: `Bearer ${Cookie.get('jwt')}`,
            }
        })
        .then(response => {
            this.getEvents();
            this.newEventDialog = false;
        })
        .catch(error => {
            console.error('Error adding event:', error);
        });
    },

    viewEvent(event) {
      this.selectedEvent = { ...event };
      this.visualizeEventDialog = true;
    },

    deleteEvent(event) {
      axios.delete(`${import.meta.env.VITE_API_URL}/event/deleteEvent/${event.id}`, {
        headers: {
          Authorization: `Bearer ${Cookie.get('jwt')}`
        }
      })
      .then((event) => {
        this.getEvents();
        this.visualizeEventDialog = false;
      })
      .catch(error => {
        console.error('Error deleting event:', error);
      });
    },

    updateDatePickerModel(newValue) {
      if (!Array.isArray(newValue)) {
        this.value = [newValue];
      } else {
        this.value = newValue; 
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
     <v-img
        class="mx-auto my-5"
        max-width="228"
        src="/src/assets/logo.png"
     ></v-img>
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

    <VisualizeEvent
      v-model:dialog="visualizeEventDialog"
      :event="selectedEvent"
      :categories="category"
      @delete-event="deleteEvent"
    />
  </v-layout>
</template>