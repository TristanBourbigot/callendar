<template>
  
</template>

<script lang="ts" setup>
  import {onMounted} from 'vue'

  onMounted(() => {
    let value = document.cookie.match('(^|;)?' + "jwt" + '=([^;]*)(;|$)');
    if(!value){
      window.location.href = 'login';
    }
  })
</script>
