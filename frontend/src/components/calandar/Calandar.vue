<script setup>
import { ref, onMounted } from 'vue';
import { useDate } from 'vuetify/lib/framework.mjs';
import { VCalendar } from 'vuetify/labs/VCalendar';
import { createVuetify } from 'vuetify';
import { fr } from 'vuetify/locale';

const vuetify = createVuetify({
  locale: {
    defaultLocale: 'fr',
    messages: { fr }, // Définit les traductions
  },
});

const drawerOpen = ref(true)
const type = ref('month')
const types = [
  { title: 'Mois', value: 'month' },
  { title: 'Semaine', value: 'week' },
  { title: 'Jour', value: 'day' }
]
const weekday = ref([0, 1, 2, 3, 4, 5, 6])
const value = ref([new Date()])
const events = ref([])
const colors = ['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey darken-1']
const titles = ['Meeting', 'Holiday', 'PTO', 'Travel', 'Event', 'Birthday', 'Conference', 'Party']

const adapter = useDate()

// New event creation state
const newEventDialog = ref(false)
const eventViewEditDialog = ref(false)
const selectedEvent = ref(null)
const newEvent = ref({
  title: '',
  start: null,
  end: null,
  allDay: false
})

onMounted(() => {
  getEvents({ 
    start: adapter.startOfDay(adapter.startOfMonth(new Date())), 
    end: adapter.endOfDay(adapter.endOfMonth(new Date())) 
  })
})

function getEvents({ start, end }) {
  const eventsList = []

  const min = start
  const max = end
  const days = (max.getTime() - min.getTime()) / 86400000
  const eventCount = rnd(days, days + 20)

  for (let i = 0; i < eventCount; i++) {
    const allDay = rnd(0, 3) === 0
    const firstTimestamp = rnd(min.getTime(), max.getTime())
    const first = new Date(firstTimestamp - (firstTimestamp % 900000))
    const secondTimestamp = rnd(2, allDay ? 288 : 8) * 900000
    const second = new Date(first.getTime() + secondTimestamp)
    
    eventsList.push({
      id: i,
      title: titles[rnd(0, titles.length - 1)],
      start: first,
      end: second,
      color: colors[rnd(0, colors.length - 1)],
      allDay: allDay,
    })
  }

  events.value = eventsList
}

function rnd(a, b) {
  return Math.floor((b - a + 1) * Math.random()) + a
}

function openCreateEventDialog() {
  newEventDialog.value = true
}

function createEvent() {
  if (newEvent.value.title) {
    events.value.push({
      id: events.value.length,
      ...newEvent.value,
      color: colors[rnd(0, colors.length - 1)]
    })
    newEventDialog.value = false
    // Reset the new event form
    newEvent.value = {
      title: '',
      start: null,
      end: null,
      allDay: false
    }
  }
}

function viewEvent(event) {
    console.log('Event clicked:', event);
  selectedEvent.value = { ...event }
  eventViewEditDialog.value = true
}

function updateEvent() {
  const index = events.value.findIndex(e => e.id === selectedEvent.value.id)
  if (index !== -1) {
    events.value[index] = { ...selectedEvent.value }
    eventViewEditDialog.value = false
  }
}

function deleteEvent() {
  const index = events.value.findIndex(e => e.id === selectedEvent.value.id)
  if (index !== -1) {
    events.value.splice(index, 1)
    eventViewEditDialog.value = false
  }
}

function updateDatePickerModel(newValue) {
  if (!Array.isArray(newValue)) {
    value.value = [newValue]; // Transforme en tableau
  } else {
    value.value = newValue; // Garde le tableau intact
  }
}

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

    <!-- Création d'événement -->
    <v-dialog v-model="newEventDialog" max-width="500">
      <v-card>
        <v-card-title>Créer un nouvel événement</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="newEvent.title"
            label="Titre de l'événement"
            required
          ></v-text-field>
          
          <v-row>
            <v-col cols="6">
              <v-date-picker
                v-model="newEvent.start"
                label="Date de début"
              ></v-date-picker>
            </v-col>
            <v-col cols="6">
              <v-date-picker
                v-model="newEvent.end"
                label="Date de fin"
              ></v-date-picker>
            </v-col>
          </v-row>

          <v-switch
            v-model="newEvent.allDay"
            label="Événement de toute la journée"
          ></v-switch>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="newEventDialog = false">Annuler</v-btn>
          <v-btn color="primary" @click="createEvent">Créer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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