<script lang="ts">
import { RouterView } from 'vue-router'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import NavBar from './components/NavBar.vue'
import { onMounted, ref } from 'vue'
import axios from 'axios'
import type { User } from './types/user'

export default {
  name: 'app',
  setup() {
    const API_URL = import.meta.env.VITE_API_URL
    const user = ref<User>({ id: 0, name: '', email: '', permissions: [] })
    const error = ref<string | null>(null)

    const fetchUser = async () => {
      try {
        const response = await axios.get(`${API_URL}/users/?email=4iTrinta@gmail.com`)
        user.value = response.data
      } catch (err) {
        if (axios.isAxiosError(err)) {
          error.value = err.response?.data?.message || 'An error occurred while fetching boulders.'
        } else {
          error.value = 'An unexpected error occurred.'
        }
      }
    }

    onMounted(fetchUser)

    return {
      user,
      API_URL,
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
    <NavBar :user="user" />
    <RouterView :url="API_URL" />
  </div>
</template>
