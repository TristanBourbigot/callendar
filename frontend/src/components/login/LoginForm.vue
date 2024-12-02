<script lang="ts">
    import { defineComponent } from 'vue'
    import axios from 'axios';

    export default defineComponent({
        data() {
            return {
                visible: false,
                isHoveringPass: false,
                isHoveringSign: false,
                errorMessages: false,
                user:{
                    email: "",
                    password: ""
                }
            }
        },
        methods: {
            login: function() {
                axios.get('http://localhost:2999/api/user/login', {email: this.user.email, password: this.user.password})
                    .then(response => {
                        document.cookie = `jwt=${response.data.token};max-age=7200;path=/`;
                        window.location.href = '/';
                }).catch(error => {
                    this.errorMessages = true;
                    console.log(error);
                })
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

            <v-alert
                v-if="errorMessages" 
                density="compact"
                text="Identifiant ou mot de passe incorrect"
                type="error"
            ></v-alert>

            <div class="text-subtitle-1 text-medium-emphasis">Email</div>
    
            <v-text-field
            v-model="user.email"
            density="compact"
            placeholder="Adresse Email"
            prepend-inner-icon="mdi-email-outline"
            variant="outlined"
            ></v-text-field>
    
            <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between" >
            Mot de passe    
                <a
                    @mouseover="isHoveringPass = true" 
                    @mouseout="isHoveringPass = false" 
                    class="text-caption text-decoration-none"
                    :class="{'text-secondary-link': !isHoveringPass, 'text-secondary-link-hover': isHoveringPass  }"
                    style="color: `secondary-link`"
                    href="#"
                >
                    mot de passe oublier ?
                </a>
            </div>
    
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
    
            <v-btn
                class="mb-8"
                size="large"
                variant="tonal"
                v-on:click="login()"
                block
                >
                    Connexion >
            </v-btn>
    
            <v-card-text class="text-center">
                <a
                    @mouseover="isHoveringSign = true" 
                    @mouseout="isHoveringSign = false" 
                    :class="{'text-secondary-link': !isHoveringSign, 'text-secondary-link-hover': isHoveringSign  }"
                    class="text-decoration-none"
                    href="signup"
                >
                    S'inscrire <v-icon icon="mdi-chevron-right"></v-icon>
                </a>
            </v-card-text>
        </v-card>
    </div>
  </template>

