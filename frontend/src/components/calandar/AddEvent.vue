<template>
    <v-dialog v-model="this.dialog" max-width="500">
      <v-card>
        <v-card-title>Créer un nouvel événement</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="newEvent.title"
            label="Titre de l'événement"
            :rules="mandatory"
            required
          ></v-text-field>
          
          <v-select
            v-model="newEvent.category"
            :items="categories"
            label="Catégorie"
            :rules="mandatory"
            required
          ></v-select>

          <v-switch
            v-model="newEvent.allDay"
            label="Événement de toute la journée"
          ></v-switch>

          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="startDate"
                type="date"
                label="Date de début"
                :rules="mandatory"
                required
              ></v-text-field>
              <v-text-field
                v-model="startTime"
                type="time"
                label="Heure de début"
                :rules="mandatory"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="endDateModel"
                type="date"
                label="Date de fin"
                :min="startDate"
                :disabled="!newEvent.allDay"
                :rules="mandatory"
                required
              ></v-text-field>
              <v-text-field
                v-model="endTime"
                type="time"
                label="Heure de fin"
                :rules="mandatory"
                required
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="closeDialog">Annuler</v-btn>
          <v-btn color="primary" @click="createEvent">Créer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
export default {
  props: {
    dialog: {
      type: Boolean,
      required: true,
    },
    categories: {
      type: Array,
      required: true,
    }
  },
  emits: ['update:dialog', 'add-event'],
  data() {
    return {
      startDate: null,
      startTime: null,
      endDate: null,
      endTime: null,
      newEvent: {
        title: '',
        start: null,
        end: null,
        category: null,
        allDay: false,
      },
      
      mandatory: [
        value => !!value || 'Obligatoire'
      ],
    };
  },
  watch: {
    newEvent: {
      deep: true,
      handler(newValue) {
        if (newValue.allDay) {
          this.startTime = null;
          this.endTime = null;
          this.endDate = this.startDate;
        }
      }
    }
  },
  computed: {
    endDateModel: {
      get() {
        return !this.newEvent.allDay ? this.startDate : this.endDate;
      },
      set(value) {
        if (this.newEvent.allDay) {
          this.startDate = value;
        } else {
          this.endDate = value;
        }
      }
    }
  },
  methods: {
    closeDialog() {
      this.$emit('update:dialog', false);
      this.resetForm();
    },
    createEvent() {
      if (this.newEvent.title && this.startDate) {
        // Merge date and time
        this.newEvent.start = new Date (this.mergeDateTime(this.startDate, this.startTime));
        this.newEvent.end = new Date(this.mergeDateTime(
          this.endDate || this.startDate, 
          this.endTime
        ));
        console.log(this.newEvent)

        this.$emit('add-event', { ...this.newEvent });
        this.closeDialog();
      }
    },
    mergeDateTime(date, time) {
      if (!date) return null;
      
      // If all-day event, return just the date
      if (this.newEvent.allDay) {
        return date;
      }
      
      // If no time provided, use midnight
      if (!time) {
        time = '00:00';
      }
      
      // Combine date and time
      return `${date}T${time}`;
    },
    resetForm() {
      this.newEvent = {
        title: '',
        start: null,
        end: null,
        category: null,
        allDay: false,
      };
      this.startDate = null;
      this.startTime = null;
      this.endDate = null;
      this.endTime = null;
      
    },
  },
};
</script>