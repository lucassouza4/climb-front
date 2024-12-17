<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <a class="navbar-brand cave-stone" href="#">
        <img
          src="../assets/logo3.png"
          width="64"
          height="64"
          class="d-inline-block align-center"
          alt=""
        />
        Rock Share
      </a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <a class="nav-link active" aria-current="page" href="#">Home</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Features</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Pricing</a>
          </li>
        </ul>
        <div class="d-flex align-items-center">
          <div v-if="user.id != 0">
            <span class="me-2"
              ><strong>{{ user.name }}</strong></span
            >
            <span class="text-muted">({{ user.email }})</span>
          </div>
          <button v-if="user.id != 0" class="btn btn-outline-primary ms-3" @click="logout">
            Logout
          </button>
          <button v-if="user.id == 0" class="btn btn-outline-primary ms-3" @click="login">
            Login
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import type { User } from '@/types/user'

export default {
  name: 'NavBar',
  data() {
    return {
      user: { id: 0, name: '', email: '' } as User,
    }
  },
  mounted() {
    this.fetchUser()
  },
  methods: {
    fetchUser() {
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        this.user = JSON.parse(storedUser)
      }
    },
    logout() {
      this.removeFromStore()
    },
    login() {
      this.$router.push('/login')
    },
    removeFromStore() {
      localStorage.removeItem('user')
    },
  },
}
</script>

<style scoped>
@font-face {
  font-family: 'cave-stone';
  src: url('@/assets/fonts/cave-stone.regular.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}

.navbar {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
.cave-stone {
  font-family: cave-stone, sans-serif;
  font-size: 28px;
  color: #050505;
}
</style>
