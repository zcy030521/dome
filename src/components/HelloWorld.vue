<script setup lang="ts">
import { ref } from 'vue'

// defineProps<{ msg: string }>()

// const count = ref(0)
const num = ref(5)
function nums(){
  num.value = num.value + 1
}

</script>

<template>

  <div class="card">
    
    <p>
      {{ num }}
    </p>
  </div>
</template>

<style scoped>

</style>
