<template>
  <div class="card">
    <img class="card-img-top" src="../assets/perfil.webp" alt="Card image cap" />
    <div class="card-body">
      <h5 class="card-title">{{ user?.name }}</h5>
      <p class="card-text">
        Some quick example text to build on the card title and make up the bulk of the card's
        content.
      </p>
      <a href="#" class="btn btn-primary">Editar</a>
    </div>
  </div>
</template>

<script lang="ts">
import type { User, UserAuth } from '@/types/user'

export default {
  name: 'UserInfo',
  data() {
    return {
      userinfo: null as UserAuth | null,
      token: '',
      user: null as User | null,
    }
  },
  mounted() {
    this.getInfo()
  },
  methods: {
    getInfo() {
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        this.userinfo = JSON.parse(storedUser) as UserAuth
        this.token = this.userinfo.token
        this.user = {
          id: this.userinfo.id,
          name: this.userinfo.name,
          email: this.userinfo.email,
        }
      }
    },
  },
}
</script>
<style scoped>
.card {
  width: 18rem;
}
</style>
