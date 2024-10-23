<script lang="ts">
    import { defineComponent } from 'vue'

    export default defineComponent({
        data() {
            return {
                visible: false,
                isHoveringLogin: false,
                user: 
                {
                    email: "",
                    firstname: "",
                    lastname: "",
                    password: "",
                    confPassword: ""
                }
            }
        },
        methods :{
            createUser: function(){
                console.log(this.user)
            }
        }
    })

</script>

<template>
    <div>
  
        <v-card
            class="mx-auto pa-12 pb-8 mt-10"
            elevation="8"
            max-width="448"
            rounded="lg"
        >
            <v-img
                class="mx-auto my-5"
                max-width="228"
                src="/src/assets/logo.png"
            ></v-img>
            <div class="text-subtitle-1 text-medium-emphasis">Email</div>
    
            <v-text-field
            v-model="user.email"
            density="compact"
            placeholder="Adresse Email"
            prepend-inner-icon="mdi-email-outline"
            variant="outlined"
            ></v-text-field>
            
            <div class="text-subtitle-1 text-medium-emphasis">Nom</div>
    
            <v-text-field
            v-model="user.lastname"
            density="compact"
            placeholder="Nom"
            prepend-inner-icon="mdi-email-outline"
            variant="outlined"
            ></v-text-field>

            
            <div class="text-subtitle-1 text-medium-emphasis">Prénom</div>
    
            <v-text-field
            v-model="user.firstname"
            density="compact"
            placeholder="Prénom"
            prepend-inner-icon="mdi-email-outline"
            variant="outlined"
            ></v-text-field>
            
            <div class="text-subtitle-1 text-medium-emphasis">Mot de passe</div>
    
            <v-text-field
            v-model="user.password"
            :append-inner-icon="visible ? 'mdi-eye' : 'mdi-eye-off'"
            :type="visible ? 'text' : 'password'"
            density="compact"
            placeholder="Entrer votre mot de passe"
            prepend-inner-icon="mdi-lock-outline"
            variant="outlined"
            @click:append-inner="visible = !visible"
            ></v-text-field>

            <div class="text-subtitle-1 text-medium-emphasis">Confirmation de mot de passe</div>
    
            <v-text-field
            v-model="user.confPassword"
            :append-inner-icon="visible ? 'mdi-eye' : 'mdi-eye-off'"
            :type="visible ? 'text' : 'password'"
            density="compact"
            placeholder="Entrer le même mot de passe"
            prepend-inner-icon="mdi-lock-outline"
            variant="outlined"
            @click:append-inner="visible = !visible"
            ></v-text-field>
    
            <v-btn
                class="mb-8"
                size="large"
                variant="tonal"
                v-on:click="createUser()"
                block
                >
                    Créer <v-icon icon="mdi-chevron-right"></v-icon>
            </v-btn>
    
            <v-card-text class="text-center">
                <a
                    @mouseover="isHoveringLogin = true" 
                    @mouseout="isHoveringLogin = false" 
                    :class="{'text-secondary-link': !isHoveringLogin, 'text-secondary-link-hover': isHoveringLogin  }"
                    class="text-decoration-none"
                    href="login"
                >
                    Déjà un compte ?  <v-icon icon="mdi-chevron-right"></v-icon>
                </a>
            </v-card-text>
        </v-card>
    </div>
  </template>

