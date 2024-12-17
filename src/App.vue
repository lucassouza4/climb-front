<script lang="ts">
import { RouterView } from 'vue-router'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import NavBar from './components/NavBar.vue'

export default {
  name: 'app',
  data() {
    return {
      API_URL: import.meta.env.VITE_API_URL,
    }
  },
  components: {
    NavBar,
    RouterView,
  },
}
</script>

<template>
  <div id="app">
    <NavBar />
    <RouterView :url="API_URL" />
  </div>
</template>
