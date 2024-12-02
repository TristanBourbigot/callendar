<script>
import axios from 'axios';
import { defineComponent } from 'vue'

    export default defineComponent({
        data() {
            return {
                visible: false,
                visibleConf: false,
                isHoveringLogin: false,
                errorMessagesDeplay: false,
                errorMessages: "Certain paramètres sont incorrects",
                user: 
                {
                    email: "",
                    firstname: "",
                    lastname: "",
                    password: "",
                    confPassword: ""
                },
                mandatory: [
                    value => !!value || 'Obligatoire',
                    value => (value && value.length >= 3) || '3 charactère minimum',
                ],
                mandatoryPassword: [
                    value => !!value || 'Obligatoire',
                    // value => (value && value.length >= 8) || '8 charactère minimum',
                    // value => ((value && value.match(/[a-z]/)) || 'Au moins une lettre minuscule'),
                    // value => ((value && value.match(/[A-Z]/)) || 'Au moins une lettre majuscule'),
                    // value => ((value && value.match(/[0-9]/)) || 'Au moins un chiffre'),
                    // value => ((value && value.match(/[^a-zA-Z0-9]/)) || 'Au moins un caractère spécial')
                ],
                mandatoryConfPassword: [
                    value => !!value || 'Obligatoire',
                    value => (value && value === this.user.password) || 'Les mots de passe ne correspondent pas',
                ],
                mandatoryEmail: [ 
                    value => !!value || 'Obligatoire',
                    value => !value || /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value) || 'Email n\'est pas valide',
                ],
            }
        },
        methods :{
            createUser: function(){
                console.log(this.user)

                axios.post(import.meta.env.VITE_API_URL +'/user/register', 
                    {
                        email: this.user.email,
                        firstName: this.user.firstname,
                        lastName: this.user.lastname,
                        password: this.user.password
                    }
                )
                    .then(response => {
                        console.log(response)
                        window.location.href = 'login';
                }).catch(error => {
                    this.errorMessagesDeplay = true;
                    console.log(error);
                })
            }
        }
    })

</script>

<template>
    <div>
  
        <v-card
            class="mx-auto pa-12 pb-8 my-10"
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
                v-if="errorMessagesDeplay" 
                density="compact"
                :text="errorMessages    "
                type="error"
            ></v-alert>

            <div class="text-subtitle-1 text-medium-emphasis">Email</div>
    
            <v-text-field
            v-model="user.email"
            :rules="mandatoryEmail"
            density="compact"
            placeholder="Adresse Email"
            prepend-inner-icon="mdi-email-outline"
            variant="outlined"
            ></v-text-field>
            
            <div class="text-subtitle-1 text-medium-emphasis">Nom</div>
    
            <v-text-field
            v-model="user.lastname"
            :rules="mandatory"
            density="compact"
            placeholder="Nom"
            prepend-inner-icon="mdi-account-outline"
            variant="outlined"
            ></v-text-field>

            
            <div class="text-subtitle-1 text-medium-emphasis">Prénom</div>
    
            <v-text-field
            v-model="user.firstname"
            :rules="mandatory"
            density="compact"
            placeholder="Prénom"
            prepend-inner-icon="mdi-account-outline"
            variant="outlined"
            ></v-text-field>
            
            <div class="text-subtitle-1 text-medium-emphasis">Mot de passe</div>
    
            <v-text-field
            v-model="user.password"
            :rules="mandatoryPassword"
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
            :rules="mandatoryConfPassword"
            :append-inner-icon="visibleConf ? 'mdi-eye' : 'mdi-eye-off'"
            :type="visibleConf ? 'text' : 'password'"
            density="compact"
            placeholder="Entrer le même mot de passe"
            prepend-inner-icon="mdi-lock-outline"
            variant="outlined"
            @click:append-inner="visibleConf = !visibleConf"
            ></v-text-field>
    
            <v-btn
                class="mb-8"
                size="large"
                variant="tonal"
                type="submit"
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

